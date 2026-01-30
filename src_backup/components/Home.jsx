import React, { useState, useEffect } from "react";
import {
  Divider,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";

import backgroundImage from "../assets/knc_background-2.png";
import logoMarca from "../assets/knc-logo3.png";

import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";

export default function Home({ onLogout }) {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const usuario = localStorage.getItem("usuario");

  const banners = [
    {
      imagem: banner1,
      titulo: "Gestão Inteligente de Oportunidades",
      descricao:
        "Acompanhe e gerencie todas as oportunidades do seu negócio em um só lugar.",
      botao: "Ver Oportunidades",
      rota: "/registros",
    },
    {
      imagem: banner2,
      titulo: "Controle Total do Cliente",
      descricao:
        "Tenha visibilidade completa dos dados, históricos e interações.",
      botao: "Acessar Clientes",
      rota: "/clientes",
    },
    {
      imagem: banner3,
      titulo: "Relatórios Estratégicos",
      descricao:
        "Decisões mais rápidas e seguras com dados claros e organizados.",
      botao: "Visualizar Relatórios",
      rota: "/relatorios",
    },
  ];

  const [bannerAtual, setBannerAtual] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerAtual((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const alternarMenu = () => setMenuAberto(!menuAberto);
  const toggleDrawer = () => setMenuAberto(!menuAberto);

  const proximoBanner = () => {
    setBannerAtual((prev) => (prev + 1) % banners.length);
  };

  const bannerAnterior = () => {
    setBannerAtual((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* NAVBAR */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#0b1b2b",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={toggleDrawer}>
            <Tooltip title="Menu">
              <MenuIcon />
            </Tooltip>
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Portal do Cliente
          </Typography>

          <Typography variant="body2">
            Bem-vindo, {usuario || ""}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Drawer
        open={menuAberto}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            background: "linear-gradient(to right, #21479e, #1e293b)",
            color: "#fff",
            width: 300,
          },
        }}
      >
        <Toolbar>
          <img src={logoMarca} alt="Logo" height={40} />
        </Toolbar>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate("/home")}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem button onClick={() => navigate("/registros")}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Oportunidades" />
          </ListItem>

          <ListItem button onClick={onLogout}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItem>
        </List>
      </Drawer>

      {/* CONTEÚDO */}
      <Box
        sx={{
          mt: 8,
          height: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* CAROUSEL */}
        <Box
          sx={{
            width: "85%",
            maxWidth: 1100,
            height: 400,
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            boxShadow: 10,
          }}
        >
          <Box
            component="img"
            src={banners[bannerAtual].imagem}
            alt="Banner"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* OVERLAY */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,.7), rgba(0,0,0,.3))",
              display: "flex",
              alignItems: "center",
              px: 6,
            }}
          >
            <Box sx={{ maxWidth: 500, color: "#fff" }}>
              <Typography variant="h4" fontWeight="bold" mb={2}>
                {banners[bannerAtual].titulo}
              </Typography>
              <Typography mb={4}>
                {banners[bannerAtual].descricao}
              </Typography>

              <IconButton
                onClick={() => navigate(banners[bannerAtual].rota)}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  px: 3,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#125ea9" },
                }}
              >
                {banners[bannerAtual].botao}
              </IconButton>
            </Box>
          </Box>

          {/* SETAS */}
          <IconButton
            onClick={bannerAnterior}
            sx={{
              position: "absolute",
              top: "50%",
              left: 16,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0,0,0,.4)",
              color: "#fff",
            }}
          >
            ❮
          </IconButton>

          <IconButton
            onClick={proximoBanner}
            sx={{
              position: "absolute",
              top: "50%",
              right: 16,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0,0,0,.4)",
              color: "#fff",
            }}
          >
            ❯
          </IconButton>

          {/* INDICADORES */}
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
            }}
          >
            {banners.map((_, index) => (
              <Box
                key={index}
                onClick={() => setBannerAtual(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  cursor: "pointer",
                  backgroundColor:
                    bannerAtual === index ? "#1976d2" : "#ffffffaa",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

