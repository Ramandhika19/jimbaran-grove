const API=(window.JIMBARAN_CONFIG?.API_BASE_URL||"").replace(/\/$/,"");
const form=document.querySelector("#searchForm"),input=document.querySelector("#searchInput"),category=document.querySelector("#searchCategory"),results=document.querySelector("#searchResults"),status=document.querySelector("#searchStatus");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const demo=[
 {id:1,title:"Jimbaran Coastal Jeep Trail",description:"Jelajahi lanskap pesisir dan jalur alam Bali Selatan bersama pemandu lokal.",type:"experience",category_name:"Jeep Offroad",image_url:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900",url:"/experiences.html?id=1"},
 {id:2,title:"Mount Batur Sunrise Jeep",description:"Panorama matahari terbit dari kawasan Gunung Batur menggunakan kendaraan 4x4.",type:"experience",category_name:"Sunrise Tour",image_url:"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900",url:"/experiences.html?id=2"},
 {id:3,title:"Ubud Jungle ATV Ride",description:"Pengalaman ATV melintasi jalur tanah dan area hijau.",type:"experience",category_name:"ATV Adventure",image_url:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900",url:"/experiences.html?id=3"},
 {id:4,title:"Colabo Cafe",description:"Cafe dan ruang berkumpul di Jimbaran Grove.",type:"place",category_name:"Food & Drink",image_url:"https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900",url:"/places.html?tenant=2"},
 {id:5,title:"Biosphere School",description:"Sekolah dengan pendekatan tech dan nature.",type:"place",category_name:"Education",image_url:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900",url:"/places.html?tenant=3"},
 {id:6,title:"Karting Star",description:"Pengalaman go-kart dengan lintasan 400 meter.",type:"place",category_name:"Sports & Adventure",image_url:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900",url:"/places.html?tenant=5"},
 {id:7,title:"Padel Club Indonesia - Bali",description:"Fasilitas padel dan aktivitas olahraga di Jimbaran Grove.",type:"place",category_name:"Sports & Wellness",image_url:"https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=900",url:"/places.html?tenant=7"},
 {id:8,title:"Jimbaran",description:"Kawasan pesisir Bali Selatan dan titik awal eksplorasi area Jimbaran.",type:"place",category_name:"Destination",image_url:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900",url:"/places.html?destination=1"},
 {id:9,title:"Community Weekend at Jimbaran Grove",description:"Agenda komunitas dan pertemuan di Jimbaran Grove.",type:"event",category_name:"Community",image_url:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900",url:"/events.html?id=1"},
 {id:10,title:"A Place to Work, Play, and Connect",description:"Mengenal Jimbaran Grove sebagai ruang aktivitas, kreativitas, olahraga, dan komunitas.",type:"story",category_name:"About Jimbaran Grove",image_url:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900",url:"/news.html?id=1"}
];
function render(items,q,source){status.textContent=items.length+" hasil ditemukan untuk “"+q+"” · "+source;results.innerHTML=items.length?items.map(x=>`<a class="discover-card search-result" href="${esc(x.url)}"><img src="${esc(x.image_url||"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900")}" alt=""><div><small>${esc(x.category_name||x.type)}</small><h3>${esc(x.title)}</h3><p>${esc(x.description||"")}</p><span>Lihat detail ↗</span></div></a>`).join(""):'<p class="empty-state">Belum ada hasil. Coba kata kunci atau kategori lain.</p>'}
form?.addEventListener("submit",async e=>{
 e.preventDefault();const q=input.value.trim().toLowerCase(),selected=category.value;
 if(q.length<2){status.textContent="Masukkan minimal 2 karakter untuk mencari.";return}
 status.textContent="Sedang mencari di katalog Jimbaran Grove…";results.innerHTML="";
 if(API&&!API.includes("YOUR-NODE-API-HOST")){
  try{const url=new URL(API+"/api/search");url.searchParams.set("q",q);url.searchParams.set("category",selected);const r=await fetch(url);if(!r.ok)throw new Error("API tidak tersedia.");const data=await r.json();render(data.results||[],q,data.dataSource==="hardcode"?"data demo":"database");return}catch(_err){/* switch to local demo content below */}
 }
 const localItems=(key)=>{try{const v=JSON.parse(localStorage.getItem(key));return Array.isArray(v)?v:[]}catch{return []}};
 const editable=[...localItems("jg_experiences").map(x=>({id:x.id,title:x.name,description:x.description,type:"experience",category_name:x.category_name||x.category,image_url:x.image_url,url:"./experiences.html"})),...localItems("jg_places").map(x=>({id:x.id,title:x.name,description:x.description,type:"place",category_name:x.category,image_url:x.image_url,url:"./places.html"})),...localItems("jg_events").map(x=>({id:x.id,title:x.title,description:x.description,type:"event",category_name:x.category,image_url:x.image_url,url:"./events.html"}))];
 const source=[...demo,...editable];
 const uniqueSource=source.filter((x,i,a)=>a.findIndex(y=>y.type===x.type&&y.title===x.title)===i);
 const items=uniqueSource.filter(x=>(selected==="all"||selected===x.type||selected==="places"&&x.type==="place"||selected==="experiences"&&x.type==="experience"||selected==="events"&&x.type==="event"||selected==="stories"&&x.type==="story")&&(x.title+" "+x.description+" "+x.category_name).toLowerCase().includes(q));
 render(items,q,"data demo + konten lokal");
});
