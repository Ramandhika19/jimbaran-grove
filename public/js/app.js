const DATA = window.JG_DATA;
const money = value => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(value||0));
const escapeHtml = value => String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeImage = value => { try { const url=new URL(value,window.location.origin); return ["https:","http:"].includes(url.protocol)?url.href:""; } catch { return ""; } };
const productGrid=document.getElementById("productGrid");
const storyGrid=document.getElementById("storyGrid");
const searchInput=document.getElementById("siteSearch");
const filterButtons=[...document.querySelectorAll(".filter-chip")];
let activeFilter="all";
let currentQuery="";
function orderUrl(product){
 const message="Halo Jimbaran Grove, saya ingin bertanya dan memesan pengalaman berikut:\n\n"+product.name+"\nHarga: "+money(product.price)+"\nDurasi: "+product.duration+"\nLokasi: "+product.location+"\n\nMohon info ketersediaan, jadwal, dan cara reservasinya. Terima kasih.";
 return "https://wa.me/"+DATA.whatsappNumber+"?text="+encodeURIComponent(message);
}
function productCard(p){
 return '<article class="product-card"><div class="product-media"><img src="'+escapeHtml(safeImage(p.image))+'" alt="'+escapeHtml(p.name)+'" loading="lazy"><span class="product-tag">'+escapeHtml(p.category)+'</span><button class="quick-detail" data-product="'+p.id+'" aria-label="Lihat detail '+escapeHtml(p.name)+'">↗</button></div><div class="product-info"><div class="product-meta"><span>⌖ '+escapeHtml(p.location)+'</span><span>◷ '+escapeHtml(p.duration)+'</span></div><div class="product-rating"><span aria-hidden="true">★★★★★</span><strong>'+Number(p.rating||4.5).toFixed(1)+'</strong><small>('+Number(p.ratingCount||0)+' ulasan demo)</small></div><h3>'+escapeHtml(p.name)+'</h3><p>'+escapeHtml(p.short)+'</p><div class="price-row"><div><small>Mulai dari</small><strong>'+money(p.price)+'</strong></div><button class="detail-link" data-product="'+p.id+'">Detail ↗</button></div><a class="btn btn-whatsapp" href="'+escapeHtml(orderUrl(p))+'" target="_blank" rel="noopener noreferrer">Pesan via WhatsApp <span>↗</span></a></div></article>';
}
function storyCard(s){
 return '<article class="story-card"><button class="story-open" data-story="'+s.id+'" aria-label="Baca '+escapeHtml(s.title)+'"><img src="'+escapeHtml(safeImage(s.image))+'" alt="'+escapeHtml(s.title)+'" loading="lazy"><span class="story-arrow">↗</span></button><div class="story-info"><small>'+escapeHtml(s.category)+' · '+escapeHtml(s.date)+'</small><h3>'+escapeHtml(s.title)+'</h3><p>'+escapeHtml(s.excerpt)+'</p><button class="detail-link" data-story="'+s.id+'">Baca cerita ↗</button></div></article>';
}
function render(){
 const q=currentQuery.toLocaleLowerCase("id").trim();
 const products=DATA.products.filter(p=>[p.name,p.category,p.short,p.description,p.location].join(" ").toLocaleLowerCase("id").includes(q));
 const stories=DATA.stories.filter(s=>[s.title,s.category,s.excerpt,s.content].join(" ").toLocaleLowerCase("id").includes(q));
 const showProducts=activeFilter!=="stories",showStories=activeFilter!=="products";
 productGrid.innerHTML=showProducts?(products.length?products.map(productCard).join(""):'<p class="empty-state">Tidak ada experience yang cocok. Coba kata kunci lain.</p>'):'';
 storyGrid.innerHTML=showStories?(stories.length?stories.map(storyCard).join(""):'<p class="empty-state">Artikel tidak ditemukan. Coba kata kunci lain.</p>'):'';
 document.getElementById("productHeading").textContent=activeFilter==="stories"?"Stories & articles":q?"Search results":"Popular experiences";
 document.getElementById("productCount").textContent=(showProducts?products.length+" experiences":"")+(showProducts&&showStories?" · ":"")+(showStories?stories.length+" articles":"");
 document.getElementById("stories").hidden=!showStories;
 document.querySelector(".results-heading").hidden=!showProducts;
 document.querySelector(".experiences").classList.toggle("searching",Boolean(q)||activeFilter!=="all");
}
function openDetail(type,id){
 const item=(type==="product"?DATA.products:DATA.stories).find(x=>String(x.id)===String(id));
 if(!item)return;
 const content=document.getElementById("detailContent");
 if(type==="product"){
  content.innerHTML='<img class="detail-image" src="'+escapeHtml(safeImage(item.image))+'" alt="'+escapeHtml(item.name)+'"><div class="detail-body"><span class="detail-category">'+escapeHtml(item.category)+'</span><h2>'+escapeHtml(item.name)+'</h2><div class="detail-facts"><span>⌖ '+escapeHtml(item.location)+'</span><span>◷ '+escapeHtml(item.duration)+'</span><span>♧ '+escapeHtml(item.capacity)+'</span><span class="detail-rating">★ '+Number(item.rating||4.5).toFixed(1)+' / 5 · Rating demo</span></div><p>'+escapeHtml(item.description)+'</p><h3>Pengalaman termasuk</h3><ul>'+item.includes.map(x=>'<li>'+escapeHtml(x)+'</li>').join("")+'</ul><p class="detail-note">'+escapeHtml(item.note)+'</p><div class="detail-order"><strong>'+money(item.price)+'</strong><a class="btn btn-whatsapp" href="'+escapeHtml(orderUrl(item))+'" target="_blank" rel="noopener noreferrer">Pesan via WhatsApp ↗</a></div></div>';
 }else{
  content.innerHTML='<img class="detail-image" src="'+escapeHtml(safeImage(item.image))+'" alt="'+escapeHtml(item.title)+'"><div class="detail-body"><span class="detail-category">'+escapeHtml(item.category)+' · '+escapeHtml(item.date)+'</span><h2>'+escapeHtml(item.title)+'</h2><p class="article-full">'+escapeHtml(item.content)+'</p></div>';
 }
 const modal=document.getElementById("detailModal");modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");
}
function closeModal(id){const modal=document.getElementById(id);modal.classList.remove("open");modal.setAttribute("aria-hidden","true");if(!document.querySelector(".modal.open"))document.body.classList.remove("modal-open")}
searchInput.addEventListener("input",()=>{currentQuery=searchInput.value;render()});
document.getElementById("clearSearch").addEventListener("click",()=>{searchInput.value="";currentQuery="";render();searchInput.focus()});
filterButtons.forEach(btn=>btn.addEventListener("click",()=>{activeFilter=btn.dataset.filter;filterButtons.forEach(b=>b.classList.toggle("active",b===btn));render()}));
document.addEventListener("click",e=>{const p=e.target.closest("[data-product]");const s=e.target.closest("[data-story]");if(p)openDetail("product",p.dataset.product);if(s)openDetail("story",s.dataset.story)});
document.getElementById("detailClose").addEventListener("click",()=>closeModal("detailModal"));
document.getElementById("detailModal").addEventListener("click",e=>{if(e.target.id==="detailModal")closeModal("detailModal")});
document.getElementById("modalClose").addEventListener("click",()=>closeModal("authModal"));
document.getElementById("authModal").addEventListener("click",e=>{if(e.target.id==="authModal")closeModal("authModal")});
function showLogin(){const modal=document.getElementById("authModal");modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open")}
document.getElementById("loginOpen").addEventListener("click",showLogin);
document.getElementById("loginForm").addEventListener("submit",e=>{
 e.preventDefault();const form=e.currentTarget;const values=Object.fromEntries(new FormData(form));const email=String(values.email||"").trim().toLowerCase();const password=String(values.password||"");const msg=document.getElementById("authMessage");
 if(email!=="caesarramandhika@gmail.com"||password!=="12345678"){msg.textContent="Email atau password admin salah.";return}
 localStorage.setItem("jg_session",JSON.stringify({email,name:"Administrator",role:"admin",loginAt:new Date().toISOString()}));localStorage.setItem("jh_token","demo-session");window.location.href="/admin.html";
});
document.getElementById("menuToggle").addEventListener("click",()=>{const nav=document.getElementById("mainNav"),button=document.getElementById("menuToggle"),open=nav.classList.toggle("nav-open");button.setAttribute("aria-expanded",String(open));button.textContent=open?"×":"☰"});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>{document.getElementById("mainNav").classList.remove("nav-open");document.getElementById("menuToggle").setAttribute("aria-expanded","false");document.getElementById("menuToggle").textContent="☰"}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal("detailModal");closeModal("authModal")}});
const reviewList=document.getElementById("reviewList");
const reviewForm=document.getElementById("reviewForm");
const demoReviews=[
 {name:"Made",rating:5,message:"Pengalaman seru untuk menikmati sisi lain Bali. Informasi aktivitasnya mudah dipahami.",date:"Contoh review"},
 {name:"Ayu",rating:5,message:"Suka dengan pilihan aktivitas outdoor dan nuansa lokal yang ditampilkan.",date:"Contoh review"}
];
function getReviews(){try{return JSON.parse(localStorage.getItem("jg_reviews")||"null")||demoReviews}catch{return demoReviews}}
function renderReviews(){
 const reviews=getReviews();
 reviewList.innerHTML=reviews.length?reviews.map(r=>'<article class="review-card"><div class="review-top"><strong>'+escapeHtml(r.name)+'</strong><span class="review-stars" aria-label="'+Number(r.rating)+' dari 5 bintang">'+("★".repeat(Math.max(1,Math.min(5,Number(r.rating)||5))))+("☆".repeat(5-Math.max(1,Math.min(5,Number(r.rating)||5))))+'</span></div><p>'+escapeHtml(r.message)+'</p><small>'+escapeHtml(r.date||"Pengunjung")+'</small></article>').join(""):'<p class="empty-state">Belum ada review. Jadilah yang pertama berbagi pengalaman.</p>';
}
reviewForm.addEventListener("submit",e=>{
 e.preventDefault();
 const values=Object.fromEntries(new FormData(reviewForm));
 const reviews=getReviews();
 reviews.unshift({name:String(values.name).trim(),rating:Number(values.rating),message:String(values.message).trim(),date:new Date().toLocaleDateString("id-ID")});
 try{localStorage.setItem("jg_reviews",JSON.stringify(reviews.slice(0,30)));document.getElementById("reviewMessage").textContent="Terima kasih! Review tersimpan di browser ini.";reviewForm.reset();renderReviews()}
 catch{document.getElementById("reviewMessage").textContent="Penyimpanan browser penuh atau tidak tersedia."}
});
document.getElementById("year").textContent=new Date().getFullYear();
render();
renderReviews();
