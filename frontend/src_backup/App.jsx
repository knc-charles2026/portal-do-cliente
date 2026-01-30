// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import CadastroOportunidades from "./components/CadastroOportunidades";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [autenticado, setAutenticado] = useState(false);

  // Mantém o login mesmo após atualizar a página
  useEffect(() => {
    const usuarioLogado = localStorage.getItem("usuario");
    if (usuarioLogado) {
      setAutenticado(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setAutenticado(false);
  };

  return (
    <Router basename="/portal-do-cliente">
      <Routes>
        {/* Página de login */}
        <Route
          path="/"
          element={
            autenticado ? (
              <Navigate to="/home" replace />
            ) : (
              <LoginPage setAutenticado={setAutenticado} />
            )
          }
        />

        {/* Home protegida */}
        <Route
          path="/home"
          element={
            <PrivateRoute autenticado={autenticado}>
              <Home onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        {/* Cadastro de oportunidades protegido */}
        <Route
          path="/registros"
          element={
            <PrivateRoute autenticado={autenticado}>
              <CadastroOportunidades onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        {/* Fallback para rotas inexistentes */}
        <Route
          path="*"
          element={
            <Navigate to={autenticado ? "/home" : "/"} replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
