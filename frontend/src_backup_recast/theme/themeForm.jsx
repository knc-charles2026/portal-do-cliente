import { Tooltip } from "@mui/material";

// Inputs
const inputStyles = (temaEscuro) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: temaEscuro ? '#1e293b' : '#fff',
    color: temaEscuro ? '#fff' : '#11113b',
    borderRadius: 2,
    '& fieldset': {
      borderColor: temaEscuro ? '#334155' : '#cbd5e1',
    },
    '&:hover fieldset': {
      borderColor: temaEscuro ? '#64748b' : '#94a3b8',
    },
    '&.Mui-focused fieldset': {
      borderColor: temaEscuro ? '#3b82f6' : '#2563eb',
    },
  },
  '& .MuiInputLabel-root': {
    color: temaEscuro ? '#f1f5f9' : '#11113b',
  },
  '& .MuiFormHelperText-root': {
    color: temaEscuro ? '#f87171' : '#b91c1c',
  },
});

// Botões
const buttonStyles = (temaEscuro) => ({
  '& .MuiButton-root': {
    borderRadius: 2,
    textTransform: 'none',
  },
  '& .MuiButton-contained': {
    color: temaEscuro ? '#f1f5f9' : '#ffffff',
    backgroundColor: temaEscuro ? '#334155' : '#3b82f6',
    '&:hover': {
      backgroundColor: temaEscuro ? '#475569' : '#2563eb',
    },
  },
  '& .MuiButton-outlined': {
    color: temaEscuro ? '#06d183ff' : '#1e293b',
    borderColor: temaEscuro ? '#475569' : '#cbd5e1',
    '&:hover': {
      backgroundColor: temaEscuro ? '#334155' : '#e0e7ff',
      borderColor: temaEscuro ? '#64748b' : '#94a3b8',
    },
  },
});

// Checkboxes / Radios / Switches
const controlStyles = (temaEscuro) => ({
  '& .MuiCheckbox-root, & .MuiRadio-root, & .MuiSwitch-root': {
    color: temaEscuro ? '#fff' : '#11113b',
  },
  '& .Mui-checked': {
    color: temaEscuro ? '#22c55e' : '#16a34a',
  },
});

// Drawer + Menu lateral
const drawerStyles = (temaEscuro) => ({
  drawerPaper: {
    backgroundColor: temaEscuro ? '#1e293b' : '#f9fafb',
    color: temaEscuro ? '#f1f5f9' : '#11113b',
    width: 280,
  },
  listItem: {
    borderRadius: 2,
    '&:hover': {
      backgroundColor: temaEscuro ? '#334155' : '#e2e8f0',
    },
  },
  listItemText: {
    color: temaEscuro ? '#f1f5f9' : '#11113b',
  },
  listItemIcon: {
    color: temaEscuro ? '#9ca3af' : '#1e293b',
  },
  divider: {
    backgroundColor: temaEscuro ? '#475569' : '#cbd5e1',
    margin: '8px 0',
  },
});

// Botão do menu (hamburger)
const menuButtonStyles = (temaEscuro) => ({
  menuButton: {
    boxShadow: 'none',
    background: 'transparent',
    '&:hover': {
      background: 'transparent',
    },
  },
  menuIcon: {
    fontSize: 36,
    color: temaEscuro ? '#fff' : '#11113b',
    Tooltip: 'Menu', 
  },
});

// Formulário geral
export const formSx = (temaEscuro) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
  backgroundColor: temaEscuro ? '#0f172a' : '#f9fafb',
  color: temaEscuro ? '#fff' : '#11113b',
  //borderRadius: 4,
  boxShadow: 'none',
 // boxShadow: temaEscuro
 //   ? '0 2px 8px rgba(136, 159, 185, 0.5)'
 //   : '0 2px 8px rgba(224, 233, 246, 0.92)',
  ...inputStyles(temaEscuro),
  ...buttonStyles(temaEscuro),
  ...controlStyles(temaEscuro),
  ...drawerStyles(temaEscuro),
  ...menuButtonStyles(temaEscuro),
});
