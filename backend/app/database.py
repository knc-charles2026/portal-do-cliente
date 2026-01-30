import os
from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# -----------------------------------------------------------
# 🔐 CARREGA VARIÁVEIS DE AMBIENTE
# -----------------------------------------------------------
load_dotenv()

DB_USER = os.getenv("DB_USER", "painel")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_NAME = os.getenv("DB_NAME", "knc")

# -----------------------------------------------------------
# 🔗 STRING DE CONEXÃO
# -----------------------------------------------------------
DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}/{DB_NAME}?charset=utf8mb4"
)

# -----------------------------------------------------------
# ⚙️ ENGINE (ROBUSTA PARA VPS)
# -----------------------------------------------------------
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # evita conexões mortas após reboot
    pool_recycle=3600,       # recicla conexões antigas
    pool_size=10,
    max_overflow=20,
    echo=False               # mude para True se quiser debug SQL
)

# -----------------------------------------------------------
# 🧩 SESSION
# -----------------------------------------------------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# -----------------------------------------------------------
# 📦 BASE DOS MODELS
# -----------------------------------------------------------
Base = declarative_base()

# -----------------------------------------------------------
# 🔄 DEPENDÊNCIA FASTAPI
# -----------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------------------------------------
# 🏗️ CRIA TABELAS (OPCIONAL)
# -----------------------------------------------------------
def create_tables():
    from app import models  # evita import circular
    Base.metadata.create_all(bind=engine)




#from sqlalchemy import create_engine
#from sqlalchemy.orm import sessionmaker, declarative_base
#from dotenv import load_dotenv
#import os
#
#load_dotenv()  # Garante que o .env seja carregado
#DB_USER = os.getenv("DB_USER", "painel")
#DB_PASSWORD = os.getenv("DB_PASSWORD", "SenhaForte%2026")
#DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
#DB_NAME = os.getenv("DB_NAME", "knc")
#
#DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
#
#engine = create_engine(
#    DATABASE_URL,
#    pool_pre_ping=True,
#    pool_recycle=1800,   # menor que wait_timeout do MySQL
#    pool_size=5,
#    max_overflow=10,
#    pool_timeout=30,
#    echo=False
#)
#
#SessionLocal = sessionmaker(
#    autocommit=False,
#    autoflush=False,
#    bind=engine
#)
#
#Base = declarative_base()
#
#
#def get_db():
#    db = SessionLocal()
#    try:
#        yield db
#    finally:
#        db.close()
#
#
#
#
#
#















#from sqlalchemy import create_engine
#from sqlalchemy.ext.declarative import declarative_base
#from sqlalchemy.orm import sessionmaker
#from dotenv import load_dotenv
##import mysql.connector
#from sqlalchemy import create_engine
#from sqlalchemy.orm import sessionmaker
#
#DATABASE_URL = "mysql+pymysql://usuario:senha@host/banco"
#
#engine = create_engine(
#    DATABASE_URL,
#    pool_pre_ping=True,      # 🔴 ESSENCIAL
#    pool_recycle=3600,       # 🔴 ESSENCIAL (1 hora)
#    pool_size=10,
#    max_overflow=20
#)
#
#SessionLocal = sessionmaker(
#    autocommit=False,
#    autoflush=False,
#    bind=engine
#)
#
#import os
#
#load_dotenv()  # Garante que o .env seja carregado
#
#DB_USER = os.getenv("DB_USER", "painel")
#DB_PASSWORD = os.getenv("DB_PASSWORD", "SenhaForte%2026")
#DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
#DB_NAME = os.getenv("DB_NAME", "knc")
#
##print("🔑 Senha carregada:", DB_PASSWORD)
#
#DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
#
#engine = create_engine(DATABASE_URL)
#SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
#
#Base = declarative_base()
#
#def get_db():
#    db = SessionLocal()
#    try:
#        yield db
#    finally:
#        db.close()
#
#def create_tables():
#    from app.models import Base  # Importa dentro da função para evitar erro circular
#    Base.metadata.create_all(bind=engine)
#
#
#
#
#
#
#
#
#
#
#
#""" 
#
#
#
#import os
#from sqlalchemy import create_engine
#from sqlalchemy.orm import sessionmaker, declarative_base
#from dotenv import load_dotenv
#
#load_dotenv()
#
#DB_URL = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
#engine = create_engine(DB_URL)
#SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
#Base = declarative_base()
#
#def create_tables():
#    from app import models
#    Base.metadata.create_all(bind=engine)
# """
#