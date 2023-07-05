import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_BUCKET_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_ACCESS_KEY_SECRET;

const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

export const createFile = async (file) => {
  const randomfileName = (bytes = 16) =>
    crypto.randomBytes(bytes).toString('hex');
  const fileName = randomfileName();
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  const result = await s3.send(command);
  const getObjectParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  const command2 = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command2);

  return { fileName, url };
};

export const getFile = async (fileName) => {
  const getObjectParams = {
    Bucket: bucketName,
    Key: fileName,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command);
  return { url };
};
