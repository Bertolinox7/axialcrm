export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { nome_cliente, nicho, telefone, vendedor_id, feedback = "", status = "novo" } = req.body;

    if (!nome_cliente || !telefone || !vendedor_id) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    // FORMATAR TELEFONE PARA (99) 99999-9999
    const onlyNumbers = telefone.replace(/\D/g, "");
    const ddd = onlyNumbers.substring(0, 2);
    const number = onlyNumbers.substring(2);
    const formattedPhone = `(${ddd}) ${number.substring(0, 5)}-${number.substring(5)}`;

    const payload = {
      nome_cliente,
      nicho: nicho || "",
      telefone: formattedPhone,
      vendedor_id,
      feedback,
      status
    };

    const insertRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await insertRes.json();

    if (!insertRes.ok) {
      return res.status(500).json({ error: data });
    }

    return res.status(201).json({ success: true, data });
    
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

