/**
 * CẤU HÌNH TRANG WEB CHÚC MỪNG 20/10 CHO CÔNG CHÚA DƯƠNG NGUYỄN HẠ VY
 * Đã tối ưu chữ ngắn gọn, giàu cảm xúc theo quy tắc Giai đoạn 3.
 */

window.APP_CONFIG = {
  // 1. Ngày bắt đầu yêu nhau (PLACEHOLDER - Người review thay bằng ngày thật)
  LOVE_START_DATE: "2023-10-20T00:00:00+07:00",

  // 2. Mật mã mở khóa Chương 01: Chấp nhận cả 20/10 và 18/09
  PASSCODES: ["2010", "1809"],

  // 3. Đường dẫn nhạc nền lãng mạn nhẹ nhàng (Piano / Music-box CC0)
  BGM_SRC: "assets/audio/romantic_piano.mp3",

  // 4. Lời nhắn bí mật Easter Egg (Chạm 3 lần vào vương miện)
  // TODO: Người review viết lại theo lời thật
  SECRET_MESSAGE: "Gửi Hạ Vy công chúa của anh: Cảm ơn em vì đã xuất hiện và khiến cuộc sống của anh ngập tràn dịu dàng. Mãi yêu em!",

  // 5. Nội dung cố định (GIỮ NGUYÊN 100% TỪNG KÝ TỰ THEO TICKET)
  FIXED_CONTENT: {
    NEON_TITLE: "Chúc Mừng Ngày Của Công Chúa Đáng Iu",
    LETTER_TEXT: "Gửi đến công chúa xinh xắn của anh, hôm nay là ngày trọng đại cũng là ngày của công chúa, chúc công chúa luôn tươi tắn, xinh đẹp và rạng rỡ, trong mắt anh công chúa của anh lúc nào cũng là xinh đẹp và tuyệt vời nhất, anh hum có món quà to tát gì, anh có trang này để chúc mừng công chúa, mong công chúa đón nhận nhennn, anh iu công chúa"
  },

  // 6. Ba điều ước ở Chương 04 (Ngắn gọn <= 10 từ)
  WISHES: [
    {
      id: "peace",
      title: "Bình an",
      iconType: "peace",
      toast: "Bình an luôn ở bên em mỗi ngày."
    },
    {
      id: "radiant",
      title: "Rạng rỡ",
      iconType: "radiant",
      toast: "Chúc công chúa luôn rạng rỡ, tỏa sáng."
    },
    {
      id: "happy",
      title: "Hạnh phúc",
      iconType: "happy",
      toast: "Mong nụ cười luôn ở trên môi em."
    }
  ],

  // 7. Lời nhắn ngọt ngào khi bấm "Chút ngọt ngào" (Mỗi câu <= 10 từ, 1 dòng)
  SWEET_QUOTES: [
    "Cả bầu trời dịu dàng bay tới bên em",
    "Một đàn bướm mang yêu thương đến cho em",
    "Bình an luôn ở bên em mỗi ngày",
    "Công chúa của anh lúc nào cũng xinh đẹp",
    "Mong nụ cười luôn ở trên môi em",
    "Hạ Vy là điều ngọt ngào nhất của anh",
    "Mỗi ngày bên em đều là ngày đẹp"
  ],

  // 8. Bốn voucher của Công Chúa (Mặt trước <= 4 từ, Mặt sau <= 12 từ)
  VOUCHERS: [
    {
      title: "Ăn Uống Tùy Thích",
      iconType: "cake3d",
      color: "#ff7597",
      backDesc: "Món nào em thèm anh cũng bao hết!"
    },
    {
      title: "Miễn Phạt Dỗi Hờn",
      iconType: "bear3d",
      color: "#c084fc",
      backDesc: "Dù em dỗi thế nào anh cũng dỗ!"
    },
    {
      title: "1 Ngày Sai Vặt",
      iconType: "wand3d",
      color: "#38bdf8",
      backDesc: "Anh làm mọi việc theo lệnh công chúa!"
    },
    {
      title: "Ôm Ấm Áp",
      iconType: "hug3d",
      color: "#f472b6",
      backDesc: "Đổi 1000 cái ôm bất cứ lúc nào!"
    }
  ]
};
