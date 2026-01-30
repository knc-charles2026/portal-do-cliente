// src/components/themesDrawer.js
const themesDrawer = {
  light: {
    drawerPaper: {
      backgroundColor: "#f9fafb",
      color: "#000",
      width: 410,
    },
    iconColor: "#374151",
    textColor: "#1e2e3f",
    hoverBg: "#474d5aff",
    hoverText: "#dee3ecff",
    divider: "rgba(7, 6, 6, 0.12)", // Divider visível no tema claro
  },
  dark: {
    drawerPaper: {
      backgroundColor: "#1e293b",
      color: "#f9fafb",
      width: 410,
    },
    iconColor: "#cbd5e1",
    textColor: "#f1f5f9",
    hoverBg: "#636a75ff",
    hoverText: "#f1f5f9",
    divider: "rgba(219, 225, 230, 0.87)", // Divider visível no tema escuro
    
  },
};

export default themesDrawer;
