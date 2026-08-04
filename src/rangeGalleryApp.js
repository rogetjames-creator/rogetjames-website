// Shared engine for the full-screen "The Range" overview galleries (Wall Art + Sculpture).
// Both pages call mountRangeGallery(opts) so they behave identically — only the data,
// label, current nav item and catalogue differ.
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { netlifyImg } from "./utils/img";
import CatPageViewer from "./components/CatPageViewer";
import { RANGE_CSS } from "./components/rangeGalleryStyles";
import { PIECE_SIZES, SIZE_TIERS, MATERIAL_OPTIONS, priceFor, checkWA, getState, STATE_NAMES } from "./data/pricing";
import { loadBasket, saveBasket } from "./utils/quoteBasket";
import { loadPostcode, savePostcode } from "./utils/postcode";

let _stylesInjected = false;

export function mountRangeGallery({ rootId, data, label, noun = "art", section, catPages, catLabel }) {
  const IMGS   = data.imgs.map((p) => netlifyImg(p, { w: 1200, q: 74 }));
  const THUMBS = data.imgs.map((p) => netlifyImg(p, { w: 220, q: 62 }));
  const RANGES = data.ranges;

  if (!_stylesInjected) {
    _stylesInjected = true;
    const s1 = document.createElement("style"); s1.textContent = RANGE_CSS; document.head.appendChild(s1);
    const s2 = document.createElement("style");
    s2.textContent = `
.pill-cat{background:none;cursor:pointer;font-family:inherit}
.thumbs{padding:11px 2px}
.thumb{margin-top:0}
.mpanel::before{content:"";position:absolute;top:-14px;left:0;right:0;height:14px}
.capline{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;align-self:center;max-width:100%}
.capline .dname{grid-column:2;text-align:center}
.capline .detail-btn{grid-column:3;justify-self:end}
@media(max-width:560px){.capline{grid-template-columns:1fr auto 1fr}.capline .detail-btn{padding:7px 12px}}`;
    document.head.appendChild(s2);
  }

  const cur = (s) => section === s ? " current" : "";
  document.getElementById(rootId).innerHTML = `<div class="top">
  <div class="nav-l">
    <div class="menu-wrap">
      <button class="burger" id="menuBtn" aria-label="Menu" aria-haspopup="true"><span></span><span></span><span></span></button>
      <div class="mpanel" id="menu" role="menu">
        <a class="mitem" href="/">Home</a>
        <a class="mitem${cur("wall-art")}" href="/wall-art">Wall Art</a>
        <a class="mitem${cur("sculpture")}" href="/sculpture">Sculpture</a>
        <a class="mitem" href="/screens">Screens</a>
        <button class="mitem" id="catMenuBtn" type="button">Catalogue</button>
        <div class="mdiv"></div>
        <a class="mitem" href="/#bespoke">Bespoke</a>
        <a class="mitem" href="/#process">Process</a>
        <a class="mitem" href="/#services">Services</a>
        <a class="mitem" href="/#about">About</a>
        <a class="mitem" href="/#contact">Contact</a>
      </div>
    </div>
    <a class="logo" href="/" aria-label="ROGETjames — home">ROGET<i>james</i></a>
  </div>
  <span class="now" id="now">${label} &middot; The Range</span>
  <div class="nav-r">
    <button class="qpill" id="qpill" aria-label="View your quote">Quote <span class="qnum" id="qnum">0</span></button>
    <button class="pill-cat" id="catBtn" type="button">View catalogue</button>
    <a class="x-esc" href="/" aria-label="Close — back to site">&#10005;</a>
  </div>
</div>

<section class="intro">
  <div class="intro-top">
    <div class="mark"><span class="fl l"></span><span class="fl r"></span><img src="/.netlify/images?url=%2Fimages%2Froj-logo.png&w=240&fm=webp&q=90" alt="ROGETjames"></div>
    <span class="walllabel">${label}</span>
  </div>
  <div class="band">
    <div class="rule" aria-hidden="true"></div>
    <div class="win" aria-hidden="true"><div class="strip" id="introStrip"></div></div>
    <div class="rule" aria-hidden="true"></div>
    <div class="band-title"><h1>The <span class="w2">Range</span></h1></div>
  </div>
  <div class="intro-bot">
    <p class="rangecount">${RANGES.length} ranges &middot; scroll to browse &middot; hover to preview &middot; tap for details &amp; prices</p>
    <div class="chev">&#8964;</div>
  </div>
</section>

<main id="app"></main>

<button class="toTop" id="toTop">&#8593;&nbsp; Top</button>

<div class="ov" id="ov" role="dialog" aria-modal="true">
  <div class="sheet">
    <button class="close" id="ovClose" aria-label="Close">&#10005;</button>
    <div class="sh-media">
      <div class="sh-stage"><img id="ovImg" alt=""></div>
      <div class="sh-thumbs" id="ovThumbs"></div>
    </div>
    <div class="sh-info">
      <div class="sh-eyebrow" id="ovRange"></div>
      <h2 class="sh-name" id="ovName"></h2>
      <p class="sh-sub" id="ovSub"></p>
      <div class="sh-block">
        <div class="sh-lab">Sizes — made to order &middot; select one</div>
        <div class="sh-sizes" id="ovSizes"></div>
      </div>
      <div class="gate">
        <p class="glab">Pricing</p>
        <p class="ghint" id="ghint">Choose a finish and enter your postcode to see pricing for your location.</p>
        <div class="sh-opts gfin" id="ovFinish">
          <button class="sh-chip" data-fin="Aluminium — Powder Coated">Aluminium — Powder Coated</button>
          <button class="sh-chip" data-fin="Natural Corten Steel">Natural Corten Steel</button>
        </div>
        <form id="gateForm">
          <input id="pc" inputmode="numeric" maxlength="4" placeholder="Postcode" aria-label="Postcode" autocomplete="off">
          <button class="go" type="submit">Show pricing</button>
        </form>
        <p class="gerr" id="gerr"></p>
        <div class="pout" id="pout">
          <p class="pregion" id="pregion"></p>
          <div id="prows"></div>
          <p class="pnote">Prices for your area. Fixings &amp; freight to be confirmed.</p>
        </div>
      </div>
      <div class="sh-block sh-actions">
        <button class="addq" id="addQ" disabled>Add to quote</button>
        <p class="addq-hint" id="addqHint">Select a finish and a size to add to your quote.</p>
      </div>
    </div>
  </div>
</div>

<div class="qov" id="qov" role="dialog" aria-modal="true">
  <div class="qsheet">
    <div class="qhead"><h3>Your quote</h3><button class="close" id="qClose" aria-label="Close">&#10005;</button></div>
    <div class="qlist" id="qlist"></div>
    <div class="qfoot">
      <button class="qreq" id="qReq">Request quote &rarr;</button>
      <p class="qfnote">We'll prepare a quote for these pieces for your location.</p>
    </div>
  </div>
</div>

<div id="catRoot"></div>`;

  try{history.scrollRestoration='manual';}catch{/* ignore */}
  window.scrollTo(0,0);
  window.addEventListener('load',()=>window.scrollTo(0,0));
  const app=document.getElementById('app'), now=document.getElementById('now');
  const nowDefault = `${label} · The Range`;
  const twoTone = txt => txt.split(' ').map((w,i)=>`<span class="${i===0?'w1':'w2'}">${w}</span>`).join(' ');
  function ensureVisible(box, el){
    if(!box.classList.contains('of')) return;
    const l=box.scrollLeft, rr=l+box.clientWidth, a=el.offsetLeft, b=a+el.offsetWidth;
    if(b>rr) box.scrollTo({left:b-box.clientWidth+18});
    else if(a<l) box.scrollTo({left:a-18});
  }
  function fitThumbs(box){ const of=box.scrollWidth>box.clientWidth+2; box.classList.toggle('of',of); box.parentElement.classList.toggle('of',of); }
  const thumbBoxes=[], posterEls=[], capAligners=[];
  RANGES.forEach((r,ri)=>{
    const sec=document.createElement('section');
    sec.className='poster'; sec.dataset.label=r.label; sec.dataset.idx=(ri+1);
    const idx=String(ri+1).padStart(2,'0'), tot=String(RANGES.length).padStart(2,'0');
    sec.innerHTML=`
      <div class="p-head">
        <span class="p-idx">${idx}<span class="of"> / ${tot}</span></span>
        <h2 class="p-name">${twoTone(r.label)}</h2>
        <span class="p-count">${r.count} design${r.count!==1?'s':''}</span>
      </div>
      <div class="stage"><img alt=""></div>
      <div class="capline"><span class="dname"></span><button class="detail-btn">Details &amp; prices &rarr;</button></div>
      <div class="thumbs-wrap"><div class="thumbs"></div></div>`;
    const stImg=sec.querySelector('.stage img'), dn=sec.querySelector('.dname'), tw=sec.querySelector('.thumbs');
    const capline=sec.querySelector('.capline');
    function alignCap(){ const w=stImg.getBoundingClientRect().width; if(w>4) capline.style.width=Math.round(w)+'px'; }
    capAligners.push(alignCap);
    let curP={d:0,v:0};
    function show(dd,vv){
      curP={d:dd,v:vv};
      const des=r.designs[dd];
      stImg.style.opacity=0;
      requestAnimationFrame(()=>{ stImg.src=IMGS[des.imgs[vv]]; stImg.onload=()=>{ stImg.style.opacity=1; alignCap(); }; });
      const extra=des.imgs.length>1?` &middot; ${vv+1}/${des.imgs.length}`:'';
      dn.innerHTML=`<b>${des.n}</b>${extra}`;
      let act=null;
      tw.querySelectorAll('.thumb').forEach(t=>{const on=(+t.dataset.d===dd&&+t.dataset.v===vv);t.classList.toggle('active',on);if(on)act=t;});
      if(act) ensureVisible(tw,act);
    }
    r.flat.forEach(([dd,vv])=>{
      const t=document.createElement('div');
      t.className='thumb'+(vv>0?' var':''); t.dataset.d=dd; t.dataset.v=vv; t.title=r.designs[dd].n;
      const im=document.createElement('img'); im.src=THUMBS[r.designs[dd].imgs[vv]]; im.alt=r.designs[dd].n; t.appendChild(im);
      t.addEventListener('mouseenter',()=>show(dd,vv));
      t.addEventListener('click',()=>show(dd,vv));
      tw.appendChild(t);
    });
    function step(dir){
      const i=r.flat.findIndex(([d,v])=>d===curP.d&&v===curP.v);
      const n=(i+dir+r.flat.length)%r.flat.length;
      const [nd,nv]=r.flat[n]; show(nd,nv);
    }
    // Mobile: finger-swipe the big image left/right to browse; tap = next.
    let _sx=0,_sy=0,_swiped=false;
    const stage=sec.querySelector('.stage');
    stage.addEventListener('touchstart',e=>{ const t=e.changedTouches[0]; _sx=t.clientX; _sy=t.clientY; _swiped=false; },{passive:true});
    stage.addEventListener('touchend',e=>{ const t=e.changedTouches[0], dx=t.clientX-_sx, dy=t.clientY-_sy;
      if(Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)*1.4){ _swiped=true; step(dx<0?1:-1); } },{passive:true});
    stImg.addEventListener('click',()=>{ if(_swiped){ _swiped=false; return; } step(1); });
    sec.querySelector('.detail-btn').addEventListener('click',()=>openDetail(ri,curP.d,curP.v));
    app.appendChild(sec); posterEls.push(sec); thumbBoxes.push(tw);
    const [d0,v0]=r.flat[0]; show(d0,v0);
    fitThumbs(tw);
  });
  window.addEventListener('resize',()=>{ thumbBoxes.forEach(fitThumbs); capAligners.forEach(f=>f()); });
  requestAnimationFrame(()=>thumbBoxes.forEach(fitThumbs));

  const strip=document.getElementById('introStrip');
  if(strip){
    const TILE=220; // 208px tile + 12px gap
    // Wall Art (many ranges) keeps its range-cover strip; small collections (Sculpture) use
    // every image so the row is just as full — same tiles, gaps and speed as Wall Art.
    const shuffle=(a)=>{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
    const paths = RANGES.length>=8
      ? RANGES.map(r=>{const [d,v]=r.flat[0];return data.imgs[r.designs[d].imgs[v]];})
      : shuffle(data.imgs.slice());   // small collections (Sculpture): random mix of the range images
    const covers = paths.map(p=>netlifyImg(p,{w:440,q:72}));
    // Pad one "half" so it's wider than the screen — the -50% loop then runs seamlessly (circular),
    // never showing an empty gap when there are only a few images.
    const minHalf=Math.max(covers.length, Math.ceil((window.innerWidth*1.4)/TILE)+1);
    let half=[]; while(half.length<minHalf) half=half.concat(covers);
    half.concat(half).forEach(src=>{const el=document.createElement('div');el.className='tile';const im=document.createElement('img');im.loading='lazy';im.src=src;im.alt='';el.appendChild(im);strip.appendChild(el);});
    // Constant scroll speed (~80px/s) regardless of tile count — so it never crawls.
    strip.style.animationDuration=Math.max(24,Math.round((half.length*TILE)/80))+'s';
  }

  const menu=document.getElementById('menu'), menuBtn=document.getElementById('menuBtn'), menuWrap=menuBtn.parentElement;
  const openMenu=()=>{ menu.classList.add('open'); menuBtn.classList.add('open'); };
  const closeMenu=()=>{ menu.classList.remove('open'); menuBtn.classList.remove('open'); };
  let menuTimer;
  const scheduleClose=()=>{ clearTimeout(menuTimer); menuTimer=setTimeout(closeMenu,140); };
  const cancelClose=()=>clearTimeout(menuTimer);
  menuBtn.addEventListener('click',e=>{ e.stopPropagation(); menu.classList.contains('open')?closeMenu():openMenu(); });
  // open on hover (desktop); a transparent CSS bridge + close-delay keep it open across the gap
  menuWrap.addEventListener('mouseenter',()=>{ cancelClose(); openMenu(); });
  menuWrap.addEventListener('mouseleave',scheduleClose);
  menu.addEventListener('mouseenter',cancelClose);
  menu.addEventListener('mouseleave',scheduleClose);
  document.addEventListener('click',e=>{ if(!menu.contains(e.target)&&!menuBtn.contains(e.target)) closeMenu(); });
  document.getElementById('catMenuBtn').addEventListener('click',()=>{ closeMenu(); openCat(); });

  const ov=document.getElementById('ov'), ovImg=document.getElementById('ovImg'),
        ovThumbs=document.getElementById('ovThumbs'), ovName=document.getElementById('ovName'),
        ovRange=document.getElementById('ovRange'), ovSub=document.getElementById('ovSub'),
        ovFinish=document.getElementById('ovFinish'), ovSizes=document.getElementById('ovSizes'),
        addQ=document.getElementById('addQ'), addqHint=document.getElementById('addqHint'),
        gateForm=document.getElementById('gateForm'), pc=document.getElementById('pc'),
        gerr=document.getElementById('gerr'), pout=document.getElementById('pout'), ghint=document.getElementById('ghint'),
        pregion=document.getElementById('pregion'), prows=document.getElementById('prows');
  const qpill=document.getElementById('qpill'), qnum=document.getElementById('qnum'),
        qov=document.getElementById('qov'), qlist=document.getElementById('qlist');
  let selFinish=null, selSize=null, curDes=null, curRange='', curImg='', quote=loadBasket(), curTiers=SIZE_TIERS, postcodeInfo=loadPostcode();
  const pcLocked = ()=> !!(postcodeInfo && postcodeInfo.postcode);
  const matId = ()=> /corten/i.test(selFinish||'') ? 'corten' : 'aluminium';
  const regionOf = (info)=> STATE_NAMES[info.state] || info.state || 'Australia';
  function setOvImg(des,vv){ ovImg.src=IMGS[des.imgs[vv]]; curImg=THUMBS[des.imgs[vv]]; ovThumbs.querySelectorAll('.sh-th').forEach((t,j)=>t.classList.toggle('active',j===vv)); }
  function renderPrices(){
    if(!pcLocked() || !selFinish){ pout.style.display='none'; return; }
    const isWA=postcodeInfo.isWA, mid=matId();
    pregion.textContent = regionOf(postcodeInfo) + ' — ' + selFinish;
    prows.innerHTML = curTiers.map(t=>{
      const p=priceFor(t,mid,isWA);
      return `<div class="prow"><span>${t.label}${t.label!==t.dims?' &middot; '+t.dims:''}</span><b>${p?('A$'+p.toLocaleString()):'POA'}</b></div>`;
    }).join('');
    pout.style.display='block';
  }
  function updateAddState(){
    const ok=selFinish&&selSize!=null;
    addQ.disabled=!ok;
    addqHint.textContent = ok ? 'Ready — adds this design, finish and size to your quote.'
      : !selFinish ? 'Select a finish to add to your quote.' : 'Select a size to add to your quote.';
  }
  ovFinish.querySelectorAll('.sh-chip').forEach(c=>c.addEventListener('click',()=>{
    selFinish=c.dataset.fin;
    ovFinish.querySelectorAll('.sh-chip').forEach(x=>x.classList.toggle('sel',x===c));
    gerr.textContent=''; updateAddState();
    renderPrices();
  }));
  ovSizes.addEventListener('click',(e)=>{
    const b=e.target.closest('.sh-size'); if(!b) return;
    selSize=+b.dataset.i;
    ovSizes.querySelectorAll('.sh-size').forEach(x=>x.classList.toggle('sel',x===b));
    updateAddState();
  });
  function gateSetup(){
    pout.style.display='none'; gerr.textContent='';
    if(pcLocked()){
      gateForm.style.display='none';
      ghint.textContent = `Prices for ${regionOf(postcodeInfo)}. Choose a finish.`;
    } else {
      gateForm.style.display='flex'; pc.value='';
      ghint.textContent = 'Choose a finish, then enter your postcode to see pricing for your area.';
    }
  }
  function openDetail(ri,dd,vv){
    const des=RANGES[ri].designs[dd];
    ovRange.textContent=RANGES[ri].label; ovName.textContent=des.n;
    ovSub.textContent=des.imgs.length>1?`${des.imgs.length} images`:`Laser-cut ${noun}`;
    ovThumbs.innerHTML='';
    des.imgs.forEach((gi,j)=>{const t=document.createElement('div');t.className='sh-th';const im=document.createElement('img');im.src=THUMBS[gi];im.alt='';t.appendChild(im);t.addEventListener('click',()=>setOvImg(des,j));ovThumbs.appendChild(t);});
    setOvImg(des,vv||0);
    curDes=des; curRange=RANGES[ri].label;
    curTiers = PIECE_SIZES[des.pk||des.n] || SIZE_TIERS;
    ovSizes.innerHTML = curTiers.map((t,i)=>`<button class="sh-size${i===0?' sel':''}" data-i="${i}"><span><b>${t.label}</b></span><span>${t.dims}</span></button>`).join('');
    selFinish=null; ovFinish.querySelectorAll('.sh-chip').forEach(x=>x.classList.remove('sel'));
    selSize = curTiers.length ? 0 : null;
    addQ.classList.remove('added'); addQ.textContent='Add to quote';
    gateSetup(); updateAddState();
    ov.classList.add('open'); document.body.classList.add('locked');
  }
  function closeDetail(){ ov.classList.remove('open'); document.body.classList.remove('locked'); }
  document.getElementById('ovClose').addEventListener('click',closeDetail);
  ov.addEventListener('click',e=>{ if(e.target===ov) closeDetail(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeDetail(); closeQuote(); closeCat(); menu.classList.remove('open'); menuBtn.classList.remove('open'); } });
  gateForm.addEventListener('submit',e=>{
    e.preventDefault();
    if(!selFinish){ gerr.textContent='Select a finish first.'; return; }
    const v=(pc.value||'').trim();
    if(!/^\d{4}$/.test(v)){ gerr.textContent='Enter a 4-digit Australian postcode.'; return; }
    postcodeInfo = { postcode:v, isWA:checkWA(v), state:getState(v), isAdmin:false };
    savePostcode(postcodeInfo);
    gerr.textContent=''; gateForm.style.display='none';
    ghint.textContent = `Prices for ${regionOf(postcodeInfo)}. Choose a finish.`;
    renderPrices();
  });

  function updateQpill(){ qnum.textContent=quote.length; qpill.classList.toggle('show',quote.length>0); }
  addQ.addEventListener('click',()=>{
    if(!selFinish||selSize==null) return;
    const t=curTiers[selSize];
    const material=MATERIAL_OPTIONS.find(m=>m.id===matId());
    const dup=quote.some(q=>q.name===curDes.n && q.size?.id===t.id && q.material?.id===material?.id);
    if(!dup){
      quote.push({ id:`${curDes.n}-${Date.now()}`, name:curDes.n, series:curRange, size:t, material, img:curImg });
      saveBasket(quote); updateQpill();
    }
    addQ.classList.add('added'); addQ.textContent='Added to quote ✓';
    setTimeout(closeDetail,900);
  });
  function renderQuote(){
    if(!quote.length){ qlist.innerHTML='<div class="qempty">Your quote is empty. Open a design, choose a finish + size, then Add to quote.</div>'; return; }
    qlist.innerHTML='';
    quote.forEach((it,i)=>{
      const row=document.createElement('div'); row.className='qrow';
      const meta=[it.series, it.material?.label, it.size?`${it.size.label} — ${it.size.dims}`:''].filter(Boolean).join(' &middot; ');
      row.innerHTML=`<img src="${it.img}" alt=""><div class="qmeta"><div class="qn">${it.name}</div><div class="qd">${meta}</div></div><button class="qx" aria-label="Remove">&#10005;</button>`;
      row.querySelector('.qx').addEventListener('click',()=>{ quote.splice(i,1); saveBasket(quote); updateQpill(); renderQuote(); });
      qlist.appendChild(row);
    });
  }
  function openQuote(){ renderQuote(); qov.classList.add('open'); document.body.classList.add('locked'); }
  function closeQuote(){ qov.classList.remove('open'); document.body.classList.remove('locked'); }
  qpill.addEventListener('click',openQuote);
  document.getElementById('qClose').addEventListener('click',closeQuote);
  qov.addEventListener('click',e=>{ if(e.target===qov) closeQuote(); });
  document.getElementById('qReq').addEventListener('click',()=>{ window.location.href='/#contact'; });
  updateQpill();

  // Catalogue — the site's shared CatPageViewer (same viewer used everywhere else).
  const catRootEl=document.getElementById('catRoot');
  let catReactRoot=null;
  function openCat(){
    document.body.classList.add('locked');
    catReactRoot=createRoot(catRootEl);
    catReactRoot.render(createElement(CatPageViewer,{ pages:catPages, label:catLabel, onClose:closeCat, onCloseAll:()=>{ closeCat(); window.location.href='/'; } }));
  }
  function closeCat(){ if(catReactRoot){ catReactRoot.unmount(); catReactRoot=null; } document.body.classList.remove('locked'); }
  document.getElementById('catBtn').addEventListener('click',openCat);

  const toTop=document.getElementById('toTop');
  toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  function updTop(){ toTop.classList.toggle('show', window.innerHeight+window.scrollY >= document.documentElement.scrollHeight-60); }
  window.addEventListener('scroll',updTop,{passive:true}); updTop();

  const io=new IntersectionObserver(es=>{es.forEach(e=>{ if(e.isIntersecting){
    const l=e.target.dataset.label, i=e.target.dataset.idx;
    if(l) now.innerHTML=`<b>${String(i).padStart(2,'0')}</b> &nbsp; ${l}`; else now.textContent=nowDefault;
  }});},{threshold:.55});
  posterEls.forEach(s=>io.observe(s));
  const introEl=document.querySelector('.intro'); introEl.dataset.label=''; io.observe(introEl);
}
