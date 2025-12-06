import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // Apenas GET permitido
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  // Segurança extra: precisa do segredo interno
  const internalSecret = req.headers["x-internal-secret"];
  if (internalSecret !== process.env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Conectar ao Supabase com SERVICE ROLE
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  // Query params opcionais
  const { seller_id, limit = 100, offset = 0 } = req.query;

  let query = supabase
    .from("leads")
    .select("*")
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  // Filtro opcional por vendedor
  if (seller_id) {
    query = query.eq("vendedor_id", seller_id);
  }

  // Executar
  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ data });
}

