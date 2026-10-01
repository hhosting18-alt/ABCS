(function(){
"use strict";
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (RM) document.documentElement.classList.add('rm');
const isMobileLandscape = () => window.innerWidth < 768;
const touch = window.matchMedia('(hover: none)').matches;

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create('abcsReveal', 'M0,0 C0.3,0.193 0.04,1 1,1');
CustomEase.create('abcsFill', 'M0,0 C0.3,0 0.806,0.897 1,1');

/* =========================== DATA =========================== */
const PAL = [['#f63d18','#ffffff'],['#131410','#f63d18'],['#d9e3e7','#131410'],['#e2dc07','#131410'],['#484133','#d9e3e7'],['#ffffff','#f63d18']];
const FEST = {
  slamdance:{ name:'Slamdance Film Festival', short:'Slamdance', mark:['SLAMDANCE'], city:'Los Angeles, US', pal:0, badge:'In your plan', bcls:'', cats:'shorts', mode:'offline', fit:92, fee:4769, deadline:'2026-09-14',
    meta:'Fee from ₹4,769, deadline 14 Sept 2026', reason:'Festy match: your runtime and genre fit their indie slate. India premieres from here got distributor attention last year.',
    statement:'Has selected 3 previously unshown Indian regional-language features in the last two editions.' },
  busan:{ name:'Busan International', short:'Busan', mark:['BUSAN'], city:'Busan, South Korea', pal:1, badge:'In your plan', bcls:'', cats:'', mode:'offline', fit:85, fee:99999, deadline:'2026-10-01',
    meta:'Fee not confirmed', reason:'Festy match: a strong track record platforming South and Southeast Asian debut features like yours.',
    statement:'A strong track record of platforming South and Southeast Asian debut features.' },
  rotterdam:{ name:'Rotterdam IFFR', short:'Rotterdam', mark:['ROTTERDAM'], city:'Rotterdam, Netherlands', pal:3, badge:'In your plan', bcls:'', cats:'', mode:'hybrid', fit:83, fee:99999, deadline:'2026-10-20',
    meta:'Fee not confirmed', reason:'Festy match: the Bright Future strand favors bold first and second features, which matches your goal of building festival buzz.',
    statement:'The Bright Future strand favours bold first and second features.' },
  tokyo:{ name:'Tokyo International', short:'Tokyo', mark:['TOKYO'], city:'Tokyo, Japan', pal:2,
    statement:'Fee not confirmed yet, and Festy says so instead of guessing.' },
  sundance:{ name:'Sundance Film Festival', short:'Sundance', mark:['SUNDANCE'], city:'Park City, US', pal:4, badge:'Oscar-qualifying', bcls:'oscar', cats:'oscar', mode:'offline', fit:55, fee:6200, deadline:'2026-08-20',
    meta:'Fee from ₹6,200, deadline 20 Aug 2026', reason:'Long shot: your festival-ready cut and premiere status both qualify you to submit, but acceptance odds here are low.',
    statement:'Oscar-qualifying. A long shot for most first features, and Festy will tell you so.' },
  berlinale:{ name:'Berlin International (Berlinale)', short:'Berlinale', mark:['BERLINALE'], city:'Berlin, Germany', pal:5, badge:'Oscar + BAFTA', bcls:'oscar', cats:'oscar bafta', mode:'offline', fit:50, fee:7900, deadline:'2026-11-05',
    meta:'Fee from ₹7,900, deadline 5 Nov 2026', reason:'Long shot: Panorama has taken India-set dramas before. Worth one submission given your premiere status.',
    statement:'Oscar and BAFTA qualifying. Panorama has taken India-set dramas before.' },
  mumbai:{ name:'Mumbai Film Festival', short:'Mumbai', mark:['MUMBAI'], city:'Mumbai, India', pal:0, badge:'Submitted', bcls:'submitted', cats:'india', mode:'hybrid', fit:80, fee:2200, deadline:'2026-01-01',
    meta:'Fee ₹2,200, deadline passed', reason:'Festy match: your local premiere and India focus made this an easy first submission.',
    statement:'A local premiere and an India focus made this an easy first submission.' },
  kolkata:{ name:'Kolkata Shorts Fest', short:'Kolkata Shorts', mark:['KOLKATA','SHORTS'], city:'Kolkata, India', pal:1,
    statement:'Looking for Marathi, Bengali, and Tamil work in its 2027 edition.' }
};
const CLIENT_ORDER = ['slamdance','busan','rotterdam','tokyo','sundance','berlinale','mumbai','kolkata'];
const GRID_ORDER = ['slamdance','busan','sundance','berlinale','mumbai','rotterdam'];
const STEPS = [
  { h:'Tell Festy about your film', s:'Title, format, runtime, language, and where you are with your premiere.', list:['Format','Runtime','Language'] },
  { h:'It protects your premiere first', s:'Before anything else, Festy separates festivals that would burn your world or international premiere from the ones that protect it.', list:['World','International','National'] },
  { h:'Reasons, not just names', s:'Every recommendation says why. The same careful reasoning every time, never a copy-pasted paragraph.', list:['Genre fit','Past selections','Programmer taste'] },
  { h:'You submit, Festy tracks', s:'Deadlines, fees, and formats in one place. You click submit on the festival’s own platform.', list:['Deadlines','Fees','Formats'] },
  { h:'The plan updates when you do', s:'A rejection or an acceptance changes what happens next. Festy recalculates the route.', list:['Rejections','Acceptances','Next moves'] }
];
const SLIDES = [
  { cls:'is-ink', h:'It won’t repeat itself', p:'Every recommendation is specific to your film, never a template swapped in for whichever festival comes up.', tags:['Specific','Reasoned','Yours'] },
  { cls:'is-red', h:'It won’t submit for you', p:'You always click submit. Festy plans the route, and you decide whether to take it.', tags:['You decide','You submit','It tracks'] },
  { cls:'is-yellow', h:'It won’t sell your film', p:'Your film’s details stay yours. Never sold, never used to train a model.', tags:['Private','Unsold','Untrained'] },
  { cls:'is-brown', h:'It won’t fake certainty', p:'If a fee or deadline isn’t confirmed, Festy says so instead of guessing.', tags:['Verified','Flagged','Honest'] }
];
const FAQ = [
  ['Does Festy replace FilmFreeway or festival submission platforms?','No. Those platforms handle payment and submission. Festy decides where, when, and why you submit, and you still submit through the festival’s own process.'],
  ['Is this only for Indian filmmakers?','Festy is built with Indian independent filmmakers first, but the festival database covers international festivals too, including ones with a track record of selecting Indian work.'],
  ['What if I don’t have a finished film yet?','Festy works best with a completed or near-final cut, since premiere status and submission eligibility depend on it. You can still build a profile earlier.'],
  ['What happens to my film’s information?','It stays private to your account. We don’t sell it, and we don’t use it to train any model.']
];

/* =========================== LAUREL TILES =========================== */
function laurelSVG(key){
  const f = FEST[key]; const [bg, fg] = PAL[f.pal];
  const cx = 150, cy = 104, r = 70; let leaves = '';
  [-1, 1].forEach(side => {
    const a0 = side < 0 ? 104 : 76;
    let d = '';
    for (let i = 0; i <= 11; i++){
      const t = i / 11, ang = side < 0 ? a0 + t * 128 : a0 - t * 128, rad = ang * Math.PI / 180;
      const sc = 1 - t * .42, x = cx + r * Math.cos(rad), y = cy + r * Math.sin(rad);
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      const tang = ang + (side < 0 ? 90 : -90);
      const ox = cx + (r + 7 * sc) * Math.cos(rad), oy = cy + (r + 7 * sc) * Math.sin(rad);
      const ix = cx + (r - 7 * sc) * Math.cos(rad), iy = cy + (r - 7 * sc) * Math.sin(rad);
      leaves += `<ellipse cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" rx="${(10*sc).toFixed(1)}" ry="${(3.6*sc).toFixed(1)}" transform="rotate(${(tang + side*-38).toFixed(1)} ${ox.toFixed(1)} ${oy.toFixed(1)})"/>`;
      if (i < 11) leaves += `<ellipse cx="${ix.toFixed(1)}" cy="${iy.toFixed(1)}" rx="${(9*sc).toFixed(1)}" ry="${(3.2*sc).toFixed(1)}" transform="rotate(${(tang + side*38).toFixed(1)} ${ix.toFixed(1)} ${iy.toFixed(1)})"/>`;
    }
    leaves += `<path d="${d}" fill="none" stroke="${fg}" stroke-width="1.4"/>`;
  });
  const lines = f.mark, longest = Math.max(...lines.map(l => l.length));
  const fs = Math.min(22, 98 / (longest * .8)); const lh = fs * 1.02; const y0 = cy + 4 - (lines.length - 1) * lh / 2;
  const name = lines.map((l, i) => `<text x="150" y="${(y0 + i*lh).toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-family="Universo, Arial Black, sans-serif" font-weight="500" font-size="${fs.toFixed(1)}">${l}</text>`).join('');
  return `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${f.name} laurel" preserveAspectRatio="xMidYMid slice"><rect width="300" height="200" fill="${bg}"/>`+
    `<g fill="${fg}">${leaves}<text x="150" y="${(y0 - fs*.95).toFixed(1)}" text-anchor="middle" font-family="Universo, Arial Black, sans-serif" font-weight="500" font-size="6.2" letter-spacing=".9">OFFICIAL SELECTION</text>${name}`+
    `<text x="150" y="${(y0 + (lines.length - 1)*lh + fs*1.25).toFixed(1)}" text-anchor="middle" font-family="Mosvita, Arial, sans-serif" font-weight="700" font-size="9">2026</text></g></svg>`;
}
function fillTiles(root=document){ $$('[data-tile]', root).forEach(el => { if (!el.dataset.filled){ el.innerHTML = laurelSVG(el.dataset.tile); el.dataset.filled = 1; } }); }

/* =========================== CHAR BUTTONS =========================== */
function initChars(root=document){
  $$('[data-chars]', root).forEach(el => {
    if (el.dataset.done) return; el.dataset.done = 1;
    const text = el.textContent; el.setAttribute('aria-label', text); el.textContent = '';
    [...text].forEach((c, i) => { const s = document.createElement('span'); s.textContent = c; s.setAttribute('aria-hidden','true'); s.style.transitionDelay = (i * .0125) + 's'; if (c === ' ') s.style.whiteSpace = 'pre'; el.appendChild(s); });
  });
}

/* =========================== LENIS =========================== */
let lenis = null;
if (!RM){
  lenis = new Lenis({ wheelMultiplier: .8 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
function scrollToTarget(target, immediate){
  if (lenis) lenis.scrollTo(target, { duration: immediate ? 0 : 1.6, immediate: !!immediate, offset: 0 });
  else { const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY; window.scrollTo({ top:y, behavior: immediate ? 'auto' : 'smooth' }); }
}

/* =========================== TOAST =========================== */
let toastT; function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800); }

/* =========================== STATE =========================== */
const state = { view:'home', step:0, editing:false, role:null, name:'', title:'Dasubodh', format:'Feature', runtime:73, lang:'Marathi', genre:'Drama', country:'India', premiere:'Not yet shown', budget:75000, goal:'Go big' };
const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');

/* =========================== BUILD HOME MARKUP =========================== */
function buildHome(){
  const names = $('#clNames'), logo = $('#clLogo'), st = $('#clStatements');
  CLIENT_ORDER.forEach(k => {
    const f = FEST[k];
    names.insertAdjacentHTML('beforeend', `<li class="cl-name" data-cname="${k}"><span>${f.short}</span><span class="hl" aria-hidden="true">${f.short}</span></li>`);
    logo.insertAdjacentHTML('beforeend', `<div class="item" data-clogo="${k}"><div class="tile" data-tile="${k}"></div></div>`);
    st.insertAdjacentHTML('beforeend', `<p class="cl-statement" data-cstate="${k}">${f.statement}</p>`);
  });
  const rots = [-2, 2, 5, -2, 3];
  $('#howCards').innerHTML = STEPS.map((s, i) => `<i class="svc-mark" aria-hidden="true"></i><article class="svc-card" style="rotate:${rots[i]}deg">
    <div><h3 class="disp">${s.h}</h3><p class="sub">${s.s}</p></div>
    <div class="svc-bottom"><ul>${s.list.map(l => `<li>${l}</li>`).join('')}</ul><span class="svc-num">0${i+1}</span></div></article>`).join('');
  $('#slides').innerHTML = SLIDES.map((s, i) => `<section class="slide ${s.cls}" style="z-index:${i+1}"><div class="slide-wrap"><div class="slide-content">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem"><h3 class="disp">${s.h}</h3><span class="slide-num">0${i+1}</span></div>
    <div class="slide-bottom"><p>${s.p}</p><div class="slide-tags" aria-hidden="true">${s.tags.map(t => `<span class="slide-tag">${t}</span>`).join('')}</div></div></div></div></section>`).join('');
  $('#faqList').innerHTML = FAQ.map((q, i) => `<div class="faq-item"><button class="faq-q" aria-expanded="false" aria-controls="faqA${i}" id="faqQ${i}"><span class="n">0${i+1}</span><span>${q[0]}</span><span class="plus" aria-hidden="true"></span></button>
    <div class="faq-a" id="faqA${i}" role="region" aria-labelledby="faqQ${i}"><div><p>${q[1]}</p></div></div></div>`).join('');
  $$('.banner-texts > div, .banner-nums > div').forEach(d => { const sp = d.firstElementChild; const words = sp.textContent.split(' '); d.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' '); });
  $$('.faq-q').forEach(b => b.addEventListener('click', () => { const it = b.parentElement, open = !it.classList.contains('is-open'); it.classList.toggle('is-open', open); b.setAttribute('aria-expanded', open); setTimeout(() => ScrollTrigger.refresh(), 650); }));
}

/* =========================== WORDMARK FIT =========================== */
function fitMarks(){
  const hm = $('#heroMark'), nl = $('#navLogo');
  if (hm && nl.offsetParent !== null){
    hm.style.fontSize = '100px'; const w = hm.getBoundingClientRect().width / (gsap.getProperty(nl, 'scale') || 1);
    const target = nl.clientWidth; hm.style.fontSize = (100 * target / w) + 'px';
    document.documentElement.style.setProperty('--logo-h', hm.offsetHeight + 'px');
  }
  const fm = $('#footMark'); if (fm && fm.offsetParent !== null){ fm.style.fontSize = '100px'; const w = fm.getBoundingClientRect().width; fm.style.fontSize = (100 * fm.parentElement.clientWidth / w * .995) + 'px'; }
}

/* =========================== HOME ANIMATIONS =========================== */
let homeCtx = null, firstLoad = true;
function initHome(loaderDelay){
  fitMarks();
  homeCtx = gsap.context(() => {
    const ld = loaderDelay;
    // ---- intro (initHomeIntroAnimation)
    gsap.set('[data-load]', { opacity:1 });
    if (!RM){
      const tl = gsap.timeline();
      tl.from('[data-load="nav-item"]', { opacity:0, yPercent:110, duration:1.5, ease:'expo.out', delay: ld + 1, stagger:{ each:.125 } }, 0);
      const splitWords = (sel, delay) => SplitText.create($$(sel + ' > *').length ? $$(sel + ' > *') : sel, { type:'lines, words', mask:'lines', autoSplit:true,
        onSplit(self){ return gsap.from(self.words, { yPercent:110, duration:1.5, delay, ease:'expo.out', stagger:{ each:.05 } }); } });
      SplitText.create('[data-load="sub1"]', { type:'lines, words', mask:'lines', onSplit(s){ return gsap.from(s.words, { yPercent:110, duration:1.5, delay:ld+1, ease:'expo.out', stagger:.05 }); } });
      SplitText.create('[data-load="sub2"]', { type:'lines, words', mask:'lines', onSplit(s){ return gsap.from(s.words, { yPercent:110, duration:1.5, delay:ld+1.125, ease:'expo.out', stagger:.05 }); } });
      splitWords('[data-load="heading"]', ld + 1.25);
      SplitText.create($$('[data-load="subtext"] > *'), { type:'lines, words', mask:'lines', autoSplit:true, onSplit(s){ return gsap.from(s.lines, { yPercent:110, duration:1.75, delay:ld+2, ease:'expo.out', stagger:.075 }); } });
      gsap.from('[data-load="button"]', { opacity:0, yPercent:175, rotation:7.5, duration:1.75, delay:ld+1.75, ease:'expo.out' });
      gsap.from('#heroMark', { yPercent:18, opacity:0, duration:1.6, delay:ld + .7, ease:'expo.out' });
    }

    // ---- nav shrink + hide/show (initHomeNav)
    const nav = $('#homeNav'), logo = $('#navLogo');
    let navMove = gsap.from(nav, { yPercent:-125, paused:true, duration:.4 }).progress(1);
    let pastHero = false;
    gsap.to(logo, { scale:.25, ease:'power1.inOut', scrollTrigger:{ trigger:'[data-hero]', start:'clamp(top top)', end:'center top', scrub:true,
      onLeave(){ pastHero = true; }, onEnterBack(){ pastHero = false; navMove.play(); } } });
    ScrollTrigger.create({ start:0, end:'max', onUpdate(self){ if (!pastHero) return; self.direction === -1 ? navMove.play() : navMove.reverse(); } });

    // ---- banner (homeScrollAnimations + initBanners)
    const banner = $('#banner');
    if (!RM) gsap.from(banner, { yPercent:100, ease:'expo.out', duration:1, scrollTrigger:{ trigger:'.banner-holder', start:'clamp(top bottom)', toggleActions:'play none none reverse' } });
    const texts = $$('.banner-texts > div').map(d => $$('.w', d)), nums = $$('.banner-nums > div').map(d => $$('.w', d));
    gsap.set([...texts.flat(), ...nums.flat()], { yPercent:110 });
    $$('[data-chapter]').forEach((ch, i) => {
      const tl = gsap.timeline({ scrollTrigger:{ trigger:ch, start:'top 87.5%', toggleActions:'play none none reverse' } });
      if (i > 0) tl.to(texts[i-1], { yPercent:-110, ease:'expo.out', duration:1.5, stagger:{ each:.033 } }, 0).to(nums[i-1], { yPercent:-110, ease:'expo.out', duration:1.5 }, .25);
      tl.to(texts[i], { yPercent:0, ease:'expo.out', duration:1.5, stagger:{ each:.033 } }, 0).to(nums[i], { yPercent:0, ease:'expo.out', duration:1.5 }, .25);
    });
    const red = $('.slide.is-red');
    if (red) ScrollTrigger.create({ trigger:red, start:'top bottom-=90', end:'bottom bottom-=90', toggleClass:{ targets:banner, className:'is-ink' } });

    // ---- story fill (initStoryAnimation)
    const front = $('[data-story-text] .front');
    if (RM) gsap.set(front, { clipPath:'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' });
    else gsap.fromTo(front, { clipPath:'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' }, { clipPath:'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', ease:'abcsFill',
      scrollTrigger:{ trigger:'[data-story-text]', start:'top 77.5%', end:'bottom center', scrub:true } });
    if (!RM){
      gsap.fromTo('[data-story-images]', { yPercent:20 }, { yPercent:-10, ease:'none', scrollTrigger:{ trigger:'[data-story]', start:'top bottom', end:'bottom top', scrub:true } });
      const proxy = { skew:0 }, skewSet = gsap.quickSetter('.story-img', 'skewY', 'deg'), clamp = gsap.utils.clamp(-30, 30);
      gsap.set('.story-img', { transformOrigin:'right center', force3D:true });
      ScrollTrigger.create({ trigger:'[data-story]', start:'top bottom', end:'bottom top', onUpdate(self){
        const skew = clamp(self.getVelocity() / -250);
        if (Math.abs(skew) > Math.abs(proxy.skew)){ proxy.skew = skew; gsap.to(proxy, { skew:0, duration:.8, ease:'power3', overwrite:true, onUpdate:() => skewSet(proxy.skew) }); }
      } });
    }

    // ---- explainer (initExplainerAnimation)
    if (!RM){
      const exSplit = SplitText.create($$('[data-ex-heading] p'), { type:'lines', mask:'lines', linesClass:'line' });
      const cardTl = gsap.timeline({ scrollTrigger:{ trigger:'[data-explainer]', start:'top bottom', end:'top -12.5%', scrub:.5 } });
      if (!isMobileLandscape()) cardTl.from('[data-ex-card]', { rotation:-15, yPercent:-100, ease:'power1.inOut' }, '<');
      cardTl.from(exSplit.lines, { yPercent:-180, stagger:{ each:.05 } }, '<');
      $$('.ex-word').forEach(w => gsap.fromTo(w.children, { yPercent:-120 }, { yPercent:0, ease:'none', scrollTrigger:{ trigger:w, start:'bottom bottom', end:'bottom center', scrub:true } }));
    }

    // ---- shared scroll text (initScrollAnimations)
    if (!RM){
      gsap.matchMedia().add('(min-width: 768px)', () => {
        $$('[data-scroll="chars"]').forEach(el => SplitText.create(el, { type:'lines, chars', mask:'chars', ignore:'[data-script]', autoSplit:true,
          onSplit(s){ return gsap.from(s.chars, { yPercent:-110, duration:1.5, ease:'expo.out', stagger:{ each:.05, from:'center' }, scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none reverse' } }); } }));
        $$('[data-scroll="lines"]').forEach(el => SplitText.create(el.children, { type:'lines', mask:'lines', autoSplit:true,
          onSplit(s){ return gsap.from(s.lines, { yPercent:110, duration:1.5, ease:'expo.out', stagger:{ each:.1 }, scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none reverse' } }); } }));
      });
      $$('[data-scroll="fade"]').forEach(el => gsap.from(el, { opacity:0, yPercent:50, duration:1.66, ease:'expo.out', scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none reverse' } }));
      $$('[data-scroll="button"]').forEach(el => gsap.from($('[data-btn-el]', el), { yPercent:175, rotation:7.5, duration:1, ease:'expo.out', scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none reverse' } }));
      $$('[data-divider]').forEach(el => gsap.from(el, { scaleX:0, duration:1, ease:'expo.inOut', scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none reverse' } }));
      $$('.faq-item').forEach((el, i) => gsap.from(el, { opacity:0, y:40, duration:1.2, ease:'expo.out', delay:i*.06, scrollTrigger:{ trigger:el, start:'top 92%', toggleActions:'play none none reverse' } }));
    }

    // ---- handwritten words (the drawn-on script)
    const scriptTl = (el, opts) => {
      const s = SplitText.create(el, { type:'chars', charsClass:'ch' });
      const tl = gsap.timeline(opts);
      tl.fromTo(s.chars, { clipPath:'inset(-45% 100% -45% -15%)' }, { clipPath:'inset(-45% -40% -45% -15%)', duration:.5, ease:'power2.inOut', stagger:.16 });
      return tl;
    };
    if (!RM){
      const clTl = gsap.timeline({ scrollTrigger:{ trigger:'[data-cl-heading]', start:'bottom bottom', end:'bottom center', toggleActions:'play none none reverse' } });
      clTl.from('[data-cl-heading]', { xPercent:17.5, duration:1.5, ease:'power2.inOut' });
      clTl.add(scriptTl('[data-cl-script]'), '<.5');
      $$('#view-home [data-script]').forEach(el => scriptTl(el, { scrollTrigger:{ trigger:el, start:'top 85%', toggleActions:'play none none reverse' } }));
    }

    // ---- clients (initClientsAnimation + initLogosWrapMove)
    const showClient = (k, skip) => {
      gsap.to('.cl-name .hl', { opacity:0, duration:.5, ease:'expo.out' });
      gsap.to(`[data-cname="${k}"] .hl`, { opacity:1, duration:.5, ease:'expo.out' });
      if (skip) return;
      gsap.to(`[data-cstate]:not([data-cstate="${k}"])`, { overwrite:true, opacity:0, scale:.75, xPercent:25, duration:.66, ease:'expo.out' });
      gsap.to(`[data-clogo]:not([data-clogo="${k}"])`, { overwrite:true, scale:0, yPercent:-50, rotate:-45, duration:.66, ease:'expo.out' });
      gsap.fromTo(`[data-cstate="${k}"]`, { opacity:0, scale:.75, xPercent:-25 }, { opacity:1, scale:1, xPercent:0, duration:.66, ease:'expo.out', overwrite:true });
      gsap.fromTo(`[data-clogo="${k}"]`, { scale:0, rotate:45, yPercent:50 }, { scale:1, rotate:0, yPercent:0, duration:.66, ease:'expo.out', overwrite:true });
    };
    const first = CLIENT_ORDER[0];
    gsap.set('#clLogo', { scale:0, rotate:45, yPercent:-50 });
    ScrollTrigger.create({ trigger:'#clNames', start:'top 62%',
      onEnter(){ gsap.to('#clLogo', { rotate:0, scale:1, yPercent:0, duration:1, ease:'expo.out' }); gsap.to(`[data-clogo="${first}"]`, { rotate:0, scale:1, duration:1, ease:'expo.out', delay:.22, overwrite:true });
        gsap.fromTo(`[data-cstate="${first}"]`, { opacity:0, scale:.75, xPercent:-25 }, { opacity:1, scale:1, xPercent:0, duration:1, ease:'expo.out', delay:.44, overwrite:true }); },
      onLeaveBack(){ gsap.to('#clLogo', { rotate:45, scale:0, yPercent:-50, duration:1, ease:'expo.out', delay:.22 }); gsap.to('[data-clogo]', { rotate:45, scale:0, duration:1, ease:'expo.out' });
        gsap.to('[data-cstate]', { opacity:0, scale:.75, xPercent:25, duration:.66, ease:'expo.out' }); gsap.to('.cl-name .hl', { opacity:0, duration:1, ease:'expo.out' }); } });
    $$('.cl-name').forEach((n, i) => ScrollTrigger.create({ trigger:n, start:'top center', onEnter:() => showClient(n.dataset.cname, i === 0), onLeaveBack:() => { if (i > 0) showClient(CLIENT_ORDER[i-1]); } }));
    if (!touch){
      const outer = $('[data-logo-outer]'), qx = gsap.quickTo(outer, 'x', { duration:.6, ease:'power3.out' }), qr = gsap.quickTo(outer, 'rotation', { duration:.6, ease:'power3.out' });
      const mm = e => { if (state.view !== 'home') return; const rx = (e.clientX / window.innerWidth) * 2 - 1; qx(rx * 100); qr(rx * 5); };
      window.addEventListener('mousemove', mm);
      cleanupFns.push(() => window.removeEventListener('mousemove', mm));
    }

    // ---- services: rotator, sticky blur, cards (initServicesAnimation)
    const rots = $$('#mlRot > span');
    const resetRot = () => rots.forEach((r, i) => gsap.set(r, { yPercent: -100 * i }));
    resetRot();
    if (!RM){
      const rTl = gsap.timeline({ repeat:-1, paused:true, defaults:{ duration:.5, ease:'power2.inOut' } });
      for (let i = 0; i < rots.length - 1; i++) rTl.to(rots, { yPercent:'+=100' }, '+=1');
      rTl.call(resetRot);
      ScrollTrigger.create({ trigger:'#mlRot', start:'top bottom', end:'bottom top', onEnter:() => rTl.play(), onLeaveBack:() => { rTl.pause().progress(0); resetRot(); } });
    }
    if (!RM && !isMobileLandscape()){
      gsap.to('#howSticky', { filter:'blur(16px)', opacity:.5, ease:'none', scrollTrigger:{ trigger:'#howCards', start:'top 66%', end:'top -60%', scrub:true } });
      $$('.svc-card').forEach(card => gsap.from(card, { yPercent:15, scale:1.25, rotation:gsap.utils.random(-25, 25, 5), ease:'back.out',
        scrollTrigger:{ trigger:card.previousElementSibling, start:'top bottom', end:'top 28%', scrub:.5 } }));
      // ---- service slides (newServiceSlides)
      const sl = $$('.slide');
      sl.forEach((slide, i) => {
        if (i === sl.length - 1) return;
        const wrap = $('.slide-wrap', slide), content = $('.slide-content', slide);
        ScrollTrigger.create({ trigger:slide, pin:wrap, pinSpacing:false, start:'top top', end:'+=100%' });
        gsap.to(content, { rotationZ:(Math.random() - .5) * 10, scale:.7, rotationX:40, ease:'power1.in', scrollTrigger:{ trigger:slide, start:'top top', end:'+=100%', scrub:true } });
      });
    }

    // ---- voices
    if (!RM) $$('[data-voice]').forEach((v, i) => gsap.from(v, { opacity:0, y:120, rotation:(i % 2 ? 8 : -8), duration:1.6, ease:'expo.out', delay:i * .1,
      scrollTrigger:{ trigger:'.voices-grid', start:'top 85%', toggleActions:'play none none reverse' } }));

    // ---- statement fill (initStatementAnimation)
    const stB = SplitText.create('[data-st-behind] > span', { type:'lines, words', mask:'lines' });
    SplitText.create('[data-st-front]', { type:'lines, words', mask:'lines' });
    if (RM) gsap.set('[data-st-front]', { clipPath:'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' });
    else {
      gsap.fromTo('[data-st-front]', { clipPath:'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' }, { clipPath:'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', ease:'abcsFill',
        scrollTrigger:{ trigger:'.st-wrap', start:'top 77.5%', end:'bottom center', scrub:true } });
      gsap.from(stB.words, { yPercent:110, rotation:1.25, stagger:{ each:.05 }, ease:'none', scrollTrigger:{ trigger:'.st-wrap', start:'top 90%', end:'bottom bottom', scrub:true } });
    }

    // ---- footer parallax (initFooter)
    if (!RM){
      const ftl = gsap.timeline({ scrollTrigger:{ trigger:'[data-footer-parallax]', start:'clamp(top bottom)', end:'clamp(top top)', scrub:true } });
      ftl.from('[data-footer-inner]', { yPercent:-25, ease:'linear' }).from('[data-footer-bottom]', { yPercent:10, ease:'linear' }, '<').fromTo('[data-footer-dark]', { opacity:.5 }, { opacity:0, ease:'linear' }, '<');
    }
  });
  requestAnimationFrame(() => ScrollTrigger.refresh());
}
const cleanupFns = [];
function destroyHome(){ cleanupFns.splice(0).forEach(f => f()); if (homeCtx){ homeCtx.revert(); homeCtx = null; } }

/* ---- cursor trail (initCursorTrail) ---- */
(function cursorTrail(){
  const root = $('#trail'), hero = $('[data-hero]'); if (!root || touch || RM) return;
  const keys = Object.keys(FEST); let incr = 0, ox = 0, oy = 0, idx = 0, init = false;
  hero.addEventListener('mousemove', e => {
    if (state.view !== 'home') return;
    const x = e.clientX, y = e.clientY;
    if (!init){ ox = x; oy = y; init = true; return; }
    incr += Math.abs(x - ox) + Math.abs(y - oy);
    if (incr > window.innerWidth / 8){
      incr = 0; const dx = x - ox, dy = y - oy, top = root.getBoundingClientRect().top;
      const el = document.createElement('div'); el.className = 'tile'; el.innerHTML = laurelSVG(keys[idx]); root.appendChild(el);
      const tl = gsap.timeline({ onComplete:() => { el.remove(); tl.kill(); } });
      tl.fromTo(el, { xPercent:-50 + (Math.random() - .5) * 80, yPercent:-50 + (Math.random() - .5) * 10, scaleX:1.3, scaleY:1.3 }, { scaleX:1, scaleY:1, ease:'elastic.out(2, 0.6)', duration:.6 });
      tl.fromTo(el, { x, y:y - top, rotation:(Math.random() - .5) * 20 }, { x:'+=' + dx * 4, y:'+=' + dy * 4, rotation:(Math.random() - .5) * 20, ease:'power4.out', duration:1.5 }, '<');
      tl.to(el, { duration:.3, scale:.5, autoAlpha:0, delay:.1, ease:'back.in(1.5)' });
      idx = (idx + 1) % keys.length;
    }
    ox = x; oy = y;
  });
})();

/* =========================== ROUTER + PAGE TRANSITION =========================== */
const tr = $('#transition'); let busy = false;
function setView(v){
  $$('.view').forEach(el => el.classList.toggle('is-active', el.dataset.view === v));
  state.view = v;
  try {
    if (window.FC_PRETTY_URLS){ const p = v === 'home' ? '/' : (v === 'intake' ? '/start' : '/dashboard'); if (location.pathname !== p) history.pushState({ v }, '', p); }
    else { const hash = v === 'home' ? '' : (v === 'intake' ? '#start' : '#dashboard'); history.replaceState(null, '', location.pathname + location.search + hash); }
  } catch(e){}
  document.title = v === 'home' ? 'Freecomers | Meet Festy, your film festival strategist' : v === 'intake' ? 'Freecomers | Tell Festy your story' : 'Freecomers | ' + state.title + ' strategy';
}
function enterView(v, opts={}){
  if (v === 'home'){ initHome(firstLoad ? .5 : 0); firstLoad = false; }
  if (v === 'intake'){ $('#inBanner').hidden = true; showStep(opts.step != null ? opts.step : 0, true); }
  if (v === 'dash'){ applyState(); showDPage('dashboard', true); }
}
function go(v, opts={}){
  if (busy || (v === state.view && !opts.force)) return;
  busy = true; closeMenu(); closeFesty();
  const swap = () => {
    if (state.view === 'home') destroyHome();
    ScrollTrigger.getAll().forEach(s => s.kill());
    setView(v); scrollToTarget(0, true); window.scrollTo(0, 0);
    if (lenis){ lenis.resize(); }
    enterView(v, opts);
  };
  if (RM){ swap(); busy = false; return; }
  gsap.set(tr, { display:'block' });
  gsap.fromTo(tr, { y:'150vh' }, { y:'0vh', duration:1, ease:'expo.out', overwrite:true, onComplete:() => {
    swap();
    gsap.to(tr, { y:'-100vh', duration:1, delay:.2, ease:'abcsReveal', onComplete:() => { gsap.set(tr, { display:'none' }); busy = false; } });
  } });
}
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g){ e.preventDefault(); go(g.dataset.go, { step: g.dataset.go === 'intake' ? 0 : undefined }); return; }
  const s = e.target.closest('[data-scrollto]'); if (s){ e.preventDefault(); closeMenu(); const id = s.dataset.scrollto; scrollToTarget(id === 'top' ? 0 : $('#' + id)); return; }
  const t = e.target.closest('[data-toast]'); if (t){ e.preventDefault(); toast(t.dataset.toast); }
});

/* ---- mobile menu ---- */
const menuBtn = $('#menuBtn'), menu = $('#mobileMenu');
function closeMenu(){ menu.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-hidden', 'true'); if (lenis && state.view === 'home') lenis.start(); }
menuBtn.addEventListener('click', () => { const open = !menu.classList.contains('is-open'); menu.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open); if (lenis) open ? lenis.stop() : lenis.start(); });

/* =========================== INTAKE =========================== */
const steps = $$('.step'); const splitCache = new Map();
function animateStepIn(step){
  if (RM) return;
  $$('[data-in="chars"]', step).forEach((el, i) => {
    let s = splitCache.get(el); if (!s){ s = SplitText.create(el, { type:'lines, chars', mask:'lines', ignore:'[data-script]' }); splitCache.set(el, s); }
    gsap.fromTo(s.chars, { yPercent:110 }, { yPercent:0, duration:1.5, delay:.15 + i * .08, ease:'expo.out', stagger:{ each:.03, from:'center' } });
  });
  $$('[data-in="lines"]', step).forEach(el => {
    let s = splitCache.get(el); if (!s){ s = SplitText.create(el.children, { type:'lines', mask:'lines' }); splitCache.set(el, s); }
    gsap.fromTo(s.lines, { yPercent:110 }, { yPercent:0, duration:1.66, delay:.45, ease:'expo.out', stagger:{ each:.033 } });
  });
  $$('[data-in="fade"]', step).forEach(el => gsap.fromTo(el, { opacity:0, y:70 }, { opacity:1, y:0, duration:1.66, delay:.55, ease:'expo.out' }));
  $$('.opt', step).forEach((o, i) => gsap.fromTo(o, { yPercent:40, rotation:(i % 2 ? 9 : -9), opacity:0 }, { yPercent:0, rotation:0, opacity:1, duration:1.4, delay:.6 + i * .07, ease:'expo.out', clearProps:'transform' }));
  $$('[data-script]', step).forEach(el => {
    let s = splitCache.get(el); if (!s){ s = SplitText.create(el, { type:'chars', charsClass:'ch' }); splitCache.set(el, s); }
    gsap.fromTo(s.chars, { clipPath:'inset(-45% 100% -45% -15%)' }, { clipPath:'inset(-45% -40% -45% -15%)', duration:.5, delay:.7, ease:'power2.inOut', stagger:.16 });
  });
}
function setInBanner(step){
  const b = $('#inBanner'), act = step.dataset.act, num = step.dataset.num;
  if (!act){ if (!b.hidden) gsap.to(b, { yPercent:140, duration:.6, ease:'expo.in', onComplete:() => { b.hidden = true; } }); return; }
  const n = parseInt(num, 10); gsap.to('#inProgress', { width: (n / 8 * 100) + '%', duration:1, ease:'expo.out' });
  if (b.hidden){ b.hidden = false; $('#inBannerT').textContent = act; $('#inBannerN').textContent = num; gsap.fromTo(b, { yPercent:140 }, { yPercent:0, duration:1, ease:'expo.out', delay:.3 }); return; }
  if ($('#inBannerT').textContent === act && $('#inBannerN').textContent === num) return;
  const tl = gsap.timeline();
  tl.to(['#inBannerT', '#inBannerN'], { yPercent:-110, duration:.45, ease:'expo.in' })
    .call(() => { $('#inBannerT').textContent = act; $('#inBannerN').textContent = num; })
    .fromTo(['#inBannerT', '#inBannerN'], { yPercent:110 }, { yPercent:0, duration:1, ease:'expo.out', stagger:.08 });
}
function showStep(n, instant){
  const cur = steps.find(s => s.classList.contains('is-active')), next = steps.find(s => +s.dataset.step === n);
  if (!next) return;
  const doShow = () => {
    steps.forEach(s => s.classList.remove('is-active')); next.classList.add('is-active'); state.step = n;
    scrollToTarget(0, true); window.scrollTo(0, 0);
    if (n === 8){ $('#revealTitle').textContent = state.title; const s = splitCache.get($('#revealTitle')); if (s){ s.revert(); splitCache.delete($('#revealTitle')); } }
    animateStepIn(next); setInBanner(next);
    const f = $('input, .opt, .chipopt, button[data-next]', $('.step-body', next) || next); if (f && !instant) setTimeout(() => f.focus({ preventScroll:true }), 400);
  };
  if (instant || !cur || cur === next || RM){ doShow(); return; }
  gsap.to(cur.children, { y:-60, opacity:0, duration:.45, ease:'expo.in', stagger:.04, onComplete:() => { gsap.set(cur.children, { clearProps:'all' }); doShow(); } });
}
function readStep(n){
  if (n === 1){ state.name = $('#fName').value.trim(); }
  if (n === 4){ state.title = $('#filmTitle').value.trim() || 'Your film'; state.format = $('#fFormat').value; state.runtime = parseInt($('#fRuntime').value, 10) || 0; state.lang = $('#fLang').value; state.genre = $('#fGenre').value; state.country = $('#fCountry').value; }
  if (n === 5){ state.premiere = ($('[data-group="premiere"] [aria-pressed="true"]') || {}).dataset?.val || state.premiere; }
  if (n === 6){ state.budget = Math.max(0, parseInt($('#budgetInput').value, 10) || 0); }
  if (n === 7){ state.goal = ($('[data-group="goal"] [aria-pressed="true"]') || {}).dataset?.val || state.goal; }
}
$('#view-intake').addEventListener('click', e => {
  const opt = e.target.closest('.opt, .chipopt');
  if (opt){ const g = opt.closest('[data-group]'); $$('.opt, .chipopt', g).forEach(o => o.setAttribute('aria-pressed', o === opt ? 'true' : 'false'));
    if (g.dataset.group === 'role'){ state.role = opt.dataset.val; $('#roleNext').disabled = false; $('#roleHint').textContent = 'Nice. ' + opt.dataset.val + ' it is.'; }
    if (!RM) gsap.fromTo(opt, { scale:.96 }, { scale:1, duration:.8, ease:'elastic.out(1.2, .5)' }); return; }
  if (e.target.closest('[data-next]')){
    const btn = e.target.closest('[data-next]'); if (btn.disabled) return;
    readStep(state.step);
    if (state.editing){ state.editing = false; go('dash'); toast('Updated. Festy recalculated the plan.'); return; }
    showStep(state.step + 1); return; }
  if (e.target.closest('[data-prev]')){ showStep(Math.max(0, state.step - 1)); }
});
$('#view-intake').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('.step input')){ e.preventDefault(); const b = $('.step.is-active [data-next]:not(.google)'); b && !b.disabled && b.click(); } });

/* =========================== DASHBOARD =========================== */
function applyState(){
  $$('.filmName').forEach(el => el.textContent = state.title);
  const nm = state.name || 'Isha Salvi'; $('#profileName').textContent = nm;
  const ini = nm.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase(); $('#initials').textContent = ini; $('#composerAv').textContent = ini[0];
  $$('.directorName').forEach(el => el.textContent = nm);
  $('#filmMeta').textContent = `${state.lang} ${state.format.toLowerCase()}, ${state.runtime} min, ${inr(state.budget)} budget`;
  $$('.budgetTotal').forEach(el => el.textContent = inr(state.budget));
  $('#budgetPct').textContent = state.budget ? Math.round(34859 / state.budget * 100) + '% of total used' : 'Set a budget to see usage';
  $('#remaining').textContent = inr(Math.max(0, state.budget - 4769));
  $('#perSel').textContent = '~' + inr(state.budget / 1.8) + ' per expected selection, at current odds';
  $('#dFormat').textContent = state.format; $('#dRuntime').textContent = state.runtime + ' minutes'; $('#dLang').textContent = state.lang; $('#dGenre').textContent = state.genre; $('#dCountry').textContent = state.country;
}
const askBtn = () => `<span class="ask"><button class="btn hov" data-ask-btn><span class="chars" data-chars>Ask Festy</span><svg class="arr" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 8L8 2M3 2h5v5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></button></span>`;
function buildDash(){
  $$('#view-dash .dcard[data-context]').forEach(c => c.insertAdjacentHTML('afterbegin', askBtn()));
  // festivals grid
  $('#festGrid').innerHTML = GRID_ORDER.map(k => { const f = FEST[k]; return `<article class="ftile" data-k="${k}" data-cats="${f.cats}" data-mode="${f.mode}" data-fit="${f.fit}" data-fee="${f.fee}" data-deadline="${f.deadline}"
    data-context="${f.name}: ${f.badge}" data-chips="Would this fit my film?|Add this to my plan|Show me similar festivals">${askBtn()}<div class="tile" data-tile="${k}"></div>
    <span class="ft-badge ${f.bcls}">${f.badge}</span><p class="ft-name">${f.name}</p><p class="ft-loc">${f.city}</p><p class="ft-meta">${f.meta}</p><p class="ft-urg"></p><p class="ft-reason">${f.reason}</p></article>`; }).join('');
  const facets = [['cat','Focus',[['all','All'],['oscar','Oscar-qualifying'],['bafta','BAFTA-qualifying'],['shorts','Shorts'],['india','India']]],
    ['mode','Mode',[['all','All'],['offline','Offline'],['hybrid','Hybrid']]],
    ['fee','Entry fee',[['all','All'],['under5k','Under ₹5,000'],['5to8k','₹5,000 to ₹8,000'],['tbc','Not yet confirmed']]],
    ['deadline','Deadline',[['all','All'],['next30','Next 30 days'],['next90','Next 90 days'],['passed','Already closed']]]];
  $('#rail').innerHTML = facets.map(([k, t, opts]) => `<div class="facet" data-facet="${k}"><p class="facet-t">${t}</p>${opts.map(([v, l], i) => `<button class="facet-opt" data-fval="${v}" aria-pressed="${i ? 'false' : 'true'}"><span>${l}</span><span class="c"></span></button>`).join('')}</div>`).join('');
  fillTiles($('#view-dash')); initChars($('#view-dash'));
}
const REF = new Date('2026-08-01');
const feeB = f => (f = +f, f >= 99999 ? 'tbc' : f < 5000 ? 'under5k' : '5to8k');
const dlB = d => { const days = Math.round((new Date(d) - REF) / 864e5); return days < 0 ? 'passed' : days <= 30 ? 'next30' : days <= 90 ? 'next90' : 'later'; };
function matches(t, skip, sel){
  const cats = (t.dataset.cats || '').split(' ');
  if (skip !== 'cat' && sel.cat !== 'all' && !cats.includes(sel.cat)) return false;
  if (skip !== 'mode' && sel.mode !== 'all' && t.dataset.mode !== sel.mode) return false;
  if (skip !== 'fee' && sel.fee !== 'all' && feeB(t.dataset.fee) !== sel.fee) return false;
  if (skip !== 'deadline' && sel.deadline !== 'all' && dlB(t.dataset.deadline) !== sel.deadline) return false;
  return true;
}
function filterFests(){
  const q = $('#festSearch').value.trim().toLowerCase(), sel = {};
  ['cat','mode','fee','deadline'].forEach(f => sel[f] = $(`.facet[data-facet="${f}"] [aria-pressed="true"]`).dataset.fval);
  const tiles = $$('#festGrid .ftile'); let vis = 0;
  tiles.forEach(t => {
    const u = $('.ft-urg', t), b = dlB(t.dataset.deadline), lab = new Date(t.dataset.deadline).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
    u.className = 'ft-urg' + (b === 'passed' ? ' ended' : b === 'next30' ? ' soon' : '');
    u.textContent = b === 'passed' ? 'Festival ended' : b === 'next30' ? 'Deadline soon, ends ' + lab : b === 'next90' ? 'Ends ' + lab : 'Open, ends ' + lab;
    const txt = ($('.ft-name', t).textContent + ' ' + $('.ft-loc', t).textContent).toLowerCase();
    const show = (!q || txt.includes(q)) && matches(t, null, sel); t.hidden = !show; if (show) vis++;
  });
  $$('.facet').forEach(g => { const f = g.dataset.facet; $$('.facet-opt', g).forEach(o => { const v = o.dataset.fval; let c = 0;
    tiles.forEach(t => { if (!matches(t, f, sel)) return; if (v === 'all') return c++;
      if ((f === 'cat' && (t.dataset.cats || '').split(' ').includes(v)) || (f === 'mode' && t.dataset.mode === v) || (f === 'fee' && feeB(t.dataset.fee) === v) || (f === 'deadline' && dlB(t.dataset.deadline) === v)) c++; });
    $('.c', o).textContent = c; }); });
  $('#festEmpty').hidden = vis !== 0; $('#festGrid').hidden = vis === 0;
}
function sortFests(){
  const by = $('#festSort').value, g = $('#festGrid');
  $$('.ftile', g).sort((a, b) => by === 'fit' ? b.dataset.fit - a.dataset.fit : by === 'fee' ? a.dataset.fee - b.dataset.fee : new Date(a.dataset.deadline) - new Date(b.dataset.deadline)).forEach(t => g.appendChild(t));
  if (!RM) gsap.fromTo($$('.ftile:not([hidden])', g), { y:30, opacity:0 }, { y:0, opacity:1, duration:.9, ease:'expo.out', stagger:.05 });
}
function animIn(el){ if (RM) return; gsap.fromTo(el.children, { y:40, opacity:0 }, { y:0, opacity:1, duration:1.1, ease:'expo.out', stagger:.06, clearProps:'transform,opacity' }); }
function showDPage(p, first){
  $$('[data-dpage]').forEach(el => { if (el.classList.contains('dpage')) el.classList.toggle('is-active', el.dataset.dpage === p); });
  $$('#dashNav a').forEach(a => a.classList.toggle('is-current', a.dataset.dpage === p));
  $$('#dashTabs a').forEach(a => a.setAttribute('aria-pressed', a.dataset.dpage === p));
  if (p === 'festivals'){ filterFests(); }
  const pg = $(`.dpage[data-dpage="${p}"]`);
  if (!first) scrollToTarget(0, true);
  if (!RM && p === 'dashboard'){ gsap.fromTo('#view-dash .side > *', { y:30, opacity:0 }, { y:0, opacity:1, duration:1.1, ease:'expo.out', stagger:.05, delay: first ? .5 : 0, clearProps:'transform,opacity' }); animIn($('.dview.is-active')); }
  else animIn(pg);
}
function showDView(v){
  $$('.side-item').forEach(i => i.classList.toggle('is-current', i.dataset.dview === v));
  $$('.dview').forEach(d => d.classList.toggle('is-active', d.dataset.dview === v));
  animIn($(`.dview[data-dview="${v}"]`));
  if (window.innerWidth < 992) scrollToTarget($('#dmain'));
}
$('#view-dash').addEventListener('click', e => {
  const dp = e.target.closest('[data-dpage]'); if (dp && !dp.classList.contains('dpage')){ e.preventDefault(); showDPage(dp.dataset.dpage); return; }
  const si = e.target.closest('.side-item[data-dview]'); if (si){ showDView(si.dataset.dview); return; }
  const vg = e.target.closest('[data-view-go]'); if (vg){ showDView(vg.dataset.viewGo); return; }
  const st = e.target.closest('[data-view-go-step]'); if (st){ state.editing = true; go('intake', { step: +st.dataset.viewGoStep }); return; }
  const ab = e.target.closest('[data-ask-btn]'); if (ab){ openFesty(ab.closest('[data-context]')); return; }
  const pr = e.target.closest('.profile'); if (pr){ openFesty(pr); return; }
  const fo = e.target.closest('.facet-opt'); if (fo){ $$('.facet-opt', fo.parentElement).forEach(o => o.setAttribute('aria-pressed', o === fo)); filterFests(); return; }
  const lk = e.target.closest('[data-like]'); if (lk){ const on = lk.classList.toggle('is-liked'); const n = parseInt(lk.textContent, 10) + (on ? 1 : -1); lk.textContent = n + ' likes'; lk.style.color = on ? 'var(--red)' : ''; return; }
  const fl = e.target.closest('[data-follow]'); if (fl){ const s = $('.chars', fl); const on = s.getAttribute('aria-label') !== 'Following'; s.dataset.done = ''; s.textContent = on ? 'Following' : 'Follow'; initChars(fl); fl.classList.toggle('is-red', on); fl.classList.toggle('is-ghost', !on); return; }
  const ap = e.target.closest('[data-apply]'); if (ap){ const role = ap.closest('tr').firstElementChild.textContent; toast('Application started for ' + role + '. The organizer will see your profile.'); return; }
  const cr = e.target.closest('#crewChips .chipf'); if (cr){ $$('#crewChips .chipf').forEach(c => c.setAttribute('aria-pressed', c === cr)); filterCrew(); return; }
});
$('#festSearch').addEventListener('input', filterFests);
$('#festSort').addEventListener('change', sortFests);
function filterCrew(){
  const q = $('#crewSearch').value.trim().toLowerCase(), role = $('#crewChips [aria-pressed="true"]').dataset.role; let vis = 0;
  $$('#jobsTable tr[data-role], #crewGrid [data-role]').forEach(el => { const show = (role === 'all' || el.dataset.role === role) && (!q || el.dataset.text.includes(q)); el.hidden = !show; if (show) vis++; });
  $('#crewEmpty').hidden = vis !== 0;
}
$('#crewSearch').addEventListener('input', filterCrew);
$('#composer').addEventListener('submit', e => {
  e.preventDefault(); const v = $('#postInput').value.trim(); if (!v) return;
  const nm = state.name || 'Isha Salvi';
  $('#posts').insertAdjacentHTML('afterbegin', `<article class="dcard"><div class="post-head"><span class="av is-red">${nm[0].toUpperCase()}</span><div><p class="post-name"></p><p class="post-meta">${state.role || 'Director'}, just now</p></div></div><p class="post-body"></p><div class="post-actions"><button data-like>0 likes</button><span>0 comments</span></div></article>`);
  const a = $('#posts').firstElementChild; $('.post-name', a).textContent = nm; $('.post-body', a).textContent = v; $('#postInput').value = '';
  if (!RM) gsap.from(a, { y:-30, opacity:0, duration:1, ease:'expo.out' });
});
$('#confirmAward').addEventListener('click', () => {
  $('#trackRows').insertAdjacentHTML('afterbegin', '<div class="frow"><span>Kolkata Shorts Fest</span><span>Best Cinematography, confirmed win</span></div>');
  const c = $('#awardCard'); gsap.to(c, { height:0, opacity:0, padding:0, margin:0, duration:.6, ease:'expo.inOut', onComplete:() => c.remove() });
  const cnt = $('[data-dview="awards"] .count'); if (cnt) cnt.remove(); toast('Win confirmed and added to your track record.');
});
$('#dismissAward').addEventListener('click', () => { const c = $('#awardCard'); gsap.to(c, { height:0, opacity:0, padding:0, margin:0, duration:.6, ease:'expo.inOut', onComplete:() => c.remove() }); const cnt = $('[data-dview="awards"] .count'); if (cnt) cnt.remove(); toast('Detection dismissed.'); });

/* ---- Festy panel ---- */
const festy = $('#festy'), msgs = $('#msgs');
function openFesty(trigger){
  festy.classList.add('is-open'); festy.setAttribute('aria-hidden', 'false'); $('#fab').setAttribute('aria-expanded', 'true'); $('#hint').hidden = true;
  $$('.contextual', msgs).forEach(el => el.remove());
  const ctx = trigger && trigger.dataset ? trigger.dataset.context : null;
  if (ctx){
    $('#ctxVal').textContent = ctx; $('#festyCtx').classList.add('show'); const sc = $('#startChips'); if (sc) sc.hidden = true;
    msgs.insertAdjacentHTML('beforeend', '<div class="msg bot contextual">Here’s what you can do with this:</div><div class="chips contextual"></div>');
    const chips = msgs.lastElementChild; (trigger.dataset.chips || 'Explain in detail|Change something|Suggest an improvement').split('|').forEach(c => { const b = document.createElement('button'); b.className = 'chip'; b.dataset.say = c; b.textContent = c; chips.appendChild(b); });
  } else { $('#festyCtx').classList.remove('show'); const sc = $('#startChips'); if (sc) sc.hidden = false; }
  msgs.scrollTop = msgs.scrollHeight; setTimeout(() => $('#chatInput').focus(), 350);
}
function closeFesty(){ festy.classList.remove('is-open'); festy.setAttribute('aria-hidden', 'true'); $('#fab').setAttribute('aria-expanded', 'false'); }
function reply(text){
  const t = text.toLowerCase(), b = inr(state.budget);
  if (/78|confidence/.test(t)) return `Confidence is 78 because four answers are still missing: past screenings, cast notability, distribution status, and whether you have a sales agent. Each one you add tightens which festivals are realistic for ${state.title}.`;
  if (/budget|cheaper|eating|spend/.test(t)) return `You’ve planned ₹34,859 of ${b}. Slamdance is the only confirmed fee so far (₹4,769). Busan, Rotterdam and Tokyo haven’t confirmed fees, so I’m not counting them yet.`;
  if (/swap|safer/.test(t)) return `A safer Phase 1 swap would be Kolkata Shorts Fest in place of Tokyo. It’s actively looking for ${state.lang} work this cycle and won’t touch your world premiere.`;
  if (/why these|order|disagree/.test(t)) return `The order protects your premiere: festivals that would use your world premiere come first only if they’re a genuine fit. Tell me which one you’d move and I’ll show what that changes.`;
  if (/premiere|pending/.test(t)) return `World and international are open. National is pending because one screening hasn’t been confirmed. Until it is, I keep national-premiere festivals out of Phase 1.`;
  if (/profile|epk|director statement|missing/.test(t)) return `Five EPK fields are missing: medium synopsis, director statement, contact email, poster and stills. Programmers read the director statement first, so start there.`;
  return `Got it. In the full product I’d make that change on your dashboard directly. For now, everything I suggest for ${state.title} stays a suggestion until you confirm it.`;
}
function say(text){
  if (!text) return; const sc = $('#startChips'); if (sc) sc.remove();
  const u = document.createElement('div'); u.className = 'msg user'; u.textContent = text; msgs.appendChild(u);
  const r = document.createElement('div'); r.className = 'msg bot'; r.textContent = '…'; msgs.appendChild(r); msgs.scrollTop = msgs.scrollHeight;
  setTimeout(() => { r.textContent = reply(text); msgs.scrollTop = msgs.scrollHeight; }, 650);
}
$('#festyForm').addEventListener('submit', e => { e.preventDefault(); const i = $('#chatInput'); say(i.value.trim()); i.value = ''; });
msgs.addEventListener('click', e => { const c = e.target.closest('[data-say]'); if (c) say(c.dataset.say); });
$('#fab').addEventListener('click', () => festy.classList.contains('is-open') ? closeFesty() : openFesty(null));
$('#festyClose').addEventListener('click', closeFesty);
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && state.view === 'dash'){ e.preventDefault(); openFesty(null); }
  if (e.key === 'Escape'){ closeFesty(); closeMenu(); }
});

/* =========================== BOOT =========================== */
buildHome(); buildDash(); setTimeout(() => { const h = $('#hint'); if (h) gsap.to(h, { autoAlpha:0, duration:.6, delay:8, onComplete:() => h.hidden = true }); }, 0); fillTiles(); initChars();
let lastW = window.innerWidth, rT;
window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { if (window.innerWidth !== lastW){ lastW = window.innerWidth; fitMarks(); ScrollTrigger.refresh(); } }, 200); });
window.addEventListener('pageshow', e => { if (e.persisted) location.reload(); });
const fontsReady = Promise.race([Promise.all([document.fonts.load('420 100px Fraunces'), document.fonts.load('100px Universo'), document.fonts.load('600 20px Mosvita'), document.fonts.load('100px "The Patience"')]).then(() => document.fonts.ready), new Promise(r => setTimeout(r, 2500))]);
document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', () => { fitMarks(); ScrollTrigger.refresh(); });
fontsReady.then(() => {
  const route = () => { const p = location.pathname.replace(/\/+$/, ''), h = location.hash;
    return (h === '#start' || p.endsWith('/start')) ? 'intake' : (h === '#dashboard' || p.endsWith('/dashboard')) ? 'dash' : 'home'; };
  window.addEventListener('popstate', () => { const r = route(); if (r !== state.view) go(r); });
  const start = route();
  setView(start); if (start !== 'home') firstLoad = false;
  enterView(start);
  if (RM){ gsap.set(tr, { display:'none' }); return; }
  gsap.to(tr, { delay:.5, y:'-100vh', duration:1, ease:'abcsReveal', onComplete:() => gsap.set(tr, { display:'none' }) });
});
})();
