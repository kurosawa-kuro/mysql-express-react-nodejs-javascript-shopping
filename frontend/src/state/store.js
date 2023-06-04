// frontend\src\state\store.js
import { create } from 'zustand';

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

export default useAuthStore;
