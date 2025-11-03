// src/components/CadastroOportunidades.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { Sun, Moon, Search } from "lucide-react";
import { CSVLink } from "react-csv";
import { Box } from "@mui/material";

const getMask = (fieldName, value = "") => {
  const numbers = value.replace(/\D/g, "");
  if (fieldName.includes("telefone")) return numbers.length <= 10 ? "(99) 9999-9999" : "(99) 99999-9999";
  if (fieldName.includes("cpf")) return "999.999.999-99";
  if (fieldName.includes("cnpj")) return "99.999.999/9999-99";
  return null;
};

export default function CadastroOportunidades() {
  const [formData, setFormData] = useState({
    status: "", status_validacao: "", observacao_knc: "", data_alteracao: "", data_hora: "",
    email_rv: "", nome_rv: "", cnpj_rv: "", contato_rv: "", telefone_rv: "",
    razao_social_cf: "", cnpj_cf: "", contato_cf: "", email_cf: "", cargo_cf: "", telefone_cf: "",
    aplicacoes_setorizacao: "", produto_codigo: "", produto_descricao: "", produto_marca: "", qtde: "",
    concorrencia: "", produto_marca_concorrente: "", faixas_valores: "", valor_total_usd: "", gerente_regional: "",
    data_prevista: "", observacoes_gerais: "", data_vencimento: "", licitacao: "", nome_email: "", dominio_email: "",
  });

  const [oportunidades, setOportunidades] = useState([]);
  const [erroOportunidades, setErroOportunidades] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const alternarTema = () => setTemaEscuro(!temaEscuro);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // FUNÇÃO ÚNICA FETCH com LED incluso
  const fetchOportunidades = async () => {
    try {
      const response = await axios.get("http://localhost:8000/oportunidades/");
      const data = (response.data || []).map((item, idx) => {
        const statusRaw = String(item.status || item.status_validacao || "").toLowerCase().trim();
        let color = "#9CA3AF"; // cinza default
        if (statusRaw.includes("aprov")) color = "#16a34a";
        else if (statusRaw.includes("negad") || statusRaw.includes("negado")) color = "#ef4444";
        else if (statusRaw.includes("reprov")) color = "#7f1d1d";
        else if (statusRaw.includes("pend")) color = "#f59e0b";
        else if (statusRaw.includes("aguard")) color = "#f97316";
        return { id: item.id ?? idx, ...item, led: color };
      });
      setOportunidades(data);
      setErroOportunidades(null);
    } catch (error) {
      setErroOportunidades("Não foi possível carregar os registros de oportunidades. Verifique se a API está rodando.");
      console.error("Erro ao buscar oportunidades:", error);
    }
  };

  useEffect(() => { if (usuario) fetchOportunidades(); }, [usuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/oportunidades/", formData);
      alert("Oportunidade inserida com sucesso!");
      setFormData({
        status: "", status_validacao: "", observacao_knc: "", data_alteracao: "", data_hora: "",
        email_rv: "", nome_rv: "", cnpj_rv: "", contato_rv: "", telefone_rv: "",
        razao_social_cf: "", cnpj_cf: "", contato_cf: "", email_cf: "", cargo_cf: "", telefone_cf: "",
        aplicacoes_setorizacao: "", produto_codigo: "", produto_descricao: "", produto_marca: "", qtde: "",
        concorrencia: "", produto_marca_concorrente: "", faixas_valores: "", valor_total_usd: "", gerente_regional: "",
        data_prevista: "", observacoes_gerais: "", data_vencimento: "", licitacao: "", nome_email: "", dominio_email: "",
      });
      fetchOportunidades();
    } catch (error) {
      alert("Erro ao registrar a Oportunidade.");
      console.error("Erro ao registrar a Oportunidade:", error);
    }
  };

  const columns = useMemo(() => [
    {
      field: "led", headerName: "Led", width: 64, sortable: false, filterable: false,
      headerAlign: "center", align: "center",
      renderCell: (params) => (
        <Box sx={{
          width: 20, height: 20, borderRadius: "50%", bgcolor: params.value,
          mx: "auto", boxShadow: `0 0 0 6px ${params.value}22`,
        }}/>
      )
    },
    { field: "status", headerName: "Status", flex: 1, minWidth: 125 },
    { field: "status_validacao", headerName: "Status Final", flex: 1, minWidth: 125 },
    { field: "observacao_knc", headerName: "Observações KNC", flex: 1, minWidth: 380 },
    { field: "data_alteracao", headerName: "Data Alteração", flex: 1, minWidth: 125 },
    { field: "data_hora", headerName: "Data/Hora", flex: 1, minWidth: 125 },
    { field: "email_rv", headerName: "Email Revenda", flex: 1, minWidth: 255 },
    { field: "nome_rv", headerName: "Nome Revenda", flex: 1, minWidth: 125 },
    { field: "cnpj_rv", headerName: "CNPJ Revenda", flex: 1, minWidth: 125 },
    { field: "contato_rv", headerName: "Contato Revenda", flex: 1, minWidth: 125 },
    { field: "telefone_rv", headerName: "Telefone Revenda", flex: 1, minWidth: 125 },
    { field: "razao_social_cf", headerName: "Razão Social Cliente Final", flex: 1, minWidth: 125 },
    { field: "cnpj_cf", headerName: "CNPJ Cliente Final", flex: 1, minWidth: 125 },
    { field: "contato_cf", headerName: "Contato Cliente Final", flex: 1, minWidth: 125 },
    { field: "email_cf", headerName: "Email Cliente Final", flex: 1, minWidth: 255 },
    { field: "cargo_cf", headerName: "Cargo Cliente Final", flex: 1, minWidth: 125 },
    { field: "telefone_cf", headerName: "Telefone Cliente Final", flex: 1, minWidth: 255 },
    { field: "aplicacoes_setorizacao", headerName: "Aplicações/Setorização", flex: 1, minWidth: 380 },
    { field: "produto_codigo", headerName: "Código do Produto", flex: 1, minWidth: 125 },
    { field: "produto_descricao", headerName: "Descrição do Produto", flex: 1, minWidth: 255 },
    { field: "produto_marca", headerName: "Marca", flex: 1, minWidth: 125 },
    { field: "qtde", headerName: "Qtde", flex: 1, minWidth: 125 },
    { field: "concorrencia", headerName: "Possui Concorrente", flex: 1, minWidth: 125 },
    { field: "produto_marca_concorrente", headerName: "Produto/Marca Concorrente", flex: 1, minWidth: 125 },
    { field: "faixas_valores", headerName: "Faixa de Valores", flex: 1, minWidth: 125 },
    { field: "valor_total_usd", headerName: "Valor Total (USD)", flex: 1, minWidth: 125 },
    { field: "gerente_regional", headerName: "Gerente Regional", flex: 1, minWidth: 125 },
    { field: "data_prevista", headerName: "Data Prevista", flex: 1, minWidth: 125 },
    { field: "observacoes_gerais", headerName: "Observações Gerais", flex: 1, minWidth: 380 },
    { field: "data_vencimento", headerName: "Data de Vencimento", flex: 1, minWidth: 125 },
    { field: "licitacao", headerName: "Licitação", flex: 1, minWidth: 255 },
    { field: "nome_email", headerName: "Nome Email", flex: 1, minWidth: 255 },
    { field: "dominio_email", headerName: "Domínio Email", flex: 1, minWidth: 125 },
  ], [temaEscuro]);


  const rows = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    const mapped = oportunidades.map((p) => ({ id: p.id, ...p }));
    if (!termo) return mapped;
    return mapped.filter((p) => {
      return (
        String(p.status || "").toLowerCase().includes(termo) ||
        String(p.status_validacao || "").toLowerCase().includes(termo) ||
        String(p.nome_rv || "").toLowerCase().includes(termo) ||
        String(p.razao_social_cf || "").toLowerCase().includes(termo) ||
        String(p.contato_rv || "").toLowerCase().includes(termo)
      );
    });
  }, [oportunidades, filtro]);

  const exportHeaders = columns.map((col) => ({ label: col.headerName || col.field, key: col.field }));
  const exportData = rows.map((row) => {
    const obj = {};
    columns.forEach((col) => {
      obj[col.field] = row[col.field] ?? "";
    });
    return obj;
  });

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (nomeUsuario === "admin" && senha === "5366") {
              setUsuario({ nome: "admin", nivel: "admin" });
            } else {
              alert("Credenciais inválidas");
            }
          }}
          className="bg-white shadow-md p-6 rounded-xl w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <input type="text" placeholder="Usuário" className="w-full mb-3 p-2 border rounded" value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} />
          <input type="password" placeholder="Senha" className="w-full mb-4 p-2 border rounded" value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button type="submit" className="bg-[#1e293b] text-white w-full py-2 rounded hover:bg-blue-700">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className={`${temaEscuro ? "bg-gray-900 text-white" : "bg-white text-black"} bg-opacity-90 rounded-2xl shadow-md overflow-hidden`}>
      {/* ... resto do layout: nav, drawer e form mantidos ... */}
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4">Portal do Cliente</h2>
        <div className="mb-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input type="text" placeholder="Filtrar por cliente, modelo ou número de série..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="pl-10 pr-3 py-2 w-full border rounded" />
        </div>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
                columns={columns}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                pageSize={15}
                rowsPerPageOptions={[15, 25, 50]}
                disableSelectionOnClick
                autoHeight
                getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"}
                rows={rows}
                sx={{
                borderRadius: 2,
                boxShadow: temaEscuro ? "0 2px 8px rgba(0,0,0,.5)" : "0 2px 8px rgba(0,0,0,.1)",
                "& .MuiDataGrid-columnHeaders": {
                backgroundColor: temaEscuro ? "#0f172a" : "#e2e8f0",
                color: temaEscuro ? "#facc15" : "#1f2937",
              fontWeight: "bold",
    },
                "& .even-row": { backgroundColor: temaEscuro ? "#1e3a8a" : "#f9fafb" },
                "& .odd-row": { backgroundColor: temaEscuro ? "#374151" : "#b7caefff" },
                "& .MuiDataGrid-row:hover": { backgroundColor: "#4198eaff !important" },
                "& .MuiDataGrid-cell": {
                borderRight: temaEscuro ? "1px solid #334155" : "1px solid #cbd5e1",
    },
  }}
      />
        
        </div>
        <div className="mt-3">
          <CSVLink data={exportData} headers={exportHeaders} filename="oportunidades.csv" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Exportar CSV
          </CSVLink>
        </div>
      </div>
    </div>
  );
}
