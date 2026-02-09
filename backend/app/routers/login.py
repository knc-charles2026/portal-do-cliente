# app/routers/login.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.usuario import Token
from app.crud.usuario import authenticate_user
from app.core.security import create_access_token

router = APIRouter(
    prefix="/login",
    tags=["Login"]
)

@router.post("/", response_model=Token)
def login(form_data: dict, db: Session = Depends(get_db)):
    """
    Recebe JSON:
    {
        "email": "usuario@exemplo.com",
        "senha": "123456"
    }
    Retorna JWT:
    {
        "access_token": "...",
        "token_type": "bearer"
    }
    """
    email = form_data.get("email")
    senha = form_data.get("senha")
    if not email or not senha:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email e senha são obrigatórios"
        )

    user = authenticate_user(db, email, senha)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas"
        )

    token = create_access_token({"sub": user.email, "perfil": user.perfil})
    return {"access_token": token, "token_type": "bearer"}

