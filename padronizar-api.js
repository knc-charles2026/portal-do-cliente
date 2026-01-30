/**
 * padronizar-api-final.js
 *
 * Script final para padronizar todas as chamadas fetch/axios para api.js
 * Suporta JSX, ESModules, optional chaining, nullish coalescing, TypeScript
 * Preserva método HTTP e body/payload.
 */

const fs = require("fs");
const path = require("path");
const recast = require("recast");
const babelParser = require("@babel/parser");

// Configuração do frontend
const SRC_DIR = path.join(__dirname, "frontend/src");
const BACKUP_DIR = path.join(__dirname, "frontend/src_backup_final");
const LOG_FILE = path.join(__dirname, "substituicoes_final.log");

// Criar backup
if (!fs.existsSync(BACKUP_DIR)) {
  console.log("Criando backup em frontend/src_backup_final...");
  fs.cpSync(SRC_DIR, BACKUP_DIR, { recursive: true });
} else {
  console.log("Backup já existe em frontend/src_backup_final, pulando criação.");
}

// Limpar log antigo
if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);
function log(substituicao) {
  fs.appendFileSync(LOG_FILE, substituicao + "\n");
}

// Extensões a processar
const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

// Função para varrer pasta recursivamente
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (EXTENSIONS.includes(path.extname(file))) results.push(file);
  });
  return results;
}

// Processar um arquivo
function processFile(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  let ast;
  try {
    ast = recast.parse(code, {
      parser: {
        parse(source) {
          return babelParser.parse(source, {
            sourceType: "module",
            plugins: [
              "jsx",
              "typescript",
              "classProperties",
              "optionalChaining",
              "nullishCoalescingOperator",
              "decorators-legacy",
            ],
          });
        },
      },
    });
  } catch (err) {
    console.error(`Erro ao parsear ${filePath}:`, err.message);
    return;
  }

  let modified = false;

  recast.types.visit(ast, {
    visitCallExpression(pathNode) {
      const node = pathNode.node;

      // -----------------------------
      // FETCH
      // -----------------------------
      if (
        node.callee.type === "Identifier" &&
        node.callee.name === "fetch" &&
        node.arguments.length >= 1
      ) {
        let urlNode = node.arguments[0];
        let optionsNode = node.arguments[1];
        let url = recast.print(urlNode).code.replace(/["']/g, "");

        let method = "GET";
        let body = null;

        if (optionsNode && optionsNode.type === "ObjectExpression") {
          optionsNode.properties.forEach((prop) => {
            const keyName = prop.key.name || prop.key.value;
            if (keyName === "method") {
              if (prop.value.type === "StringLiteral") method = prop.value.value.toUpperCase();
              else if (prop.value.type === "Literal") method = prop.value.value.toUpperCase();
            }
            if (keyName === "body") body = recast.print(prop.value).code;
          });
        }

        let replacement = "";
        if (method === "GET") replacement = `get("${url}")`;
        else if (method === "POST") replacement = body ? `post("${url}", ${body})` : `post("${url}")`;
        else if (method === "PUT") replacement = body ? `put("${url}", ${body})` : `put("${url}")`;
        else if (method === "DELETE") replacement = `del("${url}")`;
        else replacement = `fetch("${url}")`;

        log(`[${filePath}] Substituído fetch:\n  ${recast.print(node).code}\n  --> ${replacement}\n`);
        pathNode.replace(recast.parse(replacement).program.body[0].expression);
        modified = true;
      }

      // -----------------------------
      // AXIOS
      // -----------------------------
      if (
        node.callee.type === "MemberExpression" &&
        node.callee.object.name === "axios" &&
        ["get", "post", "put", "delete"].includes(node.callee.property.name)
      ) {
        const method = node.callee.property.name;
        const urlArg = node.arguments[0];
        const bodyArg = node.arguments[1];
        const url = recast.print(urlArg).code.replace(/["']/g, "");

        let replacement = "";
        if (method === "get") replacement = bodyArg ? `get("${url}", ${recast.print(bodyArg).code})` : `get("${url}")`;
        else if (method === "post") replacement = bodyArg ? `post("${url}", ${recast.print(bodyArg).code})` : `post("${url}")`;
        else if (method === "put") replacement = bodyArg ? `put("${url}", ${recast.print(bodyArg).code})` : `put("${url}")`;
        else if (method === "delete") replacement = bodyArg ? `del("${url}", ${recast.print(bodyArg).code})` : `del("${url}")`;

        log(`[${filePath}] Substituído axios.${method}:\n  ${recast.print(node).code}\n  --> ${replacement}\n`);
        pathNode.replace(recast.parse(replacement).program.body[0].expression);
        modified = true;
      }

      this.traverse(pathNode);
    },
  });

  if (modified) fs.writeFileSync(filePath, recast.print(ast).code, "utf8");
}

// -----------------------------
// Rodar todos os arquivos
// -----------------------------
const files = walk(SRC_DIR);
console.log(`Processando ${files.length} arquivos...`);
files.forEach((file) => processFile(file));

console.log(`Substituições concluídas. Log em: ${LOG_FILE}`);
console.log("Se necessário, restaure backup com:\n  rm -rf frontend/src\n  mv frontend/src_backup_final frontend/src");
