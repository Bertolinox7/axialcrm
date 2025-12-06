// ==========================
// CONFIGURAÇÕES DO CRM
// ==========================
const API_URL = "https://axialcrm.vercel.app/api/leads"; // sua rota já funcionando!

// ==========================
// LOGIN SIMPLES (FAKE)
// ==========================
function login() {
    const email = document.getElementById("email")?.value;
    const senha = document.getElementById("senha")?.value;

    if (!email || !senha) {
        alert("Preencha email e senha.");
        return;
    }

    // Login simples só para liberar a navegação (versão HTML básica)
    localStorage.setItem("usuario", email);

    window.location.href = "dashboard.html";
}

// ==========================
// VERIFICAR LOGIN
// ==========================
function checkLogin() {
    const user = localStorage.getItem("usuario");
    if (!user) {
        window.location.href = "index.html";
    }
}

// ==========================
// LOGOUT
// ==========================
function logout() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

// ==========================
// LISTAR LEADS DA API
// ==========================
async function carregarLeads() {
    const tabela = document.getElementById("lista-leads");

    if (!tabela) return;

    tabela.innerHTML = "<tr><td>Carregando...</td></tr>";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            tabela.innerHTML = `<tr><td>Erro ao carregar leads.</td></tr>`;
            return;
        }

        const leads = await response.json();

        if (!Array.isArray(leads) || leads.length === 0) {
            tabela.innerHTML = "<tr><td>Nenhum lead encontrado.</td></tr>";
            return;
        }

        let html = "";

        leads.forEach((lead) => {
            html += `
                <tr>
                    <td>${lead.nome_cliente || "-"}</td>
                    <td>${lead.telefone || "-"}</td>
                    <td>${lead.status || "-"}</td>
                    <td>${lead.created_at ? new Date(lead.created_at).toLocaleString() : "-"}</td>
                </tr>
            `;
        });

        tabela.innerHTML = html;

    } catch (err) {
        tabela.innerHTML = `<tr><td>Erro de conexão.</td></tr>`;
        console.error(err);
    }
}

// ==========================
// DASHBOARD — CONTADORES
// ==========================
async function carregarDashboard() {
    const total = document.getElementById("total-leads");
    const novos = document.getElementById("novos-leads");
    const andamento = document.getElementById("andamento-leads");

    if (!total || !novos || !andamento) return;

    try {
        const response = await fetch(API_URL);
        const leads = await response.json();

        total.innerText = leads.length;
        novos.innerText = leads.filter(l => l.status === "novo").length;
        andamento.innerText = leads.filter(l => l.status === "andamento").length;

    } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
    }
}

// ==========================
// AUTOEXECUÇÃO POR PÁGINA
// ==========================

// Se for a página de leads.html
if (window.location.pathname.includes("leads.html")) {
    checkLogin();
    carregarLeads();
}

// Se for o dashboard
if (window.location.pathname.includes("dashboard.html")) {
    checkLogin();
    carregarDashboard();
}
