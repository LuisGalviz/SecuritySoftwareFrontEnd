// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../services/firebase"; // Importa el objeto de autenticación de Firebase

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser; // Verificar si hay un usuario autenticado

  if (!user) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/" />;
  }

  // Si está autenticado, renderizar el componente hijo (la ruta protegida)
  return children;
};

export default ProtectedRoute;
