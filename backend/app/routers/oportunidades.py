from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.database import get_db
import pandas as pd
from io import BytesIO
import re

router = APIRouter(
    prefix="/oportunidades",
    tags=["Oportunidades"]
)

# 🔹 Listar todas as oportunidades
@router.get("/", response_model=List[schemas.Oportunidades])
def listar_oportunidades(db: Session = Depends(get_db)):
    return crud.get_all_oportunidades(db)

# 🔹 Criar nova oportunidade
@router.post("/", response_model=schemas.Oportunidades)
def criar_oportunidade(oportunidade: schemas.OportunidadesCreate, db: Session = Depends(get_db)):
    usuario_logado = "Administrador"
    return crud.create_oportunidade(db, oportunidade, user_logado=usuario_logado)

# 🔹 Buscar oportunidade por ID
@router.get("/{oportunidade_id}", response_model=schemas.Oportunidades)
def get_oportunidade_por_id(oportunidade_id: int, db: Session = Depends(get_db)):
    db_oportunidade = crud.get_oportunidade_by_id(db, oportunidade_id=oportunidade_id)
    if db_oportunidade is None:
        raise HTTPException(status_code=404, detail="Oportunidade não encontrada")
    return db_oportunidade

# 🔹 Atualizar oportunidade
@router.put("/{oportunidade_id}", response_model=schemas.Oportunidades)
def atualizar_oportunidade(oportunidade_id: int, dados: schemas.OportunidadesCreate, db: Session = Depends(get_db)):
    db_oportunidade = crud.get_oportunidade_by_id(db, oportunidade_id=oportunidade_id)
    if not db_oportunidade:
        raise HTTPException(status_code=404, detail=f"Oportunidade com ID {oportunidade_id} não encontrada")

    usuario_logado = "Administrador"
    return crud.update_oportunidade(db, db_oportunidade, dados, user_logado=usuario_logado)

# 🔹 Deletar oportunidade
@router.delete("/{oportunidade_id}", response_model=dict)
def deletar_oportunidade(oportunidade_id: int, db: Session = Depends(get_db)):
    db_oportunidade = crud.get_oportunidade_by_id(db, oportunidade_id=oportunidade_id)
    if db_oportunidade is None:
        raise HTTPException(status_code=404, detail="Oportunidade não encontrada")

    crud.delete_oportunidade(db, db_oportunidade)
    return {"detail": "Oportunidade deletada com sucesso"}

# 🔹 Duplicar oportunidade
@router.post("/{oportunidade_id}/duplicar", response_model=schemas.Oportunidades)
def duplicar_oportunidade(oportunidade_id: int, db: Session = Depends(get_db)):
    db_oportunidade = crud.get_oportunidade_by_id(db, oportunidade_id=oportunidade_id)
    if not db_oportunidade:
        raise HTTPException(status_code=404, detail=f"Oportunidade com ID {oportunidade_id} não encontrada")

    usuario_logado = "Administrador"
    nova_oportunidade = crud.duplicar_oportunidade(
        db,
        oportunidade_id=oportunidade_id,
        user_logado=usuario_logado
    )

    if not nova_oportunidade:
        raise HTTPException(status_code=500, detail="Erro ao duplicar a oportunidade")

    return nova_oportunidade

# 🔹 Importar várias oportunidades a partir de arquivo XLSX
@router.post("/importar-xlsx/", response_model=dict)
async def importar_xlsx(file: UploadFile = File(...), db: Session = Depends(get_db)):
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
            "Observações Gerais": "observacoes_gerais"
        }

        colunas_faltando = [col for col in mapeamento.keys() if col not in df.columns]
        if colunas_faltando:
            raise HTTPException(
                status_code=400,
                detail=f"Faltam colunas obrigatórias: {', '.join(colunas_faltando)}"
            )

        df.rename(columns=mapeamento, inplace=True)

        # Preenche NaN
        for col in df.select_dtypes(include=['object']).columns:
            df[col] = df[col].fillna("")
        for col in df.select_dtypes(include=['number']).columns:
            df[col] = df[col].fillna(0)

        limites = {
            "telefone_cf": 20,
            "telefone_rv": 20,
            "cnpj_rv": 14,
            "cnpj_cf": 14,
            "email_rv": 100,
            "email_cf": 100,
            "nome_rv": 100,
            "razao_social_cf": 150,
            "contato_rv": 100,
            "contato_cf": 100,
            "cargo_cf": 50,
        }

        usuario_logado = "Administrador"
        total_importadas = 0
        truncated = []

        for _, row in df.iterrows():
            dados = row.to_dict()

            # Limpeza e conversão
            for campo, valor in dados.items():
                if isinstance(valor, str):
                    valor_limpo = re.sub(r'[^\d.,]', '', valor).replace(',', '.').strip()
                    if campo in ["qtde", "valor_total_usd"]:
                        try:
                            dados[campo] = float(valor_limpo) if valor_limpo else 0.0
                        except ValueError:
                            dados[campo] = 0.0
                    else:
                        dados[campo] = valor_limpo
                elif pd.isna(valor):
                    if campo in ["qtde", "valor_total_usd"]:
                        dados[campo] = 0.0
                    else:
                        dados[campo] = ""
                else:
                    if campo in ["qtde", "valor_total_usd"]:
                        dados[campo] = float(valor)
                    else:
                        dados[campo] = str(valor)

            # Trunca campos que ultrapassam o limite do banco
            for campo, limite in limites.items():
                if campo in dados and isinstance(dados[campo], str) and len(dados[campo]) > limite:
                    truncated.append({"campo": campo, "valor": dados[campo]})
                    dados[campo] = dados[campo][:limite]

            oportunidade = schemas.OportunidadesCreate(**dados)
            crud.create_oportunidade(db, oportunidade, user_logado=usuario_logado)
            total_importadas += 1

        return {
            "message": f"{total_importadas} oportunidades importadas com sucesso!",
            "truncated": truncated
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        print("❌ Erro ao importar XLSX:", e)
        raise HTTPException(status_code=500, detail="Erro ao importar oportunidades do arquivo XLSX.")
