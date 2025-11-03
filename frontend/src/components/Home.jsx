import React, { useState } from "react";
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

export default function Home({ onLogout }) {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const usuario = localStorage.getItem("usuario");

  const alternarMenu = () => setMenuAberto(!menuAberto);
  const toggleDrawer = () => setMenuAberto(!menuAberto);
  const handleNavegar = (rota) => navigate(rota);

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
      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#0b1b2b",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <Tooltip title="Menu" placement="top">
              <MenuIcon />
            </Tooltip>
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Portal do Cliente
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span className="text-sm">
              Bem-vindo! {usuario ? `${usuario}` : ""}
            </span>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Drawer
        variant="temporary"
        open={menuAberto}
        onClose={toggleDrawer}
        sx={{
          width: menuAberto ? 310 : 60,
          padding: "5px",
          position: "sticky",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            background: "linear-gradient(to right, #21479eff, #1e293b)",
            color: "#fff",
            width: 310,
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: menuAberto ? "space-between" : "center",
            alignItems: "center",
            px: 1,
          }}
        >
          {menuAberto && <img src={logoMarca} alt="Logo" className="h-8" />}
          <IconButton onClick={alternarMenu} sx={{ color: "#ffffffff" }}>
            <Tooltip title="Menu" placement="right">
              <MenuIcon />
            </Tooltip>
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button onClick={() => handleNavegar("/home")}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <Tooltip title="Home" placement="right">
                <HomeIcon />
              </Tooltip>
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleNavegar("/registros")}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <Tooltip title="Oportunidades" placement="right">
                <AssignmentIcon />
              </Tooltip>
            </ListItemIcon>
            <ListItemText primary="Oportunidades" />
          </ListItem>
          <ListItem button onClick={onLogout}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <Tooltip title="Sair" placement="right">
                <LogoutIcon />
              </Tooltip>
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItem>
        </List>
      </Drawer>

      {/* Conteúdo principal */}
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 64px)",
          position: "relative",
        }}
      >
        {/* Logo superior esquerdo */}
        <Box sx={{ position: "absolute", top: 20, left: 30 }}>
          <img src={logoMarca} alt="Logo KNC" style={{ height: "70px", objectFit: "contain" }} />
        </Box>

        {/* Card central */}
        <Box
          className="bg-white/90 shadow-2xl rounded-xl p-10 text-center backdrop-blur-md"
          sx={{ maxWidth: 500 }}
        >
          <Typography mb="8" variant="h3" className="font-bold text-gray-800 mb-4">
            <span variant="h3" className="text-xl">
              {usuario ? `${usuario}` : ""}
            </span>
          </Typography>
          <Divider mb="4" />
          <Typography variant="h6" className="font-bold text-gray-800 mb-8">
            Bem-vindo ao Portal do Cliente
          </Typography>
          <Typography variant="body1" className="text-gray-700 mb-8 mt-8">
            Selecione uma opção no menu...
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
