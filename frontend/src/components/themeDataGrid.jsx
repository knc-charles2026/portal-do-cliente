// themeDataGrid.js

// Linhas do DataGrid
const rowStyles = (temaEscuro) => ({
  '& .even-row': { backgroundColor: temaEscuro ? '#020005ff' : '#fff' },
  '& .odd-row': { backgroundColor: temaEscuro ? '#1e293b' : '#d5def4ff' },
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
    borderBottom: temaEscuro ? '1px solid #334155' : '1px solid #cbd5e1',
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

  '& .MuiDataGrid-toolbarQuickFilter': {
    backgroundColor: temaEscuro ? "#fcfdfe" : '#f9fafb',
    color: temaEscuro ? "#fff" : '#11113bff',
  },

});

// Footer
const footerStyles = (temaEscuro) => ({
  boxShadow: temaEscuro 
  ? "0 2px 8px rgba(136, 159, 185, 0.5)" 
  : "0 2px 8px rgba(224, 233, 246, 0.92)",
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
  '& .MuiDataGrid-toolbarContainer .MuiSvgIcon-root': { color: temaEscuro ? '#fff' : '#e6edf9ff' },
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
    color: temaEscuro ? '#ffffff' : '#ffffff',
    backgroundColor: temaEscuro ? '#334155' : '#3b82f6',
  },
    '& .MuiDataGrid-toolbarQuickFilterControl': {
    color: temaEscuro ? '#ffffff' : '#ffffff',
    backgroundColor: temaEscuro ? '#ffffff' : '#fcfcfc',
    '&:hover': {  backgroundColor: temaEscuro ? '#ffffff' : '#98adf0' },
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
  backgroundColor: temaEscuro ? "#808391ff" : "#ced8e4ff",
  color: temaEscuro ? "#fff" : "#615b5bff",
  borderRadius: 2,
  boxShadow: temaEscuro ? "0 2px 8px rgba(115, 134, 155, 0.61)" : "0 2px 8px rgba(104, 121, 145, 0.92)",


  // Checkboxes
  '& .MuiCheckbox-root': {
    color: temaEscuro ? "#a0adb9ff" : '#3266aaff',
    '&:hover': {
      backgroundColor: temaEscuro ? 'rgba(206, 226, 228, 0.1)' : 'rgba(22, 95, 163, 0.1)',
    },
  },
  '& .Mui-checked': {
    color: temaEscuro ? "#cfdae4ff" : '#1676a3ff',
    '&:hover': {
      backgroundColor: temaEscuro ? 'rgba(34, 132, 197, 0.2)' : 'rgba(31, 134, 225, 0.2)',
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
