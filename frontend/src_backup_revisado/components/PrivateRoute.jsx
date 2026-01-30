import { Navigate } from "react-router-dom";

export default function PrivateRoute({ autenticado, children }) {
  if (!autenticado) {
    return <Navigate to="/" replace />;
  }

  return children;
}

