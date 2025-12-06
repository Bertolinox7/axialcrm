import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// Variáveis de ambiente do Vercel
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Servir a pasta public
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

// Exemplo de rota de teste API
app.get("/api/teste", async (req, res) => {
  res.json({ mensagem: "API do AxialCRM funcionando!" });
});

// Porta usada pelo Vercel automaticamente
app.listen(3000, () => console.log("Servidor AxialCRM rodando localmente"));
