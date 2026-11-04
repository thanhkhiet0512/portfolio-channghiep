import fs from 'node:fs';
import path from 'node:path';

/** Optional photos dropped into public/photos/ appear automatically. */
const candidates = [
  { file: 'sea.jpg', alt: { en: 'Nghiep by the sea, fishing boats in the bay', vi: 'Nghiệp bên bờ biển, thuyền đánh cá trong vịnh' } },
  { file: 'japan.jpg', alt: { en: 'Nghiep at a temple in Japan in autumn', vi: 'Nghiệp tại một ngôi đền ở Nhật mùa thu' } },
];

const exists = (f: string) => {
  try { return fs.existsSync(path.join(process.cwd(), 'public', 'photos', f)); } catch { return false; }
};

export const photos = candidates.filter((c) => exists(c.file)).map((c) => ({ ...c, src: `/photos/${c.file}` }));
