# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.crud.usuario import authenticate_user
from app.schemas.usuario import Token
from app.core.security import create_access_token
from app.database import get_db

router = APIRouter()

@router.post("/login", response_model=Token)
def login(form_data: dict, db: Session = Depends(get_db)):
    email = form_data.get("email")
    senha = form_data.get("senha")
    user = authenticate_user(db, email, senha)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
    token = create_access_token({"sub": user.email, "perfil": user.perfil})
    return {"access_token": token, "token_type": "bearer"}
