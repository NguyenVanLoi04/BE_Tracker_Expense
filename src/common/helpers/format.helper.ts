import dayjs from 'dayjs';

import { TIME_FORMAT } from '../constants/global.constant';

export const formatCurrencyVND = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
};

export function formatDate(date: Date, format: string = TIME_FORMAT): string {
  return dayjs(date).format(format);
}
