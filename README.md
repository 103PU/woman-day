# Web Quà Tặng 20/10 Cho "Công Chúa" Dương Nguyễn Hạ Vy 💖

Trang web quà tặng tương tác cao cấp dành cho ngày Phụ nữ Việt Nam 20/10, được thiết kế theo phong cách dreamy pastel lofi neon, tối ưu trải nghiệm Mobile-First.

---

## 1. Cách chạy tại máy cục bộ (Local)

Dự án là Static Site thuần túy (HTML5 + CSS3 + Vanilla JavaScript), không yêu cầu build step:

```bash
# Cách 1: Chạy server Node.js có sẵn (hỗ trợ HTTP Range cho âm thanh / video)
cd "E:\PROJECT\woman day"
node server.js

# Hoặc dùng Python:
python -m http.server 8080

# Mở trình duyệt truy cập:
http://localhost:8080
```

---

## 2. Hướng dẫn tùy chỉnh & cập nhật dữ liệu

Toàn bộ dữ liệu cấu hình tập trung tại file [`js/config.js`](file:///E:/PROJECT/woman%20day/js/config.js):

| Khóa cấu hình | Vị trí | Mô tả |
|---|---|---|
| `LOVE_START_DATE` | Dòng 8 | Ngày bắt đầu yêu nhau (mặc định: `2023-10-20T00:00:00+07:00`) |
| `PASSCODES` | Dòng 11 | Danh sách mật mã mở khóa (`['2010', '1809']`) |
| `BGM_SRC` | Dòng 14 | Đường dẫn nhạc nền (mặc định: `assets/audio/romantic_piano.mp3`) |
| `SECRET_MESSAGE` | Dòng 17 | Nội dung thư mật khi bấm 3 lần vào vương miện 👑 |
| `WISHES` | Dòng 26 | 3 điều ước ở Chương 04 |
| `SWEET_QUOTES` | Dòng 50 | Danh sách thông điệp ngẫu nhiên khi bấm nút "Chút ngọt ngào 🦋" |
| `VOUCHERS` | Dòng 62 | Danh sách 4 thẻ voucher lật 3D |

---

## 3. Bản quyền & Nguồn tài nguyên
- **Three.js:** MIT License (bản local r160 lưu tại `js/vendor/three.min.js`).
- **Phông chữ:** Be Vietnam Pro, Playfair Display, Dancing Script (Open Font License - Google Fonts, lưu local tại `assets/fonts/`).
- **Ảnh:** Ảnh cá nhân của người nhận trong thư mục `image/`, được tự động xóa bỏ thẻ GPS EXIF.
- **Nhạc nền:** `romantic_piano.mp3` (68 BPM, piano + music-box, CC0 Public Domain / Original Composition, không lo bản quyền). Đồng thời có bộ tổng hợp âm thanh Web Audio API procedural synthesizer hoạt động trực tiếp trên trình duyệt.
