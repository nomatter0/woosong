# 우송 牛松 — 철마 한우의 명가

스크롤 모션 브랜드 사이트. 빌드 도구 없는 정적 사이트라 어디에든 그대로 올릴 수 있습니다.

## 실행

```bash
node scripts/serve.mjs
```

→ http://localhost:5173 (영상 시킹을 위해 Range 요청을 지원하는 서버입니다. 배포는 Netlify/Vercel/Cloudflare Pages 등 정적 호스팅이면 됩니다.)

## 내용 수정

- 브랜드 정보(전화·주소·영업시간·스마트스토어·카카오·인스타 링크): [js/data.js](js/data.js) 의 `BRAND`
- 상품 11종의 설명·취향 수치(부드러움/고소함/마블링/굽기 0~1): 같은 파일의 `PRODUCTS`
- 선물세트 3종: `SETS`
- 섹션 문구: [index.html](index.html) 안의 각 `<section>`

## 구조

| 섹션 | id | 동작 |
|---|---|---|
| 오프닝 | `#top` | 부위 라인업 위로 조명이 왼→오 스윕, 이후 커서를 따라 이동 |
| 손질 | `#cut` | 스크롤 = 영상 진행 (칼질, 조각이 눕는다) |
| 숯불 | `#grill` | 스크롤 스크럽 → 84% 지점부터 완성 장면 루프로 넘어감 |
| 포장 | `#pack` | 스크롤 스크럽 (트레이 → 박스 → 리본) |
| 취향 | `#taste` | 슬라이더 4축 + 예산/인원 → 세트·단품 추천 |
| 부위 | `#products` | 카드 호버 시 스킨포장 사진으로 전환 |
| 색 변화 | `#bloom` | 스크롤하며 검붉은색 → 선홍색, 단계별 문구 |
| 선물세트 / 받으신 뒤 / 오시는 길 | `#sets` `#info` `#visit` | 정적 |

## 영상·이미지 교체

원본은 `assets/src/`, 사이트가 쓰는 파일은 `assets/img/`, `assets/vid/` 입니다.

```bash
# 스크럽용 영상 인코딩 (1080p, GOP 8, 무음) + 첫 프레임 포스터
node scripts/encode.mjs video <원본.mp4> <이름>      # → assets/vid/<이름>.mp4, assets/img/<이름>-poster.webp

# 이미지 → webp
node scripts/encode.mjs image <원본.png> <이름> [최대폭]
```

ffmpeg 는 `C:/Users/jinyo/AppData/Local/Temp/ffm/node_modules/ffmpeg-static/ffmpeg.exe` 를 사용합니다 (경로는 `scripts/encode.mjs` 상단).
