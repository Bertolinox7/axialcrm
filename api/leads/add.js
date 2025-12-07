import { supabase } from "../../lib/supabase.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    try {
        // -------------------------
        // 🟦 CADASTRO INDIVIDUAL
        // -------------------------
        if (!req.body.lista) {
            let { nome, nicho, telefone, vendedor_id } = req.body;

            if (!nome || !telefone || !vendedor_id) {
                return res.status(400).json({ error: "Campos obrigatórios faltando." });
            }

            telefone = telefone.replace(/\D/g, ""); // remove caracteres

            const { error } = await supabase.from("leads").insert({
                nome_cliente: nome,
                nicho,
                telefone,
                vendedor_id,
                status: "novo"
            });

            if (error) throw error;

            return res.json({ message: "Lead cadastrado com sucesso!" });
        }

        // -------------------------
        // 🟩 CADASTRO EM MASSA
        // -------------------------
        const lista = req.body.lista.map(item => ({
            nome_cliente: item.nome,
            telefone: item.telefone.replace(/\D/g, ""),
            vendedor_id: req.body.vendedor_id || null,
            status: "novo"
        }));

        const { error } = await supabase.from("leads").insert(lista);

        if (error) throw error;

        return res.json({ message: "Leads cadastrados em massa com sucesso!" });

    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

