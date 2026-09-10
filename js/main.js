import { BRAND, PRODUCTS, SETS, AXES, REVIEWS, byId, won } from './data.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(hover: none) and (pointer: coarse)').matches;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- 커서 → 자개 광택 (--mx/--my) ---------- */
(() => {
  if (coarse) return;
  let tx = 50, ty = 50, cx = 50, cy = 50, raf = 0;
  const tick = () => {
    cx = lerp(cx, tx, .12); cy = lerp(cy, ty, .12);
    document.documentElement.style.setProperty('--mx', cx.toFixed(2));
    document.documentElement.style.setProperty('--my', cy.toFixed(2));
    raf = (Math.abs(cx - tx) > .05 || Math.abs(cy - ty) > .05) ? requestAnimationFrame(tick) : 0;
  };
  addEventListener('pointermove', e => {
    tx = e.clientX / innerWidth * 100; ty = e.clientY / innerHeight * 100;
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
})();

/* ---------- 1. 오프닝 조명: 왼→오 스윕 → 커서 추적 → 스크롤하면 전체 점등 + 살짝 줌아웃 ---------- */
(() => {
  const hero = $('#top'), lit = $('#hero-lit'), lamp = $('#hero-lamp'), stage = $('#hero-stage');
  const copy = $('#hero-copy'), hint = $('#hero-hint');
  if (!lit || reduce) { stage && stage.style.setProperty('--hz', '1'); return; }
  let x = -20, y = 58, tx = 50, ty = 58, r = 30, tr = 30, sp = 0;   // sp = 스크롤 진행 0..1
  let sweeping = true, t0 = performance.now();
  const SWEEP = 3600; // ms, 왼쪽 끝에서 오른쪽 끝까지
  const ease = t => 1 - Math.pow(1 - t, 2.2);
  const smooth = t => t * t * (3 - 2 * t);
  const apply = () => {
    const k = smooth(sp);
    const radius = lerp(r, 260, k);                       // 스크롤 끝에서는 화면 전체를 덮는다 = 조명 전부 켜짐
    lit.style.setProperty('--lx', x + '%'); lit.style.setProperty('--ly', y + '%'); lit.style.setProperty('--lr', radius + 'vw');
    lamp.style.setProperty('--lx', x + '%'); lamp.style.setProperty('--ly', y + '%');
    lamp.style.opacity = (1 - k).toFixed(3);
    stage.style.setProperty('--hz', lerp(1.08, 1, k).toFixed(4));   // 줌아웃
    copy.style.transform = `translateY(${(-40 * k).toFixed(1)}px)`;
    copy.style.opacity = (1 - k * .35).toFixed(3);
    hint.style.opacity = sp > .06 ? 0 : 1;
  };
  const frame = now => {
    if (sweeping) {
      const p = clamp((now - t0) / SWEEP);
      x = -20 + ease(p) * 130; y = 58; r = 24 + p * 10;
      if (p >= 1) sweeping = false;
    } else {
      x = lerp(x, tx, .08); y = lerp(y, ty, .08); r = lerp(r, tr, .08);
    }
    apply();
    if (hero.getBoundingClientRect().bottom > 0) requestAnimationFrame(frame);
    else addEventListener('scroll', () => requestAnimationFrame(frame), { once: true, passive: true });
  };
  const layout = () => { hero.style.height = Math.round(innerHeight * 1.9) + 'px'; onScroll(); };
  const onScroll = () => { sp = clamp(scrollY / Math.max(1, hero.offsetHeight - innerHeight)); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', layout); layout();
  stage.addEventListener('pointermove', e => {
    const b = stage.getBoundingClientRect();
    tx = (e.clientX - b.left) / b.width * 100; ty = (e.clientY - b.top) / b.height * 100; tr = 30;
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { tx = 50; ty = 58; tr = 34; });
  requestAnimationFrame(frame);
})();

/* ---------- 리퀴드 글라스: 자개 테두리 빛
   평소엔 대각선(135°)에 짧게 머물고, 커서가 가까워지면 그 방향으로 각도를 돌리며 길게 늘어난다. ---------- */
(() => {
  if (coarse) return;
  let px = innerWidth / 2, py = innerHeight * .3, raf = 0;
  const angles = new WeakMap();      // 요소별 누적 각도 (360° 경계에서 튀지 않게)
  const REACH = 320;                 // 이 거리(px) 안에 들어오면 빛이 반응한다
  const update = () => {
    raf = 0;
    for (const g of $$('.glass')) {
      const b = g.getBoundingClientRect();
      if (b.bottom < -200 || b.top > innerHeight + 200) continue;
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      // 카드 가장자리까지의 거리
      const dx = Math.max(b.left - px, 0, px - b.right), dy = Math.max(b.top - py, 0, py - b.bottom);
      const dist = Math.hypot(dx, dy);
      const near = clamp(1 - dist / REACH);
      const eased = near * near * (3 - 2 * near);
      let target = eased > 0.02 ? Math.atan2(py - cy, px - cx) * 180 / Math.PI + 90 : 135;
      let cur = angles.get(g) ?? 135;
      let d = ((target - cur) % 360 + 540) % 360 - 180;     // 최단 회전 방향
      cur += d; angles.set(g, cur);
      g.style.setProperty('--ga', cur.toFixed(1));
      g.style.setProperty('--arc', (70 + eased * 150).toFixed(1));    // 70° → 220°
      g.style.setProperty('--near', eased.toFixed(3));
      g.style.setProperty('--gx', ((px - b.left) / b.width * 100).toFixed(1) + '%');
      g.style.setProperty('--gy', ((py - b.top) / b.height * 100).toFixed(1) + '%');
    }
  };
  addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  update();
})();

/* ---------- 후기: 3D 세로 마퀴 4열 ---------- */
(() => {
  const host = $('#review-marquee'); if (!host) return;
  const card = r => `
    <article class="review glass">
      <div class="review-head"><span class="review-avatar">${r.name[0]}</span>
        <div><div class="review-name">${r.name}<small>${r.where}</small></div></div></div>
      <p>${r.body}</p>
    </article>`;
  const col = (items, reverse, dur) => `
    <div class="marquee${reverse ? ' reverse' : ''}" style="--duration:${dur}s">
      ${[0, 1, 2].map(() => `<div class="marquee-track">${items.map(card).join('')}</div>`).join('')}
    </div>`;
  const rot = n => [...REVIEWS.slice(n), ...REVIEWS.slice(0, n)];
  host.innerHTML = col(rot(0), false, 42) + col(rot(3), true, 46) + col(rot(6), false, 40) + col(rot(2), true, 44);
})();

/* ---------- 오시는 길: 기울어지는 지도 카드 ---------- */
(() => {
  const card = $('#map-card'); if (!card) return;
  const photo = $('#map-photo');
  if (BRAND.mapImage) { photo.src = BRAND.mapImage; photo.hidden = false; $('.map-roads', card).style.display = 'none'; }
  $('#map-title').textContent = BRAND.address && !BRAND.address.includes('입력') ? BRAND.address : '오시는 길';
  $('#map-coords').textContent = BRAND.coords || BRAND.hours;
  let tx = 0, ty = 0, rx = 0, ry = 0, raf = 0;
  const tick = () => {
    rx = lerp(rx, tx, .18); ry = lerp(ry, ty, .18);
    card.style.setProperty('--rx', rx.toFixed(2) + 'deg'); card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    raf = (Math.abs(rx - tx) > .02 || Math.abs(ry - ty) > .02) ? requestAnimationFrame(tick) : 0;
  };
  card.addEventListener('pointermove', e => {
    const b = card.getBoundingClientRect();
    const mx = e.clientX - (b.left + b.width / 2), my = e.clientY - (b.top + b.height / 2);
    tx = clamp(my / (b.height / 2), -1, 1) * -8; ty = clamp(mx / (b.width / 2), -1, 1) * 8;
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
  card.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); });
  const toggle = () => { const on = card.classList.toggle('expanded'); card.setAttribute('aria-expanded', on); };
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
})();

/* ---------- 스크롤 따라 단어별로 드러나는 제목/부제 (취향 섹션부터) ---------- */
(() => {
  const els = $$('.reveal-words'); if (!els.length) return;
  const items = els.map(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w"><span class="w-ghost" aria-hidden="true">${w}</span><span class="w-ink">${w}</span></span>`).join('');
    return { el, inks: $$('.w-ink', el), n: words.length };
  });
  let raf = 0;
  const update = () => {
    raf = 0;
    for (const { el, inks, n } of items) {
      const top = el.getBoundingClientRect().top;
      // 요소 상단이 화면 90% 지점에 들어올 때 시작, 25% 지점에서 끝 (MagicText offset ["start 0.9","start 0.25"])
      const p = reduce ? 1 : clamp((innerHeight * .9 - top) / (innerHeight * .65));
      inks.forEach((ink, i) => ink.style.setProperty('--o', clamp((p - i / n) * n).toFixed(3)));
    }
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  addEventListener('resize', update); update();
})();

/* ---------- 2/3/4. 스크롤 스크럽 ----------
   섹션 높이 = data-vh × 100vh, 안쪽 .scrub-pin 은 sticky.
   진행률(0..1) → video.currentTime. 클립은 Blob 으로 받아 항상 seek 가능하게 한다. */
class Scrub {
  constructor(el) {
    this.el = el; this.pin = $('.scrub-pin', el);
    this.video = $('.scrub-video', el); this.loop = $('.scrub-loop', el);
    this.clip = el.dataset.clip; this.loopSrc = el.dataset.loop; this.loopAt = Number(el.dataset.loopAt || 1);
    this.vh = Number(el.dataset.vh || 3);
    this.copies = $$('.scrub-copy', el).map(c => { const [a, b] = c.dataset.at.split('-').map(Number); return { c, a, b }; });
    this.p = 0; this.target = 0; this.loaded = false; this.loopOn = false; this.raf = 0;
    this.layout();
    new IntersectionObserver(en => { if (en.some(e => e.isIntersecting)) { this.load(); } }, { rootMargin: '120% 0px' }).observe(el);
    addEventListener('scroll', () => this.onScroll(), { passive: true });
    addEventListener('resize', () => this.layout());
  }
  layout() { this.el.style.height = Math.round(this.vh * innerHeight) + 'px'; this.onScroll(); }
  async load() {
    if (this.loaded) return; this.loaded = true;
    try {
      const b = await (await fetch(this.clip)).blob();
      this.video.src = URL.createObjectURL(b);
    } catch { this.video.src = this.clip; }
    this.video.load();
    this.video.addEventListener('loadedmetadata', () => { this.seek(true); }, { once: true });
    if (this.loopSrc) { this.loop.src = this.loopSrc; this.loop.load(); }
  }
  onScroll() {
    const r = this.el.getBoundingClientRect();
    const total = this.el.offsetHeight - innerHeight;
    this.target = clamp(-r.top / Math.max(1, total));
    if (!this.raf) this.raf = requestAnimationFrame(() => this.tick());
  }
  tick() {
    this.raf = 0;
    const prev = this.p;
    this.p = coarse ? this.target : lerp(this.p, this.target, .22);
    if (Math.abs(this.p - this.target) < .0005) this.p = this.target;
    this.seek();
    this.copy();
    this.handoff();
    if (this.p !== this.target && this.p !== prev) this.raf = requestAnimationFrame(() => this.tick());
  }
  seek(force) {
    const v = this.video, d = v.duration;
    if (!d || (v.seeking && !force)) return;
    const t = this.p * (d - .04);
    if (Math.abs(v.currentTime - t) > 1 / 60 || force) v.currentTime = t;
  }
  copy() {
    for (const { c, a, b } of this.copies) {
      const fade = .07;
      const o = clamp((this.p - a) / fade) * clamp((b - this.p) / fade);
      c.style.opacity = o.toFixed(3);
      const ty = (1 - o) * 14;
      c.style.transform = c.classList.contains('center') ? `translate(-50%, ${ty}px)` : `translateY(${ty}px)`;
    }
  }
  handoff() {
    if (!this.loopSrc) return;
    const on = this.p >= this.loopAt;
    if (on === this.loopOn) return; this.loopOn = on;
    this.loop.classList.toggle('on', on); this.video.classList.toggle('hidden', on);
    if (on) this.loop.play().catch(() => {}); else this.loop.pause();
  }
}
$$('.scrub').forEach(el => new Scrub(el));

/* ---------- 7. 색 변화 (검붉은 → 선홍) ---------- */
(() => {
  const sec = $('#bloom'); if (!sec) return;
  const img = $('#bloom-img'), steps = $$('#bloom-steps li'), timer = $('#bloom-timer');
  const vh = Number(sec.dataset.vh || 3);
  const layout = () => sec.style.height = Math.round(vh * innerHeight) + 'px';
  layout(); addEventListener('resize', layout);
  let p = 0, target = 0, raf = 0;
  const tick = () => {
    raf = 0; p = lerp(p, target, .2); if (Math.abs(p - target) < .001) p = target;
    const k = clamp((p - .1) / .75);            // 0.1~0.85 구간에서 색이 돌아온다
    const e = k * k * (3 - 2 * k);
    img.style.filter = `saturate(${lerp(.32, 1, e).toFixed(3)}) brightness(${lerp(.5, 1, e).toFixed(3)}) sepia(${lerp(.35, 0, e).toFixed(3)}) hue-rotate(${lerp(-24, 0, e).toFixed(1)}deg) contrast(${lerp(1.05, 1, e).toFixed(3)})`;
    steps.forEach(li => li.classList.toggle('on', p >= Number(li.dataset.at)));
    timer.textContent = Math.round(e * 20) + '분';
    if (p !== target) raf = requestAnimationFrame(tick);
  };
  addEventListener('scroll', () => {
    const r = sec.getBoundingClientRect();
    target = clamp(-r.top / Math.max(1, sec.offsetHeight - innerHeight));
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
})();

/* ---------- 5. 취향 추천 ---------- */
(() => {
  const axesEl = $('#taste-axes'); if (!axesEl) return;
  const state = { soft: .35, nutty: .65, marble: .7, done: .45 };
  axesEl.innerHTML = AXES.map(a => `
    <div class="axis">
      <div class="axis-labels"><b data-side="l">${a.left}</b><b data-side="r">${a.right}</b></div>
      <input type="range" name="${a.key}" min="0" max="100" value="${Math.round(state[a.key] * 100)}" aria-label="${a.left}에서 ${a.right}" />
    </div>`).join('');
  const inputs = $$('input[type=range]', axesEl);
  const paint = inp => {
    inp.style.setProperty('--v', inp.value + '%');
    const [l, r] = $$('b', inp.parentElement);
    l.classList.toggle('dim', inp.value > 60); r.classList.toggle('dim', inp.value < 40);
  };
  const dist = (a, b) => Math.sqrt(AXES.reduce((s, ax) => s + (a[ax.key] - b[ax.key]) ** 2, 0));
  const match = d => Math.round((1 - d / 2) * 100);
  const render = () => {
    const budget = Number($('input[name=budget]:checked').value);
    const people = Number($('input[name=people]:checked').value);
    const set = SETS.find(s => s.budget === budget) || SETS[1];
    const grams = people * 200;
    $('#taste-set').innerHTML = `
      <p class="kicker">추천 세트 · ${people}인 기준 약 ${grams}g · 취향 일치 ${match(dist(state, set))}%</p>
      <h3>${set.name}</h3>
      <p class="price">${set.note} · ${won(set.price)}</p>
      <div class="items">${set.items.map(id => `<span>${byId(id).name}</span>`).join('')}</div>
      <button class="btn-glass glass" type="button" data-add-set="${set.id}">세트 담기</button>`;
    const picks = PRODUCTS.map(p => ({ p, d: dist(state, p) })).sort((x, y) => x.d - y.d).slice(0, 3);
    $('#taste-picks').innerHTML = picks.map(({ p, d }) => `
      <a class="pick glass" href="products/${p.id}.html"><img src="${p.img}" alt="${p.name}" loading="lazy" /><b class="shine">${p.name}</b><small>${match(d)}% 일치</small></a>`).join('');
  };
  inputs.forEach(inp => { paint(inp); inp.addEventListener('input', () => { state[inp.name] = inp.value / 100; paint(inp); render(); }); });
  $('#taste-form').addEventListener('change', render);
  render();
})();

/* ---------- 6. 상품 카드 ---------- */
(() => {
  const grid = $('#product-grid'); if (!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="card glass" id="p-${p.id}">
      <a class="card-media" href="products/${p.id}.html" aria-label="${p.name} 상세 보기">
        <img class="main" src="${p.img}" alt="${p.name}" loading="lazy" />
        <img class="alt" src="${p.pack}" alt="${p.name} 스킨포장" loading="lazy" />
      </a>
      <div class="card-head"><h3 class="shine"><a href="products/${p.id}.html">${p.name}</a></h3><span class="grade">1++</span></div>
      <small class="muted">${p.en} · 100g ${won(p.price100)}</small>
      <p>${p.desc}</p>
      <div class="card-foot"><a class="more" href="products/${p.id}.html">자세히 보기</a><a class="btn-glass glass" href="products/${p.id}.html">주문하기</a></div>
    </article>`).join('');
})();

/* ---------- 8. 선물세트 ---------- */
(() => {
  const grid = $('#set-grid'); if (!grid) return;
  grid.innerHTML = SETS.map(s => `
    <article class="set-tile glass">
      <p class="kicker">${s.note}</p>
      <h3>${s.name}</h3>
      <p class="price">${won(s.price)}</p>
      <div class="items">${s.items.map(id => `<span>${byId(id).name}</span>`).join('')}</div>
      <button class="btn-glass glass" type="button" data-add-set="${s.id}">세트 담기</button>
    </article>`).join('');
})();

/* ---------- 모바일 메뉴 ---------- */
(() => {
  const btn = $('#menu-btn'), menu = $('#mobile-menu'); if (!btn || !menu) return;
  const set = on => { menu.classList.toggle('on', on); btn.setAttribute('aria-expanded', on); document.body.style.overflow = on ? 'hidden' : ''; };
  btn.addEventListener('click', () => set(true));
  $('#menu-x').addEventListener('click', () => set(false));
  $$('a', menu).forEach(a => a.addEventListener('click', () => set(false)));
  $('#mm-cart')?.addEventListener('click', () => { set(false); document.querySelector('.cart-btn')?.click(); });
})();

/* ---------- 내비 · 연락처 ---------- */
(() => {
  const nav = $('#nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });
  const links = $$('.nav-links a');
  const io = new IntersectionObserver(en => {
    en.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  links.forEach(a => { const h = a.getAttribute('href'); if (!h.startsWith('#')) return; const t = $(h); if (t) io.observe(t); });
  const tel = `tel:${BRAND.tel}`;
  const set = (id, fn) => { const el = $(id); if (el) fn(el); };
  set('#nav-call', el => el.href = tel);
  set('#foot-tel', el => { el.href = tel; el.textContent = BRAND.tel; });
  set('#foot-address', el => el.textContent = BRAND.address); set('#foot-hours', el => el.textContent = BRAND.hours);
  set('#foot-store', el => el.href = BRAND.store); set('#foot-kakao', el => el.href = BRAND.kakao); set('#foot-insta', el => el.href = BRAND.instagram);
})();
