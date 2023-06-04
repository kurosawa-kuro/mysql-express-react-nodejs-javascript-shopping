// frontend\src\state\store.js
import { create } from 'zustand';
import { updateCart, addDecimals } from '../utils/cartUtils';

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

const initialState = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const useCartStore = create((set) => ({
    ...initialState,
    addToCart: (item) => set((state) => {
        const existItem = state.cartItems.find((x) => x._id === item._id);
        if (existItem) {
            state.cartItems = state.cartItems.map((x) =>
                x._id === existItem._id ? item : x
            );
        } else {
            state.cartItems = [...state.cartItems, item];
        }

        return updateCart(state, item);
    }),
    removeFromCart: (id) => set((state) => {
        state.cartItems = state.cartItems.filter((x) => x._id !== id);
        return updateCart(state);
    }),
    saveShippingAddress: (address) => set((state) => {
        state.shippingAddress = address;
        localStorage.setItem('cart', JSON.stringify(state));
    }),
    savePaymentMethod: (method) => set((state) => {
        state.paymentMethod = method;
        localStorage.setItem('cart', JSON.stringify(state));
    }),
    clearCartItems: () => set((state) => {
        state.cartItems = [];
        localStorage.setItem('cart', JSON.stringify(state));
    }),
}));

export { useAuthStore, useCartStore };
