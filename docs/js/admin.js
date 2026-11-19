(() => {
 const accounts={"caesarramandhika@gmail.com":"admin"};
 let session={};try{session=JSON.parse(localStorage.getItem("jg_session")||"{}")}catch{}
 if(session.role!=="admin"||accounts[session.email]!=="admin"){alert("Halaman ini khusus admin. Silakan login menggunakan akun admin.");location.href="./index.html";return}
 const $=id=>document.getElementById(id),keys={experience:"jg_experiences",place:"jg_places",event:"jg_events"};
 const seeds={
 experience:[
 {id:1,name:"Jimbaran Coastal Jeep Trail",category_name:"Jeep Offroad",description:"Jelajahi jalur pesisir dan panorama Bali Selatan bersama pemandu lokal.",price:425000,duration:"2-3 jam",location:"Jimbaran, Bali",image_url:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1000"},
 {id:2,name:"Mount Batur Sunrise Jeep",category_name:"Sunrise Tour",description:"Nikmati matahari terbit dan lanskap Gunung Batur dengan Jeep 4x4.",price:550000,duration:"4-5 jam",location:"Kintamani, Bali",image_url:"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000"},
 {id:3,name:"Ubud Jungle ATV Ride",category_name:"ATV Adventure",description:"Jelajahi trek alam dan jalur hijau menggunakan ATV.",price:325000,duration:"1,5-2 jam",location:"Ubud, Bali",image_url:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000"}
 ],
 place:[
 {id:1,name:"Colabo Cafe",category:"Food & Drink",description:"Cafe dan ruang berkumpul untuk menikmati kopi dan kuliner.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000"},
 {id:2,name:"Padel Club Indonesia - Bali",category:"Sports & Wellness",description:"Fasilitas padel untuk olahraga dan aktivitas bersama.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1000"},
 {id:3,name:"Jimba Arthall",category:"Arts & Creative",description:"Ruang seni, ide, pameran, dan pertunjukan komunitas.",location:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000"}
 ],
 event:[
 {id:1,title:"Community Weekend at Jimbaran Grove",category:"Community",description:"Agenda komunitas untuk bertemu, berbagi ide, dan menikmati aktivitas bersama.",venue:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000"},
 {id:2,title:"Creative Market & Local Gathering",category:"Arts & Creative",description:"Pasar kreatif yang mempertemukan komunitas dan pelaku lokal.",venue:"Jimbaran Grove, Bali",image_url:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000"}
 ]};
 const read=type=>{try{const v=JSON.parse(localStorage.getItem(keys[type]));return Array.isArray(v)?v:seeds[type]}catch{return seeds[type]}};
 const write=(type,rows)=>localStorage.setItem(keys[type],JSON.stringify(rows));
 Object.keys(keys).forEach(type=>{if(!Array.isArray(JSON.parse(localStorage.getItem(keys[type])||"null")))write(type,seeds[type])});
 const all=()=>Object.keys(keys).flatMap(type=>read(type).map(item=>({...item,_type:type})));
 const money=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n||0));
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function refresh(){
  $("countExperiences").textContent=read("experience").length;$("countPlaces").textContent=read("place").length;$("countEvents").textContent=read("event").length;
  const filter=$("listFilter").value,items=all().filter(x=>filter==="all"||x._type===filter);
  $("contentList").innerHTML=items.length?items.map(x=>{const title=x.name||x.title,category=x.category_name||x.category||"General";return `<article class="admin-item"><img src="${esc(x.image_url||"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500")}" alt=""><div class="admin-item-copy"><small>${esc(x._type.toUpperCase())} · ${esc(category)}</small><h3>${esc(title)}</h3><p>${esc(x.description||"")}</p><span>${esc(x.location||x.venue||"Jimbaran Grove, Bali")}${x._type==="experience"?" · "+money(x.price):""}</span></div><div class="admin-item-actions"><button type="button" data-edit="${x._type}:${x.id}">Edit</button><button type="button" class="danger" data-delete="${x._type}:${x.id}">Hapus</button></div></article>`}).join(""):'<p class="empty-state">Belum ada konten pada kategori ini.</p>';
 }
 function reset(){ $("contentForm").reset();$("editId").value="";$("formTitle").textContent="Tambah konten baru";$("saveButton").textContent="Simpan konten";$("cancelEdit").hidden=true;$("priceField").hidden=$("contentType").value!=="experience"}
 $("contentType").addEventListener("change",()=>{$("priceField").hidden=$("contentType").value!=="experience"});
 $("contentForm").addEventListener("submit",e=>{
  e.preventDefault();const type=$("contentType").value,rows=read(type),id=$("editId").value;
  const item={id:id?Number(id):Math.max(0,...rows.map(x=>Number(x.id)||0))+1,description:$("contentDescription").value.trim(),image_url:$("contentImage").value.trim()};
  if(type==="experience")Object.assign(item,{name:$("contentName").value.trim(),category_name:$("contentCategory").value.trim(),location:$("contentLocation").value.trim()||"Jimbaran, Bali",price:Math.max(0,Number($("contentPrice").value)||0)});
  if(type==="place")Object.assign(item,{name:$("contentName").value.trim(),category:$("contentCategory").value.trim(),location:$("contentLocation").value.trim()||"Jimbaran Grove, Bali"});
  if(type==="event")Object.assign(item,{title:$("contentName").value.trim(),category:$("contentCategory").value.trim(),venue:$("contentLocation").value.trim()||"Jimbaran Grove, Bali"});
  if(id){const index=rows.findIndex(x=>Number(x.id)===Number(id));if(index>=0)rows[index]=item}else rows.push(item);
  write(type,rows);$("formFeedback").textContent=id?"Konten berhasil diperbarui.":"Konten berhasil ditambahkan.";reset();refresh();
 });
 $("contentList").addEventListener("click",e=>{
  const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");
  if(edit){const [type,id]=edit.dataset.edit.split(":"),item=read(type).find(x=>Number(x.id)===Number(id));if(!item)return;$("contentType").value=type;$("contentType").dispatchEvent(new Event("change"));$("editId").value=item.id;$("contentName").value=item.name||item.title;$("contentCategory").value=item.category_name||item.category||"";$("contentLocation").value=item.location||item.venue||"";$("contentPrice").value=item.price||0;$("contentDescription").value=item.description||"";$("contentImage").value=item.image_url||"";$("formTitle").textContent="Edit konten";$("saveButton").textContent="Simpan perubahan";$("cancelEdit").hidden=false;window.scrollTo({top:350,behavior:"smooth"})}
  if(del&&confirm("Hapus konten ini?")){const [type,id]=del.dataset.delete.split(":");write(type,read(type).filter(x=>Number(x.id)!==Number(id)));refresh()}
 });
 $("cancelEdit").addEventListener("click",reset);$("listFilter").addEventListener("change",refresh);
 $("logoutButton").addEventListener("click",()=>{localStorage.removeItem("jg_session");location.href="./index.html"});
 refresh();
})();