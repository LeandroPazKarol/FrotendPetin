import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = sessionStorage.getItem('token');
  const userStr = sessionStorage.getItem('pettin_user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  let parsedUser = null;
  try {
    parsedUser = JSON.parse(userStr);
  } catch (e) {
    console.error("Sesión inválida", e);
  }

  if (!parsedUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(parsedUser.role)) {
      // redirigir a la ruta segun el usuario 
      const fallbackRoute = parsedUser.role === 'admin' ? '/admin/dashboard' : '/explorar';
      return <Navigate to={fallbackRoute} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
