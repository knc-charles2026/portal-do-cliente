import React, { useState, useRef } from "react";
import api from "../services/api";
import InputMask from "react-input-mask";
import CurrencyInput from "react-currency-input-field";
import ListItem from "@mui/material/ListItem";
import * as XLSX from "xlsx";

import {
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Box,
  Checkbox,
  List,
  ListItemText,
  ListItemIcon,
  ClickAwayListener,
  Input,
} from "@mui/material";
import { WarningAmber } from "@mui/icons-material";
//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

export default function FormOportunidade({
  formData,
  setFormData,
  modo,
  onCancelar,
  registroSelecionado,
  fetchOportunidades,
  onSalvar, // garante a atualização após o update
}) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmModal, setConfirmModal] = useState(false);
  const [showSetorizacao, setShowSetorizacao] = useState(false);

  // lista fixa de opções Aplicações/Setorização
  const opcoesSetorizacao = [
    "Armazém e Centro de Distribuição",
    "Controle de Estoque",
    "Controle de Medicamentos/Exames",
    "Identificação Produtos RFID",
    "Inventário",
    "Loja",
    "Rastreabilidade",
    "Outro",
  ];
  const [itensSetorizacao, setItensSetorizacao] = useState(opcoesSetorizacao);

  const selecionadosSetorizacao = formData.aplicacoes_setorizacao
    ? formData.aplicacoes_setorizacao.split(",")
    : [];

  const handleToggleSetorizacao = (valor) => {
    const novaSelecao = selecionadosSetorizacao.includes(valor)
      ? selecionadosSetorizacao.filter((item) => item !== valor)
      : [...selecionadosSetorizacao, valor];
    setFormData({
      ...formData,
      aplicacoes_setorizacao: novaSelecao.join(","),
    });
  };

  const handleOnDragEndSetorizacao = (result) => {
    if (!result.destination) return;
    const novaLista = Array.from(itensSetorizacao);
    const [reorderedItem] = novaLista.splice(result.source.index, 1);
    novaLista.splice(result.destination.index, 0, reorderedItem);
    setItensSetorizacao(novaLista);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getMask = (fieldName) => {
    if (fieldName === "telefone_rv" || fieldName === "telefone_cf")
      return "(99) 99999-9999";
    if (fieldName === "cnpj_rv" || fieldName === "cnpj_cf")
      return "99.999.999/9999-99";
    return "";
  };
  

   const formatarMoedaUSD = (valor) => {
  if (!valor) return "";
  // Remove tudo que não for número ou ponto
  const limpo = valor.replace(/[^\d.]/g, "");
  const numero = parseFloat(limpo);
  if (isNaN(numero)) return "";
  return numero.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

const handleValorUSDChange = (e) => {
  const valorFormatado = formatarMoedaUSD(e.target.value);
  setFormData((prev) => ({
    ...prev,
    valor_total_usd: valorFormatado,
  }));
};

/////////////////////////////////////////////////////
// 📂 Importação de arquivo XLSX
/////////////////////////////////////////////////////

// Campos esperados do Excel e mapeamento para o backend
const camposEsperados = {
  "CNPJ Revenda": "cnpj_rv",
  "Nome Revenda": "nome_rv",
  "Email Revenda": "email_rv",
  "Contato Revenda": "contato_rv",
  "Telefone Revenda": "telefone_rv",
  "Razão Social Cliente Final": "razao_social_cf",
  "CNPJ Cliente Final": "cnpj_cf",
  "Contato Cliente Final": "contato_cf",
  "Email Cliente Final": "email_cf",
  "Cargo Cliente Final": "cargo_cf",
  "Telefone Cliente Final": "telefone_cf",
  "Tipo Produto": "produto_codigo",
  "Descrição do Produto": "produto_descricao",
  "Marca": "produto_marca",
  "Qtde": "qtde",
  "Valor Total (USD)": "valor_total_usd",
  "Gerente Regional": "gerente_regional",
  "Licitação": "licitacao",
  "Observações Gerais": "observacoes_gerais"
};

// 📤 Função principal de importação
const handleImportarXLSX = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post(
      "/oportunidades/importar-xlsx/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    setSnackbar({
      open: true,
      message: response.data.message || "Importação concluída com sucesso!",
      severity: "success",
    });

    // 🔄 Atualiza a tabela após a importação
    buscarOportunidades();

  } catch (error) {
    console.error("❌ Erro ao importar XLSX:", error);

    let mensagemErro = "Erro ao importar o arquivo XLSX.";
    if (error.response && error.response.data && error.response.data.detail) {
      mensagemErro = error.response.data.detail;
    }

    setSnackbar({
      open: true,
      message: mensagemErro,
      severity: "error",
    });
  }
};

//////////////////////////////////////////////////////
// Fim Importação XLSX
//////////////////////////////////////////////////////


  const handleSalvar = async () => {
    try {
      if (!formData) {
        setSnackbarMessage("Erro: dados do formulário ausentes");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const payload = {
        ...formData,
        nome_rv: formData.nome_rv?.trim() || "",
        aplicacoes_setorizacao: Array.isArray(formData.aplicacoes_setorizacao)
          ? formData.aplicacoes_setorizacao.join(",")
          : formData.aplicacoes_setorizacao || "",
        status: Array.isArray(formData.status)
          ? formData.status.join(",")
          : formData.status || "",
      };

      if (modo === "create") {
        await api.post("/oportunidades/", payload);
        setSnackbarMessage("Registro salvo com sucesso!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setConfirmModal(true);
      } else if (modo === "update") {
        const id = registroSelecionado?.id || formData?.id;
        if (!id) {
          setSnackbarMessage("Erro: ID do registro não encontrado");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        await api.put(`/oportunidades/${id}`, payload);
        setSnackbarMessage("Registro atualizado com sucesso!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        if (modo === "update" && typeof onSalvar === "function") {
        onSalvar();
        }

        if (typeof fetchOportunidades === "function") await fetchOportunidades();
        if (typeof onCancelar === "function") onCancelar();
        setFormData({});
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSnackbarMessage("Erro ao processar a operação");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleConfirm = async (inserirMais) => {
    setConfirmModal(false);
    if (inserirMais) {
      setFormData({});
    } else {
      if (typeof fetchOportunidades === "function") await fetchOportunidades();
      if (typeof onCancelar === "function") onCancelar();
      setFormData({});
    }
  };

  // --- Função utilitária para garantir que campos mascarados sejam sempre strings ---
  const normalizarFormData = (dados) => {
  const camposMascarados = ["cnpj_rv", "telefone_rv", "cpf", "rg", "telefone_cliente"];
  const normalizado = { ...dados };

  camposMascarados.forEach((campo) => {
    if (normalizado[campo] === null || normalizado[campo] === undefined) {
      normalizado[campo] = "";
    } else {
      normalizado[campo] = String(normalizado[campo]);
    }
  });

  return normalizado;
};

  const campos = [
    { label: "CNPJ Revenda", name: "cnpj_rv", type: "text" },
    { label: "Nome Revenda", name: "nome_rv", type: "text" },
    //{ label: "Observações KNC", name: "observacao_knc", type: "textarea" },
    { label: "Email Revenda", name: "email_rv", type: "email" },
    { label: "Contato Revenda", name: "contato_rv", type: "text" },
    { label: "Telefone Revenda", name: "telefone_rv", type: "tel" },
    { label: "Razão Social Cliente Final", name: "razao_social_cf", type: "text" },
    { label: "CNPJ Cliente Final", name: "cnpj_cf", type: "text" },
    { label: "Contato Cliente Final", name: "contato_cf", type: "text" },
    { label: "Email Cliente Final", name: "email_cf", type: "email" },
    { label: "Cargo Cliente Final", name: "cargo_cf", type: "text" },
    { label: "Telefone Cliente Final", name: "telefone_cf", type: "tel" },
    {
      label: "Tipo Produto",
      name: "produto_codigo",
      type: "select",
      options: [
        "Coletores de dados e RFID Modelos: CT48, DT40, CT58S, DT50, DT50H, RT40, DT50P e DT50D",
        "Etiquetas Eletrônicas (ESL",
        "Impressoras Urovo",
        "K388S",
        "Superlead 5203BT, 5203 e/ou 7800",
        "Tablet P8100P",
        "Vestíveis SR5600 e U2",  
      ],
    },
    { label: "Descrição do Produto", name: "produto_descricao", type: "text" },
    { label: "Marca", name: "produto_marca", type: "text" },
    { label: "Qtde", name: "qtde", type: "text" },
    { label: "Possui Concorrente", name: "concorrencia", type: "select", options: ["Sim", "Não"] },
    { label: "Produto/Marca Concorrente", name: "produto_marca_concorrente", type: "text" },
    { label: "Faixa de Valores", name: "faixas_valores", type: "text" },
    { label: "Valor Total (USD)", name: "valor_total_usd", type: "text" },
    {
      label: "Gerente Regional",
      name: "gerente_regional",
      type: "select",
      options: [
        "Carlos Benno",
        "Fabio Costa",
        "Leandra Fonseca",
        "Maciel Nascimento",
        "Nelson Matunaga",
      ],
    },
    { label: "Licitação", name: "licitacao", type: "select", options: ["Sim", "Não"] },    
    //{ label: "Data Prevista", name: "data_prevista", type: "date" },
    //{ label: "Data de Vencimento", name: "data_vencimento", type: "date" },
    { label: "Observações Gerais", name: "observacoes_gerais", type: "textarea"},
    //{ label: "Nome Email", name: "nome_email", type: "text" },
    //{ label: "Domínio Email", name: "dominio_email", type: "text" },
  ];

  return (
    <div className="space-y-4">
      {modo === "update" && formData?.id && (
        <Box sx={{ mb: 2 }}><Typography variant="h6" mb={2} sx={{ fontWeight: "bold", color: "#275eabff" }}>Registro de Oportunidades - Modo Edição</Typography> 
        <Box sx={{ mb: 2 }}><Divider></Divider></Box>
          <Typography variant="subtitle1" sx={{textAlign:"right", fontWeight: "bold", color: "#555" }}>
            Nº do RO: {formData.id}  
          </Typography>
        </Box>
      )}

        {modo === "create" && (
        <Box sx={{ mb: 2 }}><Typography variant="h6" mb={2} sx={{ fontWeight: "bold", color: "#275eabff" }}>Registro de Oportunidades - Modo Inclusão</Typography> 
        <Box sx={{ mb: 2 }}><Divider></Divider></Box>
          <Typography variant="subtitle1" sx={{textAlign:"right", fontWeight: "bold", color: "#555" }}>
            Status: {formData.status}  
          </Typography>
        </Box>
      )}

      {/* Campo Aplicações / Setorização com drag handle e seta */}
      <div className="flex flex-col">
        <label className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
         {/*/className="block text-xs font-medium text-gray-900 mb-2  */}
          Aplicação / Setorização
        </label>

        <ClickAwayListener onClickAway={() => setShowSetorizacao(false)}>
          <Box sx={{ position: "relative" }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowSetorizacao((prev) => !prev)}
              sx={{
                justifyContent: "space-between",
                textTransform: "none",
                backgroundColor: "#fff",
                "&.Mui-selected": {
                backgroundColor: "#1094f2ff",
                fontWeight: 600,
                },
              }}
            >
              {selecionadosSetorizacao.length > 0
                ? selecionadosSetorizacao.join(", ")
                : "Selecione a Aplicação / Setorização"}
              <span style={{ fontSize: 22, marginLeft: 8 }}>
                {showSetorizacao ? "▴" : "▾"}
              </span>
            </Button>

            {showSetorizacao && (
              <Box
                sx={{
                  position: "absolute",
                  zIndex: 10,
                  width: "100%",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
                  mt: 0.1,
                  maxHeight: 650,
                  overflowY: "auto",
                }}
              >
                <DragDropContext onDragEnd={handleOnDragEndSetorizacao}>
                  <Droppable droppableId="lista-setorizacao">
                    {(provided) => (
                      <List {...provided.droppableProps} ref={provided.innerRef} dense>
                        {itensSetorizacao.map((valor, index) => (
                          <Draggable key={valor} draggableId={valor} index={index}>
                           {(provided, snapshot) => (
                             <ListItem
                               ref={provided.innerRef}
                               {...provided.draggableProps}
                               dense
                               button="true"
                               //component="button"  // substitui `button` evita warning
                               size="small"
                               onClick={() => handleToggleSetorizacao(valor)}
                               sx={{
                                 py: 0.6,
                                 px: 1.6,
                                 borderRadius: 1.5,
                                 transition: "all 0.2s ease",
                                 bgcolor: snapshot.isDragging ? "rgba(212, 227, 243, 0.1)" : "background.paper",
                                 "&:hover": {
                                   bgcolor: snapshot.isDragging
                                     ? "rgba(202, 208, 226, 0.64)"
                                     : "rgba(21, 79, 214, 0.92)",
                                   transform: "scale(1.009)",
                                   boxShadow: 1,
                                   color:"rgba(252, 253, 255, 1)",
                                   
                                 },
                               }}
                               secondaryAction={
                                 <span
                                   {...provided.dragHandleProps}
                                   style={{
                                     cursor: "grab",
                                     fontSize: 12,
                                     color: "#999",
                                     userSelect: "true",
                                   }}
                                 >
                                   ⋮
                                 </span>
                               }
                             >
                               <ListItemIcon>
                                 <Checkbox
                                   edge="start"
                                   checked={selecionadosSetorizacao.includes(valor)}
                                   tabIndex={-1}
                                   disableRipple
                                   size="small"
                                 />
                               </ListItemIcon>
                               <ListItemText
                                  primary={valor}
                                  sx={{
                                    "& .MuiListItemText-primary": {
                                      fontSize: 14,
                                      fontWeight: 500,
                                      color: snapshot.isDragging ? "rgba(21, 79, 214, 1)" : "inherit",
                                    },
                                  }}
                                />

                             </ListItem>
                           )}
                          </Draggable>

                        ))}
                        {provided.placeholder}
                      </List>
                    )}
                  </Droppable>
                </DragDropContext>
              </Box>
            )}
          </Box>
        </ClickAwayListener>
      </div>

    {/* Demais campos */}

{/* Container de 4 colunas */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
  {campos.map((field) => (
    <div key={field.name} className={`flex flex-col ${field.name === "observacoes_gerais" ? "col-span-3" : ""}`}>
  <label className="block text-xs font-medium text-gray-700 mb-2">
    {field.label}
  </label>

  {field.type === "textarea" ? (
    <textarea
      name={field.name}
      value={formData[field.name] || ""}
      onChange={handleChange}
      className="border rounded p-2 w-full min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      placeholder="Máx. 300 caracteres"
      maxLength={300}
      
    />
      ) : field.type === "select" ? (
        <select
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Selecione</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        ) : getMask(field.name) ? (
<InputMask
  mask={getMask(field.name)}
  value={
    formData[field.name] !== null && formData[field.name] !== undefined
      ? String(formData[field.name])
      : ""
  }
  onChange={(e) =>
    handleChange({ target: { name: field.name, value: e.target.value } })
  }
>
  <input
    name={field.name}
    type={field.type}
    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
</InputMask>

  

) : field.name === "valor_total_usd" ? (
  <CurrencyInput
    name={field.name}
    value={formData[field.name] || ""}
    decimalsLimit={2}          // limita 2 casas decimais
    decimalScale={2}           // força exibição de 2 casas decimais
    prefix="$ "
    className="border rounded p-2 w-1/2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    placeholder="$0.00"
    onValueChange={(value, name) =>
      handleChange({ target: { name, value } })
    }
  />

) : field.name === "faixas_valores" ? (
  
  <input
  name={field.name}
  value={formData[field.name] || ""}
  onChange={handleChange}
  className="border rounded p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  placeholder="De Faixa: até Faixa:"
 />
  
) : field.name === "qtde" ? (
  <input
    name={field.name}
    type={field.type}
    placeholder="PÇS"
    className="border rounded p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />

) : (
  <input
    type={field.type}
    name={field.name}
    value={formData[field.name] || ""}
    onChange={handleChange}
    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
)
}
    </div>
  ))}
</div>


      <div className="mt-6 flex space-x-3">
        <Button variant="contained" color="primary" onClick={handleSalvar}>
          Salvar
        </Button>
        <Button variant="contained" color="error" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
<div className="mt-4 flex items-center space-x-3">
  <label
    htmlFor="xlsxInput"
    className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
  >
    Importar XLSX
  </label>
  <input
    id="xlsxInput"
    type="file"
    accept=".xlsx, .xls"
    className="hidden"
    onChange={handleImportarXLSX}
  />
  <Typography variant="body2" sx={{ color: "#555" }}>
    (Importa o registro a partir de um arquivo Excel)
  </Typography>
</div>




      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Modal de confirmação */}
      <Dialog open={confirmModal} onClose={() => setConfirmModal(false)}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmber color="warning" />
          Deseja inserir mais registros?
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            <Box mb={2}>Responda:</Box>
            <Box mb={2}>[ SIM ] para incluir o próximo registro</Box>
            <Box mb={1}>[ NÃO ] para voltar à lista de registros</Box>
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => handleConfirm(true)} color="primary" variant="contained">
            Sim
          </Button>
          <Button onClick={() => handleConfirm(false)} color="error" variant="contained">
            Não
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
