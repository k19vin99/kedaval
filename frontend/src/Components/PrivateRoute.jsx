// PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useContext(UserContext);

  if (!user) {
    // No autenticado → redirigir al login
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.rol.toLowerCase())) {
    // Rol no permitido → redirigir al home
    return <Navigate to="/home" replace />;
  }

  // Rol permitido → renderizar el componente hijo
  return children;
}

export default PrivateRoute;
