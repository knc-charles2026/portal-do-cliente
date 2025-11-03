from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.database import get_db
from typing import List, Optional

router = APIRouter(
    prefix="/produtos",  # Isso é essencial
    tags=["Produtos"]
)

@router.get("/", response_model=List[schemas.Produto])
def listar_produtos(db: Session = Depends(get_db)):
    return crud.get_produtos(db)

@router.post("/", response_model=schemas.Produto)
def criar_produto(produto: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    return crud.create_produto(db, produto)

