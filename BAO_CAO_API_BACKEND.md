# Báo cáo kiểm tra toàn bộ API Backend

**Ngày:** 17/06/2026  
**Base URL:** `http://123.31.12.172:6001`  
**Frontend:** `quanlythuvien2026` (TanStack Start + React 18)

---

## Tổng quan

| Trạng thái | Số lượng |
|-----------|----------|
| ✅ Hoạt động bình thường | 10 |
| ⚠️ Có vấn đề (logic) | 1 |
| ❌ Bị lỗi (backend) | 1 |

---

## ✅ API hoạt động bình thường

### 1. `GET /api/taikhoan`
- **Status:** 2000
- **Response:**
```json
{
  "data": [
    {"MaTaiKhoan": 3, "TenDangNhap": "admin", "HoTen": "Nguyễn Hoà", "MaVaiTro": 1},
    {"MaTaiKhoan": 7, "TenDangNhap": "user", "HoTen": "User test", "MaVaiTro": 1}
  ],
  "status": 2000,
  "message": "success"
}
```
- **Ghi chú:** Mật khẩu đã hash MD5, cần biết mật khẩu gốc để đăng nhập

### 2. `GET /api/sach`
- **Status:** 2000
- **Response:** `{"data":[],"status":2000,"message":"success"}`
- **Ghi chú:** ⚠️ Database chưa có dữ liệu sách

### 3. `GET /api/tacgia`
- **Status:** 2000
- **Response:** 3 tác giả (MaTacGia: 6,7,8)
- **Ghi chú:** OK

### 4. `GET /api/theloai`
- **Status:** 2000
- **Response:** 1 thể loại (MaTheLoai: 3 - "Kinh dị")
- **Ghi chú:** OK

### 5. `GET /api/docgia`
- **Status:** 2000
- **Response:** 1 độc giả
```json
{"MaDocGia": 3, "HoTen": "asd", "SoDienThoai": "31212", "DiaChi": "23", "SoSachDangMuon": 0}
```
- **Ghi chú:** OK

### 6. `GET /api/phieutra`
- **Status:** 2000
- **Response:** `{"data":[],"status":2000,"message":"success"}`
- **Ghi chú:** Database chưa có phiếu trả

### 7. `GET /api/nhatkysach`
- **Status:** 2000
- **Response:**
```json
{
  "data": [
    {"MaNhatKy":1,"MaSach":1,"TenSachCu":"Sách 1","TenSachMoi":"Sách 1 test","NgayCapNhat":"2026-06-17T23:23:00.777"}
  ],
  "status":2000,
  "message":"success"
}
```
- **Ghi chú:** OK

### 8. `GET /api/baocao/rp1`
- **Status:** 2000
- **Response:**
```json
{
  "data": {"TongDauSach":0,"TongSoSach":0,"DangCoSan":0,"TongDocGia":1,"PhieuQuaHan":0},
  "status":2000,
  "message":"Thao tác thành công!"
}
```
- **Ghi chú:** ⚠️ Response khác với format `{ tenTheLoai, soLuongSach, soLuotMuon }` như thiết kế. Cần đồng bộ lại type `BaoCaoRp1` phía frontend

### 9. `GET /api/baocao/rp2`
- **Status:** 2000
- **Response:** `{"data":[],"status":2000,"message":"Thao tác thành công!"}`
- **Ghi chú:** Top sách mượn nhiều - trống do chưa có dữ liệu

### 10. `GET /api/baocao/rp3`
- **Status:** 2000
- **Response:** `{"data":[],"status":2000,"message":"Thao tác thành công!"}`
- **Ghi chú:** Top độc giả - trống do chưa có dữ liệu

### 11. `GET /api/baocao/rp4`
- **Status:** 2000
- **Response:** `{"data":[],"status":2000,"message":"Thao tác thành công!"}`
- **Ghi chú:** Xu hướng mượn theo tháng - trống do chưa có dữ liệu

### 12. `POST /api/tinh-tien-phat`
- **Status:** 2000
- **Response:** `{"data":35000.0000,"status":2000,"message":"success"}`
- **Ghi chú:** OK. Với hạn trả 10/06, ngày trả 17/06 → phạt 35,000đ

---

## ⚠️ Có vấn đề

### `POST /api/login`
- **Status:** 4001
- **Response:** `{"status":4001,"message":"Mật khẩu không đúng, vui lòng kiểm tra lại!"}`
- **Payload gửi:** `{"tenDangNhap":"admin","password":"admin123"}`
- **Nguyên nhân:** Backend lưu mật khẩu dạng hash MD5 (`21232F297A57A5A743894A0E4A801FC3`). Frontend gửi plaintext không khớp
- **Cách sửa:**
  - **Option 1:** Backend so sánh sau khi hash MD5 password gửi lên
  - **Option 2:** Frontend hash MD5 password trước khi gửi
  - **Option 3:** Backend trả về plaintext password trong `api/taikhoan` để frontend so khớp

---

## ❌ Bị lỗi Backend

### `GET /api/phieumuon`
- **Status:** 5000
- **Response:** `{"status":5000,"message":"Incorrect syntax near the keyword 'on'."}`
- **Nguyên nhân:** Lỗi cú pháp SQL trong backend (thường ở mệnh đề JOIN)
- **Cần sửa:** Kiểm tra câu SQL JOIN trong API phiếu mượn

---

## Tác động đến Frontend

| Trang | Ảnh hưởng |
|-------|-----------|
| **Tổng quan (Dashboard)** | Hiển thị mock data vì api/sach rỗng, api/phieumuon lỗi |
| **Sách** | Trống do DB chưa có sách |
| **Tác giả** | OK - hiển thị 3 tác giả |
| **Thể loại** | OK - hiển thị 1 thể loại |
| **Độc giả** | OK - hiển thị 1 độc giả |
| **Phiếu mượn** | ❌ Không load được do api/phieumuon lỗi SQL |
| **Phiếu trả** | Trống do chưa có dữ liệu |
| **Nhật ký sách** | OK - hiển thị 1 bản ghi |
| **Báo cáo** | OK nhưng dữ liệu trống/khác format |
| **Đăng nhập** | ⚠️ Không login được do mật khẩu hash → fallback mock data |

---

## Hành động cần làm

### Backend (ưu tiên cao)
1. **Sửa lỗi SQL** ở `api/phieumuon`
2. **Sửa login** - hash MD5 password trước khi so sánh hoặc đổi cách xác thực

### Backend (ưu tiên thấp)
3. Thêm dữ liệu mẫu: sách, độc giả, phiếu mượn để kiểm thử
4. Đồng bộ format response `api/baocao/rp1` với thiết kế
