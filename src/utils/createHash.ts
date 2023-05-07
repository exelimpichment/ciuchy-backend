import crypto from 'crypto';

const hashString = (string: string) =>
  crypto.createHash('sha256').update(string).digest('hex');

export default hashString;
