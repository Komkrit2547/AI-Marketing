import crypto from 'crypto';

export const generateHash = (content: string, postedAt: Date | null): string => {
  const data = `${content}_${postedAt ? postedAt.toISOString() : ''}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};
