export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum Resource {
  ALL = 'all',
  ADMIN = 'admin',
  MERCHANT = 'merchant',
  CUSTOMER = 'customer',
  AGENT = 'agent',
  GROUP_POLICY = 'group_policy',
  SYSTEM_CONFIG = 'system_config',
  SECRET = 'secret',
  CRON_JOB = 'cron_job',
  CATEGORY = 'category',
  PRODUCT = 'product',
  FILE_REQUEST = 'file_request',
  QR_CODE = 'qr_code',
  POINT = 'point',
  ORDER = 'order',
  ORDER_E_VOUCHER = 'order_e_voucher',
  EXPORT = 'export',
  EVENT = 'event',
  NEWS = 'news',
  NEWS_CATEGORY = 'news_category',
  CUSTOM_FIELD = 'custom_field',
  FORM_SUBMISSION = 'form_submission',
}

export enum ActionAbility {
  CAN = 'can',
  CANNOT = 'cannot',
}
