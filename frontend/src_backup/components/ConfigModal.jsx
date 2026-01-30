import React from "react";
import {
  Modal,
  Box,
  Typography,
  Slider,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ConfigModal({ open, onClose, rowHeight, setRowHeight }) {
  const handleChange = (event, newValue) => {
    setRowHeight(newValue);
  };

  const setPreset = (value) => {
    setRowHeight(value);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 380,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          position: "relative", // necessário para o botão se posicionar dentro do Box
        }}
      >
        {/* Botão X */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "grey.600",
            "&:hover": { color: "grey.800" },
          }}
          size="small"
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Configurações
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Ajustar altura das linhas
        </Typography>

        <Slider
          value={rowHeight}
          onChange={handleChange}
          min={20}
          max={80}
          step={1}
          sx={{ color: "primary.main", mb: 3 }}
        />

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setPreset(25)}
          >
            Compacta
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setPreset(40)}
          >
            Padrão
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => setPreset(60)}
          >
            Espaçada
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
