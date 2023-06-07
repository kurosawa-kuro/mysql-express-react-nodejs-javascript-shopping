// backend\controllers\orderController.js

import { db } from '../database/prisma/prismaClient.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const createdOrder = await db.order.create({
      data: {
        userId: req.user.id,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        paymentMethod: paymentMethod,
        itemsPrice: parseFloat(itemsPrice),
        taxPrice: parseFloat(taxPrice),
        shippingPrice: parseFloat(shippingPrice),
        totalPrice: parseFloat(totalPrice),
        orderProducts: {
          create: orderItems.map(item => ({
            productId: item.id,
            qty: item.qty
          })),
        }
      },
    });

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await db.order.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      orderProducts: {
        include: {
          product: true
        }
      }
    }
  });

  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await db.order.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      user: true,
      orderProducts: {
        include: {
          product: true
        }
      }
    }
  });

  // console.dir(order, { depth: 10 });
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await db.order.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      user: true,
      orderProducts: {
        include: {
          product: true
        }
      }
    }
  });


  if (order) {
    const updatedOrder = await db.order.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        isPaid: true,
        paidAt: new Date(), // It expects a JavaScript Date object
        paymentResultId: req.body.id,
        paymentResultStatus: req.body.status,
        paymentResultUpdateTime: req.body.update_time,
        paymentResultEmail: req.body.payer.email_address,
      }
    });

    console.dir(updatedOrder, { depth: 10 });
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await db.order.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      user: true,
      orderProducts: {
        include: {
          product: true
        }
      }
    }
  });

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await db.order.update({
      where: {

        id: parseInt(req.params.id),
      },
      data: {
        isDelivered: true,

        deliveredAt: new Date(), // It expects a JavaScript Date object
      }
    });

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await db.order.findMany({
    include: {
      user: true,
      orderProducts: {
        include: {
          product: true
        }
      }
    }
  });


  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
