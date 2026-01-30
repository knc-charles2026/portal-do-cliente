from sqlalchemy.orm import Session, joinedload
from app.models.oportunidades import Oportunidades as OportunidadesModel, HistoricoOportunidades as HistoricoModel
from app.schemas import OportunidadesCreate
from datetime import datetime
import copy

# 🔹 Listar todas as oportunidades
def get_all_oportunidades(db: Session, load_historicos: bool = False):
    query = db.query(OportunidadesModel)
    if load_historicos:
        query = query.options(joinedload(OportunidadesModel.historicos))
    return query.all()

# 🔹 Buscar oportunidade por ID
def get_oportunidade_by_id(db: Session, oportunidade_id: int, load_historicos: bool = False):
    query = db.query(OportunidadesModel).filter(OportunidadesModel.id == oportunidade_id)
    if load_historicos:
        query = query.options(joinedload(OportunidadesModel.historicos))
    return query.first()

# 🔹 Criar oportunidade
def create_oportunidade(db: Session, dados: OportunidadesCreate, user_logado: str):
    obj = OportunidadesModel(**dados.dict())
    obj.usuario_alteracao = user_logado
    obj.data_inclusao = datetime.utcnow()
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

# 🔹 Atualizar oportunidade
def update_oportunidade(db: Session, db_oportunidade: OportunidadesModel, dados: OportunidadesCreate, user_logado: str):
    for field, value in dados.dict(exclude_unset=True).items():
        old_value = getattr(db_oportunidade, field)
        if old_value != value:
            # Registrar histórico
            historico = HistoricoModel(
                campo=field,
                valor_antigo=str(old_value) if old_value is not None else "",
                valor_novo=str(value) if value is not None else "",
                data_alteracao=datetime.utcnow(),
                usuario=user_logado,
                oportunidade_id=db_oportunidade.id
            )
            db.add(historico)
            setattr(db_oportunidade, field, value)

    db_oportunidade.usuario_alteracao = user_logado
    db_oportunidade.data_alteracao = datetime.utcnow()
    db.commit()
    db.refresh(db_oportunidade)
    return db_oportunidade

# 🔹 Deletar oportunidade
def delete_oportunidade(db: Session, db_oportunidade: OportunidadesModel):
    # Deletar histórico associado primeiro
    db.query(HistoricoModel).filter(HistoricoModel.oportunidade_id == db_oportunidade.id).delete()
    db.delete(db_oportunidade)
    db.commit()

# 🔹 Duplicar oportunidade
def duplicar_oportunidade(db: Session, oportunidade_id: int, user_logado: str):
    db_oportunidade = get_oportunidade_by_id(db, oportunidade_id)
    if not db_oportunidade:
        return None

    # Criar cópia
    dados = {c.name: getattr(db_oportunidade, c.name) for c in db_oportunidade.__table__.columns if c.name != "id"}
    nova = OportunidadesModel(**dados)
    nova.usuario_alteracao = user_logado
    nova.data_inclusao = datetime.utcnow()
    db.add(nova)
    db.commit()
    db.refresh(nova)

    # Duplicar histórico também (opcional)
    for hist in db_oportunidade.historicos:
        novo_hist = HistoricoModel(
            campo=hist.campo,
            valor_antigo=hist.valor_antigo,
            valor_novo=hist.valor_novo,
            data_alteracao=hist.data_alteracao,
            usuario=hist.usuario,
            oportunidade_id=nova.id
        )
        db.add(novo_hist)

    db.commit()
    db.refresh(nova)
    return nova
