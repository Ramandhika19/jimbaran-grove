const money = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n||0));
const escapeHtml = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function getJSON(url){const r=await fetch(url);if(!r.ok)throw new Error("Gagal memuat data");return r.json()}
async function loadProducts(){const el=document.getElementById("productGrid");try{const items=await getJSON("/api/products");el.innerHTML=items.map(p=>`<article class="product-card"><img src="${escapeHtml(p.image_url||"")}" alt="${escapeHtml(p.name)}" loading="lazy"><div class="product-info"><small>${escapeHtml(p.category_name||"Bali experience")}</small><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml((p.description||"").slice(0,105))}</p><div class="price-row"><strong>${money(p.price)}</strong><button onclick="showLogin()">Book trip ↗</button></div></div></article>`).join("")||"<p>Belum ada paket tersedia.</p>"}catch(e){el.innerHTML='<p class="muted">Data paket belum tersedia. Pastikan database sudah diimpor.</p>'}}
async function loadVehicles(){const el=document.getElementById("vehicleGrid");try{const items=await getJSON("/api/vehicles");el.innerHTML=items.map(v=>`<article class="vehicle-card"><span>${escapeHtml(v.vehicle_type)} • ${v.capacity} SEATS</span><h3>${escapeHtml(v.name)}</h3><p>${escapeHtml(v.description||"Adventure-ready vehicle.")}</p></article>`).join("")}catch(_){el.innerHTML=""}}
async function loadDestinations(){const el=document.getElementById("destinationGrid");try{const items=await getJSON("/api/destinations");el.innerHTML=items.map(d=>`<article class="destination-card" style="background-image:url('${escapeHtml(d.image_url||"")}')"><div><h3>${escapeHtml(d.name)}</h3><p>${escapeHtml(d.region||"Bali")}</p></div></article>`).join("")}catch(_){el.innerHTML=""}}
async function loadGallery(){const el=document.getElementById("galleryGrid");try{const items=await getJSON("/api/gallery");el.innerHTML=items.slice(0,3).map(g=>`<img src="${escapeHtml(g.image_url)}" alt="${escapeHtml(g.title)}" loading="lazy">`).join("")}catch(_){el.innerHTML=""}}
function showLogin(){document.getElementById("authModal").classList.add("open")}
document.getElementById("loginOpen").addEventListener("click",showLogin);
document.getElementById("modalClose").addEventListener("click",()=>document.getElementById("authModal").classList.remove("open"));
document.getElementById("authModal").addEventListener("click",e=>{if(e.target.id==="authModal")e.currentTarget.classList.remove("open")});
// Demo-only hardcoded login: no API or database request is made.
const DEMO_ACCOUNTS = {
  "caesarramandhika@gmail.com": { name: "Administrator", role: "admin" },
  "ramandhikaputra683@gmail.com": { name: "Jimbaran Grove Member", role: "user" }
};
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = Object.fromEntries(new FormData(form));
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");
  const msg = document.getElementById("authMessage");
  const account = DEMO_ACCOUNTS[email];

  if (!account || password !== "12345678") {
    msg.textContent = "Email atau password salah. Periksa kembali akun demo kamu.";
    return;
  }

  const session = {
    email,
    name: account.name,
    role: account.role,
    loginAt: new Date().toISOString()
  };
  localStorage.setItem("jg_session", JSON.stringify(session));
  localStorage.setItem("jh_token", "demo-session");

  msg.textContent = `Login demo berhasil sebagai ${account.role === "admin" ? "Administrator" : "User"}.`;
  form.reset();

  msg.textContent += account.role === "admin"
    ? " Akun admin demo dikenali."
    : " Selamat datang di Jimbaran Grove!";
});
document.getElementById("year").textContent=new Date().getFullYear();
loadProducts();loadVehicles();loadDestinations();loadGallery();