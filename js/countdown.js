/**
 * LOVE COUNTDOWN TIMER
 * Calculates elapsed time from LOVE_START_DATE in Vietnam Time (UTC+7).
 * Updates Days, Hours, Minutes, Seconds every second.
 */

class LoveCountdown {
  constructor(startDateStr) {
    this.startDate = new Date(startDateStr || "2023-10-20T00:00:00+07:00");
    this.daysEl = document.getElementById('countDays');
    this.hoursEl = document.getElementById('countHours');
    this.minutesEl = document.getElementById('countMinutes');
    this.secondsEl = document.getElementById('countSeconds');

    this.timer = null;
    this.update();
    this.start();
  }

  start() {
    this.timer = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date();
    let diff = now - this.startDate;

    // Handle future dates safely
    if (diff < 0) diff = 0;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (this.daysEl) this.daysEl.textContent = days;
    if (this.hoursEl) this.hoursEl.textContent = String(hours).padStart(2, '0');
    if (this.minutesEl) this.minutesEl.textContent = String(minutes).padStart(2, '0');
    if (this.secondsEl) this.secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }
}

window.LoveCountdown = LoveCountdown;
