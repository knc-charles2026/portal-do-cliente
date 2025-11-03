import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import logoMarca from "../assets/knc-logo.png";
import { DataGrid } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { Sun, Moon, Search } from "lucide-react";
import { CSVLink } from "react-csv";
import InputMask from "react-input-mask";
//import TelefoneInput from "./TelefoneInput";
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Chip } from '@mui/material';
import { Modal } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const getMask = (fieldName, value = "") => {
  const numbers = value.replace(/\D/g, "");

  if (fieldName.includes("telefone")) {
    // Telefone dinâmico: celular ou fixo
    return numbers.length <= 11 ? "(99) 99999-9999" : "(99) 9999-9999";
  }
  if (fieldName.includes("cpf")) {
    return "999.999.999-99";
  }
  if (fieldName.includes("cnpj")) {
    return "99.999.999/9999-99";
  }

  return null; // sem máscara
};

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

export default function CadastroOportunidades() {
  const [menuAberto, setMenuAberto] = useState(false);
  const alternarMenu = () => setMenuAberto(!menuAberto);

  const [formData, setFormData] = useState({
    status: "",
    status_validacao: "",
    observacao_knc: "", 
    data_alteracao: "",
    data_hora:"",
    email_rv: "",
    nome_rv: "",
    cnpj_rv: "",
    contato_rv: "",
    telefone_rv: "",
    razao_social_cf: "",
    cnpj_cf: "", 
    contato_cf: "",
    email_cf: "",
    cargo_cf: "",
    telefone_cf: "",
    aplicacoes_setorizacao: "",
    produto_codigo: "",
    produto_descricao: "",
    produto_marca: "",
    qtde: "",
    concorrencia: "",
    produto_marca_concorrente: "",
    faixas_valores: "",
    valor_total_usd: "",
    gerente_regional: "",
    data_prevista:  "",
    observacoes_gerais: "",
    data_vencimento: "",
    licitacao: "",
    nome_email: "",
    dominio_email: "",
  });

  const [oportunidades, setOportunidades] = useState([]);
  const [erroOportunidades, seterroOportunidades] = useState(null);
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
      await axios.post("http://localhost:8000/oportunidades/", formData);
      alert("Oportunidade inserida com sucesso!");
      setFormData({
        status: "",
        status_validacao: "",
        observacao_knc: "", 
        data_alteracao: "",
        data_hora:"",
        email_rv: "",
        nome_rv: "",
        cnpj_rv: "",
        contato_rv: "",
        telefone_rv: "",
        razao_social_cf: "",
        cnpj_cf: "", 
        contato_cf: "",
        email_cf: "",
        cargo_cf: "",
        telefone_cf: "",
        aplicacoes_setorizacao: "",
        produto_codigo: "",
        produto_descricao: "",
        produto_marca: "",
        qtde: "",
        concorrencia: "",
        produto_marca_concorrente: "",
        faixas_valores: "",
        valor_total_usd: "",
        gerente_regional: "",
        data_prevista:  "",
        observacoes_gerais: "",
        data_vencimento: "",
        licitacao: "",
        nome_email: "",
        dominio_email: ""
      });
      fetchOportunidades();
    } catch (error) {
      alert("Erro ao registrar a Oportunidade.");
      console.error("Erro ao registrar a Oportunidade:", error);
    }
  };

  const fetchOportunidades = async () => {
    try {
      const response = await axios.get("http://localhost:8000/oportunidades/");
      setOportunidades(response.data);
      seterroOportunidades(null);
    } catch (error) {
      seterroOportunidades("Não foi possível carregar os registros de oportunidades. Verifique se a API está rodando.");
      console.error("Erro ao buscar oportunidades:", error);
    }
  };

  useEffect(() => {
    if (usuario) fetchOportunidades();
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
     {
        field: "status",
        headerName: "Status",
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
          const value = params.value || "";
    
          let chipProps = {
            label: value,
            size: "small",
            sx: { fontWeight: "bold" },
          };
    
          if (/andamento/i.test(value)) chipProps.icon = <DirectionsWalkOutlinedIcon />, chipProps.color = "info", chipProps.variant = "outlined";
            else if (/concluído/i.test(value)) chipProps.icon = <CheckOutlinedIcon />,  chipProps.color = "success", chipProps.variant = "outlined";
            else if (/análise/i.test(value)) chipProps.icon = <WarningAmberOutlinedIcon />, chipProps.color = "warning", chipProps.variant = "outlined";
            else if (/cancelado/i.test(value)) chipProps.icon = <CloseOutlinedIcon />, chipProps.color = "error", chipProps.variant = "outlined";
            else chipProps.color = "warning", chipProps.icon = <WarningAmberOutlinedIcon />, chipProps.variant = "outlined";
    
          return <Chip {...chipProps} />;
        },
        
    },
//    { field: "status", headerName: "Status", flex: 1, minWidth: 125 },
    { field: "status_validacao", headerName: "Status Final",  flex: 1, minWidth: 125 },
    { field: "observacao_knc", headerName: "Observações KNC",  flex: 1, minWidth: 380 },
    { field: "data_alteracao", headerName: "Data Alteração", flex: 1, minWidth: 125 },
    { field: "data_hora", headerName: "Data/Hora",  flex: 1, minWidth: 125 },
    { field: "email_rv", headerName: "Email Revenda", flex: 1, minWidth: 255 },
    { field: "nome_rv", headerName: "Nome Revenda",  flex: 1, minWidth: 125 },
    { field: "cnpj_rv", headerName: "CNPJ Revenda",  flex: 1, minWidth: 125 },
    { field: "contato_rv", headerName: "Contato Revenda",  flex: 1, minWidth: 125 },
    { field: "telefone_rv", headerName: "Telefone Revenda",  flex: 1, minWidth: 125 },
    { field: "razao_social_cf", headerName: "Razão Social Cliente Final",  flex: 1, minWidth: 125 },
    { field: "cnpj_cf", headerName: "CNPJ Cliente Final",  flex: 1, minWidth: 125 },
    { field: "contato_cf", headerName: "Contato Cliente Final", flex: 1, minWidth: 125 },
    { field: "email_cf", headerName: "Email Cliente Final", flex: 1, minWidth: 255 },
    { field: "cargo_cf", headerName: "Cargo Cliente Final",  flex: 1, minWidth: 125 },
    { field: "telefone_cf", headerName: "Telefone Cliente Final",  flex: 1, minWidth: 255 },
    { field: "aplicacoes_setorizacao", headerName: "Aplicações/Setorização",  flex: 1, minWidth: 380 },
    { field: "produto_codigo", headerName: "Código do Produto",  flex: 1, minWidth: 125 },
    { field: "produto_descricao", headerName: "Descrição do Produto",  flex: 1, minWidth: 255 },
    { field: "produto_marca", headerName: "Marca",  flex: 1, minWidth: 125 },
    { field: "qtde", headerName: "Qtde", flex: 1, minWidth: 125 },
    { field: "concorrencia", headerName: "Possui Concorrente",  flex: 1, minWidth: 125 },
    { field: "produto_marca_concorrente", headerName: "Produto/Marca Concorrente",  flex: 1, minWidth: 125 },
    { field: "faixas_valores", headerName: "Faixa de Valores",  flex: 1, minWidth: 125 },
    { field: "valor_total_usd", headerName: "Valor Total (USD)",  flex: 1, minWidth: 125 },
    { field: "gerente_regional", headerName: "Gerente Regional",  flex: 1, minWidth: 125 },
    { field: "data_prevista", headerName: "Data Prevista",  flex: 1, minWidth: 125 },
    { field: "observacoes_gerais", headerName: "Observações Gerais", flex: 1, minWidth: 380 },
    { field: "data_vencimento", headerName: "Data de Vencimento",  flex: 1, minWidth: 125 },
    { field: "licitacao", headerName: "Licitação",  flex: 1, minWidth: 255 },
    { field: "nome_email", headerName: "Nome Email", flex: 1, minWidth: 255 },
    { field: "dominio_email", headerName: "Domínio Email",  flex: 1, minWidth: 125 },
  // Coluna de Ações
  {
    field: "acoes",
    headerName: "Ações",
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            console.log("Editar ID:", params.row.id);
          }}
          color="primary"
          size="small"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            console.log("Deletar ID:", params.row.id);
          }}
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </>
    ),
  },
], []);
  

  const rows = useMemo(() => {
    return oportunidades.map((p) => ({ id: p.id, ...p })).filter((p) => {
      const termo = filtro.toLowerCase();
      return ["Status", "Status Final", "Nome Revenda", "Razão Social Cliente Final", "Contato Revenda"].some((key) =>
        String(p[key] || "").toLowerCase().includes(termo)
      );
    });
  }, [oportunidades, filtro]);

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
          <button type="submit" className="bg-[#1e293b]  text-white w-full py-2 rounded hover:bg-blue-700">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`${temaEscuro ? "bg-gray-900 text-white" : "bg-white text-black"} bg-opacity-90 rounded-2xl shadow-md overflow-hidden`}>
      <nav className="flex items-center justify-between px-4 py-3 bg-[#002855] shadow-md">
        <div className="flex items-center gap-3">
          <IconButton onClick={alternarMenu} sx={{ color: "#efeff5f1" }}>
          <MenuIcon />
          </IconButton>
          <img src={logoMarca} alt="Logo" className="h-8" />
          <span onClick={CadastroOportunidades} className="text-white text-lg font-semibold"> </span>
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
              <ListItemText primary="Registrar Oportunidades" />
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

        {/* Formulário de cadastro */}
        <form 
          onSubmit={handleSubmit} 
          //className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6 bg-[#e2e8f0] p-3 rounded-lg"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-[#e2e8f0] p-3 rounded-lg" 
        >
          <h1 className={`font-bold mb-4 col-span-3 gap-4 border rounded p-2 w-ful ${temaEscuro ? '#ebf1e1ff' : '#e2e8f0'}`}>
            Registrar Oportunidades
          </h1>


          {[
            { label: "Status", name:"status", type: "select", options: ["Aprovado", "Aguardando", "Negado", "Pendente"] },
            { label: "Status Final", name:"status_validacao", type: "text"},
            { label: "Observações KNC", name:"observacao_knc", type: "textarea"},
            { label: "Data Alteração", name:"data_alteracao", type: "date"},
            { label: "Data/Hora", name:"data_hora", type: "date"},
            { label: "Email Revenda", name:"email_rv", type: "email"},
            { label: "Nome Revenda", name:"nome_rv", type: "text"},
            { label: "CNPJ Revenda", name:"cnpj_rv", type: "text"},
            { label: "Contato Revenda", name:"contato_rv", type: "text"},
            { label: "Telefone Revenda", name:"telefone_rv", type: "tel", size: "w-40"},
            { label: "Razão Social Cliente Final", name:"razao_social_cf", type: "text"},
            { label: "CNPJ Cliente Final", name:"cnpj_cf", type: "text"},
            { label: "Contato Cliente Final", name:"contato_cf", type: "text"},
            { label: "Email Cliente Final", name:"email_cf", type: "email"},
            { label: "Cargo Cliente Final", name:"cargo_cf", type: "text"},
            { label: "Telefone Cliente Final", name:"telefone_cf", type: "tel", size: "w-40"},
            { label: "Aplicações/Setorização", name:"aplicacoes_setorizacao", type: "text"},
            { label: "Código do Produto", name:"produto_codigo", type: "text"},
            { label: "Descrição do Produto", name:"produto_descricao", type: "text"},
            { label: "Marca", name:"produto_marca", type: "text"},
            { label: "Qtde", name:"qtde", type: "text"},
            { label: "Possui Concorrente", name:"concorrencia", type: "select", options: ["Sim", "Não"] },
            { label: "Produto/Marca Concorrente", name:"produto_marca_concorrente", type: "text"},
            { label: "Faixa de Valores", name:"faixas_valores", type: "text"},
            { label: "Valor Total (USD)", name:"valor_total_usd", type: "text"},
            { label: "Gerente Regional", name:"gerente_regional", type: "select", options: ["Fabio Costa", "Leandra Fonseca", "Maciel Nascimento", "Nelson Matunaga"] },
            { label: "Data Prevista", name:"data_prevista", type: "date"},
            { label: "Observações Gerais", name:"observacoes_gerais", type: "textarea"},
            { label: "Data de Vencimento", name:"data_vencimento", type: "date"},
            { label: "Licitação", name:"licitacao", type: "text"},
            { label: "Nome Email", name:"nome_email", type: "text"},
            { label: "Domínio Email", name:"dominio_email", type: "text"},
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
            <label className="block text-xs font-medium text-gray-700 mb-2">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="border rounded p-2"
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="border rounded p-2"
                >
                  <option value="">Selecione</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "tel" || field.name.includes("cpf") || field.name.includes("cnpj") ? (
                <InputMask
                  mask={getMask(field.name, formData[field.name])}
                  value={formData[field.name]}
                  onChange={handleChange}
                >
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      type="text"
                      name={field.name}
                      className="border rounded p-2"
                    />
                  )}
                </InputMask>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="border rounded p-2"
                />
              )}
            </div>
          ))}
          <div className="flex align-end justify-end mt-4 col-span-3">
          <button
            type="submit"
            className="bg-[#1e293b] text-white px-4 py-2 rounded hover:bg-blue-500 col-span-3" >
            Cadastrar Oportunidade
          </button>
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
   
        {erroOportunidades ? (
          <div className="text-red-600 mb-4">{erroOportunidades}</div>
        ) : (
          <div style={{ height: 400, width: '100%' }}>
            {/* Grid para Listar oportunidades */}
            <DataGrid showToolbar rows={rows} columns={columns} columnHeaderHeight={36} rowHeight={30} // Define a altura da linha (padrão é 52)
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
 //             pageSize={8}
              rowsPerPageOptions={[18]}
              initialState={{
              pagination: {
              paginationModel: {
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
              getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'}
              sx={{
                backgroundColor: temaEscuro ? "#f0f0f0" : "#e2e8f0", /* Cor de fundo da grid, rodpé e Toolbar */
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
{/*           <div className="flex justify-between items-center mb-2 max-w-md">

          <CSVLink
            data={exportData}
            headers={exportHeaders}
            filename="garantias.csv"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Exportar CSV
          </CSVLink>
          <span className="text-sm font-semibold">Total: {rows.length} registros</span>
        </div> */}
        <span className="text-sm font-semibold">Total: {rows.length} registros</span>
          </div> 
        )}
      </div>
    </div> 
    
  ); 
}
