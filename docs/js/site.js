const API=(window.JIMBARAN_CONFIG?.API_BASE_URL||"").replace(/\/$/,"");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function get(path){if(!API||API.includes("YOUR-NODE-API-HOST"))throw new Error("Backend belum terhubung. URL API perlu diatur di docs/js/config.js.");const r=await fetch(API+path);if(!r.ok)throw new Error("Data belum bisa dimuat.");return r.json()}
document.querySelectorAll("[data-year]").forEach(x=>x.textContent=new Date().getFullYear());
const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".site-nav");if(toggle&&nav)toggle.addEventListener("click",()=>{nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(nav.classList.contains("open")))});
document.querySelectorAll(".site-nav a").forEach(a=>a.addEventListener("click",()=>nav?.classList.remove("open")));
function card(x){
 const title=x.title||x.name||"Explore Jimbaran Grove";
 const image=esc(x.image_url||"https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80");
 const order=x.type==="experience"?`<a class="order-button" href="https://wa.me/6285847872972?text=${encodeURIComponent("Halo Jimbaran Grove, saya ingin memesan "+title+". Mohon info ketersediaan dan detailnya.")}" target="_blank" rel="noopener">Pesan via WhatsApp ↗</a>`:"";
 return `<article class="discover-card"><img src="${image}" alt="${esc(title)}" loading="lazy"><div><small>${esc(x.category_name||x.type||"Explore")}</small><h3>${esc(title)}</h3><p>${esc(x.description||"Explore more at Jimbaran Grove.")}</p><span>${esc(x.location||x.venue||"Jimbaran Grove, Bali")}</span><p><a href="${esc(x.url||"#")}">Lihat detail ↗</a></p>${order}</div></article>`;
}
const demoExperiences=[
{id:1,name:"Jimbaran Coastal Jeep Trail",category_name:"Jeep Offroad",description:"Jelajahi jalur pesisir dan panorama Bali Selatan bersama pemandu lokal.",price:425000,duration:"2-3 jam",location:"Jimbaran, Bali",image_url:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1000"},
{id:2,name:"Mount Batur Sunrise Jeep",category_name:"Sunrise Tour",description:"Nikmati matahari terbit dan lanskap Gunung Batur dengan Jeep 4x4.",price:550000,duration:"4-5 jam",location:"Kintamani, Bali",image_url:"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000"},
{id:3,name:"Ubud Jungle ATV Ride",category_name:"ATV Adventure",description:"Jelajahi trek alam dan jalur hijau menggunakan ATV.",price:325000,duration:"1,5-2 jam",location:"Ubud, Bali",image_url:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000"},
{id:4,name:"Bali Countryside 4x4",category_name:"Jeep Offroad",description:"Perjalanan 4x4 menyusuri pedesaan, perbukitan, dan panorama Bali.",price:475000,duration:"3 jam",location:"Bali Selatan",image_url:"https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1000"}
];
const demoPlaces=[
{id:1,name:"JET Bike & Skate Park",category:"Sports & Adventure",description:"Ruang aktivitas olahraga dan rekreasi untuk komunitas.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000"},
{id:2,name:"Colabo Cafe",category:"Food & Drink",description:"Cafe dan ruang berkumpul untuk menikmati kopi dan kuliner.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000"},
{id:3,name:"Biosphere School",category:"Education",description:"Lingkungan belajar dengan pendekatan teknologi dan alam.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000"},
{id:4,name:"JLoft Office",category:"Work & Coworking",description:"Ruang kerja fleksibel untuk bisnis dan profesional.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1000"},
{id:5,name:"Karting Star",category:"Sports & Adventure",description:"Pengalaman go-kart di lintasan untuk pecinta kecepatan.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000"},
{id:6,name:"Jimba Arthall",category:"Arts & Creative",description:"Ruang seni, ide, pameran, dan pertunjukan komunitas.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000"},
{id:7,name:"Padel Club Indonesia - Bali",category:"Sports & Wellness",description:"Fasilitas padel untuk olahraga dan aktivitas bersama.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1000"},
{id:8,name:"Saia Pilates",category:"Sports & Wellness",description:"Studio pilates dan sesi kebugaran.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1000"},
{id:9,name:"Rona di Bukit Cocktails & Grill",category:"Food & Drink",description:"Tempat bersantap dan berkumpul dengan suasana Jimbaran.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000"},
{id:10,name:"Dance Studio",category:"Arts & Creative",description:"Studio kelas tari dan ekspresi kreatif.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1000"},
{id:11,name:"Colabo Meeting Room",category:"Work & Coworking",description:"Ruang rapat dan kolaborasi untuk tim.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1000"},
{id:12,name:"Ragi Baking Academy",category:"Education",description:"Ruang belajar baking dan pengembangan keterampilan kuliner.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1000"}
];
const demoEvents=[
{id:1,title:"Community Weekend at Jimbaran Grove",category:"Community",description:"Agenda komunitas untuk bertemu, berbagi ide, dan menikmati aktivitas bersama.",venue:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000"},
{id:2,title:"Creative Market & Local Gathering",category:"Arts & Creative",description:"Pasar kreatif yang mempertemukan komunitas dan pelaku lokal.",venue:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000"}
];
function localRows(key,defaults){try{const v=JSON.parse(localStorage.getItem(key));return Array.isArray(v)?v:defaults}catch{return defaults}}
async function loadListing(endpoint,target,empty){
 const el=document.querySelector(target);if(!el)return;let rows=[];
 if(endpoint.includes("products"))rows=localRows("jg_experiences",demoExperiences).map(x=>({...x,title:x.name,type:"experience",category_name:x.category_name||x.category,url:"#"}));
 else if(endpoint.includes("tenants"))rows=localRows("jg_places",demoPlaces).map(x=>({...x,title:x.name,type:"place",category_name:x.category,url:"#"}));
 else if(endpoint.includes("events"))rows=localRows("jg_events",demoEvents).map(x=>({...x,type:"event",category_name:x.category,url:"#"}));
 else {try{rows=await get(endpoint)}catch{rows=[]}}
 el.innerHTML=rows.length?rows.map(x=>card({...x,title:x.title||x.name})).join():`<p class="empty-state">${empty}</p>`;
}
