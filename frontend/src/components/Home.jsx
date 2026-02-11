import React, { useState, useEffect, useRef } from "react";
import {
  Divider,
  Box,
  Button,
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
import logoMarca from "../assets/knc-logo.png";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";

import LedLines from "../components/LedLines";

export default function Home({ onLogout }) {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const usuario = localStorage.getItem("usuario");

  const banners = [
    { type: "image", imagem: banner1 },
    {
      type: "content",
      titulo: "Registro de Oportunidades",
      descricao:
        "Insira registros, altere, faça pesquisas das oportunidades inseridas, monitore a validade com base em alertas visuais e faça a renovação, se necessário.",
      botao: "Acessar Oportunidades",
      rota: "/registros",
    },
    { type: "image", imagem: banner2 },
    {
      type: "content",
      titulo: "Controle de Acessos",
      descricao:
        "Permissões por usuário, segurança e visibilidade controlada.",
      botao: "Gerenciar Usuários",
      rota: "/usuarios",
    },
    { type: "image", imagem: banner3, cover: true },
    {
      type: "content",
      titulo: "Distribuidor Oficial Urovo Brasil",
      descricao:
        "Coletores, impressoras, acessórios e suporte especializado.",
      botao: "Ver Produtos",
      rota: "/relatorios",
    },
  ];

  const [bannerAtual, setBannerAtual] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    const tempo = banners[bannerAtual].type === "content" ? 9000 : 7000;

    const timer = setTimeout(() => {
      setBannerAtual((prev) => (prev + 1) % banners.length);
    }, tempo);

    return () => clearTimeout(timer);
  }, [bannerAtual, banners]);

  const toggleDrawer = () => setMenuAberto(!menuAberto);

  const proximoBanner = () =>
    setBannerAtual((prev) => (prev + 1) % banners.length);

  const bannerAnterior = () =>
    setBannerAtual((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;

    const delta =
      touchStartX.current - e.changedTouches[0].clientX;

    if (delta > 50) proximoBanner();
    if (delta < -50) bannerAnterior();

    touchStartX.current = null;
  };

  const banner = banners[bannerAtual];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LedLines />

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

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, ml: 2 }}
            fontWeight="bold"
          >
            Portal do Cliente
          </Typography>

          <Typography
            variant="body2"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
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
            //background: "linear-gradient(to right, #21479e, #1e293b)",
            background: "linear-gradient(to right, #21479eff, #1e293b)",            
            color: "#fff",
            width: 380,
          },
        }}
      >
        <Toolbar sx={{ color: "#fff", mt: 9, justifyContent: "center" }}>
          <Box
            component="img"
            src={logoMarca}
            alt="Logo"
            sx={{
              height: menuAberto ? 50 : 18,
              transition: "height 0.3s ease",
            }}
          />
        </Toolbar>

        <Divider sx={{borderColor: "rgba(34,211,238,0.35)", my: 1, px: 0.013, pb: 1, mt: 0.01, }}/> 

        <List sx={{ "& .MuiListItem-root": { py: 1 },
        "& .MuiListItem-root:hover": { backgroundColor: "#22374ce3" } }}>
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
            <ListItemText primary="Registro de Oportunidades" />
          </ListItem>
    <Box sx={{ mt: "auto", pb:1 }}>
        <Divider sx={{borderColor: "rgba(34,211,238,0.35)", my: 1, px: 0.03, pb: 1, mt: 41, }}/> 
    </Box>
          <ListItem button onClick={onLogout}>
            <ListItemIcon sx={{ "& .MuiListItem-root": { py: 1 },
        "& .MuiListItem-root:hover": { backgroundColor: "#22374ce3" }, color: "#fff" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItem>
        </List>

      </Drawer>

      {/* CONTEÚDO */}
      <Box
        sx={{
          pt: 12,
          px: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Box
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          sx={{
            width: "70%",                // largura menor
            maxWidth: 700,               // limite máximo
            height: { xs: 160, sm: 200, md: 240 }, // altura menor
            maxHeight: 240,
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            boxShadow: 10,
            backgroundColor: bannerAtual === 0 ? "#0b1b2b" : "#000", // azul escuro só no banner1
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",                  // centraliza horizontalmente
          }}
        >
          {/* IMAGE */}
          {banner.type === "image" && (
            <Box
              component="img"
              src={banner.imagem}
              alt="Banner"
              sx={{
                width: "100%",
                height: "100%",
                //objectFit: "contain", // mantém proporção
                objectFit: banner.cover ? "cover" : "contain",
                objectPosition: "center",
              }}
            />
          )}

          {/* CONTENT */}
          {banner.type === "content" && (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                px: { xs: 2, sm: 4, md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                background: "linear-gradient(135deg, #0b1b2b, #142c4c)",
                color: "#fff",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: "1.3rem", sm: "1.6rem", md: "1.9rem" },
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                {banner.titulo}
              </Typography>

              <Typography
                sx={{
                  maxWidth: 480,
                  mb: 2,
                  opacity: 0.9,
                  fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                }}
              >
                {banner.descricao}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  maxWidth: 280,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: "none",
                }}
                onClick={() => navigate(banner.rota)}
              >
                {banner.botao}
              </Button>
            </Box>
          )}

          {/* INDICADORES */}
          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {banners.map((_, i) => (
              <Box
                key={i}
                onClick={() => setBannerAtual(i)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor:
                    i === bannerAtual ? "#fff" : "rgba(255,255,255,.4)",
                  cursor: "pointer",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
