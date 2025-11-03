import React from "react";
import InputMask from "react-input-mask";
import { Button } from "@mui/material";
import { Snackbar, Alert} from "@mui/material";
/* const getMask = (fieldName, value = "") => {
  const numbers = value.replace(/\D/g, "");
  if (fieldName.includes("telefone")) return numbers.length <= 11 ? "(99) 99999-9999" : "(99) 9999-9999";
  if (fieldName.includes("cpf")) return "999.999.999-99";
  if (fieldName.includes("cnpj")) return "99.999.999/9999-99";
  return null;
  
};
 */
export const getMask = (fieldName, value) => {
  if (!value) return ""; // evita undefined/null
  const strValue = String(value); // garante string
  switch (fieldName) {
    case "cpf":
      return strValue.replace(/\D/g, "").slice(0, 11);
    case "cnpj":
      return strValue.replace(/\D/g, "").slice(0, 14);
    case "telefone":
      return strValue.replace(/\D/g, "").slice(0, 11);
    default:
      return strValue;
  }
};





const showAlert = (message, severity = "success") => {
  setSnackbarMessage(message);
  setSnackbarSeverity(severity);
  setOpenSnackbar(true);
};

export default function FormOportunidade({ formData, setFormData, onCancelar, onSalvar, modo }) {
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSalvar();
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-[#e2e8f0] p-3 rounded-lg"
    >
      <h1 className="font-bold mb-4 col-span-2 p-2 border rounded">
        {modo === "create" ? "Nova Oportunidade" : modo === "update" ? "Editar Oportunidade" : "Excluir Oportunidade"}
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
          <label className="block text-xs font-medium text-gray-700 mb-2">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="border rounded p-2"
            />
          ) : field.type === "select" ? (
            <select
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="border rounded p-2"
            >
              <option value="">Selecione</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <InputMask
              mask={getMask(field.name, formData[field.name])}
              value={formData[field.name]}
              onChange={handleChange}
            >
              {(inputProps) => <input {...inputProps} type={field.type} name={field.name} className="border rounded p-2" />}
            </InputMask>
          )}
        </div>
      ))}

      <div className="flex justify-end col-span-2 gap-2 mt-4">
        <Button variant="outlined" color="secondary" onClick={onCancelar}>Cancelar</Button>
        <Button variant="contained" color="primary" type="submit">
          {modo === "delete" ? "Excluir" : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
