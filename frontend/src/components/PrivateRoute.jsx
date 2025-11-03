// frontend/src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ autenticado, children }) {
  return autenticado ? children : <Navigate to="/" replace />;
}
