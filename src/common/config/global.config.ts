import * as dotenv from 'dotenv';
import { RecursiveKeyOf } from '../types/utils.type';
dotenv.config();

const globalConfig = {
  environment: process.env.NODE_ENV,
  port: +process.env.PORT || 5000,

  database: {
    type: process.env.DB_TYPE,
    name: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    secretKey: process.env.DATABASE_SECRET_KEY,
  },

  redis: {
    standAlone: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    },
    password: process.env.REDIS_PASSWORD,
  },

  auth: {
    accessToken: {
      secret: process.env.AUTH_JWT_ACCESS_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRE,
    },

    refreshToken: {
      secret: process.env.AUTH_JWT_REFRESH_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRE,
    },

    verification: {
      tokenExpiresIn: 86400, // seconds, = 24h
      verifySuccessPath: '/verify-success',
    },

    secretToken: process.env.AUTH_SECRET_TOKEN,
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessKeySecret: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,

    s3: {
      domain: process.env.AWS_S3_DOMAIN,
      bucketName: process.env.AWS_S3_BUCKET_NAME,
      limitSizeMb: +process.env.AWS_S3_LIMIT_SIZE_MB,
      presignTimeOut: +process.env.AWS_S3_PRESIGN_TIME_OUT,
    },

    ses: {
      sender: {
        name: 'BiliSoftware',
        email: process.env.AWS_SES_SENDER_EMAIL,
      },
      templateName: {
        merchant: {
          verifyEmailRequest:
            process.env.AWS_SES_TEMPLATE_VERIFY_MERCHANT_REQUEST,
          accountApproved: process.env.AWS_SES_TEMPLATE_MERCHANT_APPROVED,
          accountRefused: process.env.AWS_SES_TEMPLATE_MERCHANT_REJECTED,
        },
      },
    },
  },

  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_BOT_CHAT_ID,
  },

  zalo: {
    appSecretKey: process.env.ZALO_APP_SECRET_KEY,
    getMeUrl: process.env.ZALO_GET_ME_URL,
  },

  qrCode: {
    limitScanSuccessPerDay: +process.env.LIMIT_SCAN_SUCCESS_PER_DAY,
    limitScanFailedPerDay: +process.env.LIMIT_SCAN_FAILED_PER_DAY,
  },

  iris: {
    userId: process.env.IRIS_USER_ID,
    privateKey: process.env.IRIS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    limitNumberRetry: +process.env.LIMIT_RETRY_USE_E_VOUCHER_WHEN_FAILED,
    pinCode: {
      baseUrl: process.env.IRIS_PIN_CODE_BASE_URL,
      paths: {
        softPin: process.env.IRIS_PIN_CODE_SOFT_PIN_RESULT_PATH,
        checkSoftPin: process.env.IRIS_PIN_CODE_CHECK_SOFT_PIN_PATH,
        getSoftPin: process.env.IRIS_PIN_CODE_GET_SOFT_PIN_PATH,
      },
    },
    topup: {
      baseUrl: process.env.IRIS_TOPUP_BASE_URL,
      paths: {
        topup: process.env.IRIS_TOPUP_TOPUP_PATH,
        balance: process.env.IRIS_TOPUP_BALANCE_PATH,
      },
    },
  },

  crs: {
    baseUrl: process.env.CRS_BASE_URL,
    eVoucherBaseUrl: process.env.CRS_EVOUCHER_BASE_URL,
    eVoucherAppName: process.env.CRS_EVOUCHER_APP_NAME,
    auth: {
      username: process.env.CRS_AUTH_USERNAME,
      password: process.env.CRS_AUTH_PASSWORD,
      eVoucherXToken: process.env.CRS_EVOUCHER_X_TOKEN,
    },
    paths: {
      loginPath: process.env.CRS_LOGIN_PATH,
      hotelAvaliable: process.env.CRS_HOTEL_AVAILABLE_PATH,
      hotelList: process.env.CRS_HOTEL_LIST_PATH,
      bookingDetail: process.env.CRS_BOOKING_DETAIL_PATH,
      placeList: process.env.CRS_PLACE_LIST_PATH,

      eVoucherList: process.env.CRS_EVOUCHER_LIST_PATH,
      eVoucherListByCode: process.env.CRS_EVOUCHER_LIST_BY_CODE_PATH,
      eVoucherTypeList: process.env.CRS_EVOUCHER_TYPE_LIST_PATH,
      eVoucherDetail: process.env.CRS_EVOUCHER_DETAIL_PATH,
      eVoucherApply: process.env.CRS_EVOUCHER_APPLY_PATH,
      eVoucherApplyMultiple: process.env.CRS_EVOUCHER_APPLY_MULTIPLE_PATH,
    },
  },

  googleSheet: {
    clientEmail: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_SHEET_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    listHotelRoomSpreadsheetId:
      process.env.GOOGLE_SHEET_LIST_HOTEL_ROOM_SPREADSHEET_ID,
    listHotelRoomSpreadsheetNamePrefix:
      process.env.GOOGLE_SHEET_LIST_HOTEL_ROOM_SPREADSHEET_NAME_PREFIX,
  },
};

export default globalConfig;
export type GlobalConfig = Record<RecursiveKeyOf<typeof globalConfig>, string>;
