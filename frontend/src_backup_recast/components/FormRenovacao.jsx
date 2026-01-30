import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";
import { Autorenew } from "@mui/icons-material";
import { formatarData } from "../utils/date"; // import global



export default function FormRenovacao({ open, onClose, rowData, fetchOportunidades }) {
  const [formData, setFormData] = useState({
    id: "",
    nome_rv: "",
    cnpj_rv: "",
    gerente_regional: "",
    status: "",
    observacao_knc: "",
    observacoes_gerais: "",
    telefone_rv: "",
    contato_rv: "",
    data_inclusao: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [erroJustificativa, setErroJustificativa] = useState(false);

  useEffect(() => {
    if (rowData) {
      setFormData({
        id: rowData.id || "",
        nome_rv: rowData.nome_rv || "",
        cnpj_rv: rowData.cnpj_rv || "",
        gerente_regional: rowData.gerente_regional || "",
        status: rowData.status || "",
        observacao_knc: "",
        observacoes_gerais: rowData.observacoes_gerais || "",
        telefone_rv: rowData.telefone_rv || "",
        contato_rv: rowData.contato_rv || "",
        data_inclusao: rowData.data_inclusao || "",
      });
      setErroJustificativa(false);
    }
  }, [rowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (erroJustificativa && value.trim() !== "") setErroJustificativa(false);
  };

 /*  // 🔹 Função para formatar a data (AAAA-MM-DD HH:MM:SS → DD/MM/AAAA)
  const formatarData = (dataStr) => {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    if (isNaN(data)) return "";
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }; */

  const handleRenovar = async () => {
    if (!formData.observacao_knc || formData.observacao_knc.trim() === "") {
      setErroJustificativa(true);
      return;
    }

    try {
      const novoRegistro = {
        ...rowData,
        id: undefined,
        id_origem: rowData.id,
        observacao_knc: formData.observacao_knc,
        status: "Renovado",
        data_alteracao: new Date().toISOString(),
      };

      await api.post("/oportunidades/", novoRegistro);

      setSnackbar({ open: true, message: "Renovação criada com sucesso!", severity: "success" });

      setTimeout(() => {
        fetchOportunidades();
        onClose();
      }, 1500);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Erro ao renovar oportunidade", severity: "error" });
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 1480,
        minHeight: 320,
        margin: "0 auto",
        boxShadow: 3,
        borderRadius: 3,
        backgroundColor: "#d3d9e6ff",
      }}
    >
      <CardContent
        sx={{
          maxWidth: 1280,
          minHeight: 320,
          margin: "0 auto",
          boxShadow: 3,
          borderRadius: 3,
          backgroundColor: "#e8effc",
        }}
      >
        {/* Cabeçalho */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Renovação de Oportunidade
          </Typography>
          <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}>
            <Autorenew fontSize="large" />
          </Avatar>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Informações em duas colunas */}
        {formData.id && (
          <Box
            mb={4}
            display="grid"
            gridTemplateColumns="1fr 1fr"
            gap={2}
            sx={{ textTransform: "uppercase" }}
          >
            {/* Coluna 1 */}
            <Box>
              <Typography variant="body2">
                <strong>Nº RO Origem:</strong> {formData.id}
              </Typography>
              <Typography variant="body2" mt={1}>
                <strong>Revenda:</strong> {formData.nome_rv}
              </Typography>
              <Typography variant="body2" mt={1}>
                <strong>Contato:</strong> {formData.contato_rv}
              </Typography>
              <Typography variant="body2" mt={1}>
                <strong>Data Inclusão:</strong> {formatarData(formData.data_inclusao)}
              </Typography>
            </Box>

            {/* Coluna 2 */}
            <Box>
              <Typography variant="body2">
                <strong>CNPJ:</strong> {formData.cnpj_rv}
              </Typography>
              <Typography variant="body2" mt={1}>
                <strong>Tel. Revenda:</strong> {formData.telefone_rv}
              </Typography>
              <Typography variant="body2" mt={1}>
                <strong>Gerente Regional:</strong> {formData.gerente_regional}
              </Typography>
            </Box>

            {/* Observações ocupa as 2 colunas */}
            <Box gridColumn="span 2" mt={2}>
              <Typography variant="body2">
                <strong>Observações:</strong> {formData.observacoes_gerais}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Campo justificativa */}
        <Box mb={4}>
          <TextField
            label="Motivo / Justificativa da Renovação"
            name="observacao_knc"
            value={formData.observacao_knc}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            error={erroJustificativa}
            helperText={erroJustificativa ? "Informe a justificativa para renovar" : ""}
            sx={{
              "& .MuiInputBase-root": { backgroundColor: "white" },
              "& .MuiFormLabel-root": { color: "#1976d2" },
            }}
          />
        </Box>

        {/* Botões */}
        <Box display="flex" justifyContent="flex-start" gap={2}>
          <Button variant="contained" color="success" onClick={handleRenovar}>
            Renovar
          </Button>
          <Button variant="contained" color="error" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </CardContent>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
