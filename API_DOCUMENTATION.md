# Tracker Expense API Documentation

Tài liệu này tổng hợp các API của hệ thống **Tracker Expense**, được phân loại theo đối tượng sử dụng (Customer & Admin).
Mỗi nhóm API có prefix và quyền truy cập khác nhau.

Hệ thống tích hợp **Swagger UI** tại: `/api/swagger`

---

## PHẦN 1: API DÀNH CHO CUSTOMER (NGƯỜI DÙNG)

Prefix cơ sở: `/api`

### 1. Phân hệ Xác thực (Authentication)

_Dùng để đăng ký, đăng nhập và quản lý tài khoản cá nhân._

- **[POST] /auth/login**: Đăng nhập.
- **[POST] /auth/register**: Đăng ký.
- **[GET] /auth/profile**: Thông tin cá nhân (Cần Token).
- **[GET] /auth/check**: Kiểm tra trạng thái Token.

**Ví dụ Response Profile:**

```json
{
  "id": 1,
  "name": "John Doe",
  "userName": "john_doe",
  "categoryCount": 5,
  "transactionCount": 120
}
```

### 2. Quản lý Danh mục (Category)

Prefix: `/api/customer/category`

- **[GET] /**: Lấy toàn bộ danh mục của user.
- **[POST] /**: Tạo danh mục mới (Ăn uống, Di chuyển, v.v.).
- **[PUT] /:id**: Cập nhật tên/trạng thái danh mục.
- **[DELETE] /:id**: Xóa danh mục.

### 3. Quản lý Ví (Wallet)

Prefix: `/api/customer/wallets`

- **[GET] /**: Danh sách các ví (Ví Tiền mặt, ATM, v.v.).
- **[POST] /**: Tạo ví mới kèm số dư ban đầu.
- **[POST] /transfer**: Chuyển tiền giữa hai ví của cùng user.
- **[DELETE] /:id**: Xóa ví.

### 4. Quản lý Giao dịch (Transaction)

Prefix: `/api/customer/transactions`

- **[GET] /**: Danh sách giao dịch (Phân trang, Lọc theo thời gian/loại).
- **[POST] /**: Tạo giao dịch thu/chi (Tự động cập nhật số dư ví).
- **[GET] /information**: Tổng thu và tổng chi trong tháng hiện tại.
- **[GET] /summary**: Thống kê chi tiêu theo từng danh mục (Dạng biểu đồ).

---

## PHẦN 2: API DÀNH CHO ADMIN (QUẢN TRỊ VIÊN)

Prefix cơ sở: `/api/admin`
_Yêu cầu Token của tài khoản có quyền `isAdmin = true`._

### 1. Quản lý danh mục hệ thống

Prefix: `/api/admin/categories`

- **[GET] /**: Lấy danh sách tất cả danh mục trong hệ thống (có phân trang).
- **[GET] /:id**: Chi tiết một danh mục của bất kỳ user nào.
- **[POST] /**: Admin tạo danh mục cho một User cụ thể.
- **[PATCH] /:id**: Chỉnh sửa thông tin danh mục.
- **[DELETE] /:id**: Xóa danh mục bất kỳ.

**Ví dụ Response Admin List Category:**

```json
{
  "data": [
    { "id": 1, "name": "Ăn uống", "status": "ACTIVE", "userId": 10 },
    { "id": 2, "name": "Kinh doanh", "status": "INACTIVE", "userId": 11 }
  ],
  "meta": { "totalItems": 500 }
}
```

### 2. Quản lý giao dịch toàn hệ thống

Prefix: `/api/admin/transactions`

- **[GET] /**: Xem lịch sử giao dịch của toàn bộ người dùng trong hệ thống.
- **Query Params:** Có thể lọc theo `userId`, `type`, `startDate`, `endDate`.

---

## Hướng dẫn sử dụng chung

1. **Base URL:** `http://localhost:5005/api`
2. **Xác thực:** Gửi Token trong Header: `Authorization: Bearer <Your_Token>`
3. **Mã lỗi thường gặp:**
   - `401 Unauthorized`: Token hết hạn hoặc sai.
   - `403 Forbidden`: Truy cập API Admin bằng tài khoản thường.
   - `404 Not Found`: Không tìm thấy ID ví/danh mục/giao dịch.
   - `400 Bad Request`: Số dư ví không đủ để thực hiện chi tiêu.
