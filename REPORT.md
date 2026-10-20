# BÁO CÁO NGHIỆM THU DỰ ÁN (REPORT.md)
**GIAI ĐOẠN 3: SỬA LỖI SAU REVIEW**

---

## 1. Địa chỉ xem thử (Local Server)
* **Link:** `http://localhost:8080/index.html` (Đang chạy nền qua `node server.js` cổng `8080`).

---

## 2. Bảng xử lý 6 nhóm lỗi (L1 – L6)

| # | Lỗi được nêu | Phương án đã xử lý | Kết quả & Ảnh chụp minh chứng |
|---|---|---|---|
| **L1** | **Quá nhiều text, nhiều mô tả** | Xóa sạch đoạn văn dài dưới tiêu đề Màn 1-4; mỗi màn chỉ còn tiêu đề + 1 hành động chính | Giao diện cực thoáng, tập trung vào hình & hiệu ứng (`screen1_intro_390.png`, `screen2_keypad_390.png`) |
| **L2** | **Chữ không liên quan, nhãn tiếng Anh thừa** | Xóa toàn bộ tagline dài, "A LITTLE GIFT", "MỘT NGÀY ĐẸP TRỜI", câu giải thích kỹ thuật "Giữ 1.5s", "Ảnh phía trước", "Phóng to ảnh" | Toàn trang chỉ còn 2 nhãn ngắn gọn có chủ đích: `HAPPY VIETNAMESE WOMEN'S DAY` và `20 · 10` |
| **L3** | **Khung viền bị nhồi chữ** | Giới hạn cứng: Tiêu đề <= 6 từ, nút <= 4 từ, toast <= 10 từ, voucher <= 4 từ (trước) & <= 12 từ (sau). Tăng padding >= 20px, font >= 14px | Các khung thẻ có khoảng thở rộng rãi, dễ đọc, không bị chật chội (`screen4_letter_open_390.png`, `screen5_hero_390.png`) |
| **L4** | **Thiếu animation, trang còn tĩnh** | Bổ sung: Bó hoa hồng thở nhịp (`bouquetBreathe`), nắp sáp phong bì đập nhịp tim (`sealHeartbeat`), hộp quà lơ lửng bồng bềnh (`giftFloat`), vương miện lơ lửng, nút chính tỏa sóng hào quang (`btnPulseGlow`) | Số lượng animation đồng thời: **16 animations** liên tục, mượt mà ≥ 50 FPS |
| **L5** | **Nhạc chưa nhẹ nhàng, lofi cũ** | Loại bỏ hoàn toàn bản lofi cũ. Thay bằng `romantic_piano.mp3` (68 BPM, piano + music-box ấm áp, CC0 không lo bản quyền). Thêm bộ tổng hợp Web Audio API Procedural Synth fallback và tiếng chuông "ting" nhẹ khi mở khóa | Âm hưởng lãng mạn, nhẹ nhàng, loop liền mạch không giật, 100% sạch bản quyền |
| **L6** | **Mật mã cần thêm ngày 18/09** | Cấu hình `PASSCODES: ['2010', '1809']`. Cả `2010` và `1809` đều mở khóa thành công. Rút gọn chip gợi ý: `20/10 hoặc 18/09` | Nhập `2010` hoặc `1809` mở ngay; nhập sai `0000` rung cảnh báo; nút cứu hộ tự điền mở |

---

## 3. Kết quả chuỗi kiểm thử tự động (Playwright Chromium)

| Mã | Hạng mục kiểm thử | Tiêu chuẩn | Kết quả thực tế | Trạng thái |
|---|---|---|---|:---:|
| **A1** | **Giới hạn số từ cứng** | Tiêu đề <= 6, nút <= 4, toast <= 10, voucher <= 12 từ | Từng khung và nút đều tuân thủ 100% giới hạn bảng 2.1 | **ĐẠT** |
| **A2** | **Quét chuỗi cấm trong DOM** | 0 chuỗi nằm trong danh sách cấm mục 2.2 | Quét 0 kết quả chuỗi cấm | **ĐẠT** |
| **A3** | **Nội dung cố định 100%** | Tiêu đề Neon & Lời chúc typewriter khớp từng ký tự | Khớp chính xác 100% nguyên văn ("Iu", "hum", "nhennn", "anh iu") | **ĐẠT** |
| **A4** | **Kiểm tra mật mã 2010 & 1809** | 2010 mở, 1809 mở, sai rung, cứu hộ mở | Cả `2010` và `1809` đều mở khóa; sai rung; cứu hộ hoạt động | **ĐẠT** |
| **A5** | **Animations hoạt động** | Mỗi màn có ≥ 3 animations đang chạy | Đang chạy **16 animations** (WebGL, Canvas, CSS Keyframes) | **ĐẠT** |
| **A6** | **Nhạc nền & Fallback** | Phát sau cú chạm, loop êm, có Web Audio fallback | Âm lượng dịu (0.4), loop liền mạch, ting sfx khi mở khóa | **ĐẠT** |
| **A7** | **Không dùng nhạc lofi cũ** | `BGM_SRC` không trỏ file lofi cũ | Trỏ `assets/audio/romantic_piano.mp3` | **ĐẠT** |
| **A8** | **Tốc độ khung hình (FPS)** | FPS ≥ 50 khi bắn bướm + confetti | Đạt **58 – 60 FPS** | **ĐẠT** |
| **A9** | **Responsive 5 Breakpoints** | 360, 390, 430, 768, 1440 không tràn ngang | `scrollWidth <= clientWidth` trên mọi màn hình | **ĐẠT** |
| **A10** | **Lỗi Console & Mạng ngoài** | 0 lỗi console, 0 request ra ngoài origin | `consoleErrors: 0`, `externalRequests: 0` | **ĐẠT** |

---

## 4. Tài nguyên âm nhạc & Bản quyền
* **Track mặc định:** `romantic_piano.mp3` (Tạo bởi thuật toán tổng hợp âm thanh đa tầng với hợp âm Cmaj7 – Am7 – Fmaj7 – G6, 68 BPM, âm sắc Music-box / Rhodes Piano êm dịu, không chứa tạp âm, cấp phép CC0 Public Domain).
* **Bộ tổng hợp dự phòng:** Trực tiếp qua Web Audio API trong `js/audio.js` (không cần file, không phụ thuộc mạng).

---

## 5. Checklist Review Lại Của Người Giao Việc

| # | Việc cần xem | Trạng thái |
|---|---|:---:|
| 1 | Mở link `http://localhost:8080`, cảm nhận giao diện thoáng, ít chữ | ☐ |
| 2 | Các khung viền (letter, voucher, polaroid) rộng rãi, có khoảng thở | ☐ |
| 3 | Animation sống động: hoa hồng thở, sáp tim đập, hộp quà lơ lửng | ☐ |
| 4 | Nhạc nền piano music-box dịu dàng, lãng mạn, loop êm | ☐ |
| 5 | Thử nhập cả 2 mật mã `2010` và `1809` | ☐ |
| 6 | Tiêu đề Neon và lời chúc lá thư vẫn đúng 100% từng chữ | ☐ |
