import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
