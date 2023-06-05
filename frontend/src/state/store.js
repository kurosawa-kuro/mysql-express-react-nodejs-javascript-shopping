// frontend\src\state\store.js
import { create } from 'zustand';
import { updateCart } from '../utils/cartUtils';

const useAuthStore = create((set) => ({
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
    setCredentials: (userInfo) => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
        localStorage.setItem('expirationTime', expirationTime);

        set({ userInfo });
    },
    logout: () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('expirationTime');

        set({ userInfo: null });
    },
}));

const useCartStore = create((set) => ({
    cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
    shippingAddress: localStorage.getItem('shippingAddress')
        ? JSON.parse(localStorage.getItem('shippingAddress'))
        : {},
    paymentMethod: localStorage.getItem('paymentMethod')
        ? JSON.parse(localStorage.getItem('paymentMethod'))
        : 'PayPal',
    addToCart: (item) => set((state) => {
        const existItem = state.cartItems.find((x) => x._id === item._id);
        let newCartItems;
        if (existItem) {
            newCartItems = state.cartItems.map((x) =>
                x._id === existItem._id ? item : x
            );
        } else {
            newCartItems = [...state.cartItems, item];
        }

        // Calculate the items price

        const itemsPrice =
            newCartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

        // Calculate the shipping price
        const shippingPrice = itemsPrice > 100 ? 0 : 10;

        // Calculate the tax price
        const taxPrice = Number((0.15 * itemsPrice).toFixed(2));

        // Calculate the total price
        const totalPrice = (
            Number(itemsPrice) +
            Number(shippingPrice) +
            Number(taxPrice)
        ).toFixed(2);

        // Save the cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));

        return {
            ...state,
            cartItems: newCartItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        };
    }),
    removeFromCart: (id) => set((state) => {
        const newCartItems = state.cartItems.filter((x) => x._id !== id);
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        return {
            ...state,
            cartItems: newCartItems,
        };
    }),
    saveShippingAddress: (address) => set((state) => {
        console.log('address', address);
        localStorage.setItem('shippingAddress', JSON.stringify(address));
        return {
            ...state,
            shippingAddress: address,
        };
    }),
    savePaymentMethod: (method) => set((state) => {
        localStorage.setItem('paymentMethod', JSON.stringify(method));
        return {
            ...state,
            paymentMethod: method,
        };
    }),
    clearCartItems: () => set((state) => {
        localStorage.setItem('cartItems', JSON.stringify([]));
        return {
            ...state,
            cartItems: [],
        };
    }),
}));

export { useAuthStore, useCartStore };
