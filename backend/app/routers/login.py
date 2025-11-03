from fastapi import APIRouter

router = APIRouter(
    prefix="/login",
    tags=["Login"]
)

@router.get("/")
def get_login():
    return {"message": "Bem-vindo ao Login!"}
