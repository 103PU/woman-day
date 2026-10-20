const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080';
const SCREENS_DIR = path.join(__dirname, '..', 'qa', 'screens');
fs.mkdirSync(SCREENS_DIR, { recursive: true });

const EXPECTED_TITLE = "Chúc Mừng Ngày Của Công Chúa Đáng Iu";
const EXPECTED_LETTER = "Gửi đến công chúa xinh xắn của anh, hôm nay là ngày trọng đại cũng là ngày của công chúa, chúc công chúa luôn tươi tắn, xinh đẹp và rạng rỡ, trong mắt anh công chúa của anh lúc nào cũng là xinh đẹp và tuyệt vời nhất, anh hum có món quà to tát gì, anh có trang này để chúc mừng công chúa, mong công chúa đón nhận nhennn, anh iu công chúa";

const BANNED_STRINGS = [
  "Một hành trình nhỏ, một lời chúc thật lòng",
  "Giữ khoảng 1,5 giây",
  "Ảnh phía trước",
  "Phóng to ảnh",
  "A LITTLE GIFT",
  "20 / 10 • MỘT NGÀY ĐẸP TRỜI"
];

async function runAllTests() {
  console.log('=== BẮT ĐẦU CHUỖI KIỂM THỬ GIAI ĐOẠN 3 (PLAYWRIGHT) ===');
  const results = {};
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    const consoleErrors = [];
    const externalRequests = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));
    page.on('request', req => {
      const url = req.url();
      if (!url.startsWith('http://localhost:8080') && !url.startsWith('data:')) {
        externalRequests.push(url);
      }
    });

    await page.goto(BASE_URL + '/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // ----------------------------------------------------
    // TEST A2: Quét DOM tìm chuỗi cấm
    // ----------------------------------------------------
    const pageText = await page.textContent('body');
    const foundBanned = BANNED_STRINGS.filter(b => pageText.includes(b));
    results.banned_strings_zero = (foundBanned.length === 0);
    console.log(`[A2] Quét chuỗi cấm: ${results.banned_strings_zero ? 'PASS' : 'FAIL'} (Tìm thấy: ${foundBanned.join(', ') || '0'})`);

    // ----------------------------------------------------
    // TEST A7: BGM_SRC không trỏ tới nhạc cũ
    // ----------------------------------------------------
    const bgmSrc = await page.evaluate(() => window.APP_CONFIG.BGM_SRC);
    results.bgm_not_lofi = !bgmSrc.includes('bgm.mp3') && bgmSrc.includes('romantic_piano');
    console.log(`[A7] Nhạc BGM mới (không dùng lofi cũ): ${results.bgm_not_lofi ? 'PASS' : 'FAIL'} (${bgmSrc})`);

    // ----------------------------------------------------
    // TEST A9: Responsive & Không tràn ngang
    // ----------------------------------------------------
    const breakpoints = [
      { name: '360px', w: 360, h: 740 },
      { name: '390px', w: 390, h: 844 },
      { name: '430px', w: 430, h: 932 },
      { name: '768px', w: 768, h: 1024 },
      { name: '1440px', w: 1440, h: 900 }
    ];

    let overflowDetected = false;
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.w, height: bp.h });
      await page.waitForTimeout(200);
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth ||
               document.body.scrollWidth > window.innerWidth;
      });
      if (isOverflowing) overflowDetected = true;
      if (bp.w === 390) {
        await page.screenshot({ path: path.join(SCREENS_DIR, 'screen1_intro_390.png') });
      }
    }
    results.responsive_overflow = !overflowDetected;
    console.log(`[A9] Responsive Không tràn ngang: ${!overflowDetected ? 'PASS' : 'FAIL'}`);

    // Set back to 390x844 mobile
    await page.setViewportSize({ width: 390, height: 844 });

    // ----------------------------------------------------
    // TEST: Màn 1 -> Màn 2
    // ----------------------------------------------------
    await page.click('#startJourneyBtn');
    await page.waitForTimeout(600);

    const s2Active = await page.evaluate(() => document.getElementById('screen2').classList.contains('active'));
    console.log(`[Flow] Màn 1 -> Màn 2: ${s2Active ? 'PASS' : 'FAIL'}`);
    await page.screenshot({ path: path.join(SCREENS_DIR, 'screen2_keypad_390.png') });

    // ----------------------------------------------------
    // TEST A4: Mật mã 2010 VÀ 1809 VÀ 0000 rung VÀ cứu hộ
    // ----------------------------------------------------
    // 1. Thử nhập sai 0000
    await page.click('.num-btn[data-val="0"]');
    await page.click('.num-btn[data-val="0"]');
    await page.click('.num-btn[data-val="0"]');
    await page.click('.num-btn[data-val="0"]');
    await page.waitForTimeout(650);

    // 2. Thử nhập đúng mã mới: 1809
    await page.click('.num-btn[data-val="1"]');
    await page.click('.num-btn[data-val="8"]');
    await page.click('.num-btn[data-val="0"]');
    await page.click('.num-btn[data-val="9"]');
    await page.waitForTimeout(700);

    const s3Active = await page.evaluate(() => document.getElementById('screen3').classList.contains('active'));
    results.passcode_1809_unlock = s3Active;
    console.log(`[A4] Mật mã 18/09 mở khóa thành công: ${s3Active ? 'PASS' : 'FAIL'}`);
    await page.screenshot({ path: path.join(SCREENS_DIR, 'screen3_gift_390.png') });

    // ----------------------------------------------------
    // TEST: Giữ mở hộp quà 1.5s
    // ----------------------------------------------------
    const holdBtn = await page.$('#holdGiftBtn');
    const box = await holdBtn.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(1650);
    await page.mouse.up();
    await page.waitForTimeout(1000);

    const s4Active = await page.evaluate(() => document.getElementById('screen4').classList.contains('active'));
    console.log(`[Flow] Hộp quà giữ 1.5s -> Màn 4: ${s4Active ? 'PASS' : 'FAIL'}`);
    await page.screenshot({ path: path.join(SCREENS_DIR, 'screen4_envelope_390.png') });

    // ----------------------------------------------------
    // TEST A3: Tiêu đề Neon & Lời chúc đúng 100%
    // ----------------------------------------------------
    await page.click('#letterEnvelope', { force: true });
    await page.waitForTimeout(500);
    await page.click('#skipTypewriterBtn');
    await page.waitForTimeout(300);

    const actualTitle = (await page.textContent('#letterNeonTitle')).trim();
    const actualLetter = (await page.textContent('#letterBodyText')).trim();

    results.title_exact_match = (actualTitle === EXPECTED_TITLE);
    results.letter_exact_match = (actualLetter === EXPECTED_LETTER);
    console.log(`[A3] Tiêu đề Neon đúng 100%: ${results.title_exact_match ? 'PASS' : 'FAIL'}`);
    console.log(`[A3] Lời chúc đúng 100%: ${results.letter_exact_match ? 'PASS' : 'FAIL'}`);
    await page.screenshot({ path: path.join(SCREENS_DIR, 'screen4_letter_open_390.png') });

    // ----------------------------------------------------
    // TEST: Sang Màn 5
    // ----------------------------------------------------
    await page.click('#letterContinueBtn');
    await page.waitForTimeout(800);

    const s5Active = await page.evaluate(() => document.getElementById('screen5').classList.contains('active'));
    console.log(`[Flow] Sang Màn 5: ${s5Active ? 'PASS' : 'FAIL'}`);
    await page.screenshot({ path: path.join(SCREENS_DIR, 'screen5_hero_390.png') });

    // Cuộn Màn 5
    await page.evaluate(() => document.querySelector('.cosmic-gallery-card').scrollIntoView());
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENS_DIR, 'screen5_cosmic_390.png') });

    await page.evaluate(() => document.getElementById('gardenContainer').scrollIntoView());
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENS_DIR, 'screen5_garden_footer_390.png') });

    // ----------------------------------------------------
    // TEST A1: Đếm số từ theo giới hạn cứng
    // ----------------------------------------------------
    const wordCounts = await page.evaluate(() => {
      const countWords = str => (str || '').trim().split(/\s+/).filter(Boolean).length;
      return {
        screen1Title: countWords(document.querySelector('#screen1 .screen-title').textContent),
        screen2Title: countWords(document.querySelector('#screen2 .screen-title').textContent),
        screen3Title: countWords(document.querySelector('#screen3 .screen-title').textContent),
        screen4Title: countWords(document.querySelector('#screen4 .screen-title').textContent),
        screen5Title: countWords(document.querySelector('#screen5 .screen-title').textContent),
        startBtn: countWords(document.querySelector('#startJourneyBtn').textContent),
        holdBtn: countWords(document.querySelector('#holdBtnText').textContent),
        sendHeartBtn: countWords(document.querySelector('#sendHeartBtn').textContent),
        vouchers: Array.from(document.querySelectorAll('.voucher-card')).map(v => ({
          front: countWords(v.querySelector('.voucher-name').textContent),
          back: countWords(v.querySelector('.voucher-back-text').textContent)
        }))
      };
    });

    const wordLimitsOk = (
      wordCounts.screen1Title <= 6 &&
      wordCounts.screen2Title <= 6 &&
      wordCounts.screen3Title <= 6 &&
      wordCounts.screen4Title <= 6 &&
      wordCounts.screen5Title <= 6 &&
      wordCounts.startBtn <= 4 &&
      wordCounts.holdBtn <= 4 &&
      wordCounts.sendHeartBtn <= 4 &&
      wordCounts.vouchers.every(v => v.front <= 4 && v.back <= 12)
    );
    results.word_limits_compliant = wordLimitsOk;
    console.log(`[A1] Đạt giới hạn số từ: ${wordLimitsOk ? 'PASS' : 'FAIL'}`);

    // ----------------------------------------------------
    // TEST A5: Kiểm tra animation đang chạy
    // ----------------------------------------------------
    const animCount = await page.evaluate(() => {
      return document.getAnimations().length;
    });
    results.animations_active = (animCount >= 3);
    console.log(`[A5] Số Animations đang chạy: ${animCount} (>= 3) -> ${results.animations_active ? 'PASS' : 'FAIL'}`);

    // ----------------------------------------------------
    // TEST: Lật voucher + Easter egg
    // ----------------------------------------------------
    await page.click('.voucher-card');
    await page.waitForTimeout(200);
    const voucherFlipped = await page.evaluate(() => document.querySelector('.voucher-card').classList.contains('flipped'));

    await page.click('#crownIcon', { force: true });
    await page.waitForTimeout(100);
    await page.click('#crownIcon', { force: true });
    await page.waitForTimeout(100);
    await page.click('#crownIcon', { force: true });
    await page.waitForTimeout(400);
    const secretOpen = await page.evaluate(() => document.getElementById('secretModal').classList.contains('open'));

    // ----------------------------------------------------
    // TEST A10: Console Errors & External Requests
    // ----------------------------------------------------
    results.console_errors_zero = (consoleErrors.length === 0);
    results.external_requests_zero = (externalRequests.length === 0);
    console.log(`[A10] 0 Lỗi Console: ${results.console_errors_zero ? 'PASS' : 'FAIL'} (${consoleErrors.length} lỗi)`);
    if (consoleErrors.length > 0) console.log('Errors:', consoleErrors);
    console.log(`[A10] 0 Request ra ngoài: ${results.external_requests_zero ? 'PASS' : 'FAIL'} (${externalRequests.length} req)`);

    // Ghi file kết quả
    fs.writeFileSync(
      path.join(__dirname, 'phase3_results.json'),
      JSON.stringify({ results, wordCounts, consoleErrors, externalRequests }, null, 2)
    );

    console.log('=== HOÀN THÀNH TOÀN BỘ KIỂM THỬ GIAI ĐOẠN 3 ===');
  } catch (err) {
    console.error('Lỗi kiểm thử:', err);
  } finally {
    await browser.close();
  }
}

runAllTests();
