// The live public Wall Art gallery at /wall-art — the approved "The Range" overview.
// Built from the approved mock-up; images streamed via the Netlify Image CDN.
// ROLLBACK: revert this file to `createRoot(...).render(<FeatureWall />)` (FeatureWall.jsx is untouched).
import "./index.css";
import { netlifyImg } from "./utils/img";
import { RANGE_DATA } from "./data/rangeData";
import { RANGE_CSS } from "./components/rangeGalleryStyles";
import { PIECE_SIZES, SIZE_TIERS, MATERIAL_OPTIONS, priceFor, checkWA, getState, STATE_NAMES } from "./data/pricing";
import { loadBasket, saveBasket } from "./utils/quoteBasket";
import { loadPostcode, savePostcode } from "./utils/postcode";

const IMGS   = RANGE_DATA.imgs.map((p) => netlifyImg(p, { w: 1200, q: 74 }));
const THUMBS = RANGE_DATA.imgs.map((p) => netlifyImg(p, { w: 220, q: 62 }));
const RANGES = RANGE_DATA.ranges;

const _style = document.createElement("style");
_style.textContent = RANGE_CSS;
document.head.appendChild(_style);

const _style2 = document.createElement("style");
_style2.textContent = `
.pill-cat{background:none;cursor:pointer;font-family:inherit}
/* room so a hovered/active thumb's lift+scale isn't clipped by the scroll container */
.thumbs{padding:11px 2px}
.thumb{margin-top:0}
/* design name centred beneath the image; Details & prices to the right */
.capline{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;align-self:center;max-width:100%}
.capline .dname{grid-column:2;text-align:center}
.capline .detail-btn{grid-column:3;justify-self:end}
@media(max-width:560px){.capline{grid-template-columns:1fr auto 1fr}.capline .detail-btn{padding:7px 12px}}
.catov{position:fixed;inset:0;z-index:115;display:none;flex-direction:column;background:rgba(8,7,6,.97);backdrop-filter:blur(8px)}
.catov.open{display:flex}
.cathead{display:flex;align-items:center;justify-content:space-between;padding:16px 26px;border-bottom:1px solid var(--hair);position:sticky;top:0;background:rgba(8,7,6,.9);backdrop-filter:blur(6px)}
.catttl{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--gold)}
.cathead .close{position:static;width:36px;height:36px;border-radius:50%;border:1px solid var(--hair);background:none;color:var(--cream);cursor:pointer;font-size:16px}
.catlist{flex:1;overflow-y:auto;padding:24px 16px 60px;display:flex;flex-direction:column;align-items:center;gap:16px}
.catlist img{width:min(900px,94vw);height:auto;border-radius:8px;box-shadow:0 16px 40px rgba(0,0,0,.5)}`;
document.head.appendChild(_style2);

document.getElementById("wall-art-root").innerHTML = `<div class="top">
  <div class="nav-l">
    <div class="menu-wrap">
      <button class="burger" id="menuBtn" aria-label="Menu" aria-haspopup="true"><span></span><span></span><span></span></button>
      <div class="mpanel" id="menu" role="menu">
        <a class="mitem" href="/">Home</a>
        <a class="mitem current" href="/wall-art">Wall Art</a>
        <a class="mitem" href="/sculpture">Sculpture</a>
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
  <span class="now" id="now">Wall Art &middot; The Range</span>
  <div class="nav-r">
    <button class="qpill" id="qpill" aria-label="View your quote">Quote <span class="qnum" id="qnum">0</span></button>
    <button class="pill-cat" id="catBtn" type="button">View catalogue</button>
    <a class="x-esc" href="/" aria-label="Close — back to site">&#10005;</a>
  </div>
</div>

<section class="intro">
  <div class="intro-top">
    <div class="mark"><span class="fl l"></span><span class="fl r"></span><img src="/.netlify/images?url=%2Fimages%2Froj-logo.png&w=240&fm=webp&q=90" alt="ROGETjames"></div>
    <span class="walllabel">Wall Art</span>
  </div>
  <div class="band">
    <div class="rule" aria-hidden="true"></div>
    <div class="win" aria-hidden="true"><div class="strip" id="introStrip"></div></div>
    <div class="rule" aria-hidden="true"></div>
    <div class="band-title"><h1>The <span class="w2">Range</span></h1></div>
  </div>
  <div class="intro-bot">
    <p class="rangecount">15 ranges &middot; scroll to browse &middot; hover to preview &middot; tap for details &amp; prices</p>
    <div class="chev">&#8964;</div>
  </div>
</section>

<main id="app"></main>

<button class="toTop" id="toTop">&#8593;&nbsp; Top</button>

<!-- Detail overlay -->
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

<!-- Quote basket -->
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

<!-- Wall Art catalogue -->
<div class="catov" id="catov" role="dialog" aria-modal="true">
  <div class="cathead"><span class="catttl">Wall Art Catalogue</span><button class="close" id="catClose" aria-label="Close">&#10005;</button></div>
  <div class="catlist" id="catlist"></div>
</div>`;

/* ---- ported interaction logic ---- */

try{history.scrollRestoration='manual';}catch{/* ignore */}
window.scrollTo(0,0);
window.addEventListener('load',()=>window.scrollTo(0,0));
const app=document.getElementById('app'), now=document.getElementById('now');
const twoTone = label => label.split(' ').map((w,i)=>`<span class="${i===0?'w1':'w2'}">${w}</span>`).join(' ');
function ensureVisible(box, el){
  if(!box.classList.contains('of')) return;          // only scroll when the row overflows
  const l=box.scrollLeft, r=l+box.clientWidth, a=el.offsetLeft, b=a+el.offsetWidth;
  if(b>r) box.scrollTo({left:b-box.clientWidth+18});
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
  // keep the caption (name + Details button) the same width as the displayed image,
  // so the button sits at the image's right edge — not the far screen edge.
  function alignCap(){ const w=stImg.getBoundingClientRect().width; if(w>4) capline.style.width=Math.round(w)+'px'; }
  capAligners.push(alignCap);
  let cur={d:0,v:0};
  function show(dd,vv){
    cur={d:dd,v:vv};
    const des=r.designs[dd];
    stImg.style.opacity=0;
    requestAnimationFrame(()=>{ stImg.src=IMGS[des.imgs[vv]]; stImg.onload=()=>{ stImg.style.opacity=1; alignCap(); }; });
    const extra=des.imgs.length>1?` &middot; ${vv+1}/${des.imgs.length}`:'';
    dn.innerHTML=`<b>${des.n}</b>${extra}`;
    let act=null;
    tw.querySelectorAll('.thumb').forEach(t=>{const on=(+t.dataset.d===dd&&+t.dataset.v===vv);t.classList.toggle('active',on);if(on)act=t;});
    if(act) ensureVisible(tw,act);
  }
  // thumbs follow the range-gallery flat order (AN uses AN_ORDER)
  r.flat.forEach(([dd,vv])=>{
    const t=document.createElement('div');
    t.className='thumb'+(vv>0?' var':''); t.dataset.d=dd; t.dataset.v=vv; t.title=r.designs[dd].n;
    const im=document.createElement('img'); im.src=THUMBS[r.designs[dd].imgs[vv]]; im.alt=r.designs[dd].n; t.appendChild(im);
    t.addEventListener('mouseenter',()=>show(dd,vv));
    t.addEventListener('click',()=>show(dd,vv));            // tap = browse the images, NOT open details
    tw.appendChild(t);
  });
  // tap the big image = advance to the next image in the range (easy mobile browsing)
  stImg.addEventListener('click',()=>{
    const i=r.flat.findIndex(([d,v])=>d===cur.d&&v===cur.v);
    const [nd,nv]=r.flat[(i+1)%r.flat.length];
    show(nd,nv);
  });
  // details/prices open ONLY from this button
  sec.querySelector('.detail-btn').addEventListener('click',()=>openDetail(ri,cur.d,cur.v));
  app.appendChild(sec); posterEls.push(sec); thumbBoxes.push(tw);
  const [d0,v0]=r.flat[0]; show(d0,v0);
  fitThumbs(tw);
});
// centre thumbs that fit; left-align + allow scroll only when they overflow
window.addEventListener('resize',()=>{ thumbBoxes.forEach(fitThumbs); capAligners.forEach(f=>f()); });
requestAnimationFrame(()=>thumbBoxes.forEach(fitThumbs));

// intro sliding band — range covers (first flat image of each range)
const strip=document.getElementById('introStrip');
if(strip){
  const covers=RANGES.map(r=>{const [d,v]=r.flat[0];return THUMBS[r.designs[d].imgs[v]];});
  covers.concat(covers).forEach(src=>{const el=document.createElement('div');el.className='tile';const im=document.createElement('img');im.src=src;im.alt='';el.appendChild(im);strip.appendChild(el);});
}

// ── Site menu (dropdown under the lines button, like the wall-art gallery) ──
const menu=document.getElementById('menu'), menuBtn=document.getElementById('menuBtn');
menuBtn.addEventListener('click',e=>{ e.stopPropagation(); const o=menu.classList.toggle('open'); menuBtn.classList.toggle('open',o); });
document.addEventListener('click',e=>{ if(!menu.contains(e.target)&&!menuBtn.contains(e.target)){ menu.classList.remove('open'); menuBtn.classList.remove('open'); } });

// ── Detail overlay + finish + postcode gate ───────────
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
const pcLocked = ()=> !!(postcodeInfo && postcodeInfo.postcode);       // postcode entered once -> locked (site rule)
const matId = ()=> /corten/i.test(selFinish||'') ? 'corten' : 'aluminium';   // finish -> material id
const regionOf = (info)=> STATE_NAMES[info.state] || info.state || 'Australia';
function setOvImg(des,vv){ ovImg.src=IMGS[des.imgs[vv]]; curImg=THUMBS[des.imgs[vv]]; ovThumbs.querySelectorAll('.sh-th').forEach((t,j)=>t.classList.toggle('active',j===vv)); }
// Prices are ALWAYS computed from the STORED postcode (entered once, locked for the visit —
// consistent with the rest of the site; a visitor can't retype to see other regions).
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
  renderPrices();       // if a postcode is stored, prices show/update on finish pick
}));
ovSizes.addEventListener('click',(e)=>{
  const b=e.target.closest('.sh-size'); if(!b) return;
  selSize=+b.dataset.i;
  ovSizes.querySelectorAll('.sh-size').forEach(x=>x.classList.toggle('sel',x===b));
  updateAddState();
});
// configure the pricing gate: a stored postcode is locked (no re-entry); otherwise ask once
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
  ovSub.textContent=des.imgs.length>1?`${des.imgs.length} images`:'Laser-cut wall art';
  ovThumbs.innerHTML='';
  des.imgs.forEach((gi,j)=>{const t=document.createElement('div');t.className='sh-th';const im=document.createElement('img');im.src=THUMBS[gi];im.alt='';t.appendChild(im);t.addEventListener('click',()=>setOvImg(des,j));ovThumbs.appendChild(t);});
  setOvImg(des,vv||0);
  curDes=des; curRange=RANGES[ri].label;
  // this piece's real size tiers (catalogue); pieces not priced fall back to generic tiers -> POA
  curTiers = PIECE_SIZES[des.pk||des.n] || SIZE_TIERS;
  ovSizes.innerHTML = curTiers.map((t,i)=>`<button class="sh-size${i===0?' sel':''}" data-i="${i}"><span><b>${t.label}</b></span><span>${t.dims}</span></button>`).join('');
  selFinish=null; ovFinish.querySelectorAll('.sh-chip').forEach(x=>x.classList.remove('sel'));
  selSize = curTiers.length ? 0 : null;   // pre-select first size (matches the site; single-size pieces add straight away)
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
  // store once + lock for the visit (shared roj_postcode key -> same across the whole site)
  postcodeInfo = { postcode:v, isWA:checkWA(v), state:getState(v), isAdmin:false };
  savePostcode(postcodeInfo);
  gerr.textContent=''; gateForm.style.display='none';
  ghint.textContent = `Prices for ${regionOf(postcodeInfo)}. Choose a finish.`;
  renderPrices();
});

// ── Add to quote — writes the SHARED basket (roj-quote-basket) so pieces carry
//    into the home page's Contact form. Same item shape App/Contact expect.
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
updateQpill();   // show the pill if the shared basket already has items

// ── Wall Art catalogue (opened by the "View catalogue" pill) ──
const WALL_ART_CAT_PAGES = Array.from({length:26},(_,i)=>`/images/catalogues/cat1/page-${String(i+4).padStart(2,'0')}.jpg`);
const catov=document.getElementById('catov'), catlist=document.getElementById('catlist');
WALL_ART_CAT_PAGES.forEach(p=>{ const im=document.createElement('img'); im.loading='lazy'; im.alt=''; im.src=netlifyImg(p,{w:1000,q:72}); catlist.appendChild(im); });
function openCat(){ catov.classList.add('open'); document.body.classList.add('locked'); catlist.scrollTop=0; }
function closeCat(){ catov.classList.remove('open'); document.body.classList.remove('locked'); }
document.getElementById('catBtn').addEventListener('click',openCat);
document.getElementById('catClose').addEventListener('click',closeCat);
catov.addEventListener('click',e=>{ if(e.target===catov) closeCat(); });

// ── Return to top (appears near the bottom of the scroll) ─────────
const toTop=document.getElementById('toTop');
toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
function updTop(){ toTop.classList.toggle('show', window.innerHeight+window.scrollY >= document.documentElement.scrollHeight-60); }
window.addEventListener('scroll',updTop,{passive:true}); updTop();

// ── Top-bar current range ─────────────────────────────
const io=new IntersectionObserver(es=>{es.forEach(e=>{ if(e.isIntersecting){
  const l=e.target.dataset.label, i=e.target.dataset.idx;
  if(l) now.innerHTML=`<b>${String(i).padStart(2,'0')}</b> &nbsp; ${l}`; else now.textContent='Wall Art · The Range';
}});},{threshold:.55});
posterEls.forEach(s=>io.observe(s));
const introEl=document.querySelector('.intro'); introEl.dataset.label=''; io.observe(introEl);

