// themeDataGrid.js

// Linhas do DataGrid
const rowStyles = (temaEscuro) => ({
  '& .even-row': { backgroundColor: temaEscuro ? '#020005ff' : '#fff' },
  '& .odd-row': { backgroundColor: temaEscuro ? '#1e293b' : '#94baec40' },
  '& .MuiDataGrid-row:hover': { 
    backgroundColor: temaEscuro ? '#829bbeff' : 'rgba(37, 137, 230, 0.3)'/*'#aed0fcff'*/,
    color: temaEscuro ? '#dae4f1ff' : '#0c192bff',
  },
  '& .MuiDataGrid-row.Mui-selected': {
    backgroundColor: temaEscuro ? '#164e63ff' : '#93c5fd',
    '&:hover': {
      backgroundColor: temaEscuro ? '#17606aff' : '#60a5fa',
    },
  },
  '& .MuiDataGrid-cell': {
    borderBottom: temaEscuro ? '0.875px solid #334155' : '0.875px solid #cbd5e1',
  },
  '& .MuiDataGrid-cellContent': { fontSize: '0.875rem' },
});

// Cabeçalho
const headerStyles = (temaEscuro) => ({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: temaEscuro ? '#0f172a' : '#0909e6ff',
    color: temaEscuro ? '#114272ff' : '#114272ff',
    borderBottom: temaEscuro ? '2px solid #080454ff' : '2px solid #1f2937',
  },
  '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
  '& .MuiDataGrid-columnHeaderTitleContainer': { fontSize: '0.875rem' },
  '& .MuiDataGrid-columnHeaderDraggableContainer': {
    backgroundColor: temaEscuro ? "#fbfcffff" : '#fbfcffff',
  },

});

// Footer
const footerStyles = (temaEscuro) => ({
  '& .MuiDataGrid-footerContainer': {
    color: temaEscuro ? '#e4eaeeff' : '#1f2937',
    borderTop: temaEscuro ? '2px solid #334155' : '2px solid #cbd5e1',
  },
  '& .MuiDataGrid-footerCell': {
    fontSize: '0.875rem',
    color: temaEscuro ? '#fafbf9ff' : '#1f2937',
  },
  '& .MuiTablePagination-root .MuiSvgIcon-root': { color: temaEscuro ? "#020116ff" : '#324f7dff' },
  '& .MuiTablePagination-selectLabel': { color: temaEscuro ? "#020116ff" : '#11113bff' },
  '& .MuiTablePagination-displayedRows': { color: temaEscuro ? "#030118ff" : '#11113bff' },
  '& .MuiTablePagination-actions': { color: temaEscuro ? "#fff" : '#11113bff' },
});

// Toolbar
const toolbarStyles = (temaEscuro) => ({
  '& .MuiDataGrid-toolbarContainer': { padding: '0.5rem' },
  '& .MuiDataGrid-toolbarContainer .MuiSvgIcon-root': { color: temaEscuro ? '#fff' : '#324f7dff' },
  '& .MuiDataGrid-toolbarContainer .MuiButton-root:hover': {
    backgroundColor: temaEscuro ? '#3f4853ff' : '#e0e7ff',
  },
  '& .MuiDataGrid-toolbarContainer .MuiButton-root.Mui-disabled': {
    color: temaEscuro ? '#4875b3ff' : '#4979bdff',
  },
  '& .MuiDataGrid-toolbarContainer .MuiButton-text': { color: temaEscuro ? '#f1f5f9' : '#28326dff' },
  '& .MuiDataGrid-toolbarContainer .MuiButton-outlined': {
    color: temaEscuro ? '#f1f5f9' : '#1e293b',
    borderColor: temaEscuro ? '#475569' : '#cbd5e1',
  },
  '& .MuiDataGrid-toolbarContainer .MuiButton-contained': {
    color: temaEscuro ? '#f1f5f9' : '#ffffff',
    backgroundColor: temaEscuro ? '#334155' : '#3b82f6',
  },
});

// Filtros
const filterStyles = (temaEscuro) => ({
  '& .MuiDataGrid-filterForm': {
    backgroundColor: temaEscuro ? "#1e293b" : '#f9fafb',
    color: temaEscuro ? "#fff" : '#11113bff',
  },
  '& .MuiDataGrid-filterFormInput, & .MuiDataGrid-filterFormOperatorInput, & .MuiDataGrid-filterFormLogicOperatorInput': {
    backgroundColor: "#fff",
    color: temaEscuro ? "#000" : '#11113bff',
  },
  '& .MuiDataGrid-filterFormDeleteIcon': { color: temaEscuro ? "#f87171" : '#b91c1c' },
  '& .MuiDataGrid-filterFormAddIcon': { color: temaEscuro ? "#34d399" : '#059669' },
});

// DataGrid geral
export const dataGridSx = (temaEscuro) => ({
  backgroundColor: temaEscuro ? "#808391ff" : "#6494e136", // Toolbar e Rodapé do DataGrid
  color: temaEscuro ? "#fff" : "#615b5bff",
  borderRadius: 3,
  boxShadow: temaEscuro ? "0 2px 8px rgba(136, 159, 185, 0.5)" : "0 2px 8px rgba(224, 233, 246, 0.92)",
  '& .MuiDataGrid-virtualScroller, & .MuiDataGrid-virtualScrollerRenderZone': {
    backgroundColor: temaEscuro ? "#1e293b" : '#ffffffff', 
  },
  '& .MuiDataGrid-overlay': {
    backgroundColor: temaEscuro ? "rgba(30, 41, 59, 0.8)" : 'rgba(255, 255, 255, 0.8)',
  },

  // Checkboxes
  '& .MuiCheckbox-root': {
    color: temaEscuro ? "#a0adb9ff" : '#3266aaff',
    '&:hover': {
      backgroundColor: temaEscuro ? 'rgba(123, 197, 244, 0.14)' : 'rgba(22, 95, 163, 0.1)',
    },
  },
  '& .Mui-checked': {
    color: temaEscuro ? "#cfdae4ff" : '#1676a3ff',
    '&:hover': {
      backgroundColor: temaEscuro ? 'rgba(61, 34, 197, 0.2)' : 'rgba(22, 48, 163, 0.2)',
    },
  },

  '& .MuiDataGrid-menuIcon': { color: temaEscuro ? "#112041ff" : '#324f7dff' },
  '& .MuiDataGrid-sortIcon': { color: temaEscuro ? "#0a2546ff" : '#324f7dff' },

  ...rowStyles(temaEscuro),
  ...headerStyles(temaEscuro),
  ...footerStyles(temaEscuro),
  ...toolbarStyles(temaEscuro),
  ...filterStyles(temaEscuro),
});
