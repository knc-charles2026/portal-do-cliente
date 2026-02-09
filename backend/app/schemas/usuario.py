# app/schemas/usuario.py
from pydantic import BaseModel
from typing import Optional

class UsuarioBase(BaseModel):
    nome: str
    email: str
    gerente_regional: Optional[str]
    perfil: str

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioOut(UsuarioBase):
    id: int

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
