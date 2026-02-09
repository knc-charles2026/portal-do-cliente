from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_tables
from app.routers import oportunidades, home

# --- Criação da aplicação FastAPI ---
#app = FastAPI(
#    title="API Controle de Oportunidades",
#    version="0.1.0",
#    root_path="/portal-do-cliente",
#    docs_url="/api/docs",
#    redoc_url="/api/redoc",
#    openapi_url="/api/openapi.json"
#)
app = FastAPI(
    title="API Controle de Oportunidades",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# --- Configuração de CORS ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://69.6.222.200",
    "https://knc.eco.br",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Registro das rotas (SEM duplicação) ---
app.include_router(home.router, prefix="/api")
#app.include_router(oportunidades.router, prefix="/api")
app.include_router(oportunidades.router, prefix="/api/oportunidades")

# --- Criação automática das tabelas ---
@app.on_event("startup")
def startup_event():
    create_tables()

# --- Endpoint raiz ---
@app.get("/")
def read_root():
    return {
        "status": "ok",
        "message": "API rodando corretamente via /portal-do-cliente"
    }

# --- Importação dos routers adicionais para Login---

from app.routers import oportunidades, home, login, auth  # adicione login e auth aqui

# --- Registro das rotas (SEM duplicação) ---
app.include_router(home.router, prefix="/api")
app.include_router(oportunidades.router, prefix="/api/oportunidades")

# --- Adicione o router de login ---
app.include_router(login.router, prefix="/login")   # rota POST /login/
app.include_router(auth.router, prefix="/auth")     # rotas protegidas futuras
