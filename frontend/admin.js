const API_BASE = "http://localhost:4000";

const form = document.getElementById("keyForm");
const msg = document.getElementById("adminMsg");

const statsDiv = document.getElementById("stats");
const waitlistBox = document.getElementById("waitlistBox");
const surveysBox = document.getElementById("surveysBox");
const statsBox = document.getElementById("statsBox");

function card(title, value){
  return `
    <div class="card">
      <div class="muted" style="font-weight:900;margin-bottom:6px;">${title}</div>
      <div style="font-size:28px;font-weight:1000;">${value}</div>
    </div>
  `;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Chargement...";

  const key = new FormData(form).get("key");

  try {
    // full admin data
    const res = await fetch(`${API_BASE}/api/admin`, {
      headers: { "x-admin-key": key }
    });
    const data = await res.json();

    if (!res.ok) {
      msg.textContent = `❌ ${data.error || "Unauthorized"}`;
      return;
    }

    // stats endpoint (public)
    const statsRes = await fetch(`${API_BASE}/api/stats`);
    const stats = await statsRes.json();

    msg.textContent = "✅ Données chargées.";

    statsDiv.innerHTML =
      card("Total Waitlist", data.totalWaitlist) +
      card("Total Surveys", data.totalSurveys) +
      card("Top Persona", topKey(stats.byPersona)) ;

    waitlistBox.textContent = JSON.stringify(data.waitlist, null, 2);
    surveysBox.textContent = JSON.stringify(data.surveys, null, 2);
    statsBox.textContent = JSON.stringify(stats, null, 2);

  } catch (err) {
    msg.textContent = "❌ Erreur réseau. Vérifie que le backend tourne.";
  }
});

function topKey(obj){
  if(!obj) return "-";
  let best = "-";
  let max = -1;
  for(const k of Object.keys(obj)){
    if(obj[k] > max){ max = obj[k]; best = `${k} (${obj[k]})`; }
  }
  return best;
}
