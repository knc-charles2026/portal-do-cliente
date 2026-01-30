// Função para formatar data em DD/MM/AAAA
export const formatarData = (valor) => {
  if (!valor) return ""; // protege null ou undefined
  const date = new Date(valor);
  if (isNaN(date)) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
