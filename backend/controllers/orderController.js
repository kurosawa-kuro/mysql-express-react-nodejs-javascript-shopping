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

    console.log('orderController.js addOrderItems() orderItems:', orderItems);
    // Orderにインサート
    const createdOrder = await db.order.create({
      data: {
        userId: req.user.id,  // Assuming `req.user` contains authenticated user
        address: shippingAddress.address,
        city: shippingAddress.city, // city, country, postalCode should be included in the shippingAddress object or can be fetched separately.
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        paymentMethod: paymentMethod,
        paymentResultId: 'Payment result ID', // Assuming you have paymentResultId
        paymentResultStatus: 'Payment result status', // Assuming you have paymentResultStatus
        paymentResultUpdateTime: 'Payment result update time', // Assuming you have paymentResultUpdateTime
        paymentResultEmail: 'Payment result email', // Assuming you have paymentResultEmail
        itemsPrice: parseFloat(itemsPrice),
        taxPrice: parseFloat(taxPrice),
        shippingPrice: parseFloat(shippingPrice),
        totalPrice: parseFloat(totalPrice),
        isPaid: false, // Setting `isPaid` to false as the payment is not done yet
        paidAt: null, // Setting `paidAt` to null as the payment is not done yet
        isDelivered: false, // Setting `isDelivered` to false as the order is not delivered yet
        deliveredAt: null, // Setting `deliveredAt` to null as the order is not delivered yet
      },
    });
    console.log('orderController.js addOrderItems() createdOrder:', createdOrder);

    for (const orderItem of orderItems) {
      console.log('orderController.js addOrderItems() orderItem:', orderItem);
      await db.orderProduct.create({
        data: {
          order: {
            connect: { id: createdOrder.id },
          },
          product: {
            connect: { id: orderItem.id },
          },
          qty: orderItem.qty,
        },
      });
    }




    throw new Error('Debugging error in orderController.js addOrderItems()');
    res.status(201).json({});
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

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
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

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
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

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
  const orders = await Order.find({}).populate('user', 'id name');
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
