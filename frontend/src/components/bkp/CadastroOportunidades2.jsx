import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { Sun, Moon, Search } from "lucide-react";
import InputMask from "react-input-mask";
import Alert from "@mui/material/Alert";
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
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  DirectionsWalkOutlined,
  CheckOutlined,
  CloseOutlined,
  WarningAmberOutlined,
  Check as CheckIcon,
} from "@mui/icons-material";

export default function CadastroOportunidades({ usuario }) {
  // Tema e menu
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const alternarMenu = () => setMenuAberto(!menuAberto);
  const alternarTema = () => setTemaEscuro(!temaEscuro);

  // Dados e formulário
  const [oportunidades, setOportunidades] = useState([]);
  const [erroOportunidades, setErroOportunidades] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [formData, setFormData] = useState({
    status: "",
    status_validacao: "",
    observacao_knc: "",
    data_alteracao: "",
    data_hora: "",
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
    data_prevista: "",
    observacoes_gerais: "",
    data_vencimento: "",
    licitacao: "",
    nome_email: "",
    dominio_email: "",
    danfe: "",
    nfe44: "",
  });

  // Busca oportunidades
  const fetchOportunidades = async () => {
    try {
      const response = await axios.get("http://localhost:8000/oportunidades/");
      setOportunidades(response.data);
      setErroOportunidades(null);
    } catch (error) {
      setErroOportunidades(
        "Não foi possível carregar os registros de oportunidades. Verifique se a API está rodando."
      );
      console.error("Erro ao buscar oportunidades:", error);
    }
  };

  useEffect(() => {
    if (usuario) fetchOportunidades();
  }, [usuario]);

  // Form handlers
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
      await axios.post("http://localhost:8000/oportunidades/", formData);
      alert("Oportunidade inserida com sucesso!");
      setFormData({
        status: "",
        status_validacao: "",
        observacao_knc: "",
        data_alteracao: "",
        data_hora: "",
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
        data_prevista: "",
        observacoes_gerais: "",
        data_vencimento: "",
        licitacao: "",
        nome_email: "",
        dominio_email: "",
        danfe: "",
        nfe44: "",
      });
      fetchOportunidades();
    } catch (error) {
      alert("Erro ao registrar a Oportunidade.");
      console.error("Erro ao registrar a Oportunidade:", error);
    }
  };

  const formatarData = (valor) => {
    if (!valor) return "";
    if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      const [ano, mes, dia] = valor.split("-");
      return `${dia}/${mes}/${ano}`;
    }
    return "";
  };

//const columns = useMemo(() => [
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

      if (/andamento/i.test(value)) chipProps.icon = <DirectionsWalkOutlined />, chipProps.color = "info", chipProps.variant = "outlined";
      else if (/concluído/i.test(value)) chipProps.icon = <CheckOutlined />,  chipProps.color = "success", chipProps.variant = "outlined";
      else if (/análise/i.test(value)) chipProps.icon = <WarningAmberOutlined />, chipProps.color = "warning", chipProps.variant = "outlined";
      else if (/cancelado/i.test(value)) chipProps.icon = <CloseOutlined />, chipProps.color = "error", chipProps.variant = "outlined";
      else chipProps.color = "warning", chipProps.icon = <WarningAmberOutlined />, chipProps.variant = "outlined";

      return <Chip {...chipProps} />;
    },
  },
    { field: "status_validacao", headerName: "Status Final", flex: 1, minWidth: 150 },
    { field: "observacao_knc", headerName: "Observações KNC", flex: 1, minWidth: 380 },
    { field: "data_alteracao", headerName: "Data Alteração", flex: 1, minWidth: 125 },
    { field: "data_hora", headerName: "Data Cadastro",  flex: 1, minWidth: 150 },
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



  // Página principal após login
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Oportunidades</h1>
      <CadastroForm />
      <CadastroGrid />
    </div>
  );


// estrutura do componente de Navbar
  return (
    <div className={`${temaEscuro ? "bg-gray-900 text-white" : "bg-white text-black"} bg-opacity-90 rounded-2xl shadow-md overflow-hidden`}>
      <nav className="flex items-center justify-between px-4 py-3 bg-[#1a1e3c] shadow-md">
        <div className="flex items-center gap-3">
          <IconButton onClick={alternarMenu} sx={{ color: "#efeff5f1" }}>
          {/* <MenuIcon /> */}
          </IconButton>
          <img src={logoMarca} alt="Logo" className="h-14"/>
          <span onClick={CadastroOportunidades} className="text-white text-lg font-semibold"> </span>
        </div>
          <div className="flex items-center gap-4">
          <span className="text-white text-sm">Bem vindo! {usuario.nome} ({usuario.nivel})</span>
          <button onClick={alternarTema} className="text-white" title="Tema">
            {temaEscuro ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

{/* Estrutura do componente Drawer (Menu Lateral) */}

          <IconButton className="h-22" onClick={alternarMenu} sx={{ color: temaEscuro ? '#ffffffff' : '#002855' }}>
          <MenuIcon />
          </IconButton>

      <Drawer
        anchor="left"
        open={menuAberto}
        onClose={alternarMenu}
        Paper={{
          sx: {
            backgroundColor: temaEscuro ? '#1e293b' : '#f9fafb',
            color: temaEscuro ? '#1a1e2f' : '#000',
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
          className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-6 bg-[#e2e8f0] p-3 rounded-lg text-blue-900"
          //className={'grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-3 rounded-lg' + (temaEscuro ? 'bg-[#ebf1e1]' : ' bg-[#e2e8f0] text-blue-900')} 
        >
         {/*  <h1 className="text-xs font-bold mb-4 col-span-3 gap-4 border rounded p-2 w-ful ">   */}            {/* col-spa-3 para ocupar toda a largura com tres colunas de inputbox*/}
            <h1 className={`font-bold mb-4 col-span-3 gap-4 border rounded p-2 w-ful ${temaEscuro ? '#ebf1e1ff' : '#e2e8f0'}`}>
            Registrar Oportunidades
          </h1>

          {[
            { label: "Status", name:"status", type: "select", options: ["Aprovado", "Aguardando", "Negado", "Pendente"]},
            { label: "Status Final", name:"status_validacao", type: "text"},
            { label: "Observações KNC", name:"observacao_knc", type: "textarea"},
            { label: "Data Alteração", name:"data_alteracao", type: "date"},
            { label: "Data Cadastro", name:"data_hora", type: "date"},
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
            { label: "Gerente Regional", name:"gerente_regional", type: "select", options: ["Carlos Benno","Fabio Costa", "Leandra Fonseca", "Maciel Nascimento", "Nelson Matunaga"] },
            { label: "Data Prevista", name:"data_prevista", type: "date"},
            { label: "Observações Gerais", name:"observacoes_gerais", type: "textarea", required: true},
            { label: "Data de Vencimento", name:"data_vencimento", type: "date"},
            { label: "Licitação", name:"licitacao", type: "select", options: ["Sim", "Não"] },
            { label: "Nome Email", name:"nome_email", type: "text"},
            { label: "Domínio Email", name:"dominio_email", type: "text"},
].map((field) => (
  <div key={field.name} className="flex flex-col">
    <label className="label-form">{field.label}</label>

    {field.type === "textarea" ? (
      <textarea
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        className="form-control"
      />
    ) : field.type === "select" ? (
      <select
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        className="form-control"
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
            className="form-control"
          />
        )}
      </InputMask>
    ) : (
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        className="form-control"
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
      
        <h2 className="text-xl font-bold mb-4">Registro de Oportunidades</h2>
        <div className="mb-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Filtro Genérico..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10 p-3 border rounded-md w-full"
          />
        </div>

        {erroOportunidades ? (
          <div className="text-red-600 mb-4">{erroOportunidades}</div>
        ) : (
          <div style={{ height: 400, width: '100%' }}>
  {/* Grid para Listar Oportunidades */}
 <DataGrid showToolbar rows={rows} columns={columns} columnHeaderHeight={36} rowHeight={30} // Define a altura da linha (padrão é 52)
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              pageSize={5}
              rowsPerPageOptions={[5]}
              pagination
              disableSelectionOnClick
              getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'}
              sx={{
                backgroundColor: temaEscuro ? "#6c6d72ff" : "#d6e6fcff", // cor de fundo da tabela
                color: temaEscuro ? "#fff" : "#615b5bff",
                borderRadius: 2,
                boxShadow: temaEscuro ? "0 2px 8px rgba(136, 159, 185, 0.5)" : "0 2px 8px rgba(224, 233, 246, 0.92)",
                '& .even-row': {
                  backgroundColor: temaEscuro ? '#020005ff' : '#fff', // cor desejada para linhas pares
                },
                '& .odd-row': {
                  backgroundColor: temaEscuro ? '#1e293b' : '#d5def4ff', // cor desejada para linhas ímpares
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: temaEscuro ? '#0f172a' : '#0909e6ff', // cor desejada para o cabeçalho
                  color: temaEscuro ? '#114272ff' : '#114272ff', // cor do texto do cabeçalho
                  borderBottom: temaEscuro ? '2px solid #080454ff' : '2px solid #1f2937', 
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: temaEscuro ? '1px solid #334155' : '1px solid #cbd5e1', // cor desejada para as células
                },
                '& .MuiDataGrid-columnSeparator': {
                  color: temaEscuro ? '#64748b' : '#0e213bff', // cor desejada para os separadores de colunas
                  backgroundColor: temaEscuro ? '#829bbeff' : '#aed0fcff', // cor desejada para  separadores de colunas
                },
                '& .MuiDataGrid-iconSeparator': {
                  display: 'true', // esconde 'none'/ exibe 'true' - ícone de separador das colunas
                },
                '& .MuiDataGrid-footerContainer': {
                  color: temaEscuro ? '#facc15' : '#1f2937',  // cor do texto do rodapé
                  borderTop: temaEscuro ? '2px solid #334155' : '2px solid #cbd5e1', // cor da borda superior do rodapé
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold' 
                },
                '& .MuiDataGrid-toolbar .MuiSvgIcon-root': {
                  color: temaEscuro ? '#fff' : '#324f7dff', // cor desejada para os ícones da toolbar
                },
                '& .MuiDataGrid-row:hover': { 
                  backgroundColor: temaEscuro ? '#829bbeff' : '#aed0fcff', // cor desejada ao passar o mouse
                  color: temaEscuro ? '#dae4f1ff' : '#0c192bff', // mantém o texto legível no hover 
                },
                '& .MuiTablePagination-root .MuiSvgIcon-root': {
                  color: temaEscuro ? "#020116ff" : '#324f7dff', // cor dos ícones de paginação
                },
                '& .MuiOutlinedInput-input': {
                  backgroundColor: temaEscuro ? "#fff" : '#fff', // cor da caixa de busca
                },
                '& .MuiDataGrid-tollbarQuickFilter': {
                  backgroundColor: temaEscuro ? "#fff" : '#fff', // cor da caixa de busca
                },
                '& .MuiIconButton-root': {
                  backgroundColor: temaEscuro ? "#1f398fff" : '#fff', // cor do círculo dos botões da toolbar
                },
                '& .MuiTablePagination-selectLabel': {
                  color: temaEscuro ? "#020116ff" : '#11113bff', // cor do rótulo "Linhas por página"
                }, 
                '& .MuiTablePagination-displayedRows': {
                  color: temaEscuro ? "#030118ff" : '#11113bff', // cor da contagem de paginação
                },  
                '& .MuiTablePagination-actions': {
                  color: temaEscuro ? "#fff" : '#11113bff', // cor dos botões de ação da paginação
                },
                '& .MuiDataGrid-filterForm': {
                  backgroundColor: temaEscuro ? "#1e293b" : '#f9fafb', // cor do fundo do formulário de filtro
                  color: temaEscuro ? "#fff" : '#11113bff', // cor do texto do formulário de filtro
                },
                '& .MuiDataGrid-filterFormInput': {
                  backgroundColor: temaEscuro ? "#fff" : '#fff', // cor da caixa de entrada do filtro
                  color: temaEscuro ? "#000" : '#11113bff', // cor do texto da caixa de entrada do filtro
                },
                '& .MuiDataGrid-filterFormOperatorInput': {
                  backgroundColor: temaEscuro ? "#fff" : '#fff', // cor da caixa de operador do filtro
                  color: temaEscuro ? "#000" : '#11113bff', // cor do texto da caixa de operador do filtro
                },
                '& .MuiDataGrid-filterFormLogicOperatorInput': {
                  backgroundColor: temaEscuro ? "#fff" : '#fff', // cor da caixa de operador lógico do filtro
                  color: temaEscuro ? "#000" : '#11113bff', // cor do texto da caixa de operador lógico do filtro
                }, 
                '& .MuiDataGrid-filterFormDeleteIcon': {
                  color: temaEscuro ? "#f87171" : '#b91c1c', // cor do ícone de exclusão do filtro
                },
                '& .MuiDataGrid-filterFormAddIcon': {
                  color: temaEscuro ? "#34d399" : '#059669', // cor do ícone de adição do filtro
                },
                '& .MuiCheckbox-root': {
                  color: temaEscuro ? "#fff" : '#11113bff', // cor das checkboxes
                },
                '& .Mui-checked': {
                  color: temaEscuro ? "#22c55e" : '#16a34aff', // cor das checkboxes marcadas
                },
                '& .MuiDataGrid-menuIcon': {
                  color: temaEscuro ? "#112041ff" : '#324f7dff', // cor do ícone de menu da coluna
                },
                '& .MuiDataGrid-sortIcon': {
                  color: temaEscuro ? "#0a2546ff" : '#324f7dff', // cor do ícone de ordenação da coluna
                },
                '& .MuiDataGrid-columnHeaderDraggableContainer': {
                  backgroundColor: temaEscuro ? "#0f172a" : '#eff1f8ff', // cor ao arrastar o cabeçalho da coluna
                },
                '& .MuiDataGrid-overlay': {
                  backgroundColor: temaEscuro ? "rgba(30, 41, 59, 0.8)" : 'rgba(255, 255, 255, 0.8)', // cor do overlay (ex: ao carregar dados)
                },
                '& .MuiDataGrid-virtualScroller': {
                  backgroundColor: temaEscuro ? "#1e293b" : '#0b60b6ff', // cor do fundo do scroller
                },
                '& .MuiDataGrid-virtualScrollerRenderZone': {
                  backgroundColor: temaEscuro ? "#1e293b" : '#0b60b6ff', // cor do fundo do scroller
                }, 
                '& .MuiDataGrid-cellContent': {
                  fontSize: '0.875rem', // tamanho da fonte do conteúdo da célula
                },
                '& .MuiDataGrid-columnHeaderTitleContainer': {
                  fontSize: '0.875rem', // tamanho da fonte do título do cabeçalho da coluna
                },
                '& .MuiDataGrid-footerCell': {
                  fontSize: '0.875rem', // tamanho da fonte das células do rodapé
                  color: temaEscuro ? '#fbfcffff' : '#1f2937',
                },
                '& .MuiDataGrid-toolbarContainer': {
                  padding: '0.5rem', // espaçamento interno da toolbar
                },
                /* '& .MuiDataGrid-toolbarContainer .MuiButton-root': {
                  textTransform: 'none', // mantém o texto dos botões da toolbar sem transformação
                }, */
                '& .MuiDataGrid-toolbarContainer .MuiButton-root:hover': {
                  backgroundColor: temaEscuro ? '#334155' : '#e0e7ff', // cor de fundo ao passar o mouse nos botões da toolbar
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-root.Mui-disabled': {
                  color: temaEscuro ? '#4875b3ff' : '#4979bdff', // cor dos botões desabilitados da toolbar
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-root.Mui-disabled:hover': {
                  backgroundColor: temaEscuro ? '#1e293b' : '#f9fafb', // mantém a cor de fundo ao passar o mouse nos botões desabilitados
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
                  color: temaEscuro ? '#f1f5f9' : '#28326dff', // cor do texto dos botões de texto da toolbar
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-text:hover': {
                  backgroundColor: temaEscuro ? '#334155' : '#e0e7ff', // cor de fundo ao passar o mouse nos botões de texto da toolbar
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-outlined': {
                  color: temaEscuro ? '#f1f5f9' : '#1e293b', // cor do texto dos botões outlined da toolbar
                  borderColor: temaEscuro ? '#475569' : '#cbd5e1', // cor da borda dos botões outlined da toolbar
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-outlined:hover': {
                  backgroundColor: temaEscuro ? '#334155' : '#e0e7ff', // cor de fundo ao passar o mouse nos botões outlined da toolbar
                  borderColor: temaEscuro ? '#64748b' : '#94a3b8', // cor da borda ao passar o mouse nos botões outlined
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-outlined.Mui-disabled': {
                  color: temaEscuro ? '#64748b' : '#94a3b8', // cor dos botões outlined desabilitados da toolbar
                  borderColor: temaEscuro ? '#334155' : '#e0e7ff', // cor da borda dos botões outlined desabilitados
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-outlined.Mui-disabled:hover': {
                  backgroundColor: temaEscuro ? '#1e293b' : '#f9fafb', // mantém a cor de fundo ao passar o mouse nos botões outlined desabilitados
                  borderColor: temaEscuro ? '#334155' : '#e0e7ff', // mantém a cor da borda ao passar o mouse nos botões outlined desabilitados
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-contained': {
                  color: temaEscuro ? '#f1f5f9' : '#ffffff', // cor do texto dos botões contained da toolbar
                  backgroundColor: temaEscuro ? '#334155' : '#3b82f6', // cor de fundo dos botões contained da toolbar
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-contained:hover': {
                  backgroundColor: temaEscuro ? '#475569' : '#2563eb', // cor de fundo ao passar o mouse nos botões contained da toolbar
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-contained.Mui-disabled': {
                  color: temaEscuro ? '#64748b' : '#94a3b8', // cor dos botões contained desabilitados da toolbar
                  backgroundColor: temaEscuro ? '#1e293b' : '#f9fafb', // cor de fundo dos botões contained desabilitados
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-contained.Mui-disabled:hover': {
                  backgroundColor: temaEscuro ? '#1e293b' : '#f9fafb', // mantém a cor de fundo ao passar o mouse nos botões contained desabilitados
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-sizeSmall': {
                  padding: '4px 10px', // padding para botões pequenos
                  fontSize: '0.8125rem', // tamanho da fonte para botões pequenos
                },

              }}
            />
          <div className="flex justify-between items-center mb-2 max-w-md">

            
{/*                     <CSVLink
                        data={exportData}
                        headers={exportHeaders}
                        filename="oportunidades.csv"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                        Exportar CSV
                        </CSVLink> */}

                      <span className="text-sm font-semibold">Total: {rows.length} registros</span>
                    </div>
                      