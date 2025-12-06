import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao Supabase usando variáveis do Vercel
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Servir a pasta public
app.use(express.static("public"));

// Página inicial
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

// Rota de teste da API (para ver se o servidor está vivo)
app.get("/api/teste", async (req, res) => {
  return res.json({ status: "API AxialCRM funcionando!" });
});

// Exemplo de rota que consulta tabela no Supabase
app.get("/api/leads", async (req, res) => {
  const { data, error } = await supabase.from("leads").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

// Porta para rodar localmente (Vercel ignora o número)
app.listen(3000, () => console.log("Servidor AxialCRM rodando localmente"));
