import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { formatarData } from "../utils/date"; // import global


export default function FormAprovacao({ open, onClose, rowData, fetchOportunidades }) {
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

  const [historico, setHistorico] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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

      // Busca histórico do registro
		//api.get(`/oportunidades/${rowData.id}/historico/`)
		api.get(`/oportunidades/${rowData.id}/historico`)
		   .then((res) => setHistorico(res.data))
		   .catch((err) => console.error("Erro ao buscar histórico:", err));

    }
  }, [rowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleAprovar = async () => {
  if (!formData.status) {
    setSnackbar({ open: true, message: "Selecione o status antes de aprovar", severity: "warning" });
    return;
  }

  try {
    // Chamada para endpoint de aprovação
    const response = await api.put(
      `/oportunidades/${formData.id}/aprovar`,
      { status: formData.status, observacao_knc: formData.observacao_knc }
    );

    setSnackbar({ open: true, message: "Oportunidade aprovada com sucesso!", severity: "success" });

    setTimeout(() => {
      fetchOportunidades();
      onClose();
    }, 1500);

  } catch (error) {
    console.error(`Erro na aprovação API/oportunidades/${formData.id}:`, error);
    setSnackbar({ open: true, message: "Falha ao aprovar oportunidade", severity: "error" });
  }
};

  //const handleSalvar = async () => {
  //  try {
  //    await api.put(`/oportunidades/${formData.id}/`, formData);
  //    setSnackbar({ open: true, message: "Registro atualizado com sucesso!", severity: "success" });
  //
  //    setTimeout(() => {
  //      fetchOportunidades();
  //      onClose();
//	      }, 1500);
  //  } catch (error) {
  //    console.error(error);
  //    setSnackbar({ open: true, message: "Erro ao atualizar registro", severity: "error" });
  //  }
  //};

  return (
    <Card
      sx={{
        maxWidth: 1480,
        minHeight: 320,
        margin: "0 auto",
        boxShadow: 3,
        borderRadius: 3,
        backgroundColor: "#e8effc",
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
        {/* Cabeçalho do Formulário */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} >
          <Typography variant="h5" fontWeight="bold" color="primary">
            Aprovação
          </Typography>

          <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}>
            <AccountCircle fontSize="large" />
          </Avatar>
        </Box>

        {/* Divisor */}
        <Box mb={2}>
          <Divider />
        </Box >

           {/* Informações em duas colunas */}
                   {formData.id && (
                     <Box
                       mb={5}
                       display="grid"
                       gridTemplateColumns="1fr 1fr"
                       gap={2}
                       sx={{ textTransform: "uppercase" }}
                     >
                       {/* Coluna 1 */}
                       <Box>
                         <Typography variant="body2" fontWeight="bold" mb={2}>
                           <strong>Nº RO: </strong> {formData.id}
                         </Typography>
                         <Typography variant="body2" mt={2} mr={5}>
                           <strong>Revenda: </strong> {formData.nome_rv}
                         </Typography>
                         <Typography variant="body2" mt={0.8}>
                           <strong>CNPJ: </strong> {formData.cnpj_rv}
                         </Typography>
                         <Typography variant="body2" mt={0.8}>
                           <strong>Contato: </strong> {formData.contato_rv}
                         </Typography>
                          <Typography variant="body2" mt={1}>
                            <strong>Data Inclusão: </strong> {formatarData(formData.data_inclusao)}
                          </Typography>
                         <Typography variant="body2" mt={0.8}>
                           <strong>Tel. Revenda:</strong> {formData.telefone_rv}
                         </Typography>
           
                       </Box>
           
                       {/* Coluna 2 */}
                       <Box>
           
                         <Typography variant="body2" >
                           <strong>Gerente Regional:</strong> {formData.gerente_regional}
                         </Typography>
                       </Box>
           
                       {/* Observações ocupa as 2 colunas */}
                       <Box gridColumn="span 2" mt={2}>
                         <Typography variant="body2">
                           <strong>Observações Gerais:</strong> {formData.observacoes_gerais}
                         </Typography>
                       </Box>
                     </Box>
                   )}

          {/* Campos principais */}
        <Box mb={3}>
          <TextField
            select
            label="Aprovação Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            minHeight={180}
            minWidth={400}
            autoFocus
            variant="outlined"
            sx={{            
              "& .MuiInputBase-root": { 
                backgroundColor: "white" 
              },
              "&:hover": { backgroundColor: "rgba(21, 79, 214, 0.12)" }  
            }}
          >
            <MenuItem value="" disabled>Selecione</MenuItem>
            <MenuItem value="Aprovado">Aprovado</MenuItem>
            <MenuItem value="Aguardando">Aguardando</MenuItem>
            <MenuItem value="Negado">Negado</MenuItem>
            <MenuItem value="Pendente">Pendente</MenuItem>
			<MenuItem value="Renovado">Renovado</MenuItem>
          </TextField>
        </Box>

        <Box mb={5}>
          <TextField
            label="Observações KNC"
            name="observacao_knc"
            value={formData.observacao_knc}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            sx={{ "& .MuiInputBase-root": { backgroundColor: "white" } }}
          />
        </Box>

        {/* Botões */}
		
		<Box display="flex" justifyContent="flex-start" gap={2} mb={3}>
			<Button variant="contained" color="primary" onClick={handleAprovar}>
			Aprovar
			</Button>
			<Button variant="contained" color="error" onClick={onClose}>
			Cancelar
			</Button>
		</Box>
		

        {/* Histórico */}
        {historico.length > 0 && (
          <Box mt={4}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Histórico
            </Typography>
            {historico.map((h, index) => (
              <Box
                key={index}
                mb={1}
                p={1}
                sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
              >
                <Typography variant="body2">
                  <strong>Campo:</strong> {h.campo}
                </Typography>
                <Typography variant="body2">
                  <strong>Antigo:</strong> {h.valor_antigo} → <strong>Novo:</strong> {h.valor_novo}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(h.data_alteracao).toLocaleString()} por {h.usuario || "Sistema"}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
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
