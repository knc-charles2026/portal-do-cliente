// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import './index.css'

// 📅 Imports para datas
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { ptBR as ptBRDateFns } from 'date-fns/locale'

ReactDOM.createRoot(document.getElementById('root')).render(
 // <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRDateFns}>
      <App />
    </LocalizationProvider>
 // </React.StrictMode>,
)
