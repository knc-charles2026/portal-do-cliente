
# teste_db.py
import sys
import os
sys.path.append(os.path.dirname(__file__))


from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("SELECT 1"))
    print("Conexão OK:", result.scalar())

