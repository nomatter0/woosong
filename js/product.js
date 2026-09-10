// 상품 상세페이지: 중량 스텝퍼·금액 계산·사진 전환·장바구니. 글라스/자개/단어 등장 효과는 main.js 가 담당한다.
import { BRAND, PRODUCTS } from './data.js';
import { addProduct, close as closeCart } from './cart.js';

const $ = (s, r = document) => r.querySelector(s);
const won = n => n.toLocaleString('ko-KR') + '원';
const body = document.body;
const p = PRODUCTS.find(x => x.id === body.dataset.id);
if (p) {
  const min = Number(body.dataset.wmin), max = Number(body.dataset.wmax), price100 = Number(body.dataset.price100);
  let w = Number(body.dataset.wdef);
  const out = $('#w-out'), total = $('#pd-total'), people = $('#w-people'), minus = $('#w-minus'), plus = $('#w-plus');
  const render = () => {
    out.value = w + 'g'; out.textContent = w + 'g';
    total.textContent = won(price100 * w / 100);
    people.textContent = Math.max(1, Math.round(w / p.serve));
    minus.disabled = w <= min; plus.disabled = w >= max;
    $('#bar-weight').textContent = w + 'g'; $('#bar-total').textContent = won(price100 * w / 100);
  };
  minus.addEventListener('click', () => { w = Math.max(min, w - 100); render(); });
  plus.addEventListener('click', () => { w = Math.min(max, w + 100); render(); });
  render();

  // 장바구니 담기 / 바로 주문
  const add = () => addProduct(p.id, w);
  const buy = () => { addProduct(p.id, w); closeCart(); location.href = '../checkout.html'; };
  $('#pd-add').addEventListener('click', add); $('#bar-add').addEventListener('click', add);
  $('#pd-buy').addEventListener('click', buy); $('#bar-buy').addEventListener('click', buy);

  // 사진 전환
  const main = $('#pd-main-img');
  document.querySelectorAll('.pd-thumb').forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('on')) return;
    document.querySelectorAll('.pd-thumb').forEach(x => { x.classList.remove('on'); x.setAttribute('aria-selected', 'false'); });
    b.classList.add('on'); b.setAttribute('aria-selected', 'true');
    main.classList.add('swap');
    setTimeout(() => { main.src = b.dataset.src; main.onload = () => main.classList.remove('swap'); }, 180);
  }));

  // 링크 자리 (data.js 에 값이 없으면 버튼을 숨긴다)
  const kakao = $('#pd-kakao'), store = $('#pd-store');
  if (!BRAND.kakao || BRAND.kakao === '#') kakao.hidden = true; else kakao.href = BRAND.kakao;
  if (!BRAND.store || BRAND.store === '#') store.hidden = true; else store.href = BRAND.store;

  // 모바일 하단바: 주문 박스가 화면에 보이면 숨긴다
  const bar = $('#pd-bar'), box = $('#pd-order');
  if (bar && box) new IntersectionObserver(en => { bar.style.transform = en[0].isIntersecting ? 'translateY(120%)' : ''; bar.style.transition = 'transform .3s'; }).observe(box);
}
