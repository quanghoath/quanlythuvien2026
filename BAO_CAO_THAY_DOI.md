# Báo cáo thay đổi - Ghép API Backend vào Frontend Quản Lý Thư Viện

**Ngày:** 17/06/2026
**Dự án:** `quanlythuvien2026` (TanStack Start + React)

---

## I. Tổng quan

Dự án ban đầu sử dụng mock data cục bộ. Đã chuyển đổi sang gọi API backend .NET với:

- Xác thực JWT (login/logout)
- CRUD cho tất cả các entity
- Các trang báo cáo, nhật ký

---

## II. File mới (12 files)

| #   | File                   | Mô tả                                                                                                                                       |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `src/api/client.ts`    | Axios instance với base URL (từ `VITE_API_BASE_URL`), interceptor gắn JWT token vào header Authorization, tự động redirect về login khi 401 |
| 2   | `src/api/auth.ts`      | Auth API: `POST /api/login`                                                                                                                 |
| 3   | `src/api/taikhoan.ts`  | Tài khoản API: GET, POST, DELETE `/api/taikhoan`                                                                                            |
| 4   | `src/api/sach.ts`      | Sách API: GET, POST, DELETE `/api/sach`                                                                                                     |
| 5   | `src/api/tacgia.ts`    | Tác giả API: GET, POST, DELETE `/api/tacgia`                                                                                                |
| 6   | `src/api/theloai.ts`   | Thể loại API: GET, POST, DELETE `/api/theloai`                                                                                              |
| 7   | `src/api/docgia.ts`    | Độc giả API: GET, POST, DELETE `/api/docgia`                                                                                                |
| 8   | `src/api/phieumuon.ts` | Phiếu mượn API: GET, POST, DELETE `/api/phieumuon`                                                                                          |
| 9   | `src/api/phieutra.ts`  | Phiếu trả API: GET, POST `/api/phieutra` + POST `/api/tinh-tien-phat`                                                                       |
| 10  | `src/api/nhatky.ts`    | Nhật ký API: GET `/api/nhatkysach`                                                                                                          |
| 11  | `src/api/baocao.ts`    | Báo cáo API: GET `/api/baocao/rp1` → `rp4`                                                                                                  |
| 12  | `package-lock.json`    | Lock file cho axios                                                                                                                         |

---

## III. File đã sửa (5 files)

### 1. `package.json`

- Thêm dependency `axios`

### 2. `src/types/library.ts`

- Thêm các type mới:
  - `ApiResponse<T>` - Generic API response `{ data, status, message }`
  - `CreateTaiKhoan` - Payload thêm/sửa tài khoản
  - `LoginPayload`, `LoginResponse` - Đăng nhập
  - `BaoCaoRp1` → `BaoCaoRp4` - Các loại báo cáo
  - `TinhTienPhatRequest` - Tính tiền phạt

### 3. `src/store/authStore.tsx`

- **Trước:** Đăng nhập bằng mock data (`mockTaiKhoan`)
- **Sau:** Gọi API `POST /api/login` thực tế, lưu JWT token vào localStorage
- Hỗ trợ async login với error handling

### 4. `src/store/libraryStore.tsx`

- **Trước:** CRUD thuần túy trên state local (mock data)
- **Sau:** Tất cả các hàm CRUD gọi API backend:
  - `add/update/delete` → gọi API → `refetchAll()` để cập nhật danh sách
  - `refetchAll()`: gọi song song 8 API GET để lấy dữ liệu mới nhất
  - Fallback về mock data nếu API không khả dụng
  - Phiếu mượn: không cho sửa (API không hỗ trợ)
  - Phiếu trả: không cho xoá (API không hỗ trợ)

### 5. `src/components/auth/LoginScreen.tsx`

- **Trước:** Login đồng bộ với mock data + setTimeout giả
- **Sau:** Login async gọi API thật, loading spinner, error handling

---

## IV. Các API Endpoint được kết nối

| HTTP   | Endpoint              | Chức năng                  |
| ------ | --------------------- | -------------------------- |
| POST   | `/api/login`          | Đăng nhập → JWT token      |
| GET    | `/api/taikhoan`       | Danh sách tài khoản        |
| POST   | `/api/taikhoan`       | Thêm / Sửa tài khoản       |
| DELETE | `/api/taikhoan/{id}`  | Xoá tài khoản              |
| GET    | `/api/sach`           | Danh sách sách             |
| POST   | `/api/sach`           | Thêm / Sửa sách            |
| DELETE | `/api/sach/{id}`      | Xoá sách                   |
| GET    | `/api/tacgia`         | Danh sách tác giả          |
| POST   | `/api/tacgia`         | Thêm / Sửa tác giả         |
| DELETE | `/api/tacgia/{id}`    | Xoá tác giả                |
| GET    | `/api/theloai`        | Danh sách thể loại         |
| POST   | `/api/theloai`        | Thêm / Sửa thể loại        |
| DELETE | `/api/theloai/{id}`   | Xoá thể loại               |
| GET    | `/api/docgia`         | Danh sách độc giả          |
| POST   | `/api/docgia`         | Thêm / Sửa độc giả         |
| DELETE | `/api/docgia/{id}`    | Xoá độc giả                |
| GET    | `/api/phieumuon`      | Danh sách phiếu mượn       |
| POST   | `/api/phieumuon`      | Thêm mới phiếu mượn        |
| DELETE | `/api/phieumuon/{id}` | Xoá phiếu mượn             |
| GET    | `/api/phieutra`       | Danh sách phiếu trả        |
| POST   | `/api/phieutra`       | Thêm / Sửa phiếu trả       |
| POST   | `/api/tinh-tien-phat` | Tính tiền phạt             |
| GET    | `/api/nhatkysach`     | Danh sách nhật ký          |
| GET    | `/api/baocao/rp1`     | Báo cáo sách theo thể loại |
| GET    | `/api/baocao/rp2`     | Top sách mượn nhiều        |
| GET    | `/api/baocao/rp3`     | Top độc giả tích cực       |
| GET    | `/api/baocao/rp4`     | Xu hướng mượn theo tháng   |

---

## V. Cấu hình biến môi trường

Thêm vào `.env` hoặc `.env.local`:

```env
VITE_API_BASE_URL=https://localhost:5001
```

Mặc định nếu không set sẽ dùng `https://localhost:5001`.

---

## VI. Luồng hoạt động

1. **Đăng nhập:** Người dùng nhập TenDangNhap + Password → gọi `POST /api/login` → nhận JWT token → lưu localStorage → hiển thị app
2. **Auth Guard:** `__root.tsx` kiểm tra `currentUser` từ AuthContext → nếu chưa đăng nhập thì hiển thị LoginScreen
3. **CRUD:** Mỗi thao tác (thêm/sửa/xoá) gọi API → nếu thành công (status=2000) thì refetchAll() để cập nhật UI
4. **API calls:** Tất cả request đều được gắn `Authorization: Bearer <token>` qua axios interceptor
5. **Fallback:** Nếu API không khả dụng, dữ liệu mock vẫn được dùng làm fallback ban đầu

---

## VII. Kiểm tra

- ✅ TypeScript type check: **0 lỗi** (`npx tsc --noEmit`)
- ✅ Build production: **thành công** (`npx vite build`)
- ✅ Tất cả 11 route hiện có vẫn hoạt động bình thường
