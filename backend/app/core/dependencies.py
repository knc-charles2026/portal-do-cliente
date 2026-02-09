# app/core/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from app.database import get_db
from app.models.usuario import Usuario

SECRET_KEY = "SUA_CHAVE_SECRETA_SUPER_FORTE"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não autenticado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        perfil = payload.get("perfil")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if not user:
        raise credentials_exception
    return user

def admin_required(current_user=Depends(get_current_user)):
    if current_user.perfil != "admin":
        raise HTTPException(status_code=403, detail="Admin required")
    return current_user

def padrao_required(current_user=Depends(get_current_user)):
    if current_user.perfil not in ["admin", "padrao"]:
        raise HTTPException(status_code=403, detail="Usuário padrão required")
    return current_user

def gerente_required(current_user=Depends(get_current_user)):
    if current_user.perfil != "gerente_regional":
        raise HTTPException(status_code=403, detail="Gerente regional required")
    return current_user
