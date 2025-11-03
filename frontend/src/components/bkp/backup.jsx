import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import logoMarca from "../assets/knc-logo.png";
import { DataGrid, GridFooterContainer } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { Sun, Moon, ListIcon } from "lucide-react";
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  AppBar,
  Box,
  Button,
  Typography,
  Tooltip,
  Chip,
  Snackbar,
  Alert
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Verified from "@mui/icons-material/Verified";
import { DirectionsWalkOutlined, CheckOutlined, WarningAmberOutlined, CloseOutlined } from "@mui/icons-material";
import FormOportunidade from "./FormOportunidade";
import { dataGridSx } from "../theme/themeDataGrid";

function CustomFooter() {
  return (
    <GridFooterContainer sx={{ justifyContent: "flex-end", p: 1 }}>
      <div style={{ fontWeight: "bold" }}>Rodapé customizado aqui</div>
    </GridFooterContainer>
  );
}

export default function CadastroOportunidades() {
  const [usuario, setUsuario] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [oportunidades, setOportunidades] = useState([]);
  const [erroOportunidades, setErroOportunidades] = useState(null);
  const [modo, setModo] = useState("list"); // list ou form
  const [modoForm, setModoForm] = useState(null); // create, update, delete
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const [formData, setFormData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const alternarTema = () => setTemaEscuro(!temaEscuro);
  const alternarMenu = () => setMenuAberto(!menuAberto);

  const fetchOportunidades = async () => {
    try {
      const response = await axios.get("http://localhost:8000/oportunidades/");
      setOportunidades(response.data);
      setErroOportunidades(null);
    } catch (error) {
      setErroOportunidades("Não foi possível carregar os registros de oportunidades.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (usuario && modo === "list") fetchOportunidades();
  }, [usuario, modo]);

  const columns = useMemo(() => [
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const value = params.value || "";
        let chipProps = { label: value, size: "small", sx: { fontWeight: "bold" } };
        if (/andamento/i.test(value)) chipProps = { ...chipProps, icon: <DirectionsWalkOutlined />, color: "info", variant: "outlined" };
        else if (/concluído/i.test(value)) chipProps = { ...chipProps, icon: <CheckOutlined />, color: "success", variant: "outlined" };
        else if (/análise/i.test(value)) chipProps = { ...chipProps, icon: <WarningAmberOutlined />, color: "warning", variant: "outlined" };
        else if (/cancelado/i.test(value)) chipProps = { ...chipProps, icon: <CloseOutlined />, color: "error", variant: "outlined" };
        else chipProps = { ...chipProps, icon: <WarningAmberOutlined />, color: "warning", variant: "outlined" };
        return <Chip {...chipProps} />;
      },
    },
    { field: "status_validacao", headerName: "Status Final", flex: 1, minWidth: 150 },
    { field: "observacao_knc", headerName: "Observações KNC", flex: 1, minWidth: 380 },
    { field: "data_alteracao", headerName: "Data Alteração", flex: 1, minWidth: 125 },
    { field: "data_hora", headerName: "Data Cadastro", flex: 1, minWidth: 150 },
    { field: "email_rv", headerName: "Email Revenda", flex: 1, minWidth: 200 },
    { field: "nome_rv", headerName: "Nome Revenda",  flex: 1, minWidth: 255 },
    { field: "cnpj_rv", headerName: "CNPJ Revenda",  flex: 1, minWidth: 200 },
    { field: "contato_rv", headerName: "Contato Revenda",  flex: 1, minWidth: 175 },
    { field: "telefone_rv", headerName: "Telefone Revenda",  flex: 1, minWidth: 175 },
    { field: "razao_social_cf", headerName: "Razão Social Cliente Final",  flex: 1, minWidth: 200 },
    { field: "cnpj_cf", headerName: "CNPJ Cliente Final",  flex: 1, minWidth: 125 },
    { field: "contato_cf", headerName: "Contato Cliente Final", flex: 1, minWidth: 125 },
    { field: "email_cf", headerName: "Email Cliente Final", flex: 1, minWidth: 200 },
    { field: "cargo_cf", headerName: "Cargo Cliente Final",  flex: 1, minWidth: 155 },
    { field: "telefone_cf", headerName: "Telefone Cliente Final",  flex: 1, minWidth: 150 },
    { field: "aplicacoes_setorizacao", headerName: "Aplicação/Setorização",  flex: 1, minWidth: 380 },
    { field: "produto_codigo", headerName: "Código do Produto",  flex: 1, minWidth: 185 },
    { field: "produto_descricao", headerName: "Descrição do Produto",  flex: 1, minWidth: 255 },
    { field: "produto_marca", headerName: "Marca",  flex: 1, minWidth: 125 },
    { field: "qtde", headerName: "Qtde", flex: 1, minWidth: 125 },
    { field: "concorrencia", headerName: "Concorrente",  flex: 1, minWidth: 115 },
    { field: "produto_marca_concorrente", headerName: "Produto/Marca Concorrente",  flex: 1, minWidth: 200 },
    { field: "faixas_valores", headerName: "Faixa de Valores",  flex: 1, minWidth: 200 },
    { field: "valor_total_usd", headerName: "Valor Total (USD)",  flex: 1, minWidth: 125 },
    { field: "gerente_regional", headerName: "Gerente Regional",  flex: 1, minWidth: 125 },
    { field: "data_prevista", headerName: "Data Prevista",  flex: 1, minWidth: 150 },
    { field: "observacoes_gerais", headerName: "Observações Gerais", flex: 1, minWidth: 525 },
    { field: "data_vencimento", headerName: "Data de Vencimento",  flex: 1, minWidth: 150 },
    { field: "licitacao", headerName: "Licitação",  flex: 1, minWidth: 150 },
    { field: "nome_email", headerName: "Nome Email", flex: 1, minWidth: 180 },
    { field: "dominio_email", headerName: "Domínio Email",  flex: 1, minWidth: 180 },
    {
      field: "acoes",
      headerName: "Ações",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setRegistroSelecionado(params.row);
              setFormData(params.row);
              setModoForm("update");
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setRegistroSelecionado(params.row);
              setFormData(params.row);
              setModoForm("delete");
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ], []);

  const rows = useMemo(() => oportunidades.map((o) => ({ id: o.id, ...o })), [oportunidades]);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (nomeUsuario === "admin" && senha === "5366") setUsuario({ nome: "admin", nivel: "admin" });
            else alert("Credenciais inválidas");
          }}
          className="bg-white shadow-md p-6 rounded-xl w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <input type="text" placeholder="Usuário" className="w-full mb-3 p-2 border rounded" value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} />
          <input type="password" placeholder="Senha" className="w-full mb-4 p-2 border rounded" value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button type="submit" className="bg-[#1e293b] text-white w-full py-2 rounded hover:bg-blue-700">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className={`${temaEscuro ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen flex`}>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        open={menuAberto}
        sx={{ 
          width: menuAberto ? 310 : 60,
          flexShrink: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          "& .MuiDrawer-paper": {
            width: menuAberto ? 310 : 60,
            boxSizing: "border-box",
            color: "#fff",
            transition: "width 0.3s",
            overflowX: "hidden",
            padding: "5px",
            background: "linear-gradient(to right, #21479eff, #1e293b)",
          },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: menuAberto ? "space-between" : "center", alignItems: "center", px: 1 }}>
          {menuAberto && <img src={logoMarca} alt="Logo" className="h-8" />}
          <IconButton onClick={alternarMenu} sx={{ color: "#fff" }}><MenuIcon /></IconButton>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button onClick={() => setModo("list")}> 
            <ListItemIcon sx={{ color: "#fff" }}><ListIcon /></ListItemIcon>
            {menuAberto && <ListItemText primary="Visualizar Registros" />}
          </ListItem>
          <ListItem button onClick={() => { setFormData({}); setRegistroSelecionado(null); setModo("form"); setModoForm("create"); }}> 
            <ListItemIcon sx={{ color: "#fff" }}><AddIcon /></ListItemIcon>
            {menuAberto && <ListItemText primary="Adicionar Registro" />}
          </ListItem>
          <ListItem button onClick={() => setUsuario(null)}>
            <ListItemIcon sx={{ color: "#fff" }}><LogoutIcon /></ListItemIcon>
            {menuAberto && <ListItemText primary="Sair" />}
          </ListItem>
        </List>
      </Drawer>

      {/* Conteúdo */}
      <Box sx={{ flexGrow: 1, mt: "48px" }}>
        <AppBar position="fixed" elevation={0} sx={{ backgroundColor: "#1e293b", zIndex: (theme) => theme.zIndex.drawer}}>
          <Toolbar sx={{ minHeight: 48, display: "flex", justifyContent: "space-between", px: 2 }}>
            <img src={logoMarca} alt="Logo" className="h-8" style={{ marginLeft: "48px" }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={alternarTema} color="inherit">{temaEscuro ? <Sun size={20} /> : <Moon size={20} />}</IconButton>
              <span className="text-sm">Bem vindo! {usuario.nome} ({usuario.nivel})</span>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ mx: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, pb: 0, mt:2 }}>
          <Typography sx={{margin:0}} variant="h5" fontWeight="bold">Portal do Cliente</Typography>
          {modo === "list" && (
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setFormData({}); setRegistroSelecionado(null); setModo("form"); setModoForm("create"); }}>
              Criar Novo
            </Button>
          )}
        </Box>

        <Box sx={{ p: 2, height: "calc(100vh - 128px)" }}>
          {modo === "form" ? (
            <FormOportunidade
              formData={formData}
              setFormData={setFormData}
              modo={modoForm}
              onCancelar={() => { setModo("list"); setRegistroSelecionado(null); }}
              onSalvar={async () => {
                try {
                  if (modoForm === "create") await axios.post("http://localhost:8000/oportunidades/", formData);
                  if (modoForm === "update") await axios.put(`http://localhost:8000/oportunidades/${registroSelecionado.id}/`, formData);
                  if (modoForm === "delete") await axios.delete(`http://localhost:8000/oportunidades/${registroSelecionado.id}/`);
                  setModo("list");
                  setRegistroSelecionado(null);
                  fetchOportunidades();
                  setSnackbarMessage("Operação realizada com sucesso!");
                  setSnackbarOpen(true);
                } catch (error) {
                  alert("Erro ao processar a operação");
                  console.error(error);
                }
              }}
            />
          ) : erroOportunidades ? (
            <div className="text-red-600">{erroOportunidades}</div>
          ) : (
            <div style={{ maxWidth: "1790px", width: "100%", overflow: "auto", height: "95vh - 200px", margin: "0 auto", padding: "0 5px 5px 0px" }}>
              <Box className={" text xs row-span-3" } sx={{ display: "flex" }}>
                <Typography sx={{margin:2}} variant="contained" fontWeight="bold"> Registro de Oportunidades</Typography>
              </Box>

              <DataGrid
                rows={rows}
                rowHeight={30}
                columns={columns}
                showToolbar
                pageSizeOptions={[15, 25, 50, 100]}
                initialState={{ pagination: { paginationModel: { pageSize: 15 } }, pinnedColumns: { right: ["acoes"] } }}
                checkboxSelection
                disableRowSelectionOnClick
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"}
                sx={{ width: "100%", height: "640px", borderRadius: 2, borderTop: "none", overflow: "hidden", boxShadow: "0 4px 8px rgba(241, 218, 218, 0.2)", ...dataGridSx(temaEscuro) }}
              />

              <span className="text-xs font-semibold">Total: {rows.length} registros</span>
            </div>
          )}

          <Box sx={{ fontSize:'10px', backgroundColor: '#fff', py: 1, textAlign: 'center' }}>
            © KNC Soluções em Eficiência Energética Ltda - Todos os direitos reservados
          </Box>
        </Box>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>{snackbarMessage}</Alert>
      </Snackbar>
    </div>
  );
}
