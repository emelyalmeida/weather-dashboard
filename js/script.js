const API_KEY = "";
const CITIES = {
  "Mongaguá, SP":{lat:-24.09,lon:-46.62,t:26},"Praia Grande, SP":{lat:-24.0,lon:-46.41,t:26},"São Paulo":{lat:-23.55,lon:-46.63,t:24},
  "Rio de Janeiro":{lat:-22.91,lon:-43.17,t:29},"Salvador":{lat:-12.97,lon:-38.5,t:30},"Belo Horizonte":{lat:-19.92,lon:-43.94,t:27},
  "Curitiba":{lat:-25.43,lon:-49.27,t:20},"Porto Alegre":{lat:-30.03,lon:-51.23,t:21},"Brasília":{lat:-15.78,lon:-47.93,t:28},"Recife":{lat:-8.05,lon:-34.88,t:30}
};
const POP=["São Paulo","Rio de Janeiro","Salvador","Belo Horizonte","Curitiba","Porto Alegre"];
const COND=[["☀️","Ensolarado"],["⛅","Parcialmente nublado"],["☁️","Nublado"],["🌧️","Chuva"],["⛈️","Tempestade"]];
const $=id=>document.getElementById(id);
let current="Mongaguá, SP";
function rng(seed){let s=0;for(const c of seed)s=(s*31+c.charCodeAt(0))>>>0;return()=>(s=(s*1664525+1013904223)>>>0)/4294967296}
function demo(name){
  const c=CITIES[name]||{t:25},r=rng(name+new Date().toDateString());
  const mk=(i)=>{const k=[0,0,1,1,2,3,4][Math.floor(r()*7)];const hi=Math.round(c.t+(r()*6-3)-(k>=3?3:0));return{k,hi,lo:hi-5-Math.round(r()*2)}};
  const days=Array.from({length:7},(_,i)=>mk(i));days[0].k=1;days[0].hi=c.t;days[0].lo=c.t-6;
  return{temp:c.t,feel:c.t+2,k:1,hum:Math.round(60+r()*25),wind:Math.round(8+r()*14),pres:Math.round(1008+r()*12),days};
}
async function real(name){
  const c=CITIES[name];const q=c?`lat=${c.lat}&lon=${c.lon}`:`q=${encodeURIComponent(name)}`;
  const u=`https://api.openweathermap.org/data/2.5/`,p=`&units=metric&lang=pt_br&appid=${API_KEY}`;
  const [w,f]=await Promise.all([fetch(`${u}weather?${q}${p}`).then(r=>r.json()),fetch(`${u}forecast?${q}${p}`).then(r=>r.json())]);
  const m=id=>id>=200&&id<300?4:id<600?3:id<700?3:id==800?0:id<803?1:2;
  const by={};f.list.forEach(x=>{const d=x.dt_txt.slice(0,10);(by[d]=by[d]||[]).push(x)});
  const days=Object.values(by).map(a=>({k:m(a[Math.floor(a.length/2)].weather[0].id),hi:Math.round(Math.max(...a.map(x=>x.main.temp_max))),lo:Math.round(Math.min(...a.map(x=>x.main.temp_min)))}));
  return{temp:Math.round(w.main.temp),feel:Math.round(w.main.feels_like),k:m(w.weather[0].id),cond:w.weather[0].description,hum:w.main.humidity,wind:Math.round(w.wind.speed*3.6),pres:w.main.pressure,days};
}
function labelDay(i){const d=new Date();d.setDate(d.getDate()+i);const n=d.toLocaleDateString("pt-BR",{weekday:"short"}).replace(".","");return[i==0?"Hoje":n[0].toUpperCase()+n.slice(1),d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})]}
function render(name,d){
  $("city").textContent=name;$("loc").textContent="📍 "+name;
  $("upd").textContent="🔄 Atualizado às "+new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
  $("emoji").textContent=COND[d.k][0];$("temp").textContent=d.temp+"°C";
  $("cond").textContent=d.cond?d.cond[0].toUpperCase()+d.cond.slice(1):COND[d.k][1];
  $("feel").textContent="Sensação térmica: "+d.feel+"°C";
  $("hum").textContent=d.hum+"%";$("wind").textContent=d.wind+" km/h";$("pres").textContent=d.pres+" hPa";
  $("days").innerHTML=d.days.map((x,i)=>{const[l,s]=labelDay(i);return`<div class="day"><div><b>${l}</b><small>${s}</small></div><div class="e">${COND[x.k][0]}</div><div class="t"><b>${x.hi}°</b><span>${x.lo}°</span></div></div>`}).join("");
  const dk=document.querySelectorAll("#pop .chip");dk.forEach(b=>b.classList.toggle("on",b.textContent==name));
  renderFavs();
}
async function load(name){
  current=name;show("home");let d;
  if(API_KEY){try{d=await real(name);$("note").textContent="";}catch(e){}}
  if(!d){d=demo(name);$("note").textContent="Dados de demonstração. Para previsões reais, adicione sua chave da OpenWeatherMap na constante API_KEY.";}
  render(name,d);
}
function favs(){try{return JSON.parse(localStorage.getItem("favs")||"[]")}catch(e){return[]}}
function setFavs(a){try{localStorage.setItem("favs",JSON.stringify(a))}catch(e){}window._f=a}
function renderFavs(){
  const a=window._f||favs();window._f=a;
  $("fav").textContent=a.includes(current)?"♥":"♡";
  $("cnt").textContent=a.length?"("+a.length+")":"";
  if($("favview").style.display!="none")renderFavView();
  $("favbox").style.display=a.length?"":"none";
  $("favs").innerHTML="";a.forEach(n=>{const b=document.createElement("button");b.className="chip";b.textContent=n;b.onclick=()=>load(n);$("favs").appendChild(b)});
}
function show(v){const f=v=="favs";$("favview").style.display=f?"":"none";document.querySelector(".grid").style.display=f?"none":"";$("nFav").classList.toggle("act",f);$("nHome").classList.toggle("act",!f);if(f)renderFavView()}
async function renderFavView(){
  const a=window._f||favs(),box=$("fcards");
  if(!a.length){box.innerHTML='<div class="empty">Você ainda não favoritou nenhuma cidade.<br>Abra uma cidade e toque no ♡ para salvá-la aqui.</div>';return}
  box.innerHTML="";
  for(const n of a){
    let d;if(API_KEY){try{d=await real(n)}catch(e){}}if(!d)d=demo(n);
    const c=document.createElement("div");c.className="fcard";
    c.innerHTML='<button class="rm" title="Remover">✕</button><div class="fn"></div><div class="fe">'+COND[d.k][0]+'</div><div class="ft">'+d.temp+'°C</div><small>'+(d.cond||COND[d.k][1])+' · '+d.days[0].hi+'° / '+d.days[0].lo+'°</small>';
    c.querySelector(".fn").textContent=n;
    c.onclick=()=>load(n);
    c.querySelector(".rm").onclick=e=>{e.stopPropagation();setFavs(a.filter(x=>x!=n));renderFavs()};
    box.appendChild(c);
  }
}
$("fav").onclick=()=>{let a=window._f||favs();a=a.includes(current)?a.filter(x=>x!=current):[...a,current];setFavs(a);renderFavs()};
POP.forEach(n=>{const b=document.createElement("button");b.className="chip";b.textContent=n;b.onclick=()=>load(n);$("pop").appendChild(b)});
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
function search(){const v=norm($("q").value.trim());if(!v)return;const m=Object.keys(CITIES).find(n=>norm(n).includes(v));$("sug").style.display="none";load(m||$("q").value.trim());$("q").value=""}
$("go").onclick=search;
$("q").onkeydown=e=>{if(e.key=="Enter")search()};
$("q").oninput=()=>{const v=norm($("q").value.trim());const m=v?Object.keys(CITIES).filter(n=>norm(n).includes(v)):[];
  $("sug").style.display=m.length?"block":"none";$("sug").innerHTML="";m.forEach(n=>{const d=document.createElement("div");d.textContent=n;d.onclick=()=>{$("q").value="";$("sug").style.display="none";load(n)};$("sug").appendChild(d)})};
$("geo").onclick=()=>{if(!navigator.geolocation)return;navigator.geolocation.getCurrentPosition(p=>{
  let best,bd=1e9;for(const[n,c]of Object.entries(CITIES)){const d=(c.lat-p.coords.latitude)**2+(c.lon-p.coords.longitude)**2;if(d<bd){bd=d;best=n}}load(best)},()=>{$("note").textContent="Não foi possível obter sua localização."})};
function setTheme(t){document.documentElement.dataset.theme=t;$("theme").textContent=t=="dark"?"☀️":"🌙"}
setTheme(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
$("theme").onclick=()=>setTheme(document.documentElement.dataset.theme=="dark"?"light":"dark");
load(current);
