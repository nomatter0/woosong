// 주문서 페이지: 장바구니 요약 → 배송 정보 → 결제 방법 → 주문 전송
import { BRAND, SETS, byId, won } from './data.js';
import { load, clear, lineTotal, subtotal, shippingFor, orderText } from './cart.js';

const $ = (s, r = document) => r.querySelector(s);
const items = load();
const sub = subtotal(items), ship = shippingFor(sub), total = sub + ship;

// 요약
$('#co-items').innerHTML = items.length ? items.map(it => it.kind === 'set'
  ? `<div class="co-line"><span>${SETS.find(s => s.id === it.id).name} × ${it.qty}</span><b>${won(lineTotal(it))}</b></div>`
  : `<div class="co-line"><span>${byId(it.id).name} ${it.weight}g</span><b>${won(lineTotal(it))}</b></div>`).join('')
  : `<p class="cart-empty">담긴 상품이 없습니다. <a href="index.html#products">부위 보러 가기</a></p>`;
$('#co-sub').textContent = won(sub); $('#co-ship').textContent = ship ? won(ship) : '무료'; $('#co-total').textContent = won(total);
if (!items.length) $('#co-form').hidden = true;

// 무통장 계좌·카드 결제 표시
$('#bank-info').textContent = `${BRAND.bank.name} ${BRAND.bank.number} (예금주 ${BRAND.bank.holder})`;
if (!BRAND.cardPayment) { $('#pay-card').disabled = true; $('#pay-card-label').classList.add('off'); }
if (!BRAND.kakao || BRAND.kakao === '#') $('#pay-kakao-label').hidden = true;

// 희망일 기본값: 모레
const d = new Date(); d.setDate(d.getDate() + 2);
$('#f-date').min = new Date().toISOString().slice(0, 10); $('#f-date').value = d.toISOString().slice(0, 10);

// 우편번호 검색 (다음 우편번호 서비스 — 무료, 키 불필요)
$('#f-zip-btn').addEventListener('click', () => {
  if (!window.daum?.Postcode) { alert('우편번호 검색을 불러오지 못했습니다. 주소를 직접 입력해 주세요.'); return; }
  new daum.Postcode({ oncomplete: r => { $('#f-zip').value = r.zonecode; $('#f-address').value = r.roadAddress || r.jibunAddress; $('#f-address2').focus(); } }).open();
});

// 결제 방법에 따라 안내 문구
const payNote = () => {
  const v = $('input[name=pay]:checked').value;
  $('#bank-box').hidden = v !== '무통장입금';
  $('#co-submit').textContent = v === '카카오톡 주문' ? '카카오톡으로 주문 보내기' : v === '전화 주문' ? '주문 내용 복사하고 전화하기' : '주문서 보내기';
};
document.querySelectorAll('input[name=pay]').forEach(r => r.addEventListener('change', payNote)); payNote();

// 전송
$('#co-form').addEventListener('submit', async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target).entries());
  f.address = `(${f.zip}) ${f.address}`;
  const text = orderText(items, f);
  const orderNo = 'WS' + Date.now().toString(36).toUpperCase();
  const btn = $('#co-submit'); btn.disabled = true; btn.textContent = '보내는 중…';
  let sent = false;
  if (BRAND.orderEndpoint) {
    try {
      const r = await fetch(BRAND.orderEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ orderNo, ...f, order: text, total }) });
      sent = r.ok;
    } catch { sent = false; }
  }
  try { await navigator.clipboard.writeText(text); } catch {}
  // 완료 화면
  $('#co-form').hidden = true;
  const done = $('#co-done'); done.hidden = false;
  $('#done-no').textContent = orderNo; $('#done-text').textContent = text;
  const sms = `sms:${(BRAND.orderSms || BRAND.tel).replace(/-/g, '')}?body=${encodeURIComponent(text)}`;
  $('#done-sms').href = sms;
  $('#done-tel').href = `tel:${BRAND.tel}`;
  if (BRAND.kakao && BRAND.kakao !== '#') { $('#done-kakao').href = BRAND.kakao; $('#done-kakao').hidden = false; }
  $('#done-bank').hidden = f.pay !== '무통장입금';
  $('#done-bank-info').textContent = `${BRAND.bank.name} ${BRAND.bank.number} (예금주 ${BRAND.bank.holder}) · ${won(total)}`;
  $('#done-msg').textContent = sent
    ? '주문서가 접수되었습니다. 확인 후 연락드리겠습니다.'
    : '아래 버튼으로 주문 내용을 문자 또는 카카오톡으로 보내 주시면 확인 후 연락드립니다. (주문 내용은 복사되어 있습니다)';
  $('#done-copy').addEventListener('click', async () => { try { await navigator.clipboard.writeText(text); $('#done-copy').textContent = '복사됨'; } catch {} });
  clear();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
