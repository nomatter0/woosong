// 장바구니 — localStorage 에 저장. 메인·상세·주문서 페이지가 공유한다.
//   항목: { kind:'product', id, weight }  |  { kind:'set', id, qty }
import { BRAND, PRODUCTS, SETS, byId, won } from './data.js';

const KEY = 'woosong-cart';
const ROOT = document.body.dataset.root || '';           // 상세페이지는 '../'
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
export const save = items => { localStorage.setItem(KEY, JSON.stringify(items)); dispatchEvent(new CustomEvent('cart:change', { detail: items })); };
export const lineTotal = it => it.kind === 'set' ? SETS.find(s => s.id === it.id).price * it.qty : byId(it.id).price100 * it.weight / 100;
export const subtotal = items => items.reduce((s, it) => s + lineTotal(it), 0);
export const shippingFor = sub => (sub <= 0 || (BRAND.freeShippingOver && sub >= BRAND.freeShippingOver)) ? 0 : BRAND.shipping;
export const count = items => items.reduce((n, it) => n + (it.kind === 'set' ? it.qty : 1), 0);

export function addProduct(id, weight) {
  const items = load();
  const hit = items.find(it => it.kind === 'product' && it.id === id);
  if (hit) hit.weight = Math.min(byId(id).weight[2], hit.weight + weight); else items.push({ kind: 'product', id, weight });
  save(items); open(); return items;
}
export function addSet(id, qty = 1) {
  const items = load();
  const hit = items.find(it => it.kind === 'set' && it.id === id);
  if (hit) hit.qty += qty; else items.push({ kind: 'set', id, qty });
  save(items); open(); return items;
}
export function remove(index) { const items = load(); items.splice(index, 1); save(items); }
export function clear() { save([]); }

// 주문 내용 텍스트 (문자·카카오톡·복사용)
export function orderText(items, form = {}) {
  const lines = items.map(it => it.kind === 'set'
    ? `${SETS.find(s => s.id === it.id).name} × ${it.qty} — ${won(lineTotal(it))}`
    : `${byId(it.id).name} ${it.weight}g — ${won(lineTotal(it))}`);
  const sub = subtotal(items), ship = shippingFor(sub);
  const out = ['[우송 牛松 주문]', ...lines, `상품 ${won(sub)} + 배송 ${ship ? won(ship) : '무료'} = 합계 ${won(sub + ship)}`];
  if (form.name) out.push('', `이름: ${form.name}`, `연락처: ${form.phone}`, `주소: ${form.address} ${form.address2 || ''}`.trim());
  if (form.date) out.push(`희망일: ${form.date}`);
  if (form.memo) out.push(`요청: ${form.memo}`);
  if (form.pay) out.push(`결제: ${form.pay}`);
  return out.join('\n');
}

/* ---------- 서랍 UI ---------- */
let drawer, badge;
function mount() {
  if (drawer) return;
  drawer = document.createElement('aside');
  drawer.className = 'cart'; drawer.id = 'cart'; drawer.setAttribute('aria-label', '장바구니'); drawer.hidden = true;
  drawer.innerHTML = `
    <div class="cart-backdrop" data-close></div>
    <div class="cart-panel glass">
      <header class="cart-head"><h2 class="nacre">장바구니</h2><button class="cart-x" type="button" data-close aria-label="닫기">×</button></header>
      <div class="cart-items" id="cart-items"></div>
      <footer class="cart-foot">
        <div class="cart-sum"><span>상품</span><b id="cart-sub"></b></div>
        <div class="cart-sum"><span>배송</span><b id="cart-ship"></b></div>
        <div class="cart-sum total"><span>합계</span><b id="cart-total"></b></div>
        <a class="btn-glass glass primary" id="cart-checkout" href="${ROOT}checkout.html">주문하기</a>
        <p class="cart-note" id="cart-note"></p>
      </footer>
    </div>`;
  document.body.appendChild(drawer);
  drawer.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) close(); });
  drawer.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const items = load(), i = Number(b.dataset.i), it = items[i];
    if (b.dataset.act === 'rm') items.splice(i, 1);
    else if (it.kind === 'set') { it.qty = Math.max(1, it.qty + Number(b.dataset.act)); }
    else { const [mn, , mx] = byId(it.id).weight; it.weight = Math.min(mx, Math.max(mn, it.weight + 100 * Number(b.dataset.act))); }
    save(items);
  });
}
export function open() { mount(); render(); drawer.hidden = false; requestAnimationFrame(() => drawer.classList.add('on')); document.body.classList.add('cart-open'); }
export function close() { if (!drawer) return; drawer.classList.remove('on'); document.body.classList.remove('cart-open'); setTimeout(() => { drawer.hidden = true; }, 350); }

function render() {
  const items = load();
  const host = $('#cart-items');
  if (!items.length) host.innerHTML = `<p class="cart-empty">아직 담긴 상품이 없습니다.<br /><a href="${ROOT}index.html#products">부위 보러 가기</a></p>`;
  else host.innerHTML = items.map((it, i) => {
    if (it.kind === 'set') { const s = SETS.find(x => x.id === it.id); return `
      <div class="cart-item">
        <img src="${ROOT}assets/img/pack-set.webp" alt="" />
        <div class="cart-item-body"><b>${s.name}</b><small>${s.note}</small>
          <div class="stepper sm"><button type="button" class="step" data-act="-1" data-i="${i}" aria-label="줄이기">−</button><output>${it.qty}개</output><button type="button" class="step" data-act="1" data-i="${i}" aria-label="늘리기">+</button></div></div>
        <div class="cart-item-right"><b>${won(lineTotal(it))}</b><button type="button" class="cart-rm" data-act="rm" data-i="${i}">삭제</button></div>
      </div>`; }
    const p = byId(it.id); return `
      <div class="cart-item">
        <img src="${ROOT}${p.img}" alt="" />
        <div class="cart-item-body"><b>${p.name}</b><small>100g ${won(p.price100)} · ${p.thickness}</small>
          <div class="stepper sm"><button type="button" class="step" data-act="-1" data-i="${i}" aria-label="100g 줄이기">−</button><output>${it.weight}g</output><button type="button" class="step" data-act="1" data-i="${i}" aria-label="100g 늘리기">+</button></div></div>
        <div class="cart-item-right"><b>${won(lineTotal(it))}</b><button type="button" class="cart-rm" data-act="rm" data-i="${i}">삭제</button></div>
      </div>`;
  }).join('');
  const sub = subtotal(items), ship = shippingFor(sub);
  $('#cart-sub').textContent = won(sub); $('#cart-ship').textContent = ship ? won(ship) : (sub ? '무료' : '—'); $('#cart-total').textContent = won(sub + ship);
  $('#cart-checkout').classList.toggle('disabled', !items.length);
  $('#cart-note').textContent = BRAND.freeShippingOver && sub && sub < BRAND.freeShippingOver ? `${won(BRAND.freeShippingOver - sub)} 더 담으면 무료배송` : '';
  updateBadge(items);
}
function updateBadge(items = load()) {
  const n = count(items);
  $$('.cart-btn').forEach(b => { b.querySelector('.cart-count').textContent = n; b.classList.toggle('has', n > 0); });
}

// 상단 장바구니 버튼 + 페이지 안의 담기 버튼 연결
addEventListener('DOMContentLoaded', () => {
  updateBadge();
  $$('.cart-btn').forEach(b => b.addEventListener('click', e => { e.preventDefault(); open(); }));
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add-set]'); if (a) { e.preventDefault(); addSet(a.dataset.addSet); }
  });
  addEventListener('cart:change', () => { if (drawer && !drawer.hidden) render(); else updateBadge(); });
});
