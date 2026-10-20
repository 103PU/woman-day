# DECISIONS: Quyết định kỹ thuật & thiết kế

1. **Xử lý thư mục ảnh gốc:**
   - Thư mục `image/` chứa 15 ảnh JPEG. Sử dụng Python/Pillow xử lý tự động xoay EXIF và xóa toàn bộ metadata GPS nhằm bảo vệ quyền riêng tư.
   - Xuất ra 2 phiên bản: `assets/photos/full/` (max 1600px, quality 82) và `assets/photos/thumb/` (max 480px, quality 78).
   - Tổng dung lượng ảnh tối ưu là 3.76 MB (nhỏ hơn mức trần 6 MB theo yêu cầu). Giữ nguyên file gốc trong `image/`.

2. **Font chữ & Thư viện độc lập (No CDN):**
   - Tải trực tiếp Three.js r160 về `js/vendor/three.min.js`.
   - Tải các font Be Vietnam Pro, Playfair Display Bold và Dancing Script Bold về `assets/fonts/` và nhúng trực tiếp qua `@font-face` nội bộ.
   - Đảm bảo trang web hoạt động hoàn hảo 100% offline hoặc khi mất kết nối mạng ngoài.

3. **Nền video & Canvas "Giả video":**
   - Sử dụng kết hợp Canvas 2D Aurora tím hồng + Bokeh ánh sáng chuyển động chậm làm nền động chính (Lớp L2).
   - Đồng thời để sẵn thẻ `<video id="bgVideo">` trỏ tới `assets/video/bg.mp4` tạo bởi ffmpeg (5 KB loop), tự động ẩn nếu không có file video hoặc file lỗi.

4. **Trích xuất âm thanh BGM ban đầu (Giai đoạn 2):**
   - Ban đầu trích từ video mẫu lofi.

5. **Deploy Vercel:**
   - Chuẩn bị sẵn cấu hình `vercel.json` tối ưu header cache và tài liệu hướng dẫn 3 bước cho người giao việc.

6. **Cắt giảm chữ & Tạo khoảng thở (Giai đoạn 3 - L1, L2, L3):**
   - Cắt giảm nghiêm ngặt theo bảng 2.1: Tiêu đề <= 6 từ, nút <= 4 từ, toast <= 10 từ, voucher mặt trước <= 4 từ, mặt sau <= 12 từ, caption polaroid `Kỷ niệm N ♡`.
   - Xóa bỏ toàn bộ các đoạn mô tả dài dưới tiêu đề Màn 1, 2, 3, 4 và các câu giải thích thao tác kỹ thuật ("Giữ khoảng 1,5 giây", "Ảnh phía trước", "Phóng to ảnh", "A LITTLE GIFT", v.v.).
   - Header và footer thu gọn về 1 dòng nhỏ nhắn, tinh tế (`20 · 10 ♡ WITH LOVE`).

7. **Mật mã kép 20/10 & 18/09 (Giai đoạn 3 - L6):**
   - Chuyển cấu hình `PASSCODE` thành mảng `PASSCODES: ["2010", "1809"]`.
   - Kiểm tra bằng `includes()`, nhập `2010` hay `1809` đều mở khóa thành công.
   - Gợi ý trên màn hình rút gọn thành chip: `20/10 hoặc 18/09`.

8. **Nhạc nền Piano/Music-box lãng mạn & Fallback Web Audio (Giai đoạn 3 - L5):**
   - Loại bỏ hoàn toàn track lofi cũ khỏi mặc định để đảm bảo 100% không vướng bản quyền.
   - Tạo bản nhạc `romantic_piano.mp3` (68 BPM, hợp âm Cmaj7 - Am7 - Fmaj7 - G6, giai điệu music-box + piano ấm áp, loop liền mạch).
   - Tích hợp bộ tổng hợp âm thanh Procedural Web Audio API Synthesizer trực tiếp trong `js/audio.js` để tự động phát nhạc nếu file MP3 không tải được.
   - Bổ sung hiệu ứng âm thanh chuông "ting" nhẹ nhàng khi mở khóa mật mã và mở hộp quà.

9. **Hệ thống Animation phong phú (Giai đoạn 3 - L4):**
   - Bổ sung animation: Bó hoa hồng thở nhịp nhàng (`bouquetBreathe`), nắp sáp phong bì đập nhịp tim (`sealHeartbeat`), hộp quà lơ lửng bồng bềnh (`giftFloat`), vương miện lơ lửng, nút chính tỏa sóng hào quang (`btnPulseGlow`).
   - Cánh hoa và trái tim rơi chậm liên tục toàn trang.

10. **Gallery 3D Coverflow Slider thay thế Cylinder (User Review Update):**
   - Vòng xoay hình trụ 15 ảnh làm các thẻ bị ép hẹp và quá tải trong khung nhìn mobile.
   - Thay bằng Coverflow 3D Slider: Ảnh hiện tại to rõ nét ở giữa (220px x 295px), 2 ảnh bên cạnh xoay nghiêng 28 độ tạo chiều sâu, các ảnh ngoài ẩn mượt.
   - Tự động trượt vòng liên tục (loop glide mỗi 3.6s), hỗ trợ vuốt chạm cảm ứng kéo thả mượt mà, chạm ảnh để phóng to lightbox.

11. **Xóa sạch Unicode Emoji - Thay bằng hệ thống SVG 3D Gradient:**
   - Loại bỏ 100% emoji unicode trên toàn bộ giao diện (nút bấm, bàn phím số, voucher, điều ước, header, vương miện, modal).
   - Tạo `js/icons.js` với 19 SVG 3D đổ bóng đa sắc độ phân giải cao: bánh kem 3D, gấu bông 3D, đũa phép 3D, vòng ôm 3D, bồ câu hòa bình, ngôi sao rạng rỡ, hoa sen hạnh phúc, vương miện hoàng gia, hoa hồng bàn phím.

12. **Cập nhật Màn hình Mật mã & Nút cứu hộ:**
   - Gợi ý mật khẩu đổi thành: `Kỉ niệm ngày yêu nhau`.
   - Nút cứu hộ tự mở khóa chuyển thành nút icon chìa khóa tròn nhỏ tinh gọn, không chứa text rườm rà.
   - Phím hoa hồng và phím xóa trên bàn phím dùng icon vector/3D chuyên nghiệp.

13. **Reset hoàn toàn trạng thái khi xem lại (Replay Reset):**
   - Khi bấm "Xem lại", khôi phục toàn diện: khóa lại hộp quà (`unlocked = false`), thanh tiến trình về 0%, scale/rung hộp quà về ban đầu, text nút giữ trở lại "Giữ mở quà", đóng phong bì và cuộn về đầu trang.
