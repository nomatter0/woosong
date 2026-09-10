// 상품 상세페이지 생성기 — js/data.js 의 PRODUCTS 로 products/<id>.html 을 만든다.
//   node scripts/build-products.mjs
// 부위별로 다르게 꾸미고 싶으면 생성된 파일을 직접 고치되, 다시 생성하면 덮어쓰이니
// 공통 변경은 이 템플릿에서, 내용 변경은 data.js 에서 하는 것을 권합니다.
import { writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const ROOT = process.cwd();
const { BRAND, PRODUCTS, AXES } = await import(pathToFileURL(join(ROOT, 'js/data.js')).href);
const SITE = 'https://www.cheolmahanwoo.com';
const won = n => n.toLocaleString('ko-KR') + '원';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dist = (a, b) => Math.sqrt(AXES.reduce((s, ax) => s + (a[ax.key] - b[ax.key]) ** 2, 0));

const page = p => {
  const related = PRODUCTS.filter(q => q.id !== p.id).map(q => ({ q, d: dist(p, q) })).sort((x, y) => x.d - y.d).slice(0, 3);
  const [wMin, wDef, wMax] = p.weight;
  const paras = p.story.split(/\n\s*\n/).map(t => `<p>${esc(t)}</p>`).join('');
  const gallery = [p.img, p.pack, ...p.gallery];
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(p.name)} 1++ 한우 — 우송 牛松</title>
  <meta name="description" content="${esc(p.desc)} 100g ${won(p.price100)}, ${esc(p.thickness)}." />
  <meta name="theme-color" content="#100c0b" />
  <link rel="canonical" href="${SITE}/products/${p.id}.html" />
  <meta property="og:type" content="product" />
  <meta property="og:title" content="${esc(p.name)} 1++ 한우 — 우송 牛松" />
  <meta property="og:description" content="${esc(p.desc)}" />
  <meta property="og:image" content="${SITE}/${p.img}" />
  <meta property="og:url" content="${SITE}/products/${p.id}.html" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Song+Myung&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/product.css" />
  <script type="application/ld+json">
  ${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: `${p.name} 1++ 한우`, image: `${SITE}/${p.img}`, description: p.desc, brand: { '@type': 'Brand', name: '우송 牛松' },
    offers: { '@type': 'Offer', priceCurrency: 'KRW', price: p.price100, availability: 'https://schema.org/InStock', url: `${SITE}/products/${p.id}.html` } })}
  </script>
</head>
<body class="product-page" data-id="${p.id}" data-price100="${p.price100}" data-wmin="${wMin}" data-wmax="${wMax}" data-wdef="${wDef}">

<header class="nav scrolled" id="nav">
  <a class="brand" href="../index.html" aria-label="우송 처음으로">
    <span class="brand-name nacre">우송</span><span class="brand-hanja">牛松</span>
  </a>
  <nav class="nav-links" aria-label="섹션">
    <a href="../index.html#cut">손질</a>
    <a href="../index.html#grill">숯불</a>
    <a href="../index.html#taste">취향</a>
    <a href="../index.html#products" class="active">부위</a>
    <a href="../index.html#sets">선물세트</a>
    <a href="../index.html#visit">오시는 길</a>
  </nav>
  <a class="btn-glass glass btn-call" id="nav-call" href="tel:${BRAND.tel}">전화 주문</a>
</header>

<main class="pd wrap glass-field">
  <p class="crumbs"><a href="../index.html">우송</a><span>/</span><a href="../index.html#products">부위</a><span>/</span><b>${esc(p.name)}</b></p>

  <section class="pd-hero">
    <div class="pd-gallery">
      <figure class="pd-main glass" id="pd-main">
        <img id="pd-main-img" src="../${gallery[0]}" alt="${esc(p.name)}" />
      </figure>
      <div class="pd-thumbs" id="pd-thumbs" role="tablist" aria-label="사진">
        ${gallery.map((g, i) => `<button class="pd-thumb glass${i === 0 ? ' on' : ''}" role="tab" aria-selected="${i === 0}" data-src="../${g}"><img src="../${g}" alt="" loading="lazy" /></button>`).join('')}
      </div>
    </div>

    <div class="pd-info">
      <p class="kicker">1++ 한우 · ${esc(p.en)}</p>
      <h1 class="pd-title nacre">${esc(p.name)}</h1>
      <p class="pd-lede">${esc(p.desc)}</p>

      <dl class="pd-facts">
        <div><dt>등급</dt><dd><span class="grade">1++</span> No.8~9</dd></div>
        <div><dt>손질</dt><dd>${esc(p.thickness)}</dd></div>
        <div><dt>권장 굽기</dt><dd>${esc(p.guide[2])}</dd></div>
        <div><dt>1인 기준</dt><dd>약 ${p.serve}g</dd></div>
      </dl>

      <div class="pd-order glass" id="pd-order">
        <div class="pd-price"><span class="pd-price-num" id="pd-price">${won(p.price100)}</span><span class="pd-price-unit">/ 100g</span></div>
        <div class="pd-weight">
          <span class="pd-weight-label">중량</span>
          <div class="stepper">
            <button type="button" class="step" id="w-minus" aria-label="100g 줄이기">−</button>
            <output id="w-out" for="w-minus w-plus">${wDef}g</output>
            <button type="button" class="step" id="w-plus" aria-label="100g 늘리기">+</button>
          </div>
          <span class="pd-weight-hint">${wMin}g부터 100g 단위 · 약 <b id="w-people">${Math.max(1, Math.round(wDef / p.serve))}</b>인분</span>
        </div>
        <div class="pd-total"><span>예상 금액</span><b id="pd-total">${won(p.price100 * wDef / 100)}</b></div>
        <div class="pd-cta">
          <a class="btn-glass glass primary" id="pd-call" href="tel:${BRAND.tel}">전화로 주문 · ${BRAND.tel}</a>
          <a class="btn-glass glass" id="pd-kakao" href="${BRAND.kakao}">카카오톡 문의</a>
          <a class="btn-glass glass" id="pd-store" href="${BRAND.store}">스마트스토어</a>
        </div>
        <p class="pd-note">주문하신 날 손질해 스킨포장으로 보냅니다. 실제 중량은 ±10g 정도 차이가 날 수 있습니다.</p>
      </div>
    </div>
  </section>

  <section class="pd-section pd-taste">
    <h2 class="reveal-words">이 부위의 맛</h2>
    <div class="pd-axes">
      ${AXES.map(a => `
      <div class="pd-axis">
        <span class="l">${a.left}</span>
        <span class="bar"><i style="left:${Math.round(p[a.key] * 100)}%"></i></span>
        <span class="r">${a.right}</span>
      </div>`).join('')}
    </div>
  </section>

  <section class="pd-section pd-story">
    <h2 class="reveal-words">${esc(p.name)} 이야기</h2>
    <div class="pd-story-body">${paras}</div>
  </section>

  <section class="pd-section pd-guide">
    <h2 class="reveal-words">굽는 법</h2>
    <ol class="pd-steps">
      ${p.guide.map((g, i) => `<li class="glass"><span class="n">${i + 1}</span><p>${esc(g)}</p></li>`).join('')}
    </ol>
    <div class="pd-keep glass">
      <div><h3>보관</h3><p>스킨포장 그대로 냉장 0~2°C에서 5일, 냉동은 3개월.</p></div>
      <div><h3>해동</h3><p>전날 냉장실로 옮겨 천천히. 전자레인지 해동은 피해 주세요.</p></div>
      <div><h3>굽기 전</h3><p>30분 전 실온에 꺼내 두고, 소금은 굽기 직전에.</p></div>
    </div>
  </section>

  <section class="pd-section pd-related">
    <h2 class="reveal-words">함께 보면 좋은 부위</h2>
    <div class="pd-related-grid">
      ${related.map(({ q }) => `
      <a class="card glass" href="./${q.id}.html">
        <div class="card-media"><img class="main" src="../${q.img}" alt="${esc(q.name)}" loading="lazy" /><img class="alt" src="../${q.pack}" alt="" loading="lazy" /></div>
        <div class="card-head"><h3 class="shine">${esc(q.name)}</h3><span class="grade">1++</span></div>
        <small class="muted">${esc(q.en)} · 100g ${won(q.price100)}</small>
      </a>`).join('')}
    </div>
  </section>
</main>

<footer id="visit" class="visit wrap">
  <div class="visit-grid">
    <div>
      <p class="brand-foot"><span class="nacre">우송</span> <span class="brand-hanja">牛松</span></p>
      <p class="muted">철마 한우의 명가</p>
    </div>
    <dl class="visit-list">
      <div><dt>전화</dt><dd><a id="foot-tel" href="tel:${BRAND.tel}">${BRAND.tel}</a></dd></div>
      <div><dt>주소</dt><dd id="foot-address">—</dd></div>
      <div><dt>영업시간</dt><dd id="foot-hours">—</dd></div>
      <div><dt>주문</dt><dd class="foot-links"><a id="foot-store" href="#">스마트스토어</a><a id="foot-kakao" href="#">카카오톡 상담</a><a id="foot-insta" href="#">인스타그램</a></dd></div>
    </dl>
  </div>
  <p class="copyright">© 우송 牛松. 가격과 구성은 시기에 따라 변동될 수 있습니다.</p>
</footer>

<script type="module" src="../js/main.js"></script>
<script type="module" src="../js/product.js"></script>
</body>
</html>
`;
};

mkdirSync(join(ROOT, 'products'), { recursive: true });
for (const p of PRODUCTS) {
  writeFileSync(join(ROOT, 'products', `${p.id}.html`), page(p));
  console.log('products/' + p.id + '.html');
}
