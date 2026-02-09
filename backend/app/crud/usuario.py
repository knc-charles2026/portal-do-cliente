# app/crud/usuario.py
from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.core.security import get_password_hash, verify_password

def get_user_by_email(db: Session, email: str):
    return db.query(Usuario).filter(Usuario.email == email).first()

def authenticate_user(db: Session, email: str, senha: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(senha, user.senha):
        return None
    return user

def create_user(db: Session, nome: str, email: str, gerente_regional: str, perfil: str, senha: str):
    hashed = get_password_hash(senha)
    db_user = Usuario(nome=nome, email=email, gerente_regional=gerente_regional, perfil=perfil, senha=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
