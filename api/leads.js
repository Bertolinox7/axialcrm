import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const internalSecretHeader = req.headers["x-internal-secret"];
  const isInternal = internalSecretHeader && internalSecretHeader === process.env.INTERNAL_API_SECRET;

  // Conectar ao Supabase com SERVICE ROLE (server-side)
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const { seller_id, limit = 50, offset = 0 } = req.query;

  try {
    if (!isInternal) {
      // PUBLIC SAFE: se não for interno, retorna APENAS campos limitados e quantidade limitada
      const safeLimit = Math.min(Number(limit) || 50, 50); // max 50 para público
      const safeOffset = Math.max(Number(offset) || 0, 0);

      let q = supabase
        .from("leads")
        .select("id, nome_cliente, telefone, status, created_at")
        .order("created_at", { ascending: false })
        .range(safeOffset, safeOffset + safeLimit - 1);

      if (seller_id) {
        q = q.eq("vendedor_id", seller_id);
      }

      const { data, error } = await q;
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ data });
    }

    // INTERNAL (admin) behavior: full access (via service role + secret)
    const adminLimit = Math.min(Number(limit) || 1000, 2000);
    const adminOffset = Math.max(Number(offset) || 0, 0);

    let q = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .range(adminOffset, adminOffset + adminLimit - 1);

    if (seller_id) q = q.eq("vendedor_id", seller_id);

    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });

  } catch (err) {
    console.error("Unexpected error in /api/leads:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
