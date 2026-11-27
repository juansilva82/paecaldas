(function(){
"use strict";
const W=window,$=s=>document.querySelector(s),FM=W.FM;
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=(n,d=0)=>Number(n).toLocaleString("es-CO",{minimumFractionDigits:d,maximumFractionDigits:d});
const M1=v=>"$"+fmt(v,v%1?1:0)+" M";
const MUN=W.PAE_MUNICIPIOS||[],byDane=Object.fromEntries(MUN.map(m=>[m.dane,m])),byName=Object.fromEntries(MUN.map(m=>[m.nombre,m]));
const norm=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();

/* ---------- contadores y apariciones ---------- */
function count(el){const t=parseFloat(el.dataset.count),d=+(el.dataset.dec||0),t0=performance.now(),dur=1400;
  function f(now){const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=fmt(t*e,d);if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
const io=("IntersectionObserver" in W)?new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;io.unobserve(el);
  if(el.dataset.count!=null)count(el);else{el.classList.add("in");el.querySelectorAll(".tr i[data-w]").forEach(i=>i.style.width=i.dataset.w)}}),{threshold:.2}):null;
function watch(){document.querySelectorAll("[data-count],.reveal").forEach(el=>{if(io)io.observe(el);else{el.classList.add("in");if(el.dataset.count!=null)el.textContent=fmt(+el.dataset.count,+(el.dataset.dec||0))}})}

/* ---------- mapa ---------- */
const VIV=W.PAE_VIV_EDAN||{};
function color(v,max){if(v==null)return"#e6ebe8";const t=Math.log(1+v)/Math.log(1+max);
  const a=[230,242,236],b=[127,184,158],c=[17,90,62];const mix=(x,y,k)=>x.map((q,i)=>Math.round(q+(y[i]-q)*k));
  const r=t<.5?mix(a,b,t*2):mix(b,c,(t-.5)*2);return`rgb(${r.join(",")})`}
function drawMap(svg,onPick,selDane){const P=W.PAE_MAPA;if(!P||!svg)return;svg.setAttribute("viewBox",`0 0 ${P.w} ${P.h}`);
  const max=Math.max(...Object.values(VIV));let h=`<path d="${P.dep}" fill="none" stroke="#c6d3cc" stroke-width="1"/>`;
  for(const [d,o] of Object.entries(P.m)){const m=byDane[d];const v=m?VIV[m.nombre]:null;
    h+=`<path class="m${d===selDane?" sel":""}" data-d="${d}" d="${o.d}" fill="${color(v,max)}"><title>${esc(m?m.nombre:d)}: ${v!=null?fmt(v)+" viviendas afectadas":"sin dato"}</title></path>`}
  svg.innerHTML=h;
  svg.querySelectorAll("path.m").forEach(p=>{p.addEventListener("click",()=>onPick(p.dataset.d));
    p.addEventListener("mousemove",e=>{const tip=$("#tip");if(!tip||svg.id!=="map")return;const m=byDane[p.dataset.d];const r=svg.parentNode.getBoundingClientRect();
      tip.textContent=`${m?m.nombre:""} · ${fmt(VIV[m&&m.nombre]||0)} viviendas`;tip.style.left=(e.clientX-r.left+12)+"px";tip.style.top=(e.clientY-r.top-30)+"px";tip.style.opacity=1});
    p.addEventListener("mouseleave",()=>{const tip=$("#tip");if(tip)tip.style.opacity=0})})}

/* ---------- lo que ya hicimos ---------- */
function renderHecho(){const R=W.PAE_REC;if(!R)return;const tot=R.fuentes.reduce((a,f)=>a+f[1],0);
  $("#stack").innerHTML=R.fuentes.map(f=>`<i style="width:${f[1]/tot*100}%;background:${f[2]}" title="${esc(f[0])}"></i>`).join("");
  $("#fuentes").innerHTML=R.fuentes.map(f=>`<div><i style="background:${f[2]}"></i><span><b>${M1(f[1])}</b> · ${esc(f[0])}</span></div>`).join("");
  const st=s=>/ejecuci/i.test(s)?"":/transfer/i.test(s)?" c2":/adjudic/i.test(s)?" c3":" c4";
  $("#hechoL").innerHTML=R.hecho.map(h=>`<div class="it"><span class="chip${st(h[3])}">${esc(h[3])}</span><div class="val">${M1(h[1])}</div><h4>${esc(h[0])}</h4><p>${esc(h[2])}</p></div>`).join("")}

/* ---------- solicitud ---------- */
function renderSol(){const S=FM.sol.map(x=>({...x,p:x.n-x.g-x.y}));const D=FM.demo,dm=D.n*(D.min+D.max)/2;
  S.push({c:"Demoliciones",q:`${D.n} edificaciones; estimado a $${D.min}–${D.max} M por inmueble`,n:dm,g:0,y:0,p:dm});
  S.sort((a,b)=>b.p-a.p);const max=Math.max(...S.map(x=>x.n));
  $("#bars").innerHTML=S.map(x=>{const w=v=>(v/max*100).toFixed(2)+"%";
    return`<div class="bar"><div class="lb">${esc(x.c)}<small>${esc(x.q.replace(/\s*\([^)]*\)\s*$/,""))}</small></div>
    <div class="tr" title="Necesidad total ${M1(x.n)}"><i class="pide" data-w="${w(x.n)}"></i><i class="ya" data-w="${w(x.g+x.y)}"></i><i class="gob" data-w="${w(x.g)}"></i></div>
    <div class="v">${M1(x.p)}</div></div>`}).join("");
  const t26=S.reduce((a,x)=>a+x.p,0),mz=FM.maniz.nec-FM.maniz.fm;
  $("#tot26").textContent="$"+fmt(t26/1e6,2)+" billones";$("#totAll").textContent="$"+fmt((t26+mz)/1e6,2)+" billones"}

/* ---------- proyectos ---------- */
const STG=["Idea o plan","Estudios","Diseños o viabilidad","Radicado o en adjudicación","En ejecución"];
const stg=e=>/ejecuci/i.test(e)?5:/radicado|adjudic/i.test(e)?4:/viabilidad|dise[ñn]os(?! y)|fiducia/i.test(e)?3:/estudios/i.test(e)?2:1;
function projects(){const P=(FM.oxi||[]).map(o=>({nom:o.nom,mun:o.mun,val:o.val,est:o.est,st:o.n===10?1:stg(o.est),sec:o.sec,img:`/img/oxi/${o.img}-render.jpg`,desc:o.desc,via:"Obras por Impuestos",ben:o.ben}));
  P.push({nom:"Reserva Santa María: 680 apartamentos para familias damnificadas",mun:"Manizales · lote de la Gobernación",val:160733.1e6,est:"Lote en fiducia, con estudios y diseños",st:3,sec:"Vivienda",img:null,desc:"Proyecto de vivienda nueva en lote del Departamento, en fiducia y con estudios y diseños. Es el mayor componente del faltante de vivienda identificado por la Secretaría de Vivienda.",via:"Por financiar"});
  P.push({nom:"Vivienda urbana nueva en lotes ya disponibles: 282 viviendas",mun:"Viterbo 110 · Neira 48 · Pácora 40 · San José 34 · Aranzazu 30 · Risaralda 20",val:282*105.0543e6,est:"Lotes disponibles; Viterbo y Pácora en fiducia",st:2,sec:"Vivienda",img:null,desc:"Primera etapa de las 821 viviendas urbanas que faltan, sobre lotes ya identificados. Valor estimado con el costo unitario de la Secretaría de Vivienda (unos $105 M por vivienda).",via:"Por financiar",estim:1});
  P.push({nom:"29 viviendas rurales nuevas",mun:"San José 11 · Belalcázar 7 · Viterbo 5 · Neira 4 · Manzanares 2",val:1926.7e6,est:"En adjudicación",st:4,sec:"Vivienda",img:null,desc:"Proyecto BPID AMB-E-260098, financiado por el Fondo Departamental de Gestión del Riesgo. Muestra el modelo que se replica con 134 viviendas rurales pendientes.",via:"Financiado por la Gobernación"});
  P.push({nom:"Reconstrucción prioritaria de sedes educativas",mun:"26 municipios no certificados",val:120000e6,est:"Estudios y diseños contratados ($985 M)",st:2,sec:"Educación y primera infancia",img:null,desc:"47 sedes en riesgo grave (4.221 estudiantes) y 92 con estudiantes fuera de su aula. La Secretaría de Educación ya contrató los estudios y diseños de las soluciones definitivas.",via:"Por financiar"});
  P.push({nom:"Etapa 2 de la reposición del Hospital Santa Sofía: Urgencias, quirófanos, esterilización y hospitalización",mun:"Manizales · hospital departamental de tercer nivel",val:80000e6,est:"Fase 3, con viabilidad del Ministerio de Salud",st:3,sec:"Infraestructura hospitalaria",img:null,desc:"Único hospital público de tercer nivel de Caldas. El sismo dejó fuera de servicio el 40 % de su hospitalización general (27 camas) y trasladó Urgencias a Cuidado Intermedio. BPIN 2024000040003.",via:"Por financiar"});
  P.push({nom:"Recuperación del campus Palogrande de la Universidad Nacional (Plan Maestro)",mun:"Manizales · Universidad Nacional, sede Manizales",val:300000e6,est:"En estructuración: prefactibilidad, estudios y MGA",st:1,sec:"Educación superior",img:null,estim:true,desc:"Bloques de biblioteca y UNISALUD, administrativo, laboratorios, Torre de Estancias y posgrados. Valor preliminar sujeto a validación técnica; posible postulación a Obras por Impuestos para la Reconstrucción.",via:"Por financiar"});
  return P}
const SECG=s=>/hospital/i.test(s)?"Salud":/vivienda/i.test(s)?"Vivienda":/social|educa/i.test(s)?"Educación y primera infancia":"Equipamientos";
function renderProj(f){const P=projects();const cats=["Todos",...new Set(P.map(p=>SECG(p.sec)))];
  $("#filt").innerHTML=cats.map(c=>`<button type="button" class="${c===(f||"Todos")?"on":""}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  $("#filt").querySelectorAll("button").forEach(b=>b.onclick=()=>renderProj(b.dataset.c));
  const L=P.filter(p=>!f||f==="Todos"||SECG(p.sec)===f).sort((a,b)=>b.st-a.st||(b.val||0)-(a.val||0));
  $("#proj").innerHTML=L.map(p=>`<article class="pc">${p.img?`<div class="ph" style="background-image:url('${p.img}')"></div>`:`<div class="ph ph0 s-${SECG(p.sec).slice(0,3).toLowerCase()}"><span>${esc(SECG(p.sec))}</span><b>${esc(p.mun.split(" · ")[0])}</b></div>`}<div class="bd">
    <span class="chip${/Financiado/.test(p.via)?"":/Obras/.test(p.via)?" c2":" c3"}">${esc(p.via)}</span>
    <h4>${esc(p.nom)}</h4><div class="mu">${esc(p.mun)}</div>
    <div class="val">${p.val?M1(p.val/1e6)+(p.estim?" <small style='font:500 12px Inter,system-ui,sans-serif;color:#5b6775'>estimado</small>":""):"<span style='font:600 14px Inter,system-ui,sans-serif;color:#5b6775'>Valor por definir</span>"}</div>
    <p style="margin:0;font-size:13.5px;color:#46525e">${esc(p.desc.length>230?p.desc.slice(0,227)+"…":p.desc)}</p>
    <div class="mat" title="${esc(STG[p.st-1])}">${[1,2,3,4,5].map(i=>`<span class="${i<=p.st?"on":""}"></span>`).join("")}</div>
    <div class="matl"><span>Madurez: <b>${esc(STG[p.st-1])}</b></span><span>${esc(p.est)}</span></div></div></article>`).join("")}

/* ---------- cuentas ---------- */
function renderCuentas(){const C=FM.contraloria;const t=C.reduce((a,c)=>a+c[1],0);
  $("#contra").innerHTML=`<thead><tr><th>Contrato o acto</th><th class="r">Valor</th></tr></thead><tbody>${C.map(c=>`<tr><td>${esc(c[0])}</td><td class="r">${M1(c[1])}</td></tr>`).join("")}<tr><td><b>Total</b></td><td class="r"><b>${M1(t)}</b></td></tr></tbody>`}

/* ---------- municipio ---------- */
let selD="17614";
function edanOf(n){const E=W.PAE_EDAN23&&W.PAE_EDAN23.mun;if(!E)return null;return E[n]||E[Object.keys(E).find(k=>norm(k)===norm(n))]}
function rowOf(rows,n){return (rows||[]).find(r=>norm(r[0])===norm(n))}
function renderMun(d){selD=d;const m=byDane[d];if(!m)return;const n=m.nombre;$("#mun").value=d;
  const e=edanOf(n),r=rowOf(W.PAE_RUD&&W.PAE_RUD.rows,n),ag=rowOf(W.PAE_AGRO&&W.PAE_AGRO.rows,n),ed=W.PAE_EDU&&W.PAE_EDU.m[d],
    ah=W.PAE_AH&&W.PAE_AH.m[d],dm=rowOf(W.PAE_VIV&&W.PAE_VIV.dem,n),sb=FM.sub[n],dc=FM.dec[n],
    sal=(W.PAE_SALUD&&W.PAE_SALUD.pub||[]).filter(x=>norm(x[0])===norm(n)),salD=sal.filter(x=>x[3]!=="Sin afectaciones"),
    ox=(FM.oxi||[]).filter(o=>norm(o.mun).startsWith(norm(n)));
  const c=(v,l)=>v==null?"":`<div><b>${typeof v==="number"?fmt(v):v}</b><span>${l}</span></div>`;
  const viv=VIV[n];
  let h=`<h3>${esc(n)}</h3><div class="sr">Subregión ${esc(m.subregion)}${dc?` · Calamidad pública: Decreto ${esc(dc[0])}${dc[1]&&dc[1]!=="–"?` · Urgencia manifiesta: Decreto ${esc(dc[1])}`:""}`:" · No declaró calamidad pública"}</div><div class="mg">`+
    c(viv,"viviendas afectadas (EDAN)")+(e?c(e[2],"viviendas destruidas")+c(e[0],"familias afectadas"):"")+(r?c(r[2],"personas en el RUD"):"")+
    (ed?c(`${fmt(ed.af)} de ${fmt(ed.s)}`,"sedes educativas afectadas"):"")+(sal.length?c(`${salD.length} de ${sal.length}`,"sedes de salud pública con daño"):"")+
    (dm?c(dm[1],"edificaciones por demoler"):"")+(ah?c(ah.u,"unidades de ayuda humanitaria"):"")+
    (sb?c(sb[0],`subsidios de arriendo (${M1(sb[1]/1e6)})`):"")+(ag?c(ag[1],`fincas afectadas · ${fmt(ag[7])} beneficiaderos`):"")+`</div>`;
  if(ox.length)h+=`<div class="mp"><h4>Proyectos de Obras por Impuestos</h4><ul>${ox.map(o=>`<li>${esc(o.nom)} · ${o.val?M1(o.val/1e6):"valor por definir"} · <i>${esc(o.est)}</i></li>`).join("")}</ul></div>`;
  if(n==="Manizales")h+=`<p class="src">Manizales atiende su emergencia de forma independiente y reportó una necesidad de $2.220.000 M; el Fondo Milagro anunció $158.000 M para la ciudad.</p>`;
  if(n==="Aguadas")h+=`<p class="src">El único proceso de remoción en masa activo asociado al sismo está en el corregimiento de Arma.</p>`;
  $("#mpanel").innerHTML=h;drawMap($("#map2"),renderMun,d)}
function initMun(){const s=$("#mun");s.innerHTML=[...MUN].sort((a,b)=>a.nombre.localeCompare(b.nombre,"es")).map(m=>`<option value="${m.dane}">${esc(m.nombre)}</option>`).join("");
  s.onchange=()=>renderMun(s.value);renderMun(selD)}

/* ---------- navegación y modo presentación ---------- */
const secs=()=>[...document.querySelectorAll("section")];
function cur(){const y=window.scrollY+80;let i=0;secs().forEach((s,k)=>{if(s.offsetTop<=y)i=k});return i}
function go(k){const S=secs();k=Math.max(0,Math.min(S.length-1,k));window.scrollTo({top:S[k].offsetTop-(document.body.classList.contains("pres")?0:60),behavior:"smooth"})}
function pres(on){document.body.classList.toggle("pres",on);if(on&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});
  if(!on&&document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{})}
$("#pres").onclick=()=>pres(!document.body.classList.contains("pres"));$("#pexit").onclick=()=>pres(false);
$("#pnext").onclick=()=>go(cur()+1);$("#pprev").onclick=()=>go(cur()-1);
document.addEventListener("keydown",e=>{if(!document.body.classList.contains("pres"))return;if(["ArrowDown","PageDown"," ","ArrowRight"].includes(e.key)){e.preventDefault();go(cur()+1)}
  else if(["ArrowUp","PageUp","ArrowLeft"].includes(e.key)){e.preventDefault();go(cur()-1)}else if(e.key==="Escape")pres(false)});
const links=[...document.querySelectorAll("#nav a")];
window.addEventListener("scroll",()=>{const id=secs()[cur()].id;links.forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+id))},{passive:true});

/* ---------- imprimir ---------- */
const pr=$("#print");if(pr)pr.onclick=e=>{e.preventDefault();document.querySelectorAll(".reveal").forEach(el=>el.classList.add("in"));document.querySelectorAll(".tr i[data-w]").forEach(i=>i.style.width=i.dataset.w);
  document.querySelectorAll("[data-count]").forEach(el=>el.textContent=fmt(+el.dataset.count,+(el.dataset.dec||0)));setTimeout(()=>window.print(),300)};
window.addEventListener("beforeprint",()=>{document.querySelectorAll(".reveal").forEach(el=>el.classList.add("in"));document.querySelectorAll(".tr i[data-w]").forEach(i=>i.style.width=i.dataset.w);document.querySelectorAll("[data-count]").forEach(el=>el.textContent=fmt(+el.dataset.count,+(el.dataset.dec||0)))});

/* ---------- arranque ---------- */
try{drawMap($("#map"),d=>{renderMun(d);document.getElementById("municipios").scrollIntoView({behavior:"smooth"})})}catch(e){console.error(e)}
try{renderHecho()}catch(e){console.error(e)}
try{renderSol()}catch(e){console.error(e)}
try{renderProj()}catch(e){console.error(e)}
try{renderCuentas()}catch(e){console.error(e)}
try{initMun()}catch(e){console.error(e)}
watch();
})();
