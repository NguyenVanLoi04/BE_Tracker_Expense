export const MOBILE_ROUTE_DATA = [
  {
    name: 'Trang chủ',
    route: '/',
    isNeedParams: false,
  },
  {
    name: 'Sản phẩm',
    route: '/products',
    isNeedParams: false,
  },
  {
    name: 'Danh mục sản phẩm',
    route: '/products/categories/:id',
    isNeedParams: true,
  },
  {
    name: 'Chi tiết sản phẩm',
    route: '/products/:id',
    isNeedParams: true,
  },
  {
    name: 'Giỏ hàng',
    route: '/cart',
    isNeedParams: false,
  },
  {
    name: 'Quét mã QR Code',
    route: '/qr-code/scan',
    isNeedParams: false,
  },
  {
    name: 'Thông báo',
    route: '/notifications',
    isNeedParams: false,
  },
  {
    name: 'Thông tin cá nhân',
    route: '/profile',
    isNeedParams: false,
  },
  {
    name: 'Cập nhật thông tin cá nhân',
    route: '/profile/personal-information',
    isNeedParams: false,
  },
  {
    name: 'Quà của tôi',
    route: '/profile/my-order-e-vouchers',
    isNeedParams: false,
  },
  {
    name: 'Lịch sử đổi quà',
    route: '/profile/orders-history',
    isNeedParams: false,
  },
  {
    name: 'Trợ giúp',
    route: '/profile/help',
    isNeedParams: false,
  },
  {
    name: 'Điều khoản',
    route: '/profile/terms',
    isNeedParams: false,
  },
  {
    name: 'Chi tiết sự kiện',
    route: '/events/:id',
    isNeedParams: true,
  },
  // {
  //   name: 'Tin tức',
  //   route: '/news',
  //   isNeedParams: false,
  // },
  {
    name: 'Danh mục tin tức',
    route: '/news/news-categories/:id',
    isNeedParams: true,
  },
  {
    name: 'Chi tiết tin tức',
    route: '/news/:id',
    isNeedParams: true,
  },

  // Function
  {
    name: 'Cấp quyền đăng nhập',
    route: 'function:authorize',
    isNeedParams: false,
  },
];
