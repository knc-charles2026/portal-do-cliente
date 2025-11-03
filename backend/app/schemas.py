from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import date, datetime


# -----------------------------------------------------------
# 🧱 BASE
# -----------------------------------------------------------

class OportunidadesBase(BaseModel):
    status: Optional[str] = None
    status_validacao: Optional[str] = None
    observacao_knc: Optional[str] = None
    data_alteracao: Optional[datetime] = None
    email_rv: Optional[str] = None
    nome_rv: Optional[str] = None
    cnpj_rv: Optional[str] = None
    contato_rv: Optional[str] = None
    telefone_rv: Optional[str] = None
    razao_social_cf: Optional[str] = None
    cnpj_cf: Optional[str] = None
    contato_cf: Optional[str] = None
    email_cf: Optional[str] = None
    cargo_cf: Optional[str] = None
    telefone_cf: Optional[str] = None
    aplicacoes_setorizacao: Optional[str] = None
    produto_codigo: Optional[str] = None
    produto_descricao: Optional[str] = None
    produto_marca: Optional[str] = None
    qtde: Optional[int] = None
    concorrencia: Optional[str] = None
    produto_marca_concorrente: Optional[str] = None
    faixas_valores: Optional[str] = None
    valor_total_usd: Optional[float] = None
    gerente_regional: Optional[str] = None
    data_prevista: Optional[date] = None
    observacoes_gerais: Optional[str] = None
    data_vencimento: Optional[date] = None
    licitacao: Optional[str] = None
    nome_email: Optional[str] = None
    dominio_email: Optional[str] = None
    id_origem: Optional[int] = None  # 👈 Adicionado para função renovar


# -----------------------------------------------------------
# 🆕 CREATE / UPDATE
# -----------------------------------------------------------

class OportunidadesCreate(OportunidadesBase):
    """
    Schema usado na criação/atualização de oportunidades pelo front.
    """

    # ✅ Validação: se status for "Renovado", observacao_knc é obrigatória
    @validator("observacao_knc")
    def obrigatorio_para_renovacao(cls, v, values):
        if values.get("status") == "Renovado" and (v is None or not v.strip()):
            raise ValueError("Justificativa é obrigatória para renovação")
        return v


# -----------------------------------------------------------
# 📜 HISTÓRICO
# -----------------------------------------------------------

class HistoricoOportunidadesBase(BaseModel):
    campo: str
    valor_antigo: Optional[str] = None
    valor_novo: Optional[str] = None
    data_alteracao: Optional[datetime] = None
    usuario: Optional[str] = None


class HistoricoOportunidades(HistoricoOportunidadesBase):
    id: int
    oportunidade_id: int

    class Config:
        from_attributes = True


# -----------------------------------------------------------
# 🧾 READ (RESPOSTA COMPLETA)
# -----------------------------------------------------------

class Oportunidades(OportunidadesBase):
    id: int
    id_origem: Optional[int] = None
    data_inclusao: Optional[datetime] = None
    usuario_alteracao: Optional[str] = None
    aprovado_por: Optional[str] = None
    data_aprovacao: Optional[datetime] = None
    historicos: Optional[List[HistoricoOportunidades]] = []

    class Config:
        from_attributes = True
