// 우송 상품 데이터. 취향 축은 모두 0..1:
//   soft   0 부드러움 → 1 쫄깃함
//   nutty  0 담백함   → 1 고소함
//   marble 0 담백한 살코기 → 1 촘촘한 마블링
//   done   0 레어     → 1 웰던 (권장 굽기)
export const BRAND = {
  name: '우송', hanja: '牛松', tagline: '철마 한우의 명가',
  tel: '010-3797-0351',
  address: '주소를 입력해 주세요',           // TODO: 실제 주소
  hours: '영업시간을 입력해 주세요',        // TODO: 실제 영업시간
  store: '#', kakao: '#', instagram: '#',   // TODO: 링크
  mapImage: '',                             // TODO: 지도 사진 경로 (예: 'assets/img/map.webp') — 비우면 도로 일러스트가 나옵니다
  coords: '',                               // TODO: 예: '35.2417° N, 129.0854° E'
};

// 후기 — 예시 문구입니다. 실제 후기로 바꿔 주세요. (avatar 는 이니셜로 그립니다)
export const REVIEWS = [
  { name: '김○○', where: '해운대', body: '꽃등심 마블링이 사진 그대로였어요. 팬에 올리자마자 기름이 녹는 소리가 달라요.' },
  { name: '박○○', where: '기장', body: '부모님 생신 선물세트로 보냈는데 상자 열자마자 전화 오셨어요. 포장이 정갈합니다.' },
  { name: '이○○', where: '수영', body: '채끝 2cm 두께로 부탁드렸더니 딱 맞춰 손질해 주셨어요. 미디엄 레어가 정답.' },
  { name: '최○○', where: '남구', body: '스킨포장이라 냉장 5일 두고 먹어도 색이 그대로. 처음 열었을 때 검붉은 건 20분이면 돌아옵니다.' },
  { name: '정○○', where: '동래', body: '갈비살은 숯불에 40초씩. 안내대로 구우니 집에서도 식당 맛이 났어요.' },
  { name: '한○○', where: '연제', body: '안심이 정말 부드러워서 아이들이 먼저 찾습니다. 다음엔 새우살도 시켜볼게요.' },
  { name: '오○○', where: '금정', body: '전화로 주문했는데 당일 손질해서 바로 보내주셨어요. 이력번호까지 라벨에 있어서 믿음이 갑니다.' },
  { name: '윤○○', where: '사하', body: '부채살 육향이 진해요. 힘줄 부분이 오히려 별미.' },
  { name: '장○○', where: '북구', body: '20만원 세트, 5~6인분이라더니 넉넉했어요. 낙엽살이 의외의 발견.' },
];

// 상세페이지용 정보 — 가격·중량·문구는 예시입니다. 부위별로 수정해 주세요.
//   price100: 100g 가격(원)  weight: [최소, 기본, 최대] g  thickness: 손질 두께  serve: 1인 권장 g
//   story: 상세페이지 본문 (빈 줄로 문단 구분)  gallery: 추가 사진 경로 배열 (assets/img/… )
function DETAIL_OF(price100, weight, thickness, serve, story) { return { price100, weight, thickness, serve, story, gallery: [] }; }
const DETAIL = {
  kkot:    DETAIL_OF(24000, [200, 400, 2000], '2.5cm 스테이크 컷', 200, '등심 가운데 가장 마블링이 고운 부분만 꽃등심으로 손질합니다. 지방이 눈꽃처럼 퍼져 있어 굽는 동안 스스로 기름을 내고, 입에 넣으면 씹기 전에 녹습니다.\n\n두툼하게 구워 겉을 닫고 속은 붉게 남기는 것이 이 부위를 가장 맛있게 먹는 방법입니다. 소금만으로 충분합니다.'),
  chae:    DETAIL_OF(19000, [200, 400, 2000], '2cm 스테이크 컷', 200, '등심 끝, 허리 쪽의 채끝은 살결이 곱고 씹을 때 탄력이 있습니다. 한쪽에 붙은 지방 테두리가 굽는 동안 향을 냅니다.\n\n지방 테두리를 먼저 팬에 세워 녹인 뒤 양면을 굽습니다. 미디엄 레어에서 육즙이 가장 많습니다.'),
  ansim:   DETAIL_OF(22000, [200, 300, 1500], '3cm 두툼하게', 150, '한 마리에서 2kg 남짓만 나오는 부위입니다. 움직임이 적은 근육이라 결이 곱고, 지방이 거의 없어 담백합니다.\n\n두껍게 썰어 강불에 겉만 빠르게 닫고 속은 레어로 둡니다. 어린이와 어르신께 가장 먼저 권하는 부위입니다.'),
  saeu:    DETAIL_OF(26000, [200, 300, 1000], '1.5cm', 150, '등심 위쪽에 새우처럼 말려 붙은 작은 근육입니다. 한 마리에서 나오는 양이 적어 미리 말씀해 주셔야 준비할 수 있습니다.\n\n마블링이 가장 촘촘한 부위라 짧게, 미디엄까지만 굽습니다.'),
  galbi:   DETAIL_OF(17000, [300, 500, 3000], '1cm 구이 컷', 250, '갈빗대 사이의 살을 발라낸 갈비살은 결이 굵고 육향이 진합니다. 씹을수록 고소함이 배어 나옵니다.\n\n얇게 썰어 센 숯불에 앞뒤 40초씩. 소금보다 간장 양념과도 잘 어울립니다.'),
  buchae:  DETAIL_OF(14000, [300, 500, 3000], '1cm 구이 컷', 250, '어깨 안쪽, 부채 모양의 근육입니다. 가운데 힘줄을 따라 쫄깃함과 부드러움이 함께 있습니다.\n\n힘줄이 씹히는 식감이 이 부위의 매력이라 너무 얇게 썰지 않습니다.'),
  jebi:    DETAIL_OF(16000, [200, 400, 2000], '얇게 슬라이스', 200, '목 아래로 길게 이어진 가늘고 긴 근육입니다. 한 마리에서 소량만 나옵니다.\n\n씹는 맛과 담백함의 균형이 좋아 소금구이로 드시길 권합니다.'),
  kkotsal: DETAIL_OF(20000, [300, 500, 3000], '1cm 구이 컷', 250, '눈꽃처럼 마블링이 퍼진 부위입니다. 고소함이 가장 진하게 느껴집니다.\n\n강불에 각 면 45초, 미디엄까지만 굽습니다.'),
  anchang: DETAIL_OF(18000, [300, 500, 3000], '결 반대 슬라이스', 250, '횡격막 근육인 안창살은 결이 굵고 육즙이 풍부합니다. 씹을수록 진한 육향이 올라옵니다.\n\n결 반대로 썰어 드려야 부드럽습니다. 강불에 각 면 1분.'),
  nak:     DETAIL_OF(14000, [300, 500, 3000], '1cm 구이 컷', 250, '어깨뼈 바깥쪽의 낙엽살은 부드럽고 촉촉합니다. 한우의 담백한 풍미를 즐길 수 있는 부위입니다.\n\n강불에 각 면 45초, 미디엄 레어 권장.'),
  chima:   DETAIL_OF(15000, [300, 500, 3000], '결 반대 슬라이스', 250, '치마처럼 넓게 붙은 근육입니다. 탄력 있는 식감과 진한 육향을 가집니다.\n\n씹을수록 감칠맛이 풍부해지는 부위라 결 반대로 썰어 드립니다.'),
};

export const PRODUCTS = [
  { id: 'kkot',    name: '꽃등심',   en: 'Ribeye',              soft: .20, nutty: .90, marble: .95, done: .55,
    desc: '부드러운 식감과 풍부한 육즙. 고소한 맛과 깊은 풍미를 가장 진하게 느낄 수 있는 부위입니다.',
    guide: ['두께 2.5cm 이상으로 두툼하게', '강불에 각 면 2분, 옆면 30초', '불에서 내려 3분 레스팅'] },
  { id: 'chae',    name: '채끝등심', en: 'Striploin',           soft: .30, nutty: .65, marble: .60, done: .35,
    desc: '부드러우면서 탄성 있는 식감과 담백한 맛. 적당한 기름기와 깔끔한 풍미가 조화를 이룹니다.',
    guide: ['두께 2cm, 지방 테두리를 먼저 세워 굽기', '강불에 각 면 1분 30초', '미디엄 레어 권장'] },
  { id: 'ansim',   name: '안심',     en: 'Tenderloin',          soft: .05, nutty: .30, marble: .15, done: .30,
    desc: '가장 부드러운 부위. 지방이 적어 담백하고 결이 곱습니다.',
    guide: ['두께 3cm 두툼하게', '강불에 각 면 2분, 옆면 돌려가며 1분', '레어~미디엄 레어 권장'] },
  { id: 'saeu',    name: '새우살',   en: 'Ribeye cap',          soft: .15, nutty: .95, marble: .95, done: .45,
    desc: '등심 위쪽의 귀한 부위. 마블링이 촘촘해 입에서 녹는 고소함이 있습니다.',
    guide: ['두께 1.5cm', '강불에 각 면 1분', '미디엄 권장'] },
  { id: 'galbi',   name: '갈비살',   en: 'Boneless short rib',  soft: .75, nutty: .85, marble: .80, done: .70,
    desc: '쫄깃한 식감과 진한 육향. 씹을수록 고소함이 배어 나오는 부위입니다.',
    guide: ['두께 1cm 이하로 얇게', '센 숯불에 앞뒤 40초씩', '미디엄~미디엄 웰 권장'] },
  { id: 'buchae',  name: '부채살',   en: 'Top blade',           soft: .50, nutty: .50, marble: .55, done: .50,
    desc: '가운데 힘줄을 따라 쫄깃함과 부드러움이 함께 있는 부위. 육향이 진합니다.',
    guide: ['두께 1cm', '강불에 각 면 50초', '미디엄 권장'] },
  { id: 'jebi',    name: '제비추리', en: 'Neck chain',          soft: .60, nutty: .55, marble: .40, done: .55,
    desc: '한 마리에서 소량만 나오는 부위. 씹는 맛과 담백함의 균형이 좋습니다.',
    guide: ['얇게 슬라이스', '센 불에 짧게 30초씩', '미디엄 권장'] },
  { id: 'kkotsal', name: '꽃살',     en: 'Chuck flap',          soft: .35, nutty: .90, marble: .90, done: .50,
    desc: '눈꽃 같은 마블링이 촘촘한 부위. 고소함이 가장 진하게 느껴집니다.',
    guide: ['두께 1cm', '강불에 각 면 45초', '미디엄 권장'] },
  { id: 'anchang', name: '안창살',   en: 'Outside skirt',       soft: .80, nutty: .70, marble: .50, done: .45,
    desc: '결이 굵고 육즙이 풍부한 부위. 씹을수록 진한 육향이 올라옵니다.',
    guide: ['결 반대로 썰기', '강불에 각 면 1분', '미디엄 레어~미디엄 권장'] },
  { id: 'nak',     name: '낙엽살',   en: 'Oyster blade',        soft: .40, nutty: .30, marble: .45, done: .40,
    desc: '부드럽고 촉촉한 식감과 고소한 맛. 한우의 담백한 풍미를 즐길 수 있는 부위입니다.',
    guide: ['두께 1cm', '강불에 각 면 45초', '미디엄 레어 권장'] },
  { id: 'chima',   name: '치마살',   en: 'Flap meat',           soft: .70, nutty: .15, marble: .30, done: .40,
    desc: '탄력 있는 식감과 진한 육향. 씹을수록 감칠맛이 풍부해지는 부위입니다.',
    guide: ['결 반대로 썰기', '강불에 각 면 40초', '미디엄 레어 권장'] },
].map(p => ({
  ...p,
  img: `assets/img/cut-${p.id}.webp`,
  pack: `assets/img/pack-${p.id}.webp`,
  ...(DETAIL[p.id] || {}),
}));

export const SETS = [
  { id: 'set-steak', name: '스테이크 선물세트', budget: 30, price: 300000, items: ['kkot', 'saeu', 'chae', 'ansim'],
    note: '4부위 · 스테이크 컷', soft: .15, nutty: .70, marble: .70, done: .40 },
  { id: 'set-200',   name: '20만원 한우 선물세트', budget: 20, price: 200000, items: ['chae', 'kkot', 'galbi', 'nak'],
    note: '1.2kg 4팩 · 5~6인분', soft: .40, nutty: .70, marble: .70, done: .50 },
  { id: 'set-gui',   name: '구이 모둠세트', budget: 10, price: 100000, items: ['galbi', 'buchae', 'anchang', 'chima'],
    note: '구이용 4부위', soft: .70, nutty: .55, marble: .55, done: .55 },
];

export const AXES = [
  { key: 'soft',   left: '부드러움',       right: '쫄깃함' },
  { key: 'nutty',  left: '담백함',         right: '고소함' },
  { key: 'marble', left: '담백한 살코기',   right: '촘촘한 마블링' },
  { key: 'done',   left: '레어',           right: '웰던' },
];

export const byId = id => PRODUCTS.find(p => p.id === id);
export const won = n => n.toLocaleString('ko-KR') + '원';
