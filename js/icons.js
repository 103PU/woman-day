/**
 * 3D GRADIENT & VECTOR SVG ICON SYSTEM
 * Professional, fully-colored 3D-shaded SVGs. Zero Unicode Emojis.
 */

window.SVG_ICONS = {
  // 1. BRAND FLOWER (Header)
  flower: `<svg viewBox="0 0 32 32" fill="none" class="svg-icon-3d">
    <defs>
      <radialGradient id="flGradCenter" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff7ed"/>
        <stop offset="70%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#d97706"/>
      </radialGradient>
      <linearGradient id="flGradPetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff9ebb"/>
        <stop offset="60%" stop-color="#f43f5e"/>
        <stop offset="100%" stop-color="#9f1239"/>
      </linearGradient>
    </defs>
    <circle cx="16" cy="7" r="5.5" fill="url(#flGradPetal)" />
    <circle cx="24.5" cy="13" r="5.5" fill="url(#flGradPetal)" />
    <circle cx="21" cy="23" r="5.5" fill="url(#flGradPetal)" />
    <circle cx="11" cy="23" r="5.5" fill="url(#flGradPetal)" />
    <circle cx="7.5" cy="13" r="5.5" fill="url(#flGradPetal)" />
    <circle cx="16" cy="16" r="4.5" fill="url(#flGradCenter)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"/>
    <circle cx="14.5" cy="14.5" r="1.5" fill="#fff" opacity="0.8"/>
  </svg>`,

  // 2. 3D MUSIC EQUALIZER / NOTE
  music: `<svg viewBox="0 0 32 32" fill="none" class="svg-icon-3d">
    <defs>
      <linearGradient id="musGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fbcfe8"/>
        <stop offset="50%" stop-color="#ec4899"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>
    </defs>
    <path d="M16 4v16.5a4.5 4.5 0 1 1-3.5-4.4V9h12v4.5a4.5 4.5 0 1 1-3.5-4.4V4H16z" fill="url(#musGrad)" filter="drop-shadow(0 2px 5px rgba(236,72,153,0.5))"/>
    <circle cx="9.5" cy="20.5" r="2.2" fill="#fff" opacity="0.4"/>
    <circle cx="21.5" cy="15.5" r="2.2" fill="#fff" opacity="0.4"/>
  </svg>`,

  // 3. ARROW ↗
  arrowUpRight: `<svg viewBox="0 0 24 24" fill="none" class="svg-icon">
    <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  // 4. 3D KEYPAD ROSE
  keypadRose: `<svg viewBox="0 0 32 32" fill="none" class="svg-icon-3d">
    <defs>
      <radialGradient id="kpRose" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#fff1f2"/>
        <stop offset="40%" stop-color="#f43f5e"/>
        <stop offset="100%" stop-color="#881337"/>
      </radialGradient>
    </defs>
    <circle cx="16" cy="16" r="11" fill="url(#kpRose)" filter="drop-shadow(0 4px 8px rgba(136,19,55,0.4))"/>
    <path d="M16 9c-3 0-5 2.5-5 5s3 5 5 7c2-2 5-4.5 5-7s-2-5-5-5z" fill="#fda4af" opacity="0.7"/>
    <path d="M14 13c0-1.5 1-2.5 2-2.5s2 1 2 2.5-1 2.5-2 2.5-2-1-2-2.5z" fill="#ffe4e6"/>
  </svg>`,

  // 5. RESCUE KEY (Small icon button, no text)
  keyUnlock: `<svg viewBox="0 0 24 24" fill="none" class="svg-icon">
    <defs>
      <linearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="60%" stop-color="#eab308"/>
        <stop offset="100%" stop-color="#a16207"/>
      </linearGradient>
    </defs>
    <path d="M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" fill="url(#keyGrad)"/>
    <path d="M11 11v8l3-1.5 2 1.5V16h2v-3h-7z" fill="url(#keyGrad)"/>
    <circle cx="11" cy="7" r="1.5" fill="#fff" opacity="0.7"/>
  </svg>`,

  // 6. BACKSPACE ICON
  backspace: `<svg viewBox="0 0 24 24" fill="none" class="svg-icon">
    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="18" y1="9" x2="12" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="12" y1="9" x2="18" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  // 7. 3D GLOSS HEART (Hold Button & Send Heart)
  heart3d: `<svg viewBox="0 0 32 32" fill="none" class="svg-icon-3d">
    <defs>
      <radialGradient id="h3dGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffd5e2"/>
        <stop offset="35%" stop-color="#ff4d88"/>
        <stop offset="85%" stop-color="#d81b60"/>
        <stop offset="100%" stop-color="#880e4f"/>
      </radialGradient>
      <filter id="h3dGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#ff4d88" flood-opacity="0.5"/>
      </filter>
    </defs>
    <path d="M16 27.5l-2.1-1.9C6.4 18.9 1.5 14.5 1.5 8.9 1.5 4.4 5 1 9.5 1c2.5 0 5 1.2 6.5 3.1C17.5 2.2 20 1 22.5 1 27 1 30.5 4.4 30.5 8.9c0 5.6-4.9 10-12.4 16.7L16 27.5z" fill="url(#h3dGrad)" filter="url(#h3dGlow)"/>
    <ellipse cx="9" cy="7.5" rx="4" ry="2.2" transform="rotate(-30 9 7.5)" fill="#fff" opacity="0.6"/>
  </svg>`,

  // 8. 3D WISH: BÌNH AN (Peace Dove with Olive Branch)
  peace: `<svg viewBox="0 0 36 36" fill="none" class="svg-icon-3d">
    <defs>
      <linearGradient id="doveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="60%" stop-color="#bae6fd"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>
    </defs>
    <path d="M28 8c-3 1-5 4-8 4-4 0-8-3-11 1-3 4-2 9 2 12 3 2 7 2 10 0 4-3 8-1 11-5 2-3 2-8-4-12z" fill="url(#doveGrad)" filter="drop-shadow(0 3px 6px rgba(56,189,248,0.4))"/>
    <path d="M14 18c2-3 5-5 8-5" stroke="#0284c7" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M6 10c2-1 4 0 5 2-1 2-3 2-5 0z" fill="#4ade80"/>
  </svg>`,

  // 9. 3D WISH: RẠNG RỠ (3D Radiant Diamond Star)
  radiant: `<svg viewBox="0 0 36 36" fill="none" class="svg-icon-3d">
    <defs>
      <linearGradient id="starFacet1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fffbeb"/>
        <stop offset="60%" stop-color="#fde047"/>
        <stop offset="100%" stop-color="#ca8a04"/>
      </linearGradient>
      <linearGradient id="starFacet2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="60%" stop-color="#fef08a"/>
        <stop offset="100%" stop-color="#eab308"/>
      </linearGradient>
    </defs>
    <path d="M18 2L21.5 14.5L34 18L21.5 21.5L18 34L14.5 21.5L2 18L14.5 14.5L18 2Z" fill="url(#starFacet1)" filter="drop-shadow(0 3px 8px rgba(234,179,8,0.55))"/>
    <path d="M18 2L21.5 14.5L18 18L14.5 14.5L18 2Z" fill="url(#starFacet2)"/>
    <path d="M34 18L21.5 21.5L18 18L21.5 14.5L34 18Z" fill="#facc15"/>
    <circle cx="18" cy="18" r="2.8" fill="#fff" filter="drop-shadow(0 0 4px #fff)"/>
  </svg>`,

  // 10. 3D WISH: HẠNH PHÚC (3D Lotus Rose Bloom)
  happy: `<svg viewBox="0 0 36 36" fill="none" class="svg-icon-3d">
    <defs>
      <radialGradient id="hapLotus" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#fdf2f8"/>
        <stop offset="50%" stop-color="#ec4899"/>
        <stop offset="100%" stop-color="#9d174d"/>
      </radialGradient>
    </defs>
    <path d="M18 6c-3 5-7 10-7 16 0 5 3.5 9 7 9s7-4 7-9c0-6-4-11-7-16z" fill="url(#hapLotus)" filter="drop-shadow(0 3px 6px rgba(157,23,77,0.45))"/>
    <path d="M18 12c-4 4-9 7-10 11 0 5 4 8 8 8" fill="#f472b6" opacity="0.8"/>
    <path d="M18 12c4 4 9 7 10 11 0 5-4 8-8 8" fill="#fb7185" opacity="0.8"/>
    <circle cx="18" cy="16" r="2.5" fill="#fef08a"/>
  </svg>`,

  // 11. 3D BUTTERFLY (Chút ngọt ngào)
  butterfly: `<svg viewBox="0 0 36 36" fill="none" class="svg-icon-3d">
    <defs>
      <linearGradient id="bfWing1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#93c5fd"/>
        <stop offset="60%" stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
      <linearGradient id="bfWing2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e9d5ff"/>
        <stop offset="60%" stop-color="#c084fc"/>
        <stop offset="100%" stop-color="#7e22ce"/>
      </linearGradient>
    </defs>
    <path d="M18 14c-3-6-10-8-13-4s-2 10 4 12l9-8z" fill="url(#bfWing1)"/>
    <path d="M18 20c-2 3-6 7-9 5s-2-6 3-7l6 2z" fill="url(#bfWing1)" opacity="0.85"/>
    <path d="M18 14c3-6 10-8 13-4s2 10-4 12l-9-8z" fill="url(#bfWing2)"/>
    <path d="M18 20c2 3 6 7 9 5s2-6-3-7l-6 2z" fill="url(#bfWing2)" opacity="0.85"/>
    <ellipse cx="18" cy="18" rx="1.6" ry="7.5" fill="#2e1065"/>
    <circle cx="18" cy="10" r="2" fill="#3b0764"/>
  </svg>`,

  // 12. 3D REPLAY
  replay: `<svg viewBox="0 0 24 24" fill="none" class="svg-icon">
    <defs>
      <linearGradient id="repGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#c4b5fd"/>
        <stop offset="100%" stop-color="#8b5cf6"/>
      </linearGradient>
    </defs>
    <path d="M3 12a9 9 0 1 0 2.5-6.2L2 9" stroke="url(#repGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 3v6h6" stroke="url(#repGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  // 13. 3D ZOOM (Magnifier)
  zoom: `<svg viewBox="0 0 24 24" fill="none" class="svg-icon">
    <circle cx="10.5" cy="10.5" r="7" stroke="#ffd5e2" stroke-width="2.5"/>
    <path d="M16 16l5.5 5.5" stroke="#ff7da7" stroke-width="3" stroke-linecap="round"/>
    <path d="M10.5 7.5v6M7.5 10.5h6" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  // 14. CHEVRONS
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" class="svg-icon">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" class="svg-icon">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>`,

  // 15. 3D CROWN
  crown3d: `<svg viewBox="0 0 44 44" fill="none" class="svg-icon-crown">
    <defs>
      <linearGradient id="crGold1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="#eab308"/>
        <stop offset="100%" stop-color="#854d0e"/>
      </linearGradient>
      <filter id="crGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#eab308" flood-opacity="0.65"/>
      </filter>
    </defs>
    <rect x="6" y="30" width="32" height="6" rx="3" fill="#ca8a04"/>
    <rect x="6" y="30" width="32" height="4.5" rx="2.5" fill="url(#crGold1)"/>
    <circle cx="12" cy="32.5" r="1.6" fill="#ec4899"/>
    <circle cx="22" cy="32.5" r="2" fill="#38bdf8"/>
    <circle cx="32" cy="32.5" r="1.6" fill="#ec4899"/>
    <path d="M6 30L9 14L16 22L22 8L28 22L35 14L38 30H6Z" fill="url(#crGold1)" filter="url(#crGlow)"/>
    <circle cx="9" cy="14" r="2.8" fill="#fff" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.3))"/>
    <circle cx="22" cy="8" r="3.5" fill="#fff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"/>
    <circle cx="35" cy="14" r="2.8" fill="#fff" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.3))"/>
  </svg>`,

  // 16. 3D VOUCHER 1: CAKE (Ăn uống tùy thích)
  cake3d: `<svg viewBox="0 0 44 44" fill="none" class="svg-icon-voucher">
    <defs>
      <linearGradient id="ckBase" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fbcfe8"/>
        <stop offset="50%" stop-color="#f43f5e"/>
        <stop offset="100%" stop-color="#9f1239"/>
      </linearGradient>
      <linearGradient id="ckCream" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#ffe4e6"/>
      </linearGradient>
    </defs>
    <rect x="8" y="24" width="28" height="13" rx="4" fill="url(#ckBase)" filter="drop-shadow(0 4px 6px rgba(159,18,57,0.4))"/>
    <rect x="7" y="22" width="30" height="5" rx="2.5" fill="url(#ckCream)"/>
    <rect x="13" y="14" width="18" height="10" rx="3" fill="url(#ckBase)"/>
    <rect x="12" y="12" width="20" height="4" rx="2" fill="url(#ckCream)"/>
    <rect x="21" y="6" width="2" height="7" rx="1" fill="#fde047"/>
    <circle cx="22" cy="4" r="2" fill="#ef4444" filter="drop-shadow(0 0 3px #f59e0b)"/>
    <circle cx="22" cy="4" r="1" fill="#fff"/>
  </svg>`,

  // 17. 3D VOUCHER 2: TEDDY BEAR (Miễn phạt dỗi hờn)
  bear3d: `<svg viewBox="0 0 44 44" fill="none" class="svg-icon-voucher">
    <defs>
      <radialGradient id="brFur" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#e9d5ff"/>
        <stop offset="60%" stop-color="#a855f7"/>
        <stop offset="100%" stop-color="#581c87"/>
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="6" fill="url(#brFur)"/>
    <circle cx="32" cy="12" r="6" fill="url(#brFur)"/>
    <circle cx="12" cy="12" r="3.2" fill="#fbcfe8"/>
    <circle cx="32" cy="12" r="3.2" fill="#fbcfe8"/>
    <circle cx="22" cy="22" r="14" fill="url(#brFur)" filter="drop-shadow(0 4px 8px rgba(88,28,135,0.4))"/>
    <ellipse cx="22" cy="25" rx="6" ry="4.5" fill="#fff"/>
    <ellipse cx="22" cy="23.5" rx="2.5" ry="1.6" fill="#3b0764"/>
    <path d="M22 25.1v2m-2 0q2 1.5 4 0" stroke="#3b0764" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="17" cy="18" r="1.8" fill="#1e1b4b"/>
    <circle cx="16.5" cy="17.5" r="0.6" fill="#fff"/>
    <circle cx="27" cy="18" r="1.8" fill="#1e1b4b"/>
    <circle cx="26.5" cy="17.5" r="0.6" fill="#fff"/>
    <ellipse cx="14" cy="23" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6"/>
    <ellipse cx="30" cy="23" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6"/>
  </svg>`,

  // 18. 3D VOUCHER 3: MAGIC WAND (1 Ngày sai vặt)
  wand3d: `<svg viewBox="0 0 44 44" fill="none" class="svg-icon-voucher">
    <defs>
      <linearGradient id="wndStaff" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#bae6fd"/>
        <stop offset="50%" stop-color="#0ea5e9"/>
        <stop offset="100%" stop-color="#0369a1"/>
      </linearGradient>
      <linearGradient id="wndStar" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="#eab308"/>
        <stop offset="100%" stop-color="#ca8a04"/>
      </linearGradient>
    </defs>
    <rect x="7" y="32" width="24" height="4.5" rx="2" transform="rotate(-45 7 32)" fill="url(#wndStaff)" filter="drop-shadow(0 3px 5px rgba(3,105,161,0.4))"/>
    <path d="M29 5l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7L29 5z" fill="url(#wndStar)" filter="drop-shadow(0 0 6px #fde047)"/>
    <circle cx="29" cy="12.5" r="1.8" fill="#fff"/>
    <circle cx="39" cy="8" r="1.5" fill="#fde047"/>
    <circle cx="22" cy="7" r="1.2" fill="#7dd3fc"/>
    <circle cx="37" cy="22" r="1.2" fill="#fde047"/>
  </svg>`,

  // 19. 3D VOUCHER 4: WARM EMBRACE (Ôm ấm áp)
  hug3d: `<svg viewBox="0 0 44 44" fill="none" class="svg-icon-voucher">
    <defs>
      <radialGradient id="hgH1" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#fed7aa"/>
        <stop offset="60%" stop-color="#f97316"/>
        <stop offset="100%" stop-color="#c2410c"/>
      </radialGradient>
      <radialGradient id="hgH2" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#fce7f3"/>
        <stop offset="50%" stop-color="#ec4899"/>
        <stop offset="100%" stop-color="#be185d"/>
      </radialGradient>
    </defs>
    <path d="M18 33l-1.5-1.4C8 24.3 3 19.8 3 14c0-4.4 3.5-7.8 8-7.8 2.5 0 5 1.2 6.5 3.1 1.5-1.9 4-3.1 6.5-3.1 4.5 0 8 3.4 8 7.8 0 5.8-5 10.3-13.5 17.6L18 33z" fill="url(#hgH2)" filter="drop-shadow(0 4px 8px rgba(190,24,93,0.45))"/>
    <path d="M28 29l-1.1-1C20.5 22.3 17 19 17 15c0-3.1 2.4-5.5 5.5-5.5 1.7 0 3.4.8 4.5 2.2 1.1-1.4 2.8-2.2 4.5-2.2 3.1 0 5.5 2.4 5.5 5.5 0 4-3.5 7.3-9.9 13L28 29z" fill="url(#hgH1)" opacity="0.95"/>
    <ellipse cx="10" cy="11" rx="2.5" ry="1.5" transform="rotate(-30 10 11)" fill="#fff" opacity="0.6"/>
  </svg>`
};
