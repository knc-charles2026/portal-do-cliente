from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd
from io import BytesIO
import re

import app.crud.oportunidades as crud
from app.schemas import Oportunidades, OportunidadesCreate
from app.database import get_db

##router = APIRouter(
##    prefix="/oportunidades",
##    tags=["Oportunidades"]
##)
from fastapi import APIRouter

router = APIRouter(
    tags=["Oportunidades"]
)
# 🔹 Listar todas as oportunidades
@router.get("/", response_model=List[Oportunidades])
def listar_oportunidades(db: Session = Depends(get_db)):
    oportunidades = crud.get_all_oportunidades(db, load_historicos=True)
    return [Oportunidades.from_orm(o) for o in oportunidades] if oportunidades else []

# 🔹 Criar nova oportunidade
@router.post("/", response_model=Oportunidades)
def criar_oportunidade(
    oportunidade: OportunidadesCreate,
    db: Session = Depends(get_db)
):
    usuario_logado = "Administrador"
    obj = crud.create_oportunidade(db, oportunidade, user_logado=usuario_logado)
    return Oportunidades.from_orm(obj)

# 🔹 Buscar oportunidade por ID
@router.get("/{oportunidade_id}", response_model=Oportunidades)
def get_oportunidade_por_id(
    oportunidade_id: int,
    db: Session = Depends(get_db)
):
    db_oportunidade = crud.get_oportunidade_by_id(
        db,
        oportunidade_id=oportunidade_id,
        load_historicos=True
    )
    if not db_oportunidade:
        raise HTTPException(status_code=404, detail="Oportunidade não encontrada")

    return Oportunidades.from_orm(db_oportunidade)

# 🔹 Atualizar oportunidade
@router.put("/{oportunidade_id}", response_model=Oportunidades)
def atualizar_oportunidade(
    oportunidade_id: int,
    dados: OportunidadesCreate,
    db: Session = Depends(get_db)
):
    db_oportunidade = crud.get_oportunidade_by_id(db, oportunidade_id=oportunidade_id)
    if not db_oportunidade:
        raise HTTPException(
            status_code=404,
            detail=f"Oportunidade com ID {oportunidade_id} não encontrada"
        )

    usuario_logado = "Administrador"
    obj = crud.update_oportunidade(
        db,
        db_oportunidade,
        dados,
        user_logado=usuario_logado
    )
    return Oportunidades.from_orm(obj)

# 🔹 Deletar oportunidade
@router.delete("/{oportunidade_id}", response_model=dict)
def deletar_oportunidade(
    oportunidade_id: int,
    db: Session = Depends(get_db)
):
    db_oportunidade = crud.get_oportunidade_by_id(db, oportunidade_id=oportunidade_id)
    if not db_oportunidade:
        raise HTTPException(status_code=404, detail="Oportunidade não encontrada")

    crud.delete_oportunidade(db, db_oportunidade)
    return {"detail": "Oportunidade deletada com sucesso"}

# 🔹 Duplicar oportunidade
@router.post("/{oportunidade_id}/duplicar", response_model=Oportunidades)
def duplicar_oportunidade(
    oportunidade_id: int,
    db: Session = Depends(get_db)
):
    db_oportunidade = crud.get_oportunidade_by_id(db, oportunidade_id=oportunidade_id)
    if not db_oportunidade:
        raise HTTPException(
            status_code=404,
            detail=f"Oportunidade com ID {oportunidade_id} não encontrada"
        )

    usuario_logado = "Administrador"
    nova_oportunidade = crud.duplicar_oportunidade(
        db,
        oportunidade_id=oportunidade_id,
        user_logado=usuario_logado
    )

    if not nova_oportunidade:
        raise HTTPException(
            status_code=500,
            detail="Erro ao duplicar a oportunidade"
        )

    return Oportunidades.from_orm(nova_oportunidade)

# 🔹 Importar oportunidades via XLSX
@router.post("/importar-xlsx/", response_model=dict)
async def importar_xlsx(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        contents = await file.read()
        df = pd.read_excel(BytesIO(contents))

        mapeamento = {
            "CNPJ Revenda": "cnpj_rv",
            "Nome Revenda": "nome_rv",
            "Email Revenda": "email_rv",
            "Contato Revenda": "contato_rv",
            "Telefone Revenda": "telefone_rv",
            "Razão Social Cliente Final": "razao_social_cf",
            "CNPJ Cliente Final": "cnpj_cf",
            "Contato Cliente Final": "contato_cf",
            "Email Cliente Final": "email_cf",
            "Cargo Cliente Final": "cargo_cf",
            "Telefone Cliente Final": "telefone_cf",
            "Tipo Produto": "produto_codigo",
            "Descrição do Produto": "produto_descricao",
            "Marca": "produto_marca",
            "Qtde": "qtde",
            "Valor Total (USD)": "valor_total_usd",
            "Gerente Regional": "gerente_regional",
            "Licitação": "licitacao",
            "Observações Gerais": "observacoes_gerais",
        }

        faltantes = [c for c in mapeamento if c not in df.columns]
        if faltantes:
            raise HTTPException(
                status_code=400,
                detail=f"Faltam colunas obrigatórias: {', '.join(faltantes)}"
            )

        df.rename(columns=mapeamento, inplace=True)
        df.fillna("", inplace=True)

        usuario_logado = "Administrador"
        total_importadas = 0
        truncated = []

        for _, row in df.iterrows():
            dados = row.to_dict()

            for campo in ["qtde", "valor_total_usd"]:
                valor = str(dados.get(campo, ""))
                valor = re.sub(r"[^\d.,]", "", valor).replace(",", ".")
                dados[campo] = float(valor) if valor else 0.0

            oportunidade = OportunidadesCreate(**dados)
            crud.create_oportunidade(db, oportunidade, user_logado=usuario_logado)
            total_importadas += 1

        return {
            "message": f"{total_importadas} oportunidades importadas com sucesso",
            "truncated": truncated
        }

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Erro ao importar XLSX:", e)
        raise HTTPException(
            status_code=500,
            detail="Erro ao importar oportunidades do arquivo XLSX"
        )
# 🔹 Histórico da oportunidade
@router.get("/{oportunidade_id}/historico", response_model=list)
def historico_oportunidade(
    oportunidade_id: int,
    db: Session = Depends(get_db)
):
    oportunidade = crud.get_oportunidade_by_id(
        db,
        oportunidade_id=oportunidade_id,
        load_historicos=True
    )

    if not oportunidade:
        raise HTTPException(status_code=404, detail="Oportunidade não encontrada")

    return oportunidade.historicos or []

