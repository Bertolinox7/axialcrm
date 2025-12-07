import { supabase } from "../../lib/supabase.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    try {
        // MODO INDIVIDUAL
        if (!req.body.lista) {
            const lead = req.body;

            const { error } = await supabase.from("leads").insert(lead);

            if (error) throw error;

            return res.json({ message: "Lead cadastrado com sucesso!" });
        }

        // MODO EM MASSA
        const lista = req.body.lista.map(x => ({
            nome_cliente: x.nome,
            telefone: x.telefone,
            vendedor_id: req.body.vendedor || null
        }));

        const { error } = await supabase.from("leads").insert(lista);

        if (error) throw error;

        return res.json({ message: "Leads cadastrados em massa com sucesso!" });

    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

