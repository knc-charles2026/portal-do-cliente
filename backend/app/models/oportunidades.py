from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Oportunidades(Base):
    __tablename__ = "oportunidades"

    id = Column(Integer, primary_key=True, index=True)
    id_origem = Column(Integer, ForeignKey("oportunidades.id"), nullable=True)  # histórico da cópia

    status = Column(String(50), nullable=True)
    status_validacao = Column(String(50), nullable=True)
    observacao_knc = Column(String(255), nullable=True)

    # Controle de datas e usuário
    data_inclusao = Column(DateTime, default=datetime.now)
    data_alteracao = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    usuario_alteracao = Column(String(100), nullable=True)

    # Dados da revenda
    email_rv = Column(String(255), nullable=True)
    nome_rv = Column(String(255), nullable=True)
    cnpj_rv = Column(String(20), nullable=True)
    contato_rv = Column(String(255), nullable=True)
    telefone_rv = Column(String(20), nullable=True)

    # Dados do cliente final
    razao_social_cf = Column(String(255), nullable=True)
    cnpj_cf = Column(String(20), nullable=True)
    contato_cf = Column(String(255), nullable=True)
    email_cf = Column(String(255), nullable=True)
    cargo_cf = Column(String(100), nullable=True)
    telefone_cf = Column(String(20), nullable=True)

    # Dados do produto e aplicação
    aplicacoes_setorizacao = Column(String(255), nullable=True)
    produto_codigo = Column(String(255), nullable=True)
    produto_descricao = Column(String(255), nullable=True)
    produto_marca = Column(String(100), nullable=True)
    qtde = Column(Integer, nullable=True)
    concorrencia = Column(String(255), nullable=True)
    produto_marca_concorrente = Column(String(100), nullable=True)
    faixas_valores = Column(String(255), nullable=True)
    valor_total_usd = Column(String(50), nullable=True, index=True)
    gerente_regional = Column(String(255), nullable=True)
    data_prevista = Column(Date, nullable=True)
    observacoes_gerais = Column(String(255), nullable=True)
    data_vencimento = Column(Date, nullable=True)
    licitacao = Column(String(255), nullable=True)
    nome_email = Column(String(255), nullable=True)
    dominio_email = Column(String(255), nullable=True)

    # Campos de aprovação
    aprovado_por = Column(String(100), nullable=True)
    data_aprovacao = Column(DateTime, nullable=True)

    # Relacionamento com o histórico
    historicos = relationship(
        "HistoricoOportunidades",
        back_populates="oportunidade",
        cascade="all, delete-orphan"
    )


class HistoricoOportunidades(Base):
    __tablename__ = "historico_oportunidades"

    id = Column(Integer, primary_key=True, index=True)
    oportunidade_id = Column(Integer, ForeignKey("oportunidades.id"))
    campo = Column(String(100))  # nome do campo alterado
    valor_antigo = Column(Text, nullable=True)
    valor_novo = Column(Text, nullable=True)
    data_alteracao = Column(DateTime, default=datetime.now)
    usuario = Column(String(100), nullable=True)

    oportunidade = relationship("Oportunidades", back_populates="historicos")
