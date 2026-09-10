// Build web assets from assets/src → assets/img, assets/vid.
//   node scripts/encode.mjs            (images + placeholder videos)
//   node scripts/encode.mjs video src.mp4 name   (encode one scrub clip → assets/vid/name.mp4)
import { execFileSync } from 'node:child_process';
import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const FF = 'C:/Users/jinyo/AppData/Local/Temp/ffm/node_modules/ffmpeg-static/ffmpeg.exe';
const ROOT = process.cwd();
const SRC = join(ROOT, 'assets/src');
const IMG = join(ROOT, 'assets/img');
const VID = join(ROOT, 'assets/vid');
mkdirSync(IMG, { recursive: true }); mkdirSync(VID, { recursive: true });

const ff = (args) => execFileSync(FF, ['-v', 'error', '-y', ...args], { stdio: 'inherit' });

// Image → webp, longest side capped
function webp(src, dst, max = 1000, q = 82) {
  ff(['-i', src, '-vf', `scale='min(${max},iw)':-2`, '-c:v', 'libwebp', '-quality', String(q), dst]);
  console.log('img', basename(dst));
}

// Scrub-friendly encode (scroll-world Step 6): native res, crf 20, GOP 8, no audio, faststart.
export function scrub(src, dst, opts = {}) {
  const { crf = 20, gop = 8, scale = null } = opts;
  const vf = ['unsharp=5:5:0.8:5:5:0.0']; if (scale) vf.unshift(`scale=${scale}:-2`);
  ff(['-i', src, '-an', '-vf', vf.join(','), '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf),
    '-pix_fmt', 'yuv420p', '-g', String(gop), '-keyint_min', String(gop), '-sc_threshold', '0',
    '-movflags', '+faststart', dst]);
  console.log('vid', basename(dst));
}

// Poster = exact first frame
function poster(src, dst) { ff(['-i', src, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '85', dst]); }

const mode = process.argv[2];
if (mode === 'video') {
  const [, , , src, name] = process.argv;
  scrub(src, join(VID, `${name}.mp4`));
  poster(join(VID, `${name}.mp4`), join(IMG, `${name}-poster.webp`));
} else if (mode === 'image') {
  const [, , , src, name, max] = process.argv;
  webp(src, join(IMG, `${name}.webp`), max ? Number(max) : 1600, 84);
} else {
  for (const dir of ['cuts', 'packs']) {
    for (const f of readdirSync(join(SRC, dir))) {
      if (extname(f) !== '.png') continue;
      const dst = join(IMG, f.replace('.png', '.webp'));
      if (!existsSync(dst)) webp(join(SRC, dir, f), dst, 900, 82);
    }
  }
  webp(join(SRC, 'plates/pearl.jpg'), join(IMG, 'pearl.webp'), 1600, 80);
  // Placeholder scrub clips until the generated ones land (swap via `encode.mjs video`).
  const ph = [
    ['video-prev/cut.mp4', 'cut'],
    ['video-ref/hf_20260910_133715_394c8c72-0a04-4e23-a5ee-3cccbffb9056.mp4', 'grill'],
    ['video-prev/pack.mp4', 'pack'],
    ['video-prev/sizzle.mp4', 'sizzle'],
  ];
  for (const [s, n] of ph) {
    const dst = join(VID, `${n}.mp4`);
    if (!existsSync(dst)) { scrub(join(SRC, s), dst); poster(dst, join(IMG, `${n}-poster.webp`)); }
  }
}
