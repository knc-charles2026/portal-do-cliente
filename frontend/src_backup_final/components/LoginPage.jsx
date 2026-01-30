import React, { useState } from "react";
import { Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import knc_background from "../assets/knc_background.png";
import logo_knc from "../assets/knc-logo2.png"; 

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
      className="flex flex-col items-center justify-center h-screen relative"
      sx={{
        backgroundImage: `url(${knc_background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo no canto superior esquerdo */}
      <Box className="absolute top-4 left-4">
        <img src={logo_knc} alt="KNC Logo" className="h-12 w-auto" />
      </Box>

      {/* Card de login */}
      <Box className="bg-white shadow-xl rounded-xl p-10 w-80 z-10"
           sx={{ transition: "all 0.3s ease-in-out" }}>
        <Typography 
          variant="h5" 
          className="text-center font-bold text-gray-700"
          sx={{ mb: 6 }} // mais espaço entre título e inputs
        >
          Acesso ao Sistema
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Usuário"
            variant="outlined"
            fullWidth
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            sx={{
              mb: 4,
              transition: "all 0.3s ease",
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  boxShadow: "0 0 5px rgba(25, 118, 210, 0.3)",
                },
              },
            }}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            sx={{
              mb: 2.5, // menos espaço entre input e botão
              transition: "all 0.3s ease",
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  boxShadow: "0 0 5px rgba(25, 118, 210, 0.3)",
                },
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            className="rounded-lg"
            sx={{
              py: 1.8,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 20px rgba(25, 118, 210, 0.4)",
              },
            }}
          >
            Entrar
          </Button>
        </form>
      </Box>

      {/* Snackbar de erro */}
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
