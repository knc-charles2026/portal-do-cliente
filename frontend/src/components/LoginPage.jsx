import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import knc_background from "../assets/knc_background.png";
import logo_knc from "../assets/knc-logo.png";

export default function LoginPage({ setAutenticado }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (usuario === "admin" && senha === "5366") {
      localStorage.setItem("usuario", usuario);
      setAutenticado(true);
      navigate("/home");
    } else {
      setOpen(true);
      setUsuario("");
      setSenha("");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundImage: `url(${knc_background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* OVERLAY */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(11,27,43,0.92), rgba(20,44,76,0.88))",
          zIndex: 0,
        }}
      />

      {/* CONTAINER PRINCIPAL */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          zIndex: 1,
        }}
      >
        {/* BRANDING */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 3, sm: 6, md: 8 },
            py: { xs: 6, md: 0 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
            color: "#fff",
          }}
        >
          <Box
            component="img"
            src={logo_knc}
            alt="KNC Logo"
            sx={{
              width: { xs: 140, sm: 160, md: 180 },
              mb: 5,
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.2rem" },
              mb: 3.5,
            }}
          >
            Portal do Cliente
          </Typography>

          <Typography
            sx={{
              maxWidth: 620,
              opacity: 0.9,
              fontSize: { xs: "0.95rem", sm: "1rem" },
              mb: 3.5,
              textAlign: "justify",
              textJustify: "inter-word",
            }}
          >
            Registre oportunidades com o RO New (Novo Registro de Oportunidades da KNC), com ele você poderá incluir, pesquisar, filtrar, alterar e excluir registros. 
            Você terá acesso aos seus dados inseridos e poderá fazer o acompanhamento de cada registro com base no campo status.

            
          </Typography>

                    <Typography
            sx={{
              maxWidth: 620,
              opacity: 0.9,
              fontSize: { xs: "0.95rem", sm: "1rem" },
              mb: 3.5,
              textAlign: "justify",
              textJustify: "inter-word",
            }}
          >
            
            
            Tudo isso em um ambiente moderno, fechado e seguro.
          </Typography>
        </Box>

        {/* LOGIN */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
            pb: { xs: 6, md: 0 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 420,
              background: "rgba(255,255,255,0.94)",
              backdropFilter: "blur(8px)",
              borderRadius: 4,
              p: { xs: 4, sm: 5 },
              boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              textAlign="center"
              mb={4}
              color="#0b1b2b"
            >
              Acesso ao Sistema
            </Typography>

            <form onSubmit={handleLogin}>
              <TextField
                label="Usuário"
                fullWidth
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                sx={{ mb: 3 }}
              />

              <TextField
                label="Senha"
                type="password"
                fullWidth
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                sx={{ mb: 4 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.6,
                  fontWeight: 600,
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #1976d2, #125ea8)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #125ea8, #0d4a85)",
                    boxShadow: "0 8px 24px rgba(25,118,210,0.4)",
                  },
                }}
              >
                Entrar no Portal
              </Button>
            </form>
          </Box>
        </Box>
      </Box>

      {/* ERRO */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          Usuário ou senha inválidos!
        </Alert>
      </Snackbar>
    </Box>
  );
}