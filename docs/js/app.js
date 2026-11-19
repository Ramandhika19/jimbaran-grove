const money=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n||0));
const escapeHtml=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const API_BASE_URL=(window.JIMBARAN_CONFIG?.API_BASE_URL||"").replace(/\/$/,"");
const apiConfigured=Boolean(API_BASE_URL&&!API_BASE_URL.includes("YOUR-NODE-API-HOST"));
let lastDataSource="hardcode";
const WHATSAPP_NUMBER="6285847872972";
const readLocal=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key));return Array.isArray(value)?value:fallback}catch{return fallback}};
const orderLink=p=>`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Halo Jimbaran Grove, saya ingin memesan ${p.name}. Mohon info ketersediaan dan detailnya.`)}`;

// Demo content keeps the public website populated while MySQL is unavailable.
const FALLBACK={
 products:[
  {id:1,name:"Jimbaran Coastal Jeep Trail",category_name:"Jeep Offroad",description:"Jelajahi lanskap pesisir dan jalur alam Bali Selatan bersama pemandu lokal.",price:425000,duration:"2-3 jam",location:"Jimbaran, Bali",image_url:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200"},
  {id:2,name:"Mount Batur Sunrise Jeep",category_name:"Sunrise Tour",description:"Nikmati panorama matahari terbit dari kawasan Gunung Batur menggunakan kendaraan 4x4.",price:550000,duration:"4-5 jam",location:"Kintamani, Bangli",image_url:"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200"},
  {id:3,name:"Ubud Jungle ATV Ride",category_name:"ATV Adventure",description:"Pengalaman ATV melintasi jalur tanah, area hijau, dan trek petualangan.",price:325000,duration:"1,5-2 jam",location:"Ubud, Gianyar",image_url:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200"},
  {id:4,name:"Bali Countryside 4x4",category_name:"Jeep Offroad",description:"Perjalanan santai dengan Jeep 4x4 menyusuri panorama pedesaan dan perbukitan Bali.",price:475000,duration:"3 jam",location:"Bali Selatan",image_url:"https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200"}
 ],
 vehicles:[
  {id:1,name:"Classic 4x4 Jeep",vehicle_type:"Jeep 4x4",capacity:4,description:"Jeep 4x4 untuk perjalanan petualangan dengan driver.",image_url:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900"},
  {id:2,name:"Adventure ATV Single",vehicle_type:"ATV",capacity:1,description:"ATV untuk satu pengendara dengan perlengkapan keselamatan.",image_url:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900"},
  {id:3,name:"Adventure ATV Tandem",vehicle_type:"ATV",capacity:2,description:"ATV tandem untuk dua peserta sesuai ketentuan operator.",image_url:"https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=900"}
 ],
 destinations:[
  {id:1,name:"Jimbaran",region:"Badung",image_url:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900"},
  {id:2,name:"Gunung Batur",region:"Kintamani, Bangli",image_url:"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900"},
  {id:3,name:"Ubud",region:"Gianyar",image_url:"https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900"}
 ],
 gallery:[
  {id:1,title:"Bali Mountain Adventure",image_url:"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200"},
  {id:2,title:"Tropical Trail",image_url:"https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200"},
  {id:3,title:"Island Escape",image_url:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200"}
 ]
};

async function apiFetch(path,options={}){
 if(!apiConfigured)throw new Error("Backend Node.js belum dikonfigurasi.");
 const response=await fetch(`${API_BASE_URL}${path}`,options);
 if(!response.ok){let body={};try{body=await response.json()}catch{}throw new Error(body.message||`Permintaan gagal (${response.status})`)}
 lastDataSource=response.headers.get("X-Data-Source")||"mysql";
 return response.json();
}
function showDataMessage(id,message){const el=document.getElementById(id);if(el)el.textContent=message}
function showSource(id){showDataMessage(id,lastDataSource==="hardcode"?"Menampilkan data demo (database belum terhubung).":"Data berhasil dimuat dari server.");}
function imageOrFallback(url){return escapeHtml(url||"https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80")}

async function loadProducts(){
 const el=document.getElementById("productGrid");let items;
 try{items=await apiFetch("/api/products")}catch(error){items=FALLBACK.products;lastDataSource="hardcode"}
 items=readLocal("jg_experiences",items);
 el.innerHTML=items.length?items.map(p=>`<article class="product-card reveal is-visible"><div class="card-image"><img src="${imageOrFallback(p.image_url)}" alt="${escapeHtml(p.name)}" loading="lazy"><span class="card-tag">${escapeHtml(p.category_name||"Bali adventure")}</span></div><div class="product-info"><small>${escapeHtml(p.location||"Bali, Indonesia")} · ${escapeHtml(p.duration||"Adventure")}</small><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml((p.description||"Discover Bali through an unforgettable offroad experience.").slice(0,125))}</p><div class="price-row"><strong>${money(p.price)}</strong><a class="order-button" href="${orderLink(p)}" target="_blank" rel="noopener">Pesan via WhatsApp ↗</a></div></div></article>`).join(""):'<p class="muted">Belum ada paket tersedia.</p>';
 showSource("productStatus");
}
async function loadVehicles(){
 const el=document.getElementById("vehicleGrid");let items;
 try{items=await apiFetch("/api/vehicles")}catch(error){items=FALLBACK.vehicles;lastDataSource="hardcode"}
 el.innerHTML=items.length?items.map(v=>`<article class="vehicle-card reveal"><img src="${imageOrFallback(v.image_url)}" alt="${escapeHtml(v.name)}" loading="lazy"><div class="vehicle-info"><span>${escapeHtml(v.vehicle_type)} · ${Number(v.capacity)||1} SEATS</span><h3>${escapeHtml(v.name)}</h3><p>${escapeHtml(v.description||"Adventure-ready ride for your Bali journey.")}</p></div></article>`).join(""):'<p class="muted">Belum ada kendaraan tersedia.</p>';
}
async function loadDestinations(){
 const el=document.getElementById("destinationGrid");let items;
 try{items=await apiFetch("/api/destinations")}catch(error){items=FALLBACK.destinations;lastDataSource="hardcode"}
 el.innerHTML=items.length?items.map(d=>`<article class="destination-card reveal" style="background-image:url('${imageOrFallback(d.image_url)}')"><div><h3>${escapeHtml(d.name)}</h3><p>${escapeHtml(d.region||"Bali")} · Discover the landscape</p></div></article>`).join(""):'<p class="muted">Belum ada destinasi tersedia.</p>';
}
async function loadGallery(){
 const el=document.getElementById("galleryGrid");let items;
 try{items=await apiFetch("/api/gallery")}catch(error){items=FALLBACK.gallery;lastDataSource="hardcode"}
 el.innerHTML=items.length?items.slice(0,3).map(g=>`<img class="reveal" src="${imageOrFallback(g.image_url)}" alt="${escapeHtml(g.title)}" loading="lazy">`).join(""):'<p class="muted">Galeri masih kosong.</p>';
}

function showLogin(){document.getElementById("authModal").classList.add("open")}
document.getElementById("loginOpen").addEventListener("click",showLogin);
document.getElementById("modalClose").addEventListener("click",()=>document.getElementById("authModal").classList.remove("open"));
document.getElementById("authModal").addEventListener("click",e=>{if(e.target.id==="authModal")e.currentTarget.classList.remove("open")});
document.getElementById("loginForm").addEventListener("submit",async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));const email=String(data.email||"").trim().toLowerCase(),password=String(data.password||"");const accounts={"caesarramandhika@gmail.com":{name:"Administrator",role:"admin"},"ramandhikaputra683@gmail.com":{name:"Jimbaran Grove Member",role:"user"}};const account=accounts[email],msg=document.getElementById("authMessage");if(!account||password!=="12345678"){msg.textContent="Email atau password salah.";return}localStorage.setItem("jg_session",JSON.stringify({email,name:account.name,role:account.role,loginAt:new Date().toISOString()}));msg.textContent="Login demo berhasil.";if(account.role==="admin"){window.location.href="./admin.html"}else{msg.textContent="Selamat datang! Kamu berhasil login sebagai user."}});
const menuButton=document.getElementById("menuToggle"),nav=document.getElementById("mainNav");menuButton.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));menuButton.textContent=open?"×":"☰"});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false");menuButton.textContent="☰"}));
document.getElementById("year").textContent=new Date().getFullYear();
if("IntersectionObserver"in window&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>observer.observe(el))}
loadProducts();loadVehicles();loadDestinations();loadGallery();
