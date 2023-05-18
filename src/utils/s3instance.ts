const accessKeyId = process.env.ACCESS_KEY || '';
import { S3Client } from '@aws-sdk/client-s3';

const secretAccessKey = process.env.SECRET_ACCESS_KEY || '';
export const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region: 'eu-central-1',
});
