import * as dotenv from 'dotenv';
dotenv.config();

export const REDIS_KEY = {
  CACHE: `${process.env.NODE_ENV}:CACHE`,
  CHECK_PASSWORD_COUNT: `${process.env.NODE_ENV}:CHECK_PASSWORD_COUNT`,
  LOGIN_COUNT: `${process.env.NODE_ENV}:LOGIN_COUNT`,
  OTP_COUNT: `${process.env.NODE_ENV}:OTP_COUNT`,
  OTP_THRESHOLD: `${process.env.NODE_ENV}:OTP_THRESHOLD`,
  SF_ACCESS_TOKEN: `${process.env.NODE_ENV}:SF_ACCESS_TOKEN`,
};
