import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { StatusCode } from '../constants/status-code.contant';

export class AppMetaDto {
  status: number;
  msg?: string;
  error?: string;
  subInfo?: any;
}

export class AppPaginationDto {
  currentPage: number;
  last: boolean;
  recordsPerPage: number;
  totalPages: number;
  totalRecords: number;

  static fromNestPagination(meta: IPaginationMeta) {
    const result = new AppPaginationDto();
    result.totalRecords = meta.totalItems;
    result.currentPage = meta.currentPage;
    result.recordsPerPage = meta.itemsPerPage;
    result.totalPages = meta.totalPages;
    result.last = meta.currentPage === meta.totalPages;

    return result;
  }
}

export class AppResponseDto {
  response?: any;
  meta: AppMetaDto;
  pagination?: AppPaginationDto;

  constructor(data?: any, meta?: AppMetaDto) {
    this.response = typeof data === 'undefined' ? null : data;

    if (meta) this.meta = meta;
    else this.meta = StatusCode.SUCCESS;
  }

  static fromNestJsPagination(data: any, meta: IPaginationMeta) {
    const result = new AppResponseDto(data, StatusCode.SUCCESS);
    result.pagination = AppPaginationDto.fromNestPagination(meta);

    return result;
  }
}
