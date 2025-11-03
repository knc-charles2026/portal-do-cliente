from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_tables
from app.routers import oportunidades, home  # importa os módulos de rotas

# --- Criação da aplicação FastAPI ---
app = FastAPI(title="API Controle de Oportunidades")

# --- Configuração de CORS (permite acesso do frontend React/Tailwind) ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Registro das rotas ---
app.include_router(oportunidades.router)
app.include_router(home.router)  # integra a rota da Kyra

# --- Criação automática das tabelas no banco ---
@app.on_event("startup")
def startup_event():
    create_tables()

# --- Endpoint raiz para teste ---
@app.get("/")
def read_root():
    return {"status": "ok", "message": "API rodando com CORS ativo!"}
