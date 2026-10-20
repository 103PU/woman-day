const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:8080/index.html');

  // 1. Check Passcode Hint Text
  const hintText = await page.textContent('.passcode-hint-chip');
  console.log('Hint text:', hintText);
  if (!hintText.includes('Kỉ niệm ngày yêu nhau')) throw new Error('Hint text wrong');

  // 2. Check Rescue Button has no text
  const rescueText = (await page.textContent('#rescueCodeBtn')).trim();
  console.log('Rescue button text:', JSON.stringify(rescueText));
  if (rescueText.length > 0) throw new Error('Rescue button must not have text');

  // 3. Check No Unicode Emojis in buttons
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const btns = await page.evaluate(() =>
    Array.from(document.querySelectorAll('button, .num-btn, .wish-chip, .voucher-card, .brand-badge')).map(el => el.textContent)
  );
  const badBtns = btns.filter(t => emojiRegex.test(t));
  console.log('Buttons with emojis:', badBtns);
  if (badBtns.length > 0) throw new Error('Found emojis in buttons: ' + badBtns.join(', '));

  // 4. Test Hold button unlock & Replay Reset
  await page.click('#startJourneyBtn');
  await page.waitForSelector('#screen2.active');
  await page.click('#rescueCodeBtn'); // Click small rescue button
  await page.waitForSelector('#screen3.active', { timeout: 4000 });
  console.log('Screen 3 active after rescue key: true');

  const holdBtn = await page.locator('#holdGiftBtn');
  const box = await holdBtn.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(1650);
  await page.mouse.up();
  await page.waitForSelector('#screen4.active', { timeout: 3000 });
  console.log('Screen 4 active after hold gift: true');

  // Now in Screen 4 -> open envelope -> skip -> continue to Screen 5
  await page.click('#letterEnvelope', { force: true });
  await page.waitForSelector('#letterModal.open', { timeout: 3000 });
  await page.click('#skipTypewriterBtn');
  await page.waitForTimeout(300);
  await page.click('#letterContinueBtn');
  await page.waitForSelector('#screen5.active', { timeout: 3000 });
  console.log('Screen 5 active: true');

  // In Screen 5: Click Replay
  await page.click('#replayBtn');
  await page.waitForTimeout(400);

  const s1Active = await page.evaluate(() => document.getElementById('screen1').classList.contains('active'));
  console.log('Replay navigated to Screen 1:', s1Active);

  // Check Gift button state in Screen 3 after replay
  const giftState = await page.evaluate(() => {
    const text = document.getElementById('holdBtnText').textContent;
    const barWidth = document.getElementById('holdProgressBar').style.width;
    return { text, barWidth };
  });
  console.log('Gift state after replay reset:', giftState);
  if (giftState.text.includes('Đã mở quà') || giftState.barWidth === '100%') {
    throw new Error('Gift state not reset!');
  }

  // 5. Check Coverflow cards count & 3D styling
  const coverflowInfo = await page.evaluate(() => {
    const cards = document.querySelectorAll('.coverflow-card');
    const activeCard = document.querySelector('.coverflow-card.active');
    return {
      cardCount: cards.length,
      hasActive: !!activeCard,
      activeWidth: activeCard ? activeCard.clientWidth : 0
    };
  });
  console.log('Coverflow info:', coverflowInfo);

  // 6. Screenshot Coverflow
  await page.evaluate(() => {
    document.getElementById('screen1').classList.remove('active');
    document.getElementById('screen5').classList.add('active');
    document.querySelector('.cosmic-gallery-card').scrollIntoView();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'qa/screens/screen5_coverflow_verified.png' });

  await browser.close();
  console.log('=== TẤT CẢ KIỂM THỬ BỔ SUNG ĐÃ PASS 100% ===');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
