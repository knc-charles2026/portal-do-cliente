import React, { useState } from "react";
import api from "../services/api";
import InputMask from "react-input-mask";
import CurrencyInput from "react-currency-input-field";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ListAltIcon from "@mui/icons-material/ListAlt";


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
  ListItem,
  ListItemText,
  ListItemIcon,
  ClickAwayListener,
} from "@mui/material";

import { WarningAmber } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function FormOportunidade({
  formData,
  setFormData,
  modo,
  onCancelar,
  registroSelecionado,
  fetchOportunidades,
  onSalvar,
}) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmModal, setConfirmModal] = useState(false);
  const [showSetorizacao, setShowSetorizacao] = useState(false);

  /* =======================
     APLICAÇÕES / SETORIZAÇÃO
     ======================= */

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
      ? selecionadosSetorizacao.filter((i) => i !== valor)
      : [...selecionadosSetorizacao, valor];

    setFormData({
      ...formData,
      aplicacoes_setorizacao: novaSelecao.join(","),
    });
  };

  const handleOnDragEndSetorizacao = (result) => {
    if (!result.destination) return;
    const items = Array.from(itensSetorizacao);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setItensSetorizacao(items);
  };

  /* =======================
     FORM HANDLERS
     ======================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getMask = (name) => {
    if (name === "telefone_rv" || name === "telefone_cf")
      return "(99) 99999-9999";
    if (name === "cnpj_rv" || name === "cnpj_cf")
      return "99.999.999/9999-99";
    return "";
  };

  const handleSalvar = async () => {
    try {
      await onSalvar();
      setSnackbarMessage("Registro salvo com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setConfirmModal(true);
    } catch {
      setSnackbarMessage("Erro ao salvar registro");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleConfirm = async (novo) => {
    setConfirmModal(false);
    if (novo) {
      setFormData({});
    } else {
      await fetchOportunidades();
      onCancelar();
      setFormData({});
    }
  };

  /* =======================
     CAMPOS
     ======================= */

  const campos = [
    { label: "CNPJ Revenda", name: "cnpj_rv", type: "text" },
    { label: "Nome Revenda", name: "nome_rv", type: "text" },
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
        "Coletores de dados",
        "RFID",
        "Etiquetas Eletrônicas (ESL)",
        "Impressoras Urovo",
        "K388S",
        "Leitores de Código de Barras",
        "Tablet P8100P",
        "Vestíveis",
      ],
    },

    { label: "Descrição do Produto", name: "produto_descricao", type: "text" },
    { label: "Marca", name: "produto_marca", type: "text" },
    { label: "Qtde", name: "qtde", type: "number", half: true },

    {
      label: "Possui Concorrente",
      name: "concorrencia",
      type: "select",
      options: ["Sim", "Não"],
    },

    { label: "Produto/Marca Concorrente", name: "produto_marca_concorrente", type: "text" },

    { label: "Faixa de Valores", name: "faixas_valores", type: "text", half: true },

    { label: "Valor Total (USD)", name: "valor_total_usd", type: "currency" },

    {
      label: "Gerente Regional",
      name: "gerente_regional",
      type: "select",
      options: ["Carlos Benno", "Fabio Costa", "Leandra Fonseca","Maciel Nascimento","Nelson Matunaga",],
    },

    { label: "Licitação", name: "licitacao", type: "select", options: ["Sim", "Não"] },

    { label: "Observações Gerais", name: "observacoes_gerais", type: "textarea" },
  ];

  /* =======================
     RENDER
     ======================= */

  return (
    <div className="space-y-6">

      {/* CABEÇALHO */}
      
        <Typography variant="h5" fontWeight="bold" color="#063981ff">
          <ListAltIcon sx={{fontSize: 56, color: "#063981ff", verticalAlign: "middle"}}/>
          Formulário de  {modo === "update" ? "Edição" : "Inclusão"}
        </Typography>
        <Divider sx={{ mt: 1 }} />



      {/* SETORIZAÇÃO */}
      <div>
        <label className="text-xs font-medium mb-1 block">
          Aplicação / Setorização
        </label>

        <ClickAwayListener onClickAway={() => setShowSetorizacao(false)}>
          <Box sx={{ position: "relative" }}>
            <Button
              fullWidth
  variant="outlined"
  onClick={() => setShowSetorizacao(!showSetorizacao)}
  endIcon={<ArrowDropDownIcon />}
  sx={{
    justifyContent: "space-between",
    textTransform: "none",
              }}
            >
              <span className="truncate">
                {selecionadosSetorizacao.length
                  ? selecionadosSetorizacao.join(", ")
                  : "Selecione a Aplicação / Setorização"}
              </span>
            </Button>

            {showSetorizacao && (
              <Box sx={{ position: "absolute", zIndex: 20, width: "100%", bgcolor: "#fff", boxShadow: 3 }}>
                <DragDropContext onDragEnd={handleOnDragEndSetorizacao}>
                  <Droppable droppableId="setorizacao">
                    {(p) => (
                      <List ref={p.innerRef} {...p.droppableProps}>
                        {itensSetorizacao.map((v, i) => (
                          <Draggable key={v} draggableId={v} index={i}>
                            {(p2) => (
                              <ListItem
                                ref={p2.innerRef}
                                {...p2.draggableProps}
                                button
                                onClick={() => handleToggleSetorizacao(v)}
                                secondaryAction={<span {...p2.dragHandleProps}>⋮</span>}
                              >
                                <ListItemIcon>
                                  <Checkbox checked={selecionadosSetorizacao.includes(v)} />
                                </ListItemIcon>
                                <ListItemText primary={v} />
                              </ListItem>
                            )}
                          </Draggable>
                        ))}
                        {p.placeholder}
                      </List>
                    )}
                  </Droppable>
                </DragDropContext>
              </Box>
            )}
          </Box>
        </ClickAwayListener>
      </div>

      {/* GRID RESPONSIVO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {campos.map((f) => (
          <div
            key={f.name}
            className={`flex flex-col ${
              f.type === "textarea" ? "sm:col-span-2 lg:col-span-4" : ""
            }`}
          >
            <label className="text-xs mb-1">{f.label}</label>

            {f.type === "textarea" && (
              <textarea
                name={f.name}
                value={formData[f.name] || ""}
                onChange={handleChange}
                className="border rounded p-2 min-h-[90px]"
              />
            )}

            {f.type === "select" && (
              <select name={f.name} value={formData[f.name] || ""} onChange={handleChange}
                className="border rounded p-2">
                <option value="">Selecione</option>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            )}

            {f.type === "currency" && (
              <CurrencyInput
                prefix="$ "
                decimalsLimit={2}
                value={formData[f.name] || ""}
                onValueChange={(v) => handleChange({ target: { name: f.name, value: v } })}
                className="border rounded p-2 w-1/2"
              />
            )}

            {getMask(f.name) && (
              <InputMask
                mask={getMask(f.name)}
                value={formData[f.name] || ""}
                onChange={(e) => handleChange({ target: { name: f.name, value: e.target.value } })}
              >
                <input className="border rounded p-2" />
              </InputMask>
            )}

            {!getMask(f.name) && !["select", "textarea", "currency"].includes(f.type) && (
              <input
                type={f.type}
                name={f.name}
                value={formData[f.name] || ""}
                onChange={handleChange}
                className={`border rounded p-2 ${f.half ? "w-1/2" : "w-full"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* AÇÕES */}
      <div className="flex gap-3">
        <Button variant="contained" onClick={handleSalvar}>Salvar</Button>
        <Button variant="contained" color="error" onClick={onCancelar}>Cancelar</Button>
      </div>

      {/* CONFIRMAÇÃO */}
      <Dialog open={confirmModal}>
        <DialogTitle>
          <WarningAmber color="warning" /> Inserir novo registro?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => handleConfirm(true)}>Sim</Button>
          <Button onClick={() => handleConfirm(false)} color="error">Não</Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </div>
  );
}
