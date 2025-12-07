import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// --------------------
// CONFIGURAÇÕES
// --------------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Resolver caminhos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// --------------------
// ROTA DE SALVAR LEAD
// --------------------
app.post("/api/leads/add", async (req, res) => {
  const { nome_cliente, telefone, vendedor_id, feedback = "", status = "novo" } = req.body;

  if (!nome_cliente || !telefone || !vendedor_id) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  try {
    const payload = {
      nome_cliente,
      telefone,
      vendedor_id,
      feedback,
      status
    };

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await insertRes.json();

    if (!insertRes.ok) {
      console.error("Erro Supabase:", data);
      return res.status(500).json({ error: data });
    }

    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// --------------------
// ROTA DE FALLBACK
// (leva para index.html se acessar caminho inválido)
// --------------------
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar servidor local
app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
