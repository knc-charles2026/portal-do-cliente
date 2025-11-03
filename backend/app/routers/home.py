# app/routers/home.py
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, crud
from typing import Optional

router = APIRouter(
    prefix="/home",
    tags=["Home"]
)

# Página principal
@router.get("/")
def get_home():
    return {"message": "Bem-vindo à Home!"}

# Endpoint de chat (para integração com Kyra)
@router.post("/chat")
async def kyra_chat(request: Request):
    """
    Recebe a mensagem do usuário e retorna a resposta da Kyra.
    Exemplo de payload esperado:
    {
        "message": "Olá Kyra!"
    }
    """
    data = await request.json()
    user_message = data.get("message")

    if not user_message:
        raise HTTPException(status_code=400, detail="Mensagem não enviada.")

    # 🔹 Aqui você pode integrar a IA Kyra (local ou via API externa)
    # Por enquanto, deixamos uma resposta simulada:
    response = f"Kyra: Você disse '{user_message}', certo?"

    return {"response": response}
