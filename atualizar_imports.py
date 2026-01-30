import os
import shutil
import re
import ast

# Configurações
APP_DIR = "./app"        # pasta do seu app
BACKUP_DIR = "./backup_app"  # onde será salvo backup
os.makedirs(BACKUP_DIR, exist_ok=True)

# Função para extrair nomes de classes e funções de um arquivo .py
def extract_names(filepath):
    names = []
    with open(filepath, "r", encoding="utf-8") as f:
        try:
            node = ast.parse(f.read(), filename=filepath)
            for n in node.body:
                if isinstance(n, ast.ClassDef) or isinstance(n, ast.FunctionDef):
                    names.append(n.name)
        except Exception as e:
            print(f"Aviso: erro ao analisar {filepath}: {e}")
    return names

# Função para gerar imports corretos para cada arquivo em uma pasta
def generate_imports_for_folder(folder_name):
    folder_path = os.path.join(APP_DIR, folder_name)
    imports = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".py") and not file.startswith("__"):
                file_path = os.path.join(root, file)
                names = extract_names(file_path)
                if names:
                    # gera import completo relativo ao app
                    module_path = os.path.relpath(file_path, APP_DIR).replace(os.sep, ".").replace(".py", "")
                    imports.append(f"from {module_path} import {', '.join(names)}")
    return imports

# Mapear pastas que viraram módulos
substitutions = {
    "models": generate_imports_for_folder("models"),
    "schemas": generate_imports_for_folder("schemas"),
    "crud": generate_imports_for_folder("crud")
}

# Percorrer todos os arquivos .py na pasta app
for root, dirs, files in os.walk(APP_DIR):
    for file in files:
        if file.endswith(".py"):
            filepath = os.path.join(root, file)
            
            # Cria backup
            rel_path = os.path.relpath(filepath, APP_DIR)
            backup_path = os.path.join(BACKUP_DIR, rel_path)
            os.makedirs(os.path.dirname(backup_path), exist_ok=True)
            shutil.copy2(filepath, backup_path)
            
            # Lê conteúdo
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Substituir imports antigos
            for key, imports in substitutions.items():
                # procura qualquer import do tipo "from app import models"
                pattern = re.compile(rf"from\s+app\s+import\s+{key}")
                if imports:
                    content = pattern.sub("\n".join(imports), content)
            
            # Salva arquivo atualizado
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)

print("✅ Substituição de imports concluída! Backup em ./backup_app")
