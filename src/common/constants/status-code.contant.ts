import { IStatusCode } from '../interfaces/status-code.interface';

export const StatusCode: Record<StatusCodeKey, IStatusCode> = {
  SUCCESS: {
    status: 2000,
    msg: 'Thành công',
  },
  CODE_NOEXIST: {
    status: 1,
    msg: 'Mã không tồn tại vui lòng kiểm tra lại mã của bạn.',
    error: 'CODE_NOEXIST',
  },
  CODE_USED: {
    status: 1,
    msg: 'Mã đã được sử dụng.',
    error: 'CODE_USED',
  },
  CODE_EXPIRE: {
    status: 1,
    msg: 'Mã đã hết hạn.',
    error: 'CODE_EXPIRE',
  },
  CODE_ERROR: {
    status: 1,
    msg: 'Mã không hợp lệ.',
    error: 'CODE_ERROR',
  },
};

type StatusCodeKey =
  | 'SUCCESS'
  | 'CODE_NOEXIST'
  | 'CODE_USED'
  | 'CODE_EXPIRE'
  | 'CODE_ERROR';
