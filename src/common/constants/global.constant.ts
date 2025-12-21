import { FileType, SupportFileType } from '../enums/file.enum';

export const ABILITY_METADATA_KEY = 'ability';
export enum PrefixType {
  ADMIN = 'admin',
  MERCHANT = 'merchant',
  CUSTOMER = 'customer',
  TEST = 'test',
  EXTERNAL = 'external',
}

export const HASH_ROUND = 12;

export const MapFilePathSupport = [
  {
    key: FileType.IMAGE,
    types: ['png', 'jpg', 'jpeg'],
  },
  {
    key: FileType.PDF,
    types: ['pdf'],
  },
  {
    key: FileType.AUDIO,
    types: ['mp3', 'mp4', 'wav'],
  },
  {
    key: FileType.EXCEL,
    types: [SupportFileType.xlsx, SupportFileType.xls],
  },
  {
    key: FileType.CSV,
    types: [SupportFileType.csv, SupportFileType.csv],
  },
];

export const TIME_ZONE = 'Asia/Ho_Chi_Minh';
export const TIME_FORMAT_DAY = 'YYYY-MM-DD';
export const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIME_FORMAT_DAY_TIME = 'DD-MM-YYYY_HH-mm';

export const MAX_LENGTH_CONTENT = 100000;
