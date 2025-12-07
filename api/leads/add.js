import { supabase } from "../../lib/supabase.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    try {
        // =====================================================
        // 🟦 CADASTRO INDIVIDUAL
        // =====================================================
        if (!req.body.lista) {

            let { nome_cliente, nicho, telefone, vendedor_id } = req.body;

            if (!nome_cliente || !telefone || !vendedor_id) {
                return res.status(400).json({ error: "Campos obrigatórios faltando." });
            }

            telefone = telefone.replace(/\D/g, "");

            const { error } = await supabase.from("leads").insert({
                nome_cliente,
                nicho,
                telefone,
                vendedor_id,
                status: "novo"
            });

            if (error) throw error;

            return res.json({ message: "Lead cadastrado com sucesso!" });
        }

        // =====================================================
        // 🟩 CADASTRO EM MASSA
        // =====================================================

        const lista = req.body.lista
            .filter(item => item.nome_cliente && item.telefone) // remove vazios
            .map(item => ({
                nome_cliente: item.nome_cliente,
                telefone: item.telefone.replace(/\D/g, ""),
                vendedor_id: req.body.vendedor_id || null,
                status: "novo"
            }));

        if (!lista.length) {
            return res.status(400).json({ error: "Nenhum dado válido para inserir." });
        }

        const { error } = await supabase.from("leads").insert(lista);

        if (error) throw error;

        return res.json({ message: "Leads cadastrados em massa com sucesso!" });

    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
