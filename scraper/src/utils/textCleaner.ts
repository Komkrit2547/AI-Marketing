export const cleanText = (text: string): string => {
  if (!text) return '';

  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const normalizeContent = (text: string): string => {
  if (!text) return '';

  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
};

export const detectTruncated = (content: string): boolean => {
  return /See more\s*$|ดูเพิ่มเติม\s*$/m.test(content.trim());
};
