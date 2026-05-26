/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  dbUrl: process.env.DATABASE_URL,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  rootUrl: process.env.ROOT_URL,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  stripe:{
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
  mailer: {
    email: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
  },
  cloudflare: {
    bucketName: process.env.CLOUDFLARE_BUCKET_NAME,
    publicUrl: process.env.CLOUDFLARE_PUBLIC_URL,
    endpoint: process.env.CLOUDFLARE_ENDPOINT,
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API
  },
  twilio: {
    accountSid: process.env.TWILIO_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  }
};
