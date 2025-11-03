import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import logoMarca from "../assets/knc-logo.png";
import { DataGrid } from '@mui/x-data-grid'; // Removido GridToolbar daqui
import { ptBR } from '@mui/x-data-grid/locales';
import { Sun, Moon } from "lucide-react";
// Removido CSVLink daqui, pois agora está no CustomDataGridToolbar
import CustomDataGridToolbar from './CustomDataGridToolbar'; // Importe o novo componente da toolbar

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Toolbar,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';

export default function CadastroProduto() {
  const [menuAberto, setMenuAberto] = useState(false);
  const alternarMenu = () => setMenuAberto(!menuAberto);

  const [formData, setFormData] = useState({
    numero_serie: "",
    modelo: "",
    data_compra: "",
    cliente: "",
    danfe: "",
    nfe44: "",
    data_envio: "",
    data_vencimento: "",
  });

  const [produtos, setProdutos] = useState([]);
  const [erroProdutos, setErroProdutos] = useState(null);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const alternarTema = () => setTemaEscuro(!temaEscuro);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.danfe && formData.danfe.length !== 9) {
      alert("DANFE deve ter 9 dígitos.");
      return;
    }
    if (formData.nfe44 && formData.nfe44.length !== 44) {
      alert("A chave NFe deve ter 44 dígitos.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/produtos/", formData);
      alert("Produto cadastrado com sucesso!");
      setFormData({
        numero_serie: "",
        modelo: "",
        data_compra: "",
        cliente: "",
        data_envio: "",
        data_vencimento: "",
        danfe: "",
        nfe44: ""
      });
      fetchProdutos();
    } catch (error) {
      alert("Erro ao cadastrar produto.");
      console.error("Erro ao cadastrar produto:", error);
    }
  };

  const fetchProdutos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/produtos/");
      setProdutos(response.data);
      setErroProdutos(null);
    } catch (error) {
      setErroProdutos("Não foi possível carregar os produtos. Verifique se a API está rodando.");
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    if (usuario) fetchProdutos();
  }, [usuario]);

  const columns = useMemo(() => [
    { field: "numero_serie", headerName: "Número de Série", flex: 1, minWidth: 125 },
    { field: "modelo", headerName: "Modelo", flex: 1, minWidth: 140 },
    { field: "cliente", headerName: "Cliente", flex: 1, minWidth: 270 },
    { field: "danfe", headerName: "Nota Fiscal", flex: 1, minWidth: 135 },
    { field: "data_compra", headerName: "Data Emissão", flex: 1.5, minWidth: 130 },
    { field: "data_envio", headerName: "Data Envio", flex: 1.5, minWidth: 130 },
    { field: "data_vencimento", headerName: "Data Vencimento", flex: 1.5, minWidth: 130 },
    { field: "nfe44", headerName: "Chave NFe", flex: 1.5, minWidth: 380 },
  ], []);

  const rows = useMemo(() => {
    return produtos.map((p) => ({ id: p.id, ...p }));
  }, [produtos]);

  // Estes dados serão passados para a CustomDataGridToolbar
  const exportHeaders = columns.map(col => ({ label: col.headerName, key: col.field }));
  const exportData = rows.map(row => {
    const linha = {};
    columns.forEach(col => {
      linha[col.field] = row[col.field] ?? "";
    });
    return linha;
  });

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (nomeUsuario === "admin" && senha === "5366") {
              setUsuario({ nome: "admin", nivel: "admin" });
            } else {
              alert("Credenciais inválidas");
            }
          }}
          className="bg-white shadow-md p-6 rounded-xl w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <input
            type="text"
            placeholder="Usuário"
            className="w-full mb-3 p-2 border rounded"
            value={nomeUsuario}
            onChange={(e) => setNomeUsuario(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full mb-4 p-2 border rounded"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="submit" className="bg-[#1e293b] text-white w-full py-2 rounded hover:bg-blue-700">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`${temaEscuro ? "bg-gray-900 text-white" : "bg-white text-black"} bg-opacity-90 rounded-2xl shadow-md overflow-hidden`}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 py-3 bg-[#002855] shadow-md">
        <div className="flex items-center gap-3">
          <IconButton onClick={alternarMenu} sx={{ color: "#fff" }}>
            <MenuIcon />
          </IconButton>
          <img src={logoMarca} alt="Logo" className="h-8" />
          <span className="text-white text-lg font-semibold">Controle de Garantias</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white text-sm">Bem vindo! {usuario.nome} ({usuario.nivel})</span>
          <button onClick={alternarTema} className="text-white" title="Tema">
            {temaEscuro ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="text-white" title="Sair">
            <LogoutIcon />
          </button>
        </div>
      </nav>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={menuAberto}
        onClose={alternarMenu}
        PaperProps={{ // Corrigido de Paper para PaperProps para compatibilidade com MUI v5+
          sx: {
            backgroundColor: temaEscuro ? '#1e293b' : '#f9fafb',
            color: temaEscuro ? '#fff' : '#000',
            width: 300,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ width: 300 }}>
          <img src={logoMarca} alt="Logo" className="h-8 mx-auto my-2" />
          <List>
            <ListItem button>
              <ListItemIcon><HomeIcon sx={{ color: temaEscuro ? '#facc15' : '#002855' }} /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><DescriptionIcon sx={{ color: temaEscuro ? '#facc15' : '#002855' }} /></ListItemIcon>
              <ListItemText primary="Controle de Garantias" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon><LogoutIcon sx={{ color: temaEscuro ? '#f87171' : '#b91c1c' }} /></ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Conteúdo */}
      <div className="p-4 sm:p-6">
        <h2 className="text-2xl text-right font-bold mt-6 mb-4">Portal do Cliente</h2>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-[#e2e8f0] p-3 rounded-lg">
          <h1 className="text-sm font-bold mb-4 col-span-2">Formulário de Cadastro de Garantias</h1>

          {.map((field, index) => (
            <div key={index} className="flex flex-col">
              <label htmlFor={field.name} className="text-sm font-medium mb-1">{field.label}:</label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.name !== "nfe44"} // NFe não é obrigatória
                className={`p-2 border rounded-md focus:outline-none focus:ring-2 
                  ${temaEscuro ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-400' : 'bg-white text-gray-800 border-gray-300 focus:ring-blue-500'}`}
              />
            </div>
          ))}
          <div className="col-span-1 md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-[#002855] text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cadastrar
            </button>
          </div>
        </form>

        {/* Tabela de Produtos */}
        <div className={`mt-8 ${temaEscuro ? "bg-gray-800" : "bg-gray-50"} rounded-lg shadow-md p-4`}>
          <h3 className="text-xl font-semibold mb-4">Lista de Produtos</h3>
          {erroProdutos && <div className="text-red-500 mb-4">{erroProdutos}</div>}
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10, 25, 50]} // Definição explícita das opções de tamanho da página
              checkboxSelection
              disableRowSelectionOnClick
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              // Usando slots para a toolbar personalizada
              slots={{
                toolbar: CustomDataGridToolbar,
              }}
              slotProps={{ // Passando as props necessárias para a CustomDataGridToolbar
                toolbar: { exportHeaders, exportData, temaEscuro }, // Inclua temaEscuro aqui
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
