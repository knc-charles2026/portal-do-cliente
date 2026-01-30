from sqlalchemy.orm import Session
from datetime import datetime
from app import models, schemas

# -----------------------------------------------------------
# 🧾 CRUD BÁSICO
# -----------------------------------------------------------

def get_all_oportunidades(db: Session):
    """Retorna todas as oportunidades"""
    return db.query(models.Oportunidades).all()


def get_oportunidade_by_id(db: Session, oportunidade_id: int):
    """Busca uma oportunidade específica pelo ID"""
    return db.query(models.Oportunidades).filter(models.Oportunidades.id == oportunidade_id).first()


def create_oportunidade(db: Session, oportunidade: schemas.OportunidadesCreate, user_logado: str = None):
    """Cria uma nova oportunidade"""
    usuario = user_logado or "Administrador"
    db_oportunidade = models.Oportunidades(**oportunidade.model_dump())
    db_oportunidade.data_inclusao = datetime.now()
    db_oportunidade.usuario_criacao = usuario
    db.add(db_oportunidade)
    db.commit()
    db.refresh(db_oportunidade)
    return db_oportunidade


# -----------------------------------------------------------
# ✏️ ATUALIZAÇÃO + HISTÓRICO
# -----------------------------------------------------------

def update_oportunidade(
    db: Session,
    db_oportunidade: models.Oportunidades,
    dados: schemas.OportunidadesCreate,
    user_logado: str = None,
):
    """
    Atualiza uma oportunidade existente.
    - Atualiza data_alteracao automaticamente.
    - Grava usuario_alteracao.
    - Se o status for 'Aprovado', registra o usuário e a data da aprovação.
    - Registra todas as alterações na tabela de histórico.
    """
    update_data = dados.model_dump(exclude_unset=True)
    usuario = user_logado or "Administrador"

    for key, value in update_data.items():
        valor_antigo = getattr(db_oportunidade, key, None)
        if valor_antigo != value:
            # Grava no histórico a alteração
            historico = models.HistoricoOportunidades(
                oportunidade_id=db_oportunidade.id,
                campo=key,
                valor_antigo=str(valor_antigo) if valor_antigo is not None else None,
                valor_novo=str(value) if value is not None else None,
                data_alteracao=datetime.now(),
                usuario=usuario,
            )
            db.add(historico)
            # Atualiza o valor no registro principal
            setattr(db_oportunidade, key, value)

    # Atualiza carimbo de alteração
    db_oportunidade.data_alteracao = datetime.now()
    db_oportunidade.usuario_alteracao = usuario

    # Controle de aprovação
    status_atual = update_data.get("status")
    if status_atual and status_atual.lower() == "aprovado":
        if not db_oportunidade.data_aprovacao:
            db_oportunidade.aprovado_por = usuario
            db_oportunidade.data_aprovacao = datetime.now()
    else:
        if status_atual and status_atual.lower() != "aprovado":
            db_oportunidade.aprovado_por = None
            db_oportunidade.data_aprovacao = None

    db.commit()
    db.refresh(db_oportunidade)
    return db_oportunidade


# -----------------------------------------------------------
# 🧩 RENOVAÇÃO / DUPLICAÇÃO DE OPORTUNIDADE
# -----------------------------------------------------------

def renovar_oportunidade(db: Session, oportunidade_id: int, justificativa: str, user_logado: str = None):
    """
    Cria uma cópia completa de uma oportunidade existente.
    - Preserva o ID original no campo id_origem.
    - Atualiza data_inclusao e data_alteracao.
    - Status da nova RO é sempre 'Pendente'.
    - Registra no histórico a ação de cópia.
    - Justificativa é obrigatória.
    """
    if not justificativa or justificativa.strip() == "":
        raise ValueError("Justificativa da renovação é obrigatória")

    original = get_oportunidade_by_id(db, oportunidade_id)
    if not original:
        return None

    # Copia todos os campos, exceto os de controle
    dados = {
        c.name: getattr(original, c.name)
        for c in original.__table__.columns
        if c.name not in ["id", "data_inclusao", "data_alteracao", "usuario_alteracao", "aprovado_por", "data_aprovacao"]
    }

    nova_oportunidade = models.Oportunidades(**dados)
    nova_oportunidade.id_origem = original.id
    nova_oportunidade.status = "Pendente"
    nova_oportunidade.data_inclusao = datetime.now()
    nova_oportunidade.data_alteracao = datetime.now()
    nova_oportunidade.usuario_alteracao = user_logado or "Administrador"
    nova_oportunidade.observacao_knc = justificativa

    db.add(nova_oportunidade)
    db.commit()
    db.refresh(nova_oportunidade)

    # Registra no histórico a duplicação
    historico = models.HistoricoOportunidades(
        oportunidade_id=nova_oportunidade.id,
        campo="__copia__",
        valor_antigo=str(original.id),
        valor_novo=f"Duplicado de ID {original.id} com justificativa",
        data_alteracao=datetime.now(),
        usuario=user_logado or "Administrador",
    )
    db.add(historico)
    db.commit()

    return nova_oportunidade


# -----------------------------------------------------------
# 🗑️ EXCLUSÃO
# -----------------------------------------------------------

def delete_oportunidade(db: Session, db_oportunidade: models.Oportunidades):
    """Exclui uma oportunidade"""
    db.delete(db_oportunidade)
    db.commit()


# -----------------------------------------------------------
# 📥 IMPORTAÇÃO EM MASSA
# -----------------------------------------------------------

def importar_oportunidades(db: Session, oportunidades: list[schemas.OportunidadesCreate], user_logado: str = None):
    """
    Importa várias oportunidades de uma vez (ex: XLSX)
    - user_logado será registrado em cada registro.
    """
    usuario = user_logado or "Administrador"
    registros_importados = []

    for oportunidade in oportunidades:
        db_oportunidade = models.Oportunidades(**oportunidade.model_dump())
        db_oportunidade.data_inclusao = datetime.now()
        db_oportunidade.usuario_criacao = usuario
        db.add(db_oportunidade)
        registros_importados.append(db_oportunidade)

    db.commit()

    for r in registros_importados:
        db.refresh(r)

    return registros_importados
