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
  const tbody = document.querySelector("#leadsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="5">Carregando...</td></tr>`;

  try {
    const response = await fetch(API_URL); // public-safe endpoint (no secret)
    if (!response.ok) {
      tbody.innerHTML = `<tr><td colspan="5">Erro ao carregar leads (${response.status})</td></tr>`;
      return;
    }

    const json = await response.json();
    const data = Array.isArray(json?.data) ? json.data : [];

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">Nenhum lead encontrado.</td></tr>`;
      return;
    }

    let html = "";
    data.forEach((lead) => {
      html += `
        <tr>
          <td>${escapeHtml(lead.nome_cliente || "-")}</td>
          <td>${escapeHtml(lead.telefone || "-")}</td>
          <td>${escapeHtml(lead.vendedor_id || "-")}</td>
          <td>${escapeHtml(lead.status || "-")}</td>
          <td>${lead.created_at ? new Date(lead.created_at).toLocaleString() : "-"}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;

  } catch (err) {
    console.error("Erro ao carregar leads:", err);
    tbody.innerHTML = `<tr><td colspan="5">Erro de conexão.</td></tr>`;
  }
}

// ==========================
// DASHBOARD — CONTADORES (opcional)
 // tenta preencher se elementos existirem
// ==========================
async function carregarDashboard() {
  const totalEl = document.getElementById("total-leads");
  const novosEl = document.getElementById("novos-leads");
  const andamentoEl = document.getElementById("andamento-leads");
  if (!totalEl && !novosEl && !andamentoEl) return;

  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    const leads = Array.isArray(json?.data) ? json.data : [];

    if (totalEl) totalEl.innerText = leads.length;
    if (novosEl) novosEl.innerText = leads.filter(l => l.status === "novo").length;
    if (andamentoEl) andamentoEl.innerText = leads.filter(l => l.status === "andamento").length;
  } catch (err) {
    console.error("Erro ao carregar dashboard:", err);
  }
}

// ==========================
// AUTOEXECUÇÃO POR PÁGINA
// ==========================
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);}

if (window.location.pathname.includes("leads.html")) {
  checkLogin();
  carregarLeads();
}

if (window.location.pathname.includes("dashboard.html")) {
  checkLogin();
  carregarDashboard();
}

// Exponha funções globais para botões no HTML
window.login = login;
window.logout = logout;
// -----------------------------
// ADICIONAR LEAD
// -----------------------------
const leadForm = document.getElementById("leadForm");

if (leadForm) {
  leadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const vendedorId = document.getElementById("vendedorId").value.trim();
    const msg = document.getElementById("msg");

    msg.textContent = "Salvando lead...";
    msg.style.color = "black";

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_cliente: nome,
          telefone: telefone,
          vendedor_id: vendedorId
        })
      });

      const result = await response.json();

      if (!response.ok) {
        msg.textContent = "Erro: " + (result.error || "Falha ao salvar lead.");
        msg.style.color = "red";
        return;
      }

      msg.textContent = "Lead salvo com sucesso!";
      msg.style.color = "green";

      leadForm.reset();

    } catch (err) {
      console.error(err);
      msg.textContent = "Erro inesperado.";
      msg.style.color = "red";
    }
  });
}

