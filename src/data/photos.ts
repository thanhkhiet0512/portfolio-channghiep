import fs from 'node:fs';
import path from 'node:path';

/** Optional photos dropped into public/photos/ appear automatically. */
const candidates = [
  { file: 'sea.jpg', pos: '65% 50%', caption: { en: 'By the sea — where ships, hydrodynamics and fishing boats meet', vi: 'Bên bờ biển — nơi tàu thuyền và thuỷ động lực gặp nhau' }, alt: { en: 'Nghiep by the sea, fishing boats in the bay', vi: 'Nghiệp bên bờ biển, thuyền đánh cá trong vịnh' } },
  { file: 'japan.jpg', pos: '40% 50%', caption: { en: 'Autumn in Japan', vi: 'Mùa thu ở Nhật Bản' }, alt: { en: 'Nghiep at a temple in Japan in autumn', vi: 'Nghiệp tại một ngôi đền ở Nhật mùa thu' } },
];

const exists = (f: string) => {
  try { return fs.existsSync(path.join(process.cwd(), 'public', 'photos', f)); } catch { return false; }
};

export const photos = candidates.filter((c) => exists(c.file)).map((c) => ({ ...c, src: `/photos/${c.file}` }));
