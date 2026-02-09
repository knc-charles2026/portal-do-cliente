# app/models/usuario.py
from sqlalchemy import Column, Integer, String
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    gerente_regional = Column(String(100), nullable=True)
    perfil = Column(String(20), nullable=False)  # admin, padrao, gerente_regional
    senha = Column(String(200), nullable=False)  # hashed
