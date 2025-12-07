// ============================
// CONFIG
// ============================
const API_ADD = "/api/leads/add";

// ============================
// LOGIN / LOGOUT
// ============================
function logout() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

// ============================
// FORMATAR TELEFONE
// ============================
function formatarTelefone(input) {
    let v = input.value.replace(/\D/g, "");

    if (v.length >= 2) v = `(${v.substring(0,2)}) ${v.substring(2)}`;
    if (v.length >= 10) v = `${v.substring(0,10)}-${v.substring(10,14)}`;

    input.value = v;
}

// ============================
// SALVAR LEAD INDIVIDUAL
// ============================
async function salvarLead() {
    const nome = document.getElementById("lead_nome").value.trim();
    const nicho = document.getElementById("lead_nicho").value.trim();
    const telefone = document.getElementById("lead_telefone").value.replace(/\D/g, "");
    const vendedor = document.getElementById("lead_vendedor").value.trim();
    const msg = document.getElementById("msgLead");

    msg.textContent = "";
    
    if (!nome || telefone.length < 10 || !vendedor) {
        msg.textContent = "Preencha os campos corretamente.";
        msg.style.color = "red";
        return;
    }

    const payload = {
        nome_cliente: nome,
        nicho,
        telefone,
        vendedor_id: vendedor
    };

    try {
        const r = await fetch(API_ADD, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await r.json();

        if (!r.ok) throw new Error(data.error);

        msg.textContent = "Lead salvo com sucesso!";
        msg.style.color = "green";

    } catch (err) {
        msg.textContent = "Erro: " + err.message;
        msg.style.color = "red";
    }
}

// ============================
// SALVAR EM MASSA
// ============================
async function salvarMassa() {
    const texto = document.getElementById("massaLista").value.trim();
    const msg = document.getElementById("msgMassa");

    msg.textContent = "";

    if (!texto) {
        msg.textContent = "Cole algum dado!";
        msg.style.color = "red";
        return;
    }

    const linhas = texto.split("\n");

    const lista = linhas.map(l => {
        const [nome, tel] = l.split(",");
        return {
            nome_cliente: nome?.trim(),
            telefone: tel?.replace(/\D/g, "").trim()
        };
    });

    try {
        const r = await fetch(API_ADD, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lista })
        });

        const data = await r.json();
        if (!r.ok) throw new Error(data.error);

        msg.textContent = data.message || "Leads salvos!";
        msg.style.color = "green";

    } catch (err) {
        msg.textContent = "Erro: " + err.message;
        msg.style.color = "red";
    }
}
