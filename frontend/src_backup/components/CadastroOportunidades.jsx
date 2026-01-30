import React, { useState, useEffect, useMemo } from "react";
import api from "../services/api";
import logoMarca from "../assets/knc-logo.png";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { Sun, Moon, ListIcon } from "lucide-react";
import { IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Toolbar, AppBar, Box, Button, Typography, Tooltip, Chip, Snackbar, Alert, Slider} from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
//import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Verified from "@mui/icons-material/Verified";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import PauseOutlined from "@mui/icons-material/PauseOutlined";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { DirectionsWalkOutlined, CheckOutlined, WarningAmberOutlined, CloseOutlined} from "@mui/icons-material";
import FormOportunidade from "./FormOportunidade";
import FormAprovacao from "./FormAprovacao";
import FormRenovacao from "./FormRenovacao"; 
import { dataGridSx } from "../theme/themeDataGrid";
import { GridFooterContainer } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { formatarData } from "../utils/date"; // import global
import ConfigModal from "./ConfigModal";
import SettingsIcon from "@mui/icons-material/Settings";

export default function CadastroOportunidades({ onLogout }) {
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false); // Menu colapsado por default
  const [oportunidades, setOportunidades] = useState([]);
  const [erroOportunidades, setErroOportunidades] = useState(null);
  const [formData, setFormData] = useState({});
  const [modo, setModo] = useState("list"); // list ou form
  const [modoForm, setModoForm] = useState(null); // create, update, delete
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formTipo, setFormTipo] = useState(null); 
  const [snackbarMessage, setSnackbarMessage] = useState("");
  //const [rowHeight, setRowHeight] = useState(32);  // Default (52)
  //const dataHora = dayjs(params.row.data_inclusao, "YYYY-MM-DD");
  //if (!dataHora.isValid()) return null;
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);
 // Pega o usuário do localStorage
const usuario = localStorage.getItem("usuario");

// Estados dos modais
const [openDeleteModal, setOpenDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [openConfig, setOpenConfig] = useState(false);
const [rowHeight, setRowHeight] = useState(40); // valor inicial do slider

// Abre o modal de exclusão
const handleOpenDeleteModal = (id) => {
  setDeleteId(id);
  setOpenDeleteModal(true);
};

// Fecha o modal de exclusão
const handleCloseDeleteModal = () => {
  setOpenDeleteModal(false);
  setDeleteId(null);
};


  // Confirma exclusão
  const handleConfirmDelete = async () => {
  try {
    await api.delete(`/portal-do-cliente/oportunidades/${deleteId}`);
    setSnackbarMessage("Registro excluído com sucesso!");
    setSnackbarOpen(true);
    fetchOportunidades(); // Atualiza grid
  } catch (error) {
    console.error("Erro ao excluir registro:", error);
    setSnackbarMessage("Erro ao excluir registro.");
    setSnackbarOpen(true);
  } finally {
    handleCloseDeleteModal();
  }
};


  const handleEdit = (row) => {
  setSelectedRow(row);
  setOpen(true); // abre modal
};

  const handleDelete = async (id) => {
  if (window.confirm("Deseja realmente excluir esta oportunidade?")) {
    try {
      await api.delete(`/portal-do-cliente/oportunidades/${id}`);
      fetchData(); // recarrega lista após delete
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar oportunidade");
    }
  }
};
  const navigate = useNavigate();

  const alternarTema = () => setTemaEscuro(!temaEscuro);
  const alternarMenu = () => setMenuAberto(!menuAberto);

  const fetchOportunidades = async () => {
    try {
      const response = await api.get('/portal-do-cliente/oportunidades/');
      setOportunidades(response.data);
      setErroOportunidades(null);
    } catch (error) {
      setErroOportunidades("Não foi possível carregar os registros de oportunidades.");
      console.error(error);
   }
  };

   const handleCancelar = () => {
      setModo("list"); // ou o estado que controla se exibe o form ou o grid
  };

      <FormOportunidade
        onCancelar={handleCancelar}
        fetchOportunidades={fetchOportunidades}
      />;

      

  useEffect(() => {
    if (usuario) fetchOportunidades();
  }, [usuario]);



// Definição de Status padrão para a inserção de registros (Formulário no Modo "create")

useEffect(() => {
  if (modoForm === "create" && (!formData.status || formData.status === "")) {
    setFormData((prev) => ({
      ...prev,
      status: "Pendente",
    }));
  }
}, [modoForm, formData.status, setFormData]);



  const columns = useMemo(() => [
    //{ field: "id", headerName: "Nº RO",  minWidth: 90,fontWeight: "bold", textAlign: "center", cellClassName: "idCell"  },
    {
     field: "id",
     headerName: "Nº RO",
     width: 120,
    renderCell: (params) => (
      <span style={{ color: "#307dcfff", fontWeight: "bold" }}>
       {params.value}
      </span>
        ), 
    },
    {
     field: "id_origem",
     headerName: "RO Origem",
     width: 150,
    renderCell: (params) => (
      <span style={{ color: "#b03636d6", fontWeight: "bold" }}>
       {params.value}
      </span>
        ), 
    },
    {

      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const value = params.value || "";
        let chipProps = { label: value, size: "small", sx: { fontWeight: "bold" } };
        if (/andamento/i.test(value)) chipProps = { ...chipProps, icon: <DirectionsWalkOutlined />, color: "info", variant: "outlined" };
        else if (/aprovado/i.test(value)) chipProps = { ...chipProps, icon: <CheckOutlined />, color: "success", variant: "outlined" };
        else if (/análise/i.test(value)) chipProps = { ...chipProps, icon: <WarningAmberOutlined />, color: "warning", variant: "outlined" };
        else if (/cancelado/i.test(value)) chipProps = { ...chipProps, icon: <CloseOutlined />, color: "error", variant: "outlined" };
        else chipProps = { ...chipProps, icon: <PauseOutlined />, color: "inherity", variant: "outlined" };
        return <Chip {...chipProps} />;
      },
      
    },
    { field: "cnpj_rv", headerName: "CNPJ Revenda", flex: 1, minWidth: 200 },
    { field: "nome_rv", headerName: "Nome Revenda", flex: 1, minWidth: 255 },
    { field: "email_rv", headerName: "Email Revenda", flex: 1, minWidth: 200 },
    { field: "status_validacao", headerName: "Status Final", flex: 1, minWidth: 150 },
    { field: "observacao_knc", headerName: "Observações KNC", flex: 1, minWidth: 380 },
    {
      field: "data_inclusao",
      headerName: "Data Inclusão",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
     }
    },
    //{ field: "data_inclusao", headerName: "Data Inclusão", flex: 1, minWidth: 155 },
     {
      field: "data_alteracao",
      headerName: "Data Alteração",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
     }
    }, 
    //{ field: "data_alteracao", headerName: "Data Alteração", flex: 1, minWidth: 125 },
    { field: "contato_rv", headerName: "Contato Revenda",  flex: 1, minWidth: 175 },
    { field: "telefone_rv", headerName: "Telefone Revenda",  flex: 1, minWidth: 175 },
    { field: "razao_social_cf", headerName: "Razão Social Cliente Final", flex: 1, minWidth: 200 },
    { field: "cnpj_cf", headerName: "CNPJ Cliente Final",  flex: 1, minWidth: 125 },
    { field: "contato_cf", headerName: "Contato Cliente Final", flex: 1, minWidth: 125 },
    { field: "email_cf", headerName: "Email Cliente Final", flex: 1, minWidth: 200 },
    { field: "cargo_cf", headerName: "Cargo Cliente Final", flex: 1, minWidth: 155 },
    { field: "telefone_cf", headerName: "Telefone Cliente Final", flex: 1, minWidth: 150 },
    { field: "aplicacoes_setorizacao", headerName: "Aplicação/Setorização", flex: 1, minWidth: 380 },
    { field: "produto_codigo", headerName: "Código do Produto", flex: 1, minWidth: 185 },
    { field: "produto_descricao", headerName: "Descrição do Produto", flex: 1, minWidth: 255 },
    { field: "produto_marca", headerName: "Marca", flex: 1, minWidth: 125 },
    { field: "qtde", headerName: "Qtde", flex: 1, minWidth: 125 },
    { field: "concorrencia", headerName: "Concorrente", flex: 1, minWidth: 115 },
    { field: "produto_marca_concorrente", headerName: "Produto/Marca Concorrente", flex: 1, minWidth: 200 },
    { field: "faixas_valores", headerName: "Faixa de Valores", flex: 1, minWidth: 200 },
    { field: "valor_total_usd", headerName: "Valor Total (USD)", flex: 1, minWidth: 125 },
    { field: "gerente_regional", headerName: "Gerente Regional", flex: 1, minWidth: 125 },
    {
      field: "data_prevista",
      headerName: "DataPrevista",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
     }
    }, 
    //{ field: "data_prevista", headerName: "Data Prevista", flex: 1, minWidth: 150 },
    { field: "observacoes_gerais", headerName: "Observações Gerais", flex: 1, minWidth: 255 },
    {
      field: "data_vencimento",
      headerName: "Vencimento",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
     }
    }, 
    //{ field: "data_vencimento", headerName: "Vencimento", flex: 1, minWidth: 150 },
    { field: "licitacao", headerName: "Licitação", flex: 1, minWidth: 150 },
    //{ field: "nome_email", headerName: "Nome Email", flex: 1, minWidth: 180 },
    //{ field: "dominio_email", headerName: "Domínio Email", flex: 1, minWidth: 180 },
    {
      field: "dias_restantes",
      headerName: "À Vencer",
      width: 150,
      sortable: true,
      renderCell: (params) => {
        if (!params?.row?.vencimento) return null;

        const vencimento = dayjs(params.row.vencimento, "YYYY-MM-DD");
        const hoje = dayjs().startOf("day");
        const diff = vencimento.diff(hoje, "day");

        let color =  "#65c67dff"; // >10 dias para vencer
        if (diff <= 10 && diff > 0) color = "#d1a55fff"; // <=10 dias para vencer
        else if (diff <= 0) color = "#cc5959ff"; // Já vencido

        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: color,
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 4,
             }}
          >
            {diff >= 0 ? diff : 0} dias
          </div>
        );
      },
    },

   {
  field: "vencimento_sla",
  headerName: "SLA (3 dias)",
  width: 120,
  minWidth: 115,
  renderCell: (params) => {
    if (!params.row.data_inclusao) return "-";

    const dataInclusao = new Date(params.row.data_inclusao);
    const dataSLA = new Date(dataInclusao);
    dataSLA.setDate(dataSLA.getDate() + 3);

    const hoje = new Date();
    const diffDias = Math.ceil((dataSLA - hoje) / (1000 * 60 * 60 * 24));

    // Cor da fonte conforme o prazo
    let corTexto = "green";
    if (diffDias <= 2 && diffDias >= 0) corTexto = "orange";
    if (diffDias < 0) corTexto = "red";

    return (
      <span style={{ fontWeight: "bold", color: corTexto }}>
        {dataSLA.toLocaleDateString("pt-BR")}
      </span>
    );
  },
},

  
   {
  field: "acoes",
  headerName: "Ações",
  width: 190,
  minWidth: 180,
  sortable: false,
  filterable: false,
  cellClassName: 'pinnedRight', // Classe CSS para fixar
  renderCell: (params) => (
    <>
      {/* Botão Editar */}
      <Tooltip title="Editar" placement="left">
        <IconButton
          color="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setRegistroSelecionado(params.row);
            setFormData(params.row);
            setModoForm("update");
            setModo("form");
            setFormTipo("oportunidades");
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>

      {/* Botão Aprovar */}
      <Tooltip title="Aprovar" placement="left">
        <IconButton
          color="info"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setRegistroSelecionado(params.row);
            setFormData(params.row);
            setModoForm("update");
            setModo("form");
            setFormTipo("aprovacao");
          }}
        >
          <AdminPanelSettingsIcon />
        </IconButton>
      </Tooltip>

      {/* Botão Excluir */}
      <Tooltip title="Excluir" placement="left">
        <IconButton
          color="inherit"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDeleteModal(params.row.id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>


      {/* Botão Renovar */}
      <Tooltip title="Renovar" placement="left">
        <IconButton
          color="info"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setRegistroSelecionado(params.row);
            setFormData(params.row);
            setModoForm("update");
            setModo("form");
            setFormTipo("renovacao");
          }}
        >
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>


{/*       <Tooltip title="Renovar" placement="left">
        <IconButton
          color="success"
          size="small"
          onClick={async (e) => {
            e.stopPropagation();
            try {
              await api.post(
                `/oportunidades/${params.row.id}/renovar`
              );
              fetchOportunidades();
              setSnackbarMessage("Registro renovado com sucesso!");
              setSnackbarOpen(true); // ✅ ativa Snackbar
            } catch (error) {
              console.error("Erro ao renovar:", error);
              setSnackbarMessage("Não foi possível renovar a oportunidade.");
              setSnackbarOpen(true); // ✅ ativa Snackbar de erro
            }
          }}
        >
          <ContentCopyIcon />
        </IconButton>
      </Tooltip> */}
    </>
  ),
}], []);



// const rows = useMemo(
//    () =>
//      oportunidades.map((o, index) => {
//        const dataHora = dayjs(o.data_inclusao, "YYYY-MM-DD");
//        const vencimento = dataHora.add(90, "day").format("YYYY-MM-DD"); // 90 dias para Vencimento contados da data de inclusão
//        const vencimento_sla = dataHora.add(3, "day").format("YYYY-MM-DD"); // 03 dias para Vencimento do SLA  contados da data de inclusão
//        return {
//          id: o.id ?? index,
//          ...o,
//          vencimento,
//          vencimento_sla,
//        };
//      }),
//    [oportunidades]
//
//    );

const rows = useMemo(() => {
  if (!Array.isArray(oportunidades)) return [];

  return oportunidades.map((o, index) => {
    const dataHora = dayjs(o.data_inclusao, "YYYY-MM-DD");

    const vencimento = dataHora
      .add(90, "day")
      .format("YYYY-MM-DD");

    const vencimento_sla = dataHora
      .add(3, "day")
      .format("YYYY-MM-DD");

    return {
      id: o.id ?? index,
      ...o,
      vencimento,
      vencimento_sla,
    };
  });
}, [oportunidades]);


  const handleSnackbarClose = () => setSnackbarOpen(false);
  
  return (
    <div className={`${temaEscuro ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen flex`}>
      
      {/* Drawer */}
      <Drawer
        variant="permanent"
        open={menuAberto}
        sx={{ 
          width: menuAberto ? 310 : 60,
          flexShrink: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1, // AppBar atrás do Drawer
          "& .MuiDrawer-paper": {
            width: menuAberto ? 310 : 60,
            boxSizing: "border-box",
            color: "#fff",
            transition: "width 0.2s",
            overflowX: "hidden",
            padding: "5px",
            background: "linear-gradient(to right, #21479eff, #1e293b)",
            "&:hover": {
            backgroundColor: "#d6e0f4ff", // cor de hover
            color: "#ffffffff",         // texto ao passar mouse
            "& .pinnedRight": {
            position: "sticky",
            right: 0,
            backgroundColor: "#fff",
            zIndex: 3,
            boxShadow: "-4px 0 6px rgba(0,0,0,0.05)",
          },
            "& .MuiDataGrid-cell": {
            borderRight: "1px solid #f0f0f0",
          },          
      },
          },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: menuAberto ? "space-between" : "center", alignItems: "center", px: 1 }}>
          {menuAberto && <img src={logoMarca} alt="Logo" className="h-8" />}
          <IconButton onClick={alternarMenu} sx={{ color: "#fff" }}>
            <Tooltip title="Menu" placement="right"><MenuIcon /></Tooltip>
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate("/home")}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <Tooltip title="Home" placement="right"><HomeIcon /></Tooltip>
            </ListItemIcon>
            {menuAberto && <ListItemText primary="Home" />}
          </ListItem>
          <ListItem button onClick={() => setModo("list")}> 
            <ListItemIcon sx={{ color: "#fff" }}>
              <Tooltip title="Visualizar Registros" placement="right"><ListIcon /></Tooltip>
            </ListItemIcon>
            {menuAberto && <ListItemText primary="Visualizar Registros" />}
          </ListItem>
          <ListItem button onClick={() => { 
              setFormData({}); 
              setRegistroSelecionado(null); 
              setModo("form"); 
              setModoForm("create"); 
              setFormTipo("oportunidades");   // 👈 define o Fromulário
            }}
          > 
            <ListItemIcon sx={{ color: "#fff" }}>
              <Tooltip title="+ Criar Novo" placement="right"><AddIcon /></Tooltip>
            </ListItemIcon>
            {menuAberto && <ListItemText primary="Adicionar Registro" />}
          </ListItem>
          <ListItem button onClick={() => { 
              setFormData({}); 
              setRegistroSelecionado(null); 
              setModo("form"); 
              setModoForm("create"); 
              setFormTipo("aprovacao");   // 👈 define o Fromulário
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <Tooltip title="Aprovação" placement="right"><Verified /></Tooltip>
            </ListItemIcon>
            {menuAberto && <ListItemText primary="Aprovação" />}
          </ListItem>
        </List>
        <Divider />
        <List>
{/*           <ListItem button onClick={() => setUsuario(null)}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <Tooltip title="Sair" placement="right"><LogoutIcon /></Tooltip>
            </ListItemIcon>
            {menuAberto && <ListItemText primary="Sair" />}
          </ListItem> */}
          <ListItem button onClick={onLogout}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItem>
        </List>
      </Drawer>

      {/* Conteúdo */}
  
      <Box sx={{ flexGrow: 1, mt: "48px" }}>
        {/* Navbar */}
        <AppBar position="fixed" elevation={0} sx={{ backgroundColor: "#1e293b", borderTop: "none", zIndex: (theme) => theme.zIndex.drawer}}>
          <Toolbar sx={{ minHeight: 48, display: "flex", justifyContent: "space-between", px: 2 }}>
            <img src={logoMarca} alt="Logo" className="h-8" style={{ marginLeft: "48px" }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={alternarTema} color="inherit">
                {temaEscuro ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
              <span className="text-sm">Bem-vindo! {usuario ? `${usuario}` : ""}</span> 
              
            </Box>
          </Toolbar>
        </AppBar>

        {/* Título e botão */}
        <Box sx={{ mx: "auto", mt: "4", mb:"4", display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, pb: 0}}>
          <Typography sx={{margin:0}}variant="h5" fontWeight="bold">Portal do Cliente</Typography>
{/*           {modo === "list" && (   
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => { setFormData({}); setRegistroSelecionado(null); setModo("form"); setModoForm("create"); }}
          >
            Criar Novo
          </Button>
          )} */}

{/* Botão Configurações */}
<Tooltip title="Configurações" placement="left">
  <IconButton
    color="inherit"
    size="small"
    onClick={(e) => {
      e.stopPropagation();
      setOpenConfig(true); // abre a modal
    }}
  >
    <SettingsIcon />
  </IconButton>
</Tooltip>



          
 
      </Box>
      

        {/* Grid */}
      <Box sx={{ p: 2, height: "calc(100vh - 128px)" }}>
        
              {/*  {modoForm ? ( */}
    {modo === "form" ? (
          <Box 
            sx={{
              backgroundColor: /*"#f5f5f5"*/ "#d9e1f2ff",  // cinza claro
              padding: 3,                     // espaçamento interno
              borderRadius: 2,                // bordas arredondadas
              boxShadow: 3,                   // sombra leve
              maxWidth: 1200,                 // largura máxima
              margin: "20px auto",            // centraliza e dá espaço
              overflowY: "auto",  
              width: "100%",
              p: 3 
            }}
          >
    {formTipo === "oportunidades" && (
      <FormOportunidade
        formData={formData}
        setFormData={setFormData}
        modo={modoForm}
        onCancelar={() => { 
          setModo("list"); 
          setRegistroSelecionado(null); 
          setFormTipo(null); 
          setModoForm(null);
        }}
        onSalvar={async () => {
          try {
            if (modoForm === "create") await api.post("/oportunidades/", formData);
            if (modoForm === "update") await api.put(`/oportunidades/${registroSelecionado?.id}`, formData);
            if (modoForm === "delete") await api.delete(`/oportunidades/${registroSelecionado?.id}/`);
            setModo("list");
            setModoForm(null);
            setRegistroSelecionado(null);
            setFormTipo(null);
            fetchOportunidades();
            setSnackbarMessage("Operação realizada com sucesso!");
            setSnackbarOpen(true);
          } catch (error) {
            alert("Erro ao processar a operação");
            console.error(error);
          }
        }}
      />
    )}

    {formTipo === "aprovacao" && registroSelecionado && (
  <FormAprovacao
    open={true}
    onClose={() => {
      setModo("list");
      setRegistroSelecionado(null);
      setFormTipo(null);
      setModoForm(null);
    }}
    rowData={registroSelecionado}  // dados carregados para o form
    fetchOportunidades={fetchOportunidades} // atualiza a grid após salvar
  />
)}


   {formTipo === "renovacao" && registroSelecionado && (
  <FormRenovacao
    open={true}
    onClose={() => {
      setModo("list");
      setRegistroSelecionado(null);
      setFormTipo(null);
      setModoForm(null);
    }}
    rowData={registroSelecionado}  // dados carregados para o form
    fetchOportunidades={fetchOportunidades} // atualiza a grid após salvar
  />
)}

  </Box>
) : erroOportunidades ? (
  <div className="text-red-600">{erroOportunidades}</div>
) : (

            <div
                style={{
                maxWidth: "1790px", // limita a largura máxima do grid
                width: "100%",       // ocupa 100% do espaço do container até o limite

                overflow: "auto",    // scroll aparece só no grid
                height: "95vh - 200px", //calc(100vh - 110px)",  // 👆 ocupa a altura da janela menos o header + footer
                margin: "0 auto",    // centraliza o container
                padding: "0 5px 5px 0px",
              }}
            >
         
        <Box className={" text xs row-span-3" } sx={{ display: 'flex', width: 300, mx: "right" }}>
          <Typography sx={{margin:2}} variant="contained" fontWeight="bold" > Registro de Oportunidades</Typography>
        </Box>

            <DataGrid
              rows={rows}
              rowHeight={rowHeight} 
              columns={columns}
              showToolbar
              getRowId={(row) => row.id} // 🔑 garante que cada linha tenha ID
              pageSizeOptions={[15, 25, 50, 100]}
              initialState={{
              pagination: { paginationModel: { pageSize: 15 } },
              }}
              checkboxSelection
              disableRowSelectionOnClick
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
             // pinnedColumns={{ right: ["acoes"] }} // <- coluna fixa à direita Só funciona na Grid Pro / Premium
              getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
              }
              
              sx={{
                width: "100%",
                height: "640px",     // altura fixa para permitir scroll interno
                borderRadius: 2,
                borderTop: "none",   // cola no header
                overflow: "hiden",   // scroll aparece só dentro do grid
                "& .MuiDataGrid-columnHeaders": {
                borderBottom: "none", // cola no rodapé
                },
                boxShadow: "0 4px 8px rgba(251, 218, 228, 0.48)",
                ...dataGridSx(temaEscuro), 
              }}
            />
          </div>
          )}

  


      {/* Modal de Configurações da densidade do DataGrid */}
        <ConfigModal
              open={openConfig}
              onClose={() => setOpenConfig(false)}
              rowHeight={rowHeight}
              setRowHeight={setRowHeight}
        />


        {/* Títulos Dinâmicos conforme o Modo e Tipo de Formulário */}

        {modo === "form" && formTipo === "aprovacao" && ( 
         <Box> <Typography variant="h1"> </Typography></Box>
        )}

        {modo === "form" && formTipo === "renovacao" && (    
         <Box> <Typography variant="h1"> </Typography></Box>
        )}

        {modo === "form" && formTipo === "oportunidades" && ( 
         <Box> <Typography variant="h1"> </Typography></Box>
        )} 

        {modo === "list" && ( 
         <Box> <Typography variant="h1"> </Typography></Box>
        )}          

        {/* Contador de Registros da Grid */} 

        {modo === "list" && (       
            <span className="text-xs font-semibold">
              Total: {rows.length} registros
            </span>
        )}

        {/* Rodapé */}
          <Box sx={{ fontSize:'10px', backgroundColor: '#fff', py: 1, textAlign: 'center' }}>
              © KNC Soluções em Eficiência Energética Ltda - Todos os direitos reservados
          </Box>

      </Box> 
  
    </Box>


<Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
  <DialogTitle>Confirmar Exclusão</DialogTitle>
      <Divider></Divider>
  <DialogContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <WarningAmberOutlined color="error" sx={{ fontSize: 40 }} />
    <Typography>Tem certeza que deseja excluir este registro?</Typography>
  </DialogContent>
      <Divider></Divider>
  <DialogActions>
    <Button onClick={handleCloseDeleteModal} color="error" variant="contained">
      Não
    </Button>
    <Button onClick={handleConfirmDelete} color="primary" variant="contained">
      Sim
    </Button>
  </DialogActions>
</Dialog>


      {/* Snackbar de sucesso - Exibe o Alert estilizado que auto oculta após o tempo determinado*/}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
 
}
