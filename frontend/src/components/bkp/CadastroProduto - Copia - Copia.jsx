import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import logoMarca from "../assets/knc-logo.png";
import { DataGrid } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { Sun, Moon, Search } from "lucide-react";
import { CSVLink } from "react-csv";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ptBR } from 'date-fns/locale';

<LocalizationProvider 
  dateAdapter={AdapterDateFns} 
  adapterLocale={ptBR}
>
  <App />
</LocalizationProvider>


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
  const [filtro, setFiltro] = useState("");
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const alternarTema = () => setTemaEscuro(!temaEscuro);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (formData.danfe && formData.danfe.length !== 9) {
      alert("DANFE deve ter 9 dígitos.");
      return;
    }
    if (formData.nfe44 && formData.nfe44.length !== 44) {
      alert("A chave NFe deve ter 44 dígitos.");
      return;
    }

    e.preventDefault();
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

  const formatarData = (valor) => {
    if (!valor) return "";
    if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      const [ano, mes, dia] = valor.split("-");
      return `${dia}/${mes}/${ano}`;
    }
    return "";
  };
  
  

  const columns = useMemo(() => [
    { field: "numero_serie", headerName: "Número de Série", flex: 1, minWidth: 125 },
    { field: "modelo", headerName: "Modelo", flex: 1, minWidth: 140 },
    { field: "cliente", headerName: "Cliente", flex: 1, minWidth: 270 },
    { field: "danfe", headerName: "Nota Fiscal", flex: 1, minWidth: 135 },
    { field: "data_compra", headerName: "Data Emissão", flex: 1.5, minWidth: 130 },
    { field: "data_envio", headerName: "Data Envio", flex: 1.5, minWidth: 130 },
    { field: "data_vencimento", headerName: "Data Vencimento", flex: 1.5, minWidth: 130 },
    { field: "nfe44", headerName: "Chave NFe", flex: 1.5, minWidth: 380 },
   /*  {
      field: "data_compra",
      headerName: "Data da Compra",
      flex: 1,
      minWidth: 140,
      valueFormatter: (params) => formatarData(params?.value)
    },
    {
      field: "data_envio",
      headerName: "Data do Envio",
      flex: 1,
      minWidth: 140,
      valueFormatter: (params) => formatarData(params?.value)
    },
    {
      field: "data_vencimento",
      headerName: "Vencimento da Garantia",
      flex: 1,
      minWidth: 170,
      valueFormatter: (params) => formatarData(params?.value)
    }, */
  ], []);

  const rows = useMemo(() => {
    return produtos.map((p) => ({ id: p.id, ...p })).filter((p) => {
      const termo = filtro.toLowerCase();
      return ["numero_serie", "modelo", "cliente", "danfe", "nfe44"].some((key) =>
        String(p[key] || "").toLowerCase().includes(termo)
      );
    });
  }, [produtos, filtro]);

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
 {/*      <header className="flex items-center justify-between bg-[#002855] p-4">
        <div className="flex items-center gap-4">
          <img src={logoMarca} alt="Logo KNC" className="h-10" />
          <h1 className="text-white text-2xl font-bold">Controle de Garantias</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white text-sm">Bem vindo! {usuario.nome} ({usuario.nivel})</span>
          <button onClick={alternarTema} className="text-white hover:text-yellow-300 transition" title="Alternar tema">
            {temaEscuro ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header> */}

      <nav className="flex items-center justify-between px-4 py-3 bg-[#002855] shadow-md">
        <div className="flex items-center gap-3">
          <IconButton onClick={alternarMenu} sx={{ color: "#fff" }}>
          <MenuIcon />
          </IconButton>
          <img src={logoMarca} alt="Logo" className="h-8" />
          <span onClick={CadastroProduto} className="text-white text-lg font-semibold">Controle de Garantias</span>
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

		<Drawer
		anchor="left"
		open={menuAberto}
		onClose={alternarMenu}
		Paper={{
			sx: {
			backgroundColor: temaEscuro ? '#1e293b' : '#f9fafb',
			color: temaEscuro ? '#fff' : '#000',
			width: 300,
			},
		}}
		>
		<Toolbar /> <img src={logoMarca} alt="Logo" className="h-6" />
		<Box sx={{ width: 300 }}> <img src={logoMarca} alt="Logo" className="h-8" />
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







      <div className="p-4 sm:p-6"> 
        <h2 className="text-2xl text-right font-bold mt-6 mb-4">Portal do Cliente</h2>
          {/* Formulário de cadastro de garantias */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-[#e2e8f0] p-3 rounded-lg">  <h1 className="text-sm font-bold mb-4 col-span-2">Formulário de Cadastro de Garantias</h1>
          <div class="flex flex-col"> <label class="text-xs text-gray-600 mb-1">Número de Série</label> 
          <input type="text" name="numero_serie" value={formData.numero_serie} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div class="flex flex-col"> <label class="text-xs text-gray-600 mb-1">Modelo</label>          
          <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div class="flex flex-col"> <label class="text-xs text-gray-600 mb-1">Cliente</label>
          <input type="text" name="cliente" value={formData.cliente} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div class="flex flex-col"> <label class="text-xs text-gray-600 mb-1">Nota Fiscal</label>
          <input type="text" name="danfe" value={formData.danfe} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div class="flex flex-col"> <label class="text-xs text-gray-600 mb-1">Chave Nfe</label>
          <input type="text" name="nfe44" value={formData.nfe44} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div class="flex flex-col"> <label class="text-xs text-gray-600 mb-1">Data da Compra</label>
          <input type="date" name="data_compra" value={formData.data_compra} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div class="flex flex-col"> <label class="text-xs text-gray-600 mb-1">Data do Envio</label>
          <input type="date" name="data_envio" value={formData.data_envio} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div class="flex flex-col"> <label class="text-xs text-gray-600 mb-1">Data Vencimento</label>
          <input type="date" name="data_vencimento" value={formData.data_vencimento} onChange={handleChange} className="p-2 border rounded" />
          </div>
        <div class="col-span-2 flex justify-end">          
          <button  type="submit"  class="bg-[#1e293b] text-white px-4 py-2 rounded hover:bg-blue-500">Inserir Registro</button>
        </div>
        </form>
        <h2 className="text-xl font-bold mb-4">Portal do Cliente</h2>
        <div className="mb-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Filtrar por cliente, modelo ou número de série..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10 p-3 border rounded-md w-full"
          />
        </div>

        {erroProdutos ? (
          <div className="text-red-600 mb-4">{erroProdutos}</div>
        ) : (
          <div style={{ height: 400, width: '100%' }}>
            {/* Grid para Listar garantias */}
            <DataGrid showToolbar rows={rows} columns={columns} columnHeaderHeight={36} rowHeight={30} // Define a altura da linha (padrão é 52)
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              pagination
              autoHeight={false}
              disableSelectionOnClick
              getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'}
              sx={{
                backgroundColor: temaEscuro ? "#f0f0f0" : "#f0f0f0",
                color: temaEscuro ? "#fff" : "#000",
                borderRadius: 2,
                boxShadow: temaEscuro ? "0 2px 8px rgba(0, 0, 0, 0.5)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                '& .even-row': {
                  backgroundColor: temaEscuro ? '#334155' : '#f9fafb',
                },
                '& .odd-row': {
                  backgroundColor: temaEscuro ? '#1e293b' : '#f9fafb',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: temaEscuro ? '#0f172a' : '#e2e8f0',
                  color: temaEscuro ? '#facc15' : '#1f2937',
                  fontWeight: 'bold'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  color: '#4b67a3', // Azul
                },


              }}
            />
          <div className="flex justify-between items-center mb-2 max-w-md">

          <CSVLink
            data={exportData}
            headers={exportHeaders}
            filename="garantias.csv"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Exportar CSV
          </CSVLink>
          <span className="text-sm font-semibold">Total: {rows.length} registros</span>
        </div>
          </div>
        )}
      </div>
    </div> 
    
  ); 
}
