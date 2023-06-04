// frontend\src\components\PrivateRoute.jsx

import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../state/store'; // Import Zustand store

const PrivateRoute = () => {
  const { userInfo } = useAuthStore(); // Use the userInfo from Zustand store
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
