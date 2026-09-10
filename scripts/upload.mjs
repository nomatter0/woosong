// PUT local files to Higgsfield presigned URLs. Usage: node scripts/upload.mjs uploads.json
// uploads.json: [{ file, type, url }]
import { readFileSync } from 'node:fs';
const list = JSON.parse(readFileSync(process.argv[2], 'utf8'));
for (const u of list) {
  const body = readFileSync(u.file);
  const r = await fetch(u.url, { method: 'PUT', headers: { 'Content-Type': u.type }, body });
  console.log(u.file, '->', r.status);
}
