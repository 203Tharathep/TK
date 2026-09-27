/**
 * 🌻 TO MY SUNSHINE - ROMANTIC INTERACTIVE APPLICATION
 * Features:
 * - Natural wind physics & sway animation
 * - Dual page routing (Hero Swaying Sunflower -> Sunflower Garden)
 * - Layered interactive meadow with normal and special colored sunflowers
 * - Love letter polaroid modals with custom photos and messages
 * - Discovery counter & Secret finale celebration
 * - Web Audio API Romantic Music Box / Lofi Piano Synthesizer
 * - Ambient golden particles, floating petals, and hearts
 */

(function () {
  'use strict';

  // Config reference
  const CONFIG = window.SURPRISE_CONFIG || {};

  // DOM Elements
  const heroView = document.getElementById('hero-view');
  const gardenView = document.getElementById('garden-view');
  const heroSunflowerInteractive = document.getElementById('hero-sunflower-interactive');
  const heroBadge = document.getElementById('hero-badge');
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  const heroTapHint = document.getElementById('hero-tap-hint');
  const heroHintText = document.getElementById('hero-hint-text');

  const btnBackHero = document.getElementById('btn-back-hero');
  const counterPill = document.getElementById('counter-pill');
  const counterText = document.getElementById('counter-text');
  const meadowContainer = document.getElementById('sunflower-meadow');
  const layerBack = document.getElementById('layer-back');
  const layerMid = document.getElementById('layer-mid');
  const layerFront = document.getElementById('layer-front');
  const gardenBanner = document.getElementById('garden-banner');
  const btnCloseBanner = document.getElementById('btn-close-banner');

  // Audio elements
  const audioWidget = document.getElementById('audio-widget');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  const audioLabel = document.getElementById('audio-label');
  const btnGardenAudio = document.getElementById('btn-garden-audio');
  const gardenAudioIcon = document.getElementById('garden-audio-icon');

  // Modal elements
  const memoryModal = document.getElementById('memory-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalMemoryTag = document.getElementById('modal-memory-tag');
  const modalMemoryDate = document.getElementById('modal-memory-date');
  const modalPhoto = document.getElementById('modal-photo');
  const modalPolaroidCaption = document.getElementById('modal-polaroid-caption');
  const modalMemoryTitle = document.getElementById('modal-memory-title');
  const modalMemoryText = document.getElementById('modal-memory-text');
  const modalMemoryQuote = document.getElementById('modal-memory-quote');
  const modalPrevBtn = document.getElementById('modal-prev-btn');
  const modalNextBtn = document.getElementById('modal-next-btn');
  const modalNavDots = document.getElementById('modal-nav-dots');
  const modalUnderstandBtn = document.getElementById('modal-understand-btn');

  // Food Journey & Lightbox elements
  const modalPolaroidWrapper = document.getElementById('modal-polaroid-wrapper');
  const modalStandardContent = document.getElementById('modal-standard-content');
  const modalFoodJourney = document.getElementById('modal-food-journey');
  const foodJourneyTitle = document.getElementById('food-journey-title');
  const foodJourneyIntro = document.getElementById('food-journey-intro');
  const foodPlacesList = document.getElementById('food-places-list');
  const photoLightbox = document.getElementById('photo-lightbox');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxCaption = document.getElementById('lightbox-caption');

  // Finale Modal elements
  const finaleModal = document.getElementById('finale-modal');
  const finaleCloseBtn = document.getElementById('finale-close-btn');
  const btnNightStargaze = document.getElementById('btn-night-stargaze');
  const btnFinaleFireworks = document.getElementById('btn-finale-fireworks');

  // Night Mode elements
  const gardenNightBg = document.getElementById('garden-night-bg');
  const twinklingStarsLayer = document.getElementById('twinkling-stars');
  const shootingStarsLayer = document.getElementById('shooting-stars-layer');
  const btnToggleNight = document.getElementById('btn-toggle-night');
  const nightBtnIcon = document.getElementById('night-btn-icon');
  const nightBtnLabel = document.getElementById('night-btn-label');
  const bannerFlowerIcon = document.getElementById('banner-flower-icon');
  const bannerTitle = document.getElementById('banner-title');
  const bannerDesc = document.getElementById('banner-desc');

  // Stargazing Background Video & Halley Audio elements
  const stargazeBgVideo = document.getElementById('stargaze-bg-video');
  const stargazeHalleyAudio = document.getElementById('stargaze-halley-audio');
  const STARGAZE_VIDEO_PLAYLIST = ['vidback/IMG_0120.mp4', 'vidback/IMG_0119.mp4'];
  let currentStargazeVideoIdx = 0;
  let isStargazeMediaActive = false;
  let wasBgmPlayingBeforeNight = false;

  const toastContainer = document.getElementById('compliment-toast-container');
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');

  // Application State
  const state = {
    currentView: 'hero', // 'hero' | 'garden'
    isNightMode: false,
    discoveredMemories: new Set(),
    activeMemoryIndex: 0,
    isPlayingMusic: false,
    audioInitialized: false,
    particles: [],
    finaleTriggered: false,
  };

  /* ==========================================================================
     1. INITIALIZATION & PROCEDURAL SUNFLOWER PETALS
     ========================================================================== */
  function init() {
    setupHeroTexts();
    generateHeroSunflowerPetals();
    buildInteractiveMeadow();
    setupNightSky();
    setupCanvas();
    setupAudioSynth();
    setupEventListeners();
    updateCounterHUD();
    tryAutoplayMusic();
  }

  // Populate config text in Hero
  function setupHeroTexts() {
    if (CONFIG.hero) {
      if (CONFIG.hero.badge && heroBadge) heroBadge.textContent = CONFIG.hero.badge;
      if (CONFIG.hero.subtitle && heroSubtitle) heroSubtitle.textContent = CONFIG.hero.subtitle;
      if (CONFIG.hero.hintText && heroHintText) heroHintText.textContent = CONFIG.hero.hintText;
    }
  }

  // Procedural SVG petals & seeds for Hero sunflower
  // Procedural SVG petals & seeds for Hero sunflower — lush, dense multi-tier petals
  function generateHeroSunflowerPetals() {
    const headGroup = document.querySelector('.flower-head-group');
    const backGroup = document.getElementById('hero-petals-back');
    const outerGroup = document.getElementById('hero-petals-outer');
    const midGroup = document.getElementById('hero-petals-mid');
    const innerGroup = document.getElementById('hero-petals-inner');
    const collarGroup = document.getElementById('hero-petals-collar');
    const seedsGroup = document.getElementById('hero-center-seeds');

    if (!outerGroup || !innerGroup || !seedsGroup) return;

    // Helper to create petal element
    const createPetal = (d, fill, stroke, strokeWidth, opacity, hlPath, hlFill, spinePath, spineStroke) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      petal.setAttribute('d', d);
      petal.setAttribute('fill', fill);
      petal.setAttribute('stroke', stroke);
      petal.setAttribute('stroke-width', strokeWidth);
      petal.setAttribute('opacity', opacity || '0.98');
      g.appendChild(petal);

      if (hlPath) {
        const hl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hl.setAttribute('d', hlPath);
        hl.setAttribute('fill', hlFill || '#fef08a');
        hl.setAttribute('opacity', '0.5');
        g.appendChild(hl);
      }

      if (spinePath) {
        const spine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        spine.setAttribute('d', spinePath);
        spine.setAttribute('stroke', spineStroke || '#b45309');
        spine.setAttribute('stroke-width', '0.8');
        spine.setAttribute('stroke-linecap', 'round');
        spine.setAttribute('opacity', '0.45');
        g.appendChild(spine);
      }

      return g;
    };

    // Helper to populate a tier
    const populateTier = (group, count, offsetAngle, d, fills, stroke, strokeW, hlPath, hlFill, spinePath, spineStroke) => {
      if (!group) return;
      group.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const angle = (i * 360) / count + offsetAngle;
        const fill = fills[i % fills.length];
        const petalG = createPetal(d, fill, stroke, strokeW, '0.98', hlPath, hlFill, spinePath, spineStroke);
        petalG.setAttribute('transform', `rotate(${angle.toFixed(2)})`);
        group.appendChild(petalG);
      }
    };

    // 1. Tier 1: Deep Back Petals (32 petals, longest reach, dark golden shadow layer)
    populateTier(
      backGroup,
      32,
      0,
      'M 0,-44 C 12,-68 15,-94 0,-116 C -15,-94 -12,-68 0,-44 Z',
      ['#d97706', '#b45309', '#ea580c', '#c26505'],
      '#9a3412',
      '0.85',
      null,
      null,
      'M 0,-48 L 0,-112',
      '#7c2d12'
    );

    // 2. Tier 2: Outer Petals (32 petals, interleaved at half-step 5.625°)
    populateTier(
      outerGroup,
      32,
      5.625,
      'M 0,-44 C 11,-66 14,-88 0,-110 C -14,-88 -11,-66 0,-44 Z',
      ['url(#petalOuterGrad)', '#f59e0b', '#fbbf24', '#f59e0b'],
      '#b45309',
      '0.95',
      'M -1,-52 C 2.8,-70 3.2,-88 0,-106 C -2,-88 -2.4,-70 -1,-52 Z',
      '#fef08a',
      'M 0,-50 L 0,-104',
      '#b45309'
    );

    // 3. Tier 3: Mid Petals (28 petals, offset 3.2°)
    populateTier(
      midGroup,
      28,
      3.2,
      'M 0,-45 C 10,-63 12.5,-80 0,-98 C -12.5,-80 -10,-63 0,-45 Z',
      ['url(#petalMidGrad)', '#fbbf24', '#fde047', '#f59e0b'],
      '#b45309',
      '0.85',
      'M -0.8,-54 C 2.2,-68 2.5,-80 0,-94 C -1.6,-80 -1.8,-68 -0.8,-54 Z',
      '#fffbeb',
      'M 0,-50 L 0,-92',
      '#d97706'
    );

    // 4. Tier 4: Inner Petals (26 petals, offset 9.5°)
    populateTier(
      innerGroup,
      26,
      9.5,
      'M 0,-46 C 9,-58 11,-72 0,-86 C -11,-72 -9,-58 0,-46 Z',
      ['url(#petalInnerGrad)', '#fde047', '#facc15', '#fde047'],
      '#b45309',
      '0.8',
      'M 0,-55 C 1.8,-65 2,-74 0,-82 C -1.2,-74 -1.2,-65 0,-55 Z',
      '#fffef0',
      'M 0,-50 L 0,-80',
      '#d97706'
    );

    // 5. Tier 5: Collar Florets (24 petals embracing the seed disc tightly)
    populateTier(
      collarGroup,
      24,
      4.8,
      'M 0,-47 C 7,-53 8.5,-62 0,-69 C -8.5,-62 -7,-53 0,-47 Z',
      ['#f59e0b', '#fbbf24', '#fde047'],
      '#b45309',
      '0.7',
      null,
      null,
      'M 0,-50 L 0,-66',
      '#fef08a'
    );

    // Golden Fibonacci spiral seed circles
    seedsGroup.innerHTML = '';
    const numSeeds = 135;
    const goldenAngle = 137.5 * (Math.PI / 180);
    for (let i = 0; i < numSeeds; i++) {
      const r = Math.sqrt(i) * 3.75;
      if (r > 46.5) continue;
      const theta = i * goldenAngle;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const seed = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const radius = i % 4 === 0 ? 2.3 : (i % 2 === 0 ? 1.8 : 1.4);
      seed.setAttribute('cx', x.toFixed(2));
      seed.setAttribute('cy', y.toFixed(2));
      seed.setAttribute('r', radius.toFixed(1));
      seed.setAttribute('fill', i % 3 === 0 ? '#fbbf24' : (i % 2 === 0 ? '#f59e0b' : '#d97706'));
      seed.setAttribute('opacity', (0.65 + (i / numSeeds) * 0.35).toFixed(2));
      seedsGroup.appendChild(seed);
    }
  }

  /* ==========================================================================
     2. PROCEDURAL SUNFLOWER SVG GENERATOR FOR MEADOW (PIXEL ART STYLE)
     ========================================================================== */
  /**
   * Cute retro pixel art SVG for distant/background flowers
   */
  // Simple cartoon sunflower SVG for distant/background flowers
  function createSimpleSunflowerSVG(scale = 1) {
    const w = (120 * scale) | 0;
    const h = (190 * scale) | 0;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 120 190');
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.style.overflow = 'visible';

    // Smooth stem
    const stemGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    stemGroup.innerHTML = `
      <path d="M60,190 C59,140 61,100 60,55" stroke="url(#simpleStemGrad)" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.85" />
      <!-- Left curved leaf -->
      <path d="M59,120 C38,116 22,100 14,82 C28,76 50,92 59,110 Z" fill="#3a7d1a" opacity="0.9" />
      <!-- Right curved leaf -->
      <path d="M61,140 C82,140 98,118 106,98 C90,93 70,110 61,130 Z" fill="#3a7d1a" opacity="0.9" />
    `;

    // Inline gradient for simple stem
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="simpleStemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2d5a27" />
        <stop offset="50%" stop-color="#4e8c3b" />
        <stop offset="100%" stop-color="#2a5223" />
      </linearGradient>
    `;
    svg.appendChild(defs);
    svg.appendChild(stemGroup);

    // Flower head group
    const head = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    head.setAttribute('transform', 'translate(60, 50)');

    // Backing disc to eliminate see-through gaps
    const backdrop = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    backdrop.setAttribute('cx', '0');
    backdrop.setAttribute('cy', '0');
    backdrop.setAttribute('r', '32');
    backdrop.setAttribute('fill', '#92400e');
    backdrop.setAttribute('opacity', '0.96');
    head.appendChild(backdrop);

    // 18 back petals
    for (let i = 0; i < 18; i++) {
      const angle = i * 20;
      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      petal.setAttribute('transform', `rotate(${angle})`);
      petal.innerHTML = `
        <path d="M 0,-18 C 6.5,-28 8.5,-38 0,-50 C -8.5,-38 -6.5,-28 0,-18 Z"
          fill="#d97706" stroke="#9a3412" stroke-width="0.7" opacity="0.95" />
      `;
      head.appendChild(petal);
    }

    // 18 front petals (offset 10 deg)
    for (let i = 0; i < 18; i++) {
      const angle = i * 20 + 10;
      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      petal.setAttribute('transform', `rotate(${angle})`);
      petal.innerHTML = `
        <path d="M 0,-18 C 6,-26 7.5,-35 0,-47 C -7.5,-35 -6,-26 0,-18 Z"
          fill="${i % 2 === 0 ? '#f59e0b' : '#fbbf24'}" stroke="#b45309" stroke-width="0.7" opacity="0.98" />
        <path d="M 0,-24 C 2,-32 2.5,-39 0,-45 C -1.5,-39 -1.5,-32 0,-24 Z"
          fill="#fef08a" opacity="0.45" />
      `;
      head.appendChild(petal);
    }

    // Smooth circular center
    const center = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    center.innerHTML = `
      <circle cx="0" cy="0" r="16" fill="#3d1202" />
      <circle cx="0" cy="0" r="13" fill="#78350f" />
      <circle cx="-4" cy="-4" r="5" fill="#92400e" opacity="0.5" />
    `;
    head.appendChild(center);

    svg.appendChild(head);
    return svg;
  }

  /**
   * Detailed Natural SVG for foreground interactive & special sunflowers
   */
  function createSunflowerSVG(options = {}) {
    const {
      scale = 1,
      colorTag = '#ffd116',
      isSpecial = false,
      specialIndex = 0,
    } = options;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 170 270');
    svg.setAttribute('width', (160 * scale).toFixed(0));
    svg.setAttribute('height', (256 * scale).toFixed(0));
    svg.style.overflow = 'visible';

    // Radiant Golden Sunflower Palettes (All gorgeous yellow, with unique warm golden characters)
    const specialPalettes = [
      // Special 1: Radiant Golden Sunburst
      { outline: '#78350f', shadow: '#d97706', main: '#f59e0b', tip: '#fef08a', center: '#2b1202', seed: '#fbbf24', glow: '#fbbf24' },
      // Special 2: Warm Honey Amber Gold
      { outline: '#7c2d12', shadow: '#b45309', main: '#fbbf24', tip: '#fef9c3', center: '#381604', seed: '#fde047', glow: '#f59e0b' },
      // Special 3: Brilliant Pure Gold
      { outline: '#713f12', shadow: '#ca8a04', main: '#eab308', tip: '#fef08a', center: '#261204', seed: '#facc15', glow: '#ffd116' },
      // Special 4: Luminous Starlight Yellow
      { outline: '#854d0e', shadow: '#d97706', main: '#fde047', tip: '#fffbeb', center: '#2d1405', seed: '#fef08a', glow: '#fde047' },
      // Special 5: Grand Crystal Champagne Gold
      { outline: '#78350f', shadow: '#ea580c', main: '#facc15', tip: '#ffffff', center: '#240d02', seed: '#fff066', glow: '#fef08a' },
    ];

    const pal = isSpecial ? (specialPalettes[specialIndex % specialPalettes.length]) : {
      outline: '#78350f',
      shadow: '#d97706',
      main: '#fbbf24',
      tip: '#fef08a',
      center: '#2b1202',
      seed: '#f59e0b',
      glow: '#fbbf24'
    };

    // Smooth cartoon stem with curved leaves
    const stemGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    stemGroup.innerHTML = `
      <path d="M85,270 C83,200 87,140 85,72"
        stroke="url(#meadowStemGrad)" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.88" />
      <!-- Left curved leaf -->
      <path d="M84,175 C58,172 36,148 22,122 C42,114 70,138 83,162 Z" fill="#3a7d1a" opacity="0.9" />
      <path d="M83,163 C58,145 40,133 26,126" stroke="#7fc256" stroke-width="1.5" fill="none" opacity="0.45" />
      <!-- Right curved leaf -->
      <path d="M86,215 C112,214 134,190 148,164 C126,156 100,178 86,204 Z" fill="#3a7d1a" opacity="0.9" />
      <path d="M87,205 C110,188 130,174 146,166" stroke="#7fc256" stroke-width="1.5" fill="none" opacity="0.45" />
    `;

    // Add defs with gradient
    const meadowDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    meadowDefs.innerHTML = `
      <linearGradient id="meadowStemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2d5a27" />
        <stop offset="45%" stop-color="#4e8c3b" />
        <stop offset="100%" stop-color="#2a5223" />
      </linearGradient>
    `;
    svg.insertBefore(meadowDefs, svg.firstChild);
    svg.appendChild(stemGroup);

    // Flower Head (centered at 85, 75)
    const headGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    headGroup.setAttribute('transform', 'translate(85, 75)');

    // Solid Backing Disc: Guarantees zero see-through gaps, eliminating background & stem bleed
    const backingCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    backingCircle.setAttribute('cx', '0');
    backingCircle.setAttribute('cy', '0');
    backingCircle.setAttribute('r', '46');
    backingCircle.setAttribute('fill', pal.shadow);
    backingCircle.setAttribute('opacity', '0.96');
    headGroup.appendChild(backingCircle);

    // Helper to generate a tier of petals
    const createPetalTier = (count, offsetAngle, pathD, fill, stroke, strokeW, hlD, hlFill, spineD, spineStroke) => {
      const tierGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      for (let i = 0; i < count; i++) {
        const angle = (i * 360) / count + offsetAngle;
        const petalG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        petalG.setAttribute('transform', `rotate(${angle.toFixed(2)})`);

        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', pathD);
        p.setAttribute('fill', fill);
        p.setAttribute('stroke', stroke);
        p.setAttribute('stroke-width', strokeW);
        p.setAttribute('opacity', '0.98');
        petalG.appendChild(p);

        if (hlD) {
          const hl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          hl.setAttribute('d', hlD);
          hl.setAttribute('fill', hlFill || pal.tip);
          hl.setAttribute('opacity', '0.52');
          petalG.appendChild(hl);
        }

        if (spineD) {
          const spine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          spine.setAttribute('d', spineD);
          spine.setAttribute('stroke', spineStroke || pal.shadow);
          spine.setAttribute('stroke-width', '0.7');
          spine.setAttribute('stroke-linecap', 'round');
          spine.setAttribute('opacity', '0.45');
          petalG.appendChild(spine);
        }

        tierGroup.appendChild(petalG);
      }
      return tierGroup;
    };

    // Tier 1: Deep Back Petals (24 petals, shadow layer)
    headGroup.appendChild(
      createPetalTier(
        24,
        0,
        'M 0,-18 C 8.5,-30 11.5,-48 0,-66 C -11.5,-48 -8.5,-30 0,-18 Z',
        pal.shadow,
        pal.outline,
        '0.85',
        null,
        null,
        'M 0,-20 L 0,-62',
        pal.outline
      )
    );

    // Tier 2: Outer Main Petals (24 petals, interleaved at 7.5°)
    headGroup.appendChild(
      createPetalTier(
        24,
        7.5,
        'M 0,-18 C 8,-28 11,-44 0,-62 C -11,-44 -8,-28 0,-18 Z',
        pal.main,
        pal.outline,
        '0.85',
        'M -0.8,-24 C 2,-34 2.4,-46 0,-58 C -1.6,-46 -1.8,-34 -0.8,-24 Z',
        pal.tip,
        'M 0,-20 L 0,-58',
        pal.shadow
      )
    );

    // Tier 3: Mid Petals (20 petals, offset at 3.8°)
    headGroup.appendChild(
      createPetalTier(
        20,
        3.8,
        'M 0,-18 C 7.5,-26 9.5,-38 0,-52 C -9.5,-38 -7.5,-26 0,-18 Z',
        isSpecial ? pal.main : pal.main,
        pal.outline,
        '0.75',
        'M 0,-24 C 1.5,-32 1.8,-40 0,-48 C -1.2,-40 -1.2,-32 0,-24 Z',
        pal.tip,
        'M 0,-20 L 0,-48',
        pal.shadow
      )
    );

    // Tier 4: Inner Petals (16 petals, offset at 11.25°)
    headGroup.appendChild(
      createPetalTier(
        16,
        11.25,
        'M 0,-18 C 6.5,-24 8,-32 0,-42 C -8,-32 -6.5,-24 0,-18 Z',
        pal.shadow,
        pal.outline,
        '0.7',
        null,
        null,
        'M 0,-20 L 0,-38',
        pal.outline
      )
    );

    // Tier 5: Disc Collar Florets (16 tiny petals hugging seed core)
    headGroup.appendChild(
      createPetalTier(
        16,
        5.6,
        'M 0,-19 C 5,-23 6,-28 0,-32 C -6,-28 -5,-23 0,-19 Z',
        pal.main,
        pal.outline,
        '0.6',
        null,
        null,
        'M 0,-22 L 0,-30',
        pal.tip
      )
    );

    // Smooth circular center disc
    const center = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    center.innerHTML = `
      <circle cx="0" cy="0" r="24" fill="${pal.center}" />
      <circle cx="0" cy="0" r="21" fill="#3d1904" />
      <circle cx="0" cy="0" r="18" fill="#582405" />
      <!-- Seed cluster circles -->
      <circle cx="-7" cy="-7" r="2.5" fill="${pal.seed}" opacity="0.9" />
      <circle cx="0" cy="-9" r="2.5" fill="${pal.main}" opacity="0.9" />
      <circle cx="7" cy="-6" r="2.5" fill="${pal.seed}" opacity="0.9" />
      <circle cx="-9" cy="0" r="2.5" fill="${pal.main}" opacity="0.9" />
      <circle cx="-2" cy="2" r="2.5" fill="${pal.seed}" opacity="0.9" />
      <circle cx="6" cy="1" r="2.5" fill="${pal.main}" opacity="0.9" />
      <circle cx="-6" cy="8" r="2.5" fill="${pal.seed}" opacity="0.9" />
      <circle cx="2" cy="9" r="2.5" fill="${pal.main}" opacity="0.9" />
      <!-- Soft gleam -->  
      <ellipse cx="-7" cy="-8" rx="7" ry="5" fill="#fef08a" opacity="0.25" />
    `;
    headGroup.appendChild(center);

    svg.appendChild(headGroup);
    return svg;
  }

  /* ==========================================================================
     3. BUILD INTERACTIVE SUNFLOWER MEADOW
     ========================================================================== */
  function buildInteractiveMeadow() {
    const specialMemories = CONFIG.specialMemories || [];

    // Helper to attach tap/click reliably on both mobile touch and mouse
    function attachMeadowFlowerTap(el, handler) {
      let touchMoved = false;
      el.addEventListener('touchstart', () => { touchMoved = false; }, { passive: true });
      el.addEventListener('touchmove', () => { touchMoved = true; }, { passive: true });
      el.addEventListener('touchend', (e) => {
        if (!touchMoved) {
          e.preventDefault();
          e.stopPropagation();
          handler(e);
        }
      }, { passive: false });
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        handler(e);
      });
    }

    // 1. Layer Back — lightweight simple SVGs, clickable (14 flowers)
    for (let i = 0; i < 14; i++) {
      const flowerEl = document.createElement('div');
      const leftPercent = 3 + i * 7.1 + (Math.random() * 3.5 - 1.75);
      const bottomPercent = 28 + (Math.random() * 10);
      const scale = 0.44 + Math.random() * 0.12;
      const phaseClass = `sway-phase-${i % 5}`;

      flowerEl.className = `field-sunflower ${phaseClass}`;
      flowerEl.style.left = `${leftPercent}%`;
      flowerEl.style.bottom = `${bottomPercent}%`;
      flowerEl.style.cursor = 'pointer';
      flowerEl.style.pointerEvents = 'auto';
      flowerEl.style.willChange = 'transform';

      flowerEl.appendChild(createSimpleSunflowerSVG(scale));
      attachMeadowFlowerTap(flowerEl, (e) => handleNormalFlowerClick(e, flowerEl));
      layerBack.appendChild(flowerEl);
    }

    // 2. Layer Mid — simple SVGs, clickable (11 flowers)
    for (let i = 0; i < 11; i++) {
      const flowerEl = document.createElement('div');
      const leftPercent = 3 + i * 9.4 + (Math.random() * 3.5 - 1.75);
      const bottomPercent = 14 + (Math.random() * 8);
      const scale = 0.72 + Math.random() * 0.12;
      const phaseClass = `sway-phase-${(i + 2) % 5}`;

      flowerEl.className = `field-sunflower ${phaseClass}`;
      flowerEl.style.left = `${leftPercent}%`;
      flowerEl.style.bottom = `${bottomPercent}%`;
      flowerEl.style.cursor = 'pointer';
      flowerEl.style.pointerEvents = 'auto';
      flowerEl.style.willChange = 'transform';

      flowerEl.appendChild(createSimpleSunflowerSVG(scale));
      attachMeadowFlowerTap(flowerEl, (e) => handleNormalFlowerClick(e, flowerEl));
      layerMid.appendChild(flowerEl);
    }

    // 3. Layer Front (Foreground interactive normal + SPECIAL FLOWERS)
    // Distributed positions for 3 Special Flowers:
    // Step 1: Left (18%) -> Step 2: Right (82%) -> Step 3: DEAD CENTER (50%, 17%)
    const specialPositions = [
      { left: 18, bottom: 14 }, // Step 1 (Mem 1) - Left: มื้อข้าวที่กินด้วยกัน
      { left: 82, bottom: 14 }, // Step 2 (Mem 2) - Right: โมเมนต์น่ารักๆ
      { left: 50, bottom: 18 }, // Step 3 (Mem 3) - Center (ตรงกลางสุด): ความรู้สึกของเค้า
    ];

    // Place Special Flowers
    specialMemories.forEach((mem, index) => {
      const pos = specialPositions[index] || { left: 18 + index * 32, bottom: 14 };
      const flowerEl = document.createElement('div');
      const phaseClass = `sway-phase-${(index * 2) % 5}`;

      flowerEl.className = `field-sunflower special-flower special-flower-${index} ${phaseClass}`;
      flowerEl.style.left = `${pos.left}%`;
      flowerEl.style.bottom = `${pos.bottom}%`;
      flowerEl.style.cursor = 'pointer';
      flowerEl.style.pointerEvents = 'auto';
      flowerEl.style.setProperty('--flower-color', mem.colorTag || '#ffd116');
      flowerEl.style.setProperty('--flower-glow', mem.glowColor || 'rgba(245, 158, 11, 0.35)');
      flowerEl.setAttribute('data-memory-id', mem.id);
      flowerEl.setAttribute('data-memory-index', index);

      const svg = createSunflowerSVG({
        scale: index === 2 ? 1.25 : 1.15,
        colorTag: mem.colorTag,
        isSpecial: true,
        specialIndex: index,
      });
      flowerEl.appendChild(svg);

      // Click / Touch handler for special flower with sequential check
      attachMeadowFlowerTap(flowerEl, (e) => handleSpecialFlowerClick(mem, index, flowerEl, e));

      layerFront.appendChild(flowerEl);
    });

    // Initialize visual state for sequential special flowers
    updateSpecialFlowersState();

    // Complementary Foreground Normal Sunflowers (Balanced side & mid accents)
    // Elevated bottoms (4.5% to 9%) so they are completely visible and prominent on mobile and desktop!
    const normalFrontPositions = [
      { left: 6, bottom: 8 },
      { left: 14, bottom: 4.5 },
      { left: 33, bottom: 8.5 },
      { left: 42, bottom: 5 },
      { left: 58, bottom: 5 },
      { left: 67, bottom: 8.5 },
      { left: 86, bottom: 4.5 },
      { left: 94, bottom: 8 },
    ];

    normalFrontPositions.forEach((pos, i) => {
      const flowerEl = document.createElement('div');
      const phaseClass = `sway-phase-${(i + 1) % 5}`;

      flowerEl.className = `field-sunflower normal-front-flower ${phaseClass}`;
      flowerEl.style.left = `${pos.left}%`;
      flowerEl.style.bottom = `${pos.bottom}%`;
      flowerEl.style.cursor = 'pointer';
      flowerEl.style.pointerEvents = 'auto';

      const svg = createSunflowerSVG({ scale: 1.05 + Math.random() * 0.15, isSpecial: false });
      flowerEl.appendChild(svg);

      attachMeadowFlowerTap(flowerEl, (e) => handleNormalFlowerClick(e, flowerEl));

      layerFront.appendChild(flowerEl);
    });
  }

  // Update classes on special flowers based on sequential progress
  function updateSpecialFlowersState() {
    const specialFlowers = document.querySelectorAll('.field-sunflower.special-flower');
    const currentStep = state.discoveredMemories.size;

    specialFlowers.forEach((el) => {
      const idx = parseInt(el.getAttribute('data-memory-index'), 10);
      const memId = el.getAttribute('data-memory-id');
      const isDiscovered = state.discoveredMemories.has(memId);
      const isCurrentTarget = (idx === currentStep);

      if (isDiscovered) {
        el.classList.add('flower-discovered');
        el.classList.remove('flower-locked', 'flower-target');
      } else if (isCurrentTarget) {
        el.classList.add('flower-target');
        el.classList.remove('flower-locked', 'flower-discovered');
      } else {
        el.classList.add('flower-locked');
        el.classList.remove('flower-target', 'flower-discovered');
      }
    });
  }

  /* ==========================================================================
     4. CLICK INTERACTIONS (SPECIAL & NORMAL FLOWERS)
     ========================================================================== */
  // Special Flower Click — Sequential Progression (1 -> 2 -> 3 -> 4 -> 5)
  function handleSpecialFlowerClick(memory, index, flowerEl, e) {
    const currentStep = state.discoveredMemories.size;
    const isAlreadyDiscovered = state.discoveredMemories.has(memory.id);

    // If not unlocked yet: wiggle, pop sound, burst, AND show random quote so a message ALWAYS appears!
    if (!isAlreadyDiscovered && index !== currentStep) {
      flowerEl.classList.remove('locked-wiggle');
      void flowerEl.offsetWidth;
      flowerEl.classList.add('locked-wiggle');
      setTimeout(() => flowerEl.classList.remove('locked-wiggle'), 350);

      playPopSound();
      createExplosionEffect(flowerEl, 12, ['#ffd116', '#ffedd5', '#f59e0b', '#ffffff']);

      const randomQuote = getRandomNormalQuote();
      const touch = (e && e.touches && e.touches[0]) || (e && e.changedTouches && e.changedTouches[0]);
      let targetX, targetY;
      if (touch && touch.clientX) {
        targetX = touch.clientX;
        targetY = touch.clientY - 35;
      } else if (e && typeof e.clientX === 'number' && e.clientX > 0) {
        targetX = e.clientX;
        targetY = e.clientY - 35;
      } else {
        const rect = flowerEl.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top - 20;
      }
      showComplimentBubble(randomQuote, targetX, targetY);
      return;
    }

    // Tap bounce animation on the flower
    flowerEl.classList.remove('flower-tap-bounce');
    void flowerEl.offsetWidth;
    flowerEl.classList.add('flower-tap-bounce');
    setTimeout(() => {
      flowerEl.classList.remove('flower-tap-bounce');
    }, 450);

    playChimeSound();
    createExplosionEffect(flowerEl, 22, ['#ffd116', '#f59e0b', '#fbbf24', '#fef08a', '#ffffff', '#fde047']);

    // Mark as discovered
    state.discoveredMemories.add(memory.id);
    updateCounterHUD();
    updateSpecialFlowersState();

    // Open Memory Modal with slight delay so tap bounce is visibly appreciated
    state.activeMemoryIndex = index;
    setTimeout(() => {
      openMemoryModal(memory);
    }, 180);
  }

  // Helper to pick random quote from CONFIG.normalFlowerQuotes with weighted odds (Quote #16 is 95% rarer)
  function getRandomNormalQuote() {
    const rawQuotes = CONFIG.normalFlowerQuotes || [];
    if (!rawQuotes.length) {
      return "อ้วนนนน่ารักจัง";
    }

    const items = rawQuotes.map((q, idx) => {
      if (typeof q === 'object' && q !== null) {
        return {
          text: q.text,
          weight: typeof q.weight === 'number' ? q.weight : (idx === 15 ? 0.05 : 1)
        };
      }
      return {
        text: String(q),
        weight: (idx === 15 || String(q).includes("อยากเป็นสามีเธอ")) ? 0.05 : 1
      };
    });

    const totalWeight = items.reduce((sum, it) => sum + (it.weight > 0 ? it.weight : 0), 0);
    if (totalWeight <= 0) return items[0].text;

    let rand = Math.random() * totalWeight;
    for (let i = 0; i < items.length; i++) {
      rand -= items[i].weight;
      if (rand <= 0) {
        return items[i].text;
      }
    }
    return items[items.length - 1].text;
  }

  // Normal Flower Click (Floating Compliments + Tap Bounce)
  function handleNormalFlowerClick(e, flowerEl) {
    if (e && e.stopPropagation) e.stopPropagation();

    // Pick random compliment with weighted probability (Quote #16 is 95% rarer)
    const randomQuote = getRandomNormalQuote();
    const isUltraRare = randomQuote.includes("อยากเป็นสามีเธอ");

    playPopSound();
    if (isUltraRare) {
      // Extra sparkly romantic burst for ultra rare quote
      createExplosionEffect(flowerEl, 24, ['#ff477e', '#ffd116', '#ff6b9d', '#ffffff', '#fbbf24']);
      if (typeof playChimeSound === 'function') {
        playChimeSound();
      }
    } else {
      createExplosionEffect(flowerEl, 12, ['#ffd116', '#ffedd5', '#f59e0b', '#ffffff']);
    }

    // Tap bounce animation
    flowerEl.classList.remove('flower-tap-bounce');
    void flowerEl.offsetWidth;
    flowerEl.classList.add('flower-tap-bounce');
    setTimeout(() => {
      flowerEl.classList.remove('flower-tap-bounce');
    }, 450);

    // Calculate coordinate: prioritize click/touch event, fallback to flower element rect
    const touch = (e && e.touches && e.touches[0]) || (e && e.changedTouches && e.changedTouches[0]);
    let targetX, targetY;
    if (touch && typeof touch.clientX === 'number') {
      targetX = touch.clientX;
      targetY = touch.clientY - 40;
    } else if (e && typeof e.clientX === 'number' && e.clientX > 0) {
      targetX = e.clientX;
      targetY = e.clientY - 40;
    } else {
      const rect = flowerEl.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top - 20;
    }

    showComplimentBubble(randomQuote, targetX, targetY);
  }

  function showComplimentBubble(text, x, y) {
    const container = toastContainer || document.getElementById('compliment-toast-container') || document.body;

    const bubble = document.createElement('div');
    bubble.className = 'compliment-bubble';
    bubble.textContent = text;

    const screenW = window.innerWidth || document.documentElement.clientWidth || 360;
    const screenH = window.innerHeight || document.documentElement.clientHeight || 640;

    const posX = typeof x === 'number' && !isNaN(x) ? x : screenW / 2;
    const posY = typeof y === 'number' && !isNaN(y) ? y : screenH / 2;

    const safeX = Math.max(100, Math.min(screenW - 100, posX));
    const safeY = Math.max(80, Math.min(screenH - 120, posY));

    bubble.style.left = `${safeX}px`;
    bubble.style.top = `${safeY}px`;

    container.appendChild(bubble);
    setTimeout(() => {
      if (bubble.parentNode) bubble.parentNode.removeChild(bubble);
    }, 2800);
  }

  function updateCounterHUD() {
    const total = (CONFIG.specialMemories || []).length;
    const discovered = state.discoveredMemories.size;
    counterText.innerHTML = `<span class="counter-label-full">ค้นหาดอกทานตะวันแห่งความทรงจำ: </span>${discovered} / ${total} ดอก`;

    if (discovered === total && !state.finaleTriggered) {
      counterPill.style.borderColor = '#ff477e';
      counterPill.style.background = '#fff1f2';
    }
  }

  /* ==========================================================================
     5. MEMORY MODAL LOGIC
     ========================================================================== */
  function openMemoryModal(memory) {
    const memoryHeaderRow = document.querySelector('.memory-header-row');

    if (modalMemoryTag) {
      modalMemoryTag.textContent = memory.tag || '';
      modalMemoryTag.style.display = memory.tag ? '' : 'none';
    }
    if (modalMemoryDate) {
      modalMemoryDate.textContent = memory.date || '';
      modalMemoryDate.style.display = memory.date ? '' : 'none';
    }

    // Check if this memory has items or foodPlaces (Memory #01: มื้อข้าวที่กินด้วยกัน, Memory #02: โมเมนต์น่ารักๆ)
    const cardItems = memory.items || memory.foodPlaces;
    if (cardItems && cardItems.length > 0) {
      if (modalPolaroidWrapper) modalPolaroidWrapper.style.display = 'none';
      if (modalStandardContent) modalStandardContent.style.display = 'none';
      if (modalFoodJourney) modalFoodJourney.style.display = 'block';
      if (memoryHeaderRow) memoryHeaderRow.style.display = 'none';

      if (foodJourneyTitle) foodJourneyTitle.textContent = memory.title || '';
      if (foodJourneyIntro) {
        if (memory.subtitle) {
          foodJourneyIntro.textContent = memory.subtitle;
          foodJourneyIntro.style.display = 'block';
        } else {
          foodJourneyIntro.style.display = 'none';
        }
      }
      renderFoodPlaces(cardItems);
    } else {
      if (modalPolaroidWrapper) modalPolaroidWrapper.style.display = '';
      if (modalStandardContent) modalStandardContent.style.display = '';
      if (modalFoodJourney) modalFoodJourney.style.display = 'none';
      if (memoryHeaderRow) memoryHeaderRow.style.display = (memory.tag || memory.date) ? 'flex' : 'none';

      modalPhoto.src = memory.photo || 'assets/memory_sunset.jpg';
      if (modalPolaroidCaption) {
        modalPolaroidCaption.textContent = '';
        modalPolaroidCaption.style.display = 'none';
      }
      modalMemoryTitle.textContent = memory.title || '';
      modalMemoryText.textContent = memory.message || '';
    }

    if (modalMemoryQuote) {
      modalMemoryQuote.textContent = memory.quote || '';
      const modalQuoteBox = document.getElementById('modal-quote-box');
      if (modalQuoteBox) {
        modalQuoteBox.style.display = memory.quote ? 'flex' : 'none';
      }
    }

    // Render dots
    renderModalDots();

    memoryModal.classList.add('active');
    memoryModal.setAttribute('aria-hidden', 'false');

    // Scroll card to top when opening
    const modalCard = document.getElementById('modal-card');
    if (modalCard) modalCard.scrollTop = 0;
  }

  function renderFoodPlaces(places) {
    if (!foodPlacesList) return;
    foodPlacesList.innerHTML = '';

    places.forEach((place) => {
      const card = document.createElement('div');
      card.className = 'food-card';
      card.dataset.shopNo = place.no;

      let photosHtml = '';
      if (place.images && place.images.length > 0) {
        const hasVideo = place.images.some(src => src.toLowerCase().endsWith('.mp4'));
        if (hasVideo) {
          const videoItems = place.images.map(src => {
            if (src.toLowerCase().endsWith('.mp4')) {
              return `
                <div class="food-video-item">
                  <video src="${encodeURI(src)}" controls playsinline preload="metadata" class="food-card-video"></video>
                </div>
              `;
            } else {
              const caption = place.date ? `${place.name} • ${place.date}` : place.name;
              return `
                <div class="food-photo-item" data-full-src="${encodeURI(src)}" data-caption="${caption}">
                  <img src="${encodeURI(src)}" alt="${place.name}" loading="lazy">
                  <span class="food-photo-hint">แตะดูรูป</span>
                </div>
              `;
            }
          }).join('');
          photosHtml = `<div class="food-media-box">${videoItems}</div>`;
        } else {
          const gridClass = place.images.length === 1 ? 'photos-1' : 'photos-2';
          const photoItems = place.images.map((imgSrc, idx) => {
            const caption = place.date ? `${place.name} • ${place.date}` : place.name;
            return `
              <div class="food-photo-item" data-full-src="${encodeURI(imgSrc)}" data-caption="${caption}">
                <img src="${encodeURI(imgSrc)}" alt="${place.name}" loading="lazy">
                <span class="food-photo-hint">แตะดูรูป</span>
              </div>
            `;
          }).join('');

          photosHtml = `<div class="food-photos-grid ${gridClass}">${photoItems}</div>`;
        }
      }

      const cleanStoryText = (place.text || '').replace(/^\d{1,2}\/\d{1,2}\/\d{2,4}\s*/, '');
      const dateBadgeHtml = place.date ? `<div class="food-date-badge">${place.date}</div>` : '';

      card.innerHTML = `
        <div class="food-card-header">
          <div class="food-shop-badge">
            <span class="food-shop-num">#${place.no}</span>
            <span class="food-shop-name">${place.name}</span>
          </div>
          ${dateBadgeHtml}
        </div>
        ${photosHtml}
        <div class="food-story-text">${cleanStoryText}</div>
      `;

      // Click to view photo in lightbox
      card.querySelectorAll('.food-photo-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const src = item.getAttribute('data-full-src');
          const cap = item.getAttribute('data-caption') || '';
          openPhotoLightbox(src, cap);
        });
      });

      foodPlacesList.appendChild(card);
    });
  }

  function openPhotoLightbox(src, caption) {
    if (!photoLightbox) return;
    const isVideo = src && src.toLowerCase().endsWith('.mp4');
    if (isVideo) {
      if (lightboxImg) lightboxImg.style.display = 'none';
      if (lightboxVideo) {
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = src;
        lightboxVideo.play().catch(() => { });
      }
    } else {
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.style.display = 'none';
        lightboxVideo.src = '';
      }
      if (lightboxImg) {
        lightboxImg.style.display = 'block';
        lightboxImg.src = src;
      }
    }
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    photoLightbox.classList.add('active');
    photoLightbox.setAttribute('aria-hidden', 'false');
  }

  function closePhotoLightbox() {
    if (!photoLightbox) return;
    photoLightbox.classList.remove('active');
    photoLightbox.setAttribute('aria-hidden', 'true');
    if (lightboxImg) lightboxImg.src = '';
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
      lightboxVideo.style.display = 'none';
    }
  }

  function closeMemoryModal() {
    memoryModal.classList.remove('active');
    memoryModal.setAttribute('aria-hidden', 'true');

    // Check if all memories discovered to trigger grand finale
    const total = (CONFIG.specialMemories || []).length;
    if (state.discoveredMemories.size >= total && !state.finaleTriggered) {
      setTimeout(() => {
        triggerGrandFinale();
      }, 600);
    }
  }

  function renderModalDots() {
    if (!modalNavDots) return;
    modalNavDots.innerHTML = '';
    const memories = CONFIG.specialMemories || [];
    memories.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = `modal-dot ${idx === state.activeMemoryIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        state.activeMemoryIndex = idx;
        const mem = memories[idx];
        state.discoveredMemories.add(mem.id);
        updateCounterHUD();
        openMemoryModal(mem);
      });
      modalNavDots.appendChild(dot);
    });
  }

  function navigateMemory(direction) {
    const memories = CONFIG.specialMemories || [];
    let nextIndex = state.activeMemoryIndex + direction;
    if (nextIndex < 0) nextIndex = memories.length - 1;
    if (nextIndex >= memories.length) nextIndex = 0;

    state.activeMemoryIndex = nextIndex;
    const nextMem = memories[nextIndex];
    state.discoveredMemories.add(nextMem.id);
    updateCounterHUD();
    openMemoryModal(nextMem);
  }

  /* ==========================================================================
     6. GRAND FINALE: DIRECT TRANSITION TO NIGHT STARGAZE MODE
     ========================================================================== */
  function triggerGrandFinale() {
    state.finaleTriggered = true;
    enterNightMode(true);
  }

  function closeFinaleModal() {
    finaleModal.classList.remove('active');
    finaleModal.setAttribute('aria-hidden', 'true');
  }

  function setupNightSky() {
    if (!twinklingStarsLayer || !shootingStarsLayer) return;

    // Generate 48 twinkling stars
    twinklingStarsLayer.innerHTML = '';
    for (let i = 0; i < 48; i++) {
      const star = document.createElement('div');
      star.className = 'twinkle-star';
      const size = 1.5 + Math.random() * 2.8;
      const left = Math.random() * 98;
      const top = Math.random() * 56;
      const dur = 1.6 + Math.random() * 2.4;
      const delay = Math.random() * 3.5;

      star.style.width = `${size.toFixed(1)}px`;
      star.style.height = `${size.toFixed(1)}px`;
      star.style.left = `${left.toFixed(1)}%`;
      star.style.top = `${top.toFixed(1)}%`;
      star.style.setProperty('--twinkle-dur', `${dur.toFixed(2)}s`);
      star.style.setProperty('--twinkle-delay', `${delay.toFixed(2)}s`);
      twinklingStarsLayer.appendChild(star);
    }

    // Generate dense flank sparkle stars for video wings (left and right)
    setupStargazeFlankStars();

    // Shooting stars loop
    startShootingStars();

    // Click anywhere on night sky to spawn fireworks!
    if (gardenNightBg) {
      gardenNightBg.addEventListener('click', (e) => {
        if (state.currentView !== 'garden' || !state.isNightMode) return;
        handleNightSkyFireworkClick(e);
      });
    }
  }

  function setupStargazeFlankStars() {
    const leftCluster = document.getElementById('flank-stars-left');
    const rightCluster = document.getElementById('flank-stars-right');
    if (!leftCluster || !rightCluster) return;

    leftCluster.innerHTML = '';
    rightCluster.innerHTML = '';

    const starGlyphs = ['✦', '✧', '⋆', '✨', '✦', '✧', '★'];
    const starColors = ['#ffffff', '#fff9db', '#fef08a', '#bae6fd', '#e0e7ff', '#fed7aa', '#fde047'];

    const populateCluster = (clusterEl) => {
      for (let i = 0; i < 36; i++) {
        const star = document.createElement('span');
        star.className = 'flank-star';
        const glyph = starGlyphs[Math.floor(Math.random() * starGlyphs.length)];
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const size = Math.floor(9 + Math.random() * 16);
        const left = Math.random() * 92;
        const top = Math.random() * 94;
        const dur = (1.4 + Math.random() * 2.2).toFixed(2);
        const delay = (Math.random() * 3.0).toFixed(2);

        star.textContent = glyph;
        star.style.fontSize = `${size}px`;
        star.style.color = color;
        star.style.left = `${left.toFixed(1)}%`;
        star.style.top = `${top.toFixed(1)}%`;
        star.style.setProperty('--twinkle-dur', `${dur}s`);
        star.style.setProperty('--twinkle-delay', `${delay}s`);
        clusterEl.appendChild(star);
      }
    };

    populateCluster(leftCluster);
    populateCluster(rightCluster);
  }

  let shootingStarTimer = null;
  function spawnMeteor() {
    if (!state.isNightMode || state.currentView !== 'garden' || !shootingStarsLayer) return;
    const meteor = document.createElement('div');
    meteor.className = 'shooting-star active';
    const startX = 25 + Math.random() * 65; // % from left
    const startY = 2 + Math.random() * 25;  // % from top
    const width = 90 + Math.random() * 110;

    meteor.style.left = `${startX}%`;
    meteor.style.top = `${startY}%`;
    meteor.style.width = `${width}px`;

    shootingStarsLayer.appendChild(meteor);
    setTimeout(() => {
      if (meteor.parentNode) meteor.parentNode.removeChild(meteor);
    }, 1500);
  }

  function startShootingStars() {
    if (shootingStarTimer) clearInterval(shootingStarTimer);

    // Spawn shooting stars continuously every 1.5s
    shootingStarTimer = setInterval(() => {
      spawnMeteor();
      // Occasional twin meteor
      if (Math.random() < 0.4) {
        setTimeout(spawnMeteor, 320);
      }
    }, 1500);
  }

  function handleNightSkyFireworkClick(e) {
    const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
    const x = touch ? touch.clientX : (e.clientX || window.innerWidth / 2);
    const y = touch ? touch.clientY : (e.clientY || window.innerHeight / 3);

    createHeartFirework(x, y);
    playChimeSound();

    const romanticPhrases = [
      "เธอคือดาวดวงโปรดของเค้า 🌟",
      "รักเธอใต้แสงจันทร์นะ 🌙",
      "อธิษฐานขอให้อยู่ด้วยกันตลอดไป ✨",
      "สุขสันต์วันพิเศษนะคนดี 💖",
      "รอยยิ้มของเธอสว่างกว่าดาวบนฟ้า 💫",
      "ปิ้ววว! รักที่สุดเลยย 🎆"
    ];
    const phrase = romanticPhrases[Math.floor(Math.random() * romanticPhrases.length)];
    showComplimentBubble(phrase, x, y - 20);
  }

  /* ==========================================================================
     STARGAZE BACKGROUND VIDEO & HALLEY AUDIO CONTROLLER
     ========================================================================== */
  function startStargazeMedia() {
    isStargazeMediaActive = true;
    if (gardenView) {
      gardenView.classList.add('stargaze-video-active');
    }
    setupStargazeFlankStars();

    // 1. Remember if original BGM was playing, then pause it until stargaze ends
    wasBgmPlayingBeforeNight = state.isPlayingMusic;
    stopBGM();

    // 2. Play Halley.MP3 audio with whisper-soft volume (plays once: when song finishes, the video ends too)
    if (stargazeHalleyAudio) {
      stargazeHalleyAudio.pause();
      try {
        stargazeHalleyAudio.currentTime = 0;
      } catch (e) { }
      stargazeHalleyAudio.volume = 0.12;
      stargazeHalleyAudio.loop = false;

      const playAudio = stargazeHalleyAudio.play();
      if (playAudio !== undefined) {
        playAudio.catch((err) => {
          console.log('Halley audio play caught:', err);
        });
      }

      // เมื่อเพลงจบ คลิปที่แสดงอยู่ก็จบไปด้วยทันที
      stargazeHalleyAudio.onended = () => {
        onStargazeVideosFinished();
      };

      // Fallback: ตรวจจับก่อนเพลงจบเล็กน้อยป้องกันบราวเซอร์มือถือค้าง
      stargazeHalleyAudio.ontimeupdate = () => {
        if (stargazeHalleyAudio.duration && stargazeHalleyAudio.duration > 0) {
          if (stargazeHalleyAudio.duration - stargazeHalleyAudio.currentTime <= 0.3) {
            stargazeHalleyAudio.ontimeupdate = null;
            onStargazeVideosFinished();
          }
        }
      };
    }

    // 3. Play video playlist sequentially: IMG_0120.mp4 -> IMG_0119.mp4
    videoEndHandled = false;
    playStargazeVideoIndex(0);
  }

  /* ==========================================================================
     STARGAZE END-OF-VIDEO TYPEWRITER LOVE MESSAGE & RETURN TO EVENING SCENE
     ========================================================================== */
  let stargazeTypewriterTimer = null;
  let stargazeReturnTimer = null;
  let videoEndHandled = false;
  const STARGAZE_LOVE_TEXT = "ขอให้ที่ตรงนี้ที่เราอยู่ เป็นที่ๆทำให้เรามีความสุขไปตลอดนะคับ รักเกียวนะ เย้ะ <3";

  function showStargazeEndTypewriter() {
    const msgBox = document.getElementById('stargaze-end-message-box');
    const textEl = document.getElementById('stargaze-typewriter-text');
    const cursorEl = document.querySelector('.stargaze-typewriter-cursor');
    const subEl = document.getElementById('stargaze-message-sub');

    // Fade out video so starry night sky and message stand out beautifully
    if (stargazeBgVideo) {
      stargazeBgVideo.classList.remove('active');
      setTimeout(() => {
        if (stargazeBgVideo) stargazeBgVideo.pause();
      }, 700);
    }

    if (!msgBox || !textEl) return;

    msgBox.classList.add('active');
    textEl.textContent = '';
    if (cursorEl) cursorEl.style.display = 'inline-block';
    if (subEl) subEl.classList.remove('visible');

    let charIdx = 0;
    if (stargazeTypewriterTimer) clearInterval(stargazeTypewriterTimer);

    stargazeTypewriterTimer = setInterval(() => {
      if (charIdx < STARGAZE_LOVE_TEXT.length) {
        textEl.textContent += STARGAZE_LOVE_TEXT.charAt(charIdx);
        charIdx++;
        if (charIdx % 3 === 0) {
          playChatBubbleSound(true);
        }
      } else {
        clearInterval(stargazeTypewriterTimer);
        stargazeTypewriterTimer = null;
        if (subEl) subEl.classList.add('visible');
        playChimeSound();

        // Celebration heart firework bursts around message box
        const rect = msgBox.getBoundingClientRect();
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            createHeartFirework(
              rect.left + rect.width * (0.28 + Math.random() * 0.44),
              rect.top + rect.height * (0.35 + Math.random() * 0.3)
            );
          }, i * 260);
        }
      }
    }, 60);
  }

  function hideStargazeEndTypewriter() {
    if (stargazeTypewriterTimer) {
      clearInterval(stargazeTypewriterTimer);
      stargazeTypewriterTimer = null;
    }
    const msgBox = document.getElementById('stargaze-end-message-box');
    if (msgBox) {
      msgBox.classList.remove('active');
    }
    const textEl = document.getElementById('stargaze-typewriter-text');
    if (textEl) {
      textEl.textContent = '';
    }
  }

  function onStargazeVideosFinished() {
    if (videoEndHandled) return;
    videoEndHandled = true;

    // Fade out and pause the video immediately
    if (stargazeBgVideo) {
      stargazeBgVideo.classList.remove('active');
      stargazeBgVideo.ontimeupdate = null;
      stargazeBgVideo.onended = null;
      setTimeout(() => {
        if (stargazeBgVideo) stargazeBgVideo.pause();
      }, 700);
    }

    // Stop halley audio and its listeners
    if (stargazeHalleyAudio) {
      stargazeHalleyAudio.onended = null;
      stargazeHalleyAudio.ontimeupdate = null;
      stargazeHalleyAudio.pause();
    }

    // Display sweet love card in starry night sky
    showStargazeEndTypewriter();

    // Stay in the stargaze scene for 6 seconds, then automatically return to the evening scene with sunflowers
    if (stargazeReturnTimer) clearTimeout(stargazeReturnTimer);
    stargazeReturnTimer = setTimeout(() => {
      stargazeReturnTimer = null;
      exitNightMode();
    }, 6000);
  }

  function playStargazeVideoIndex(index) {
    if (!stargazeBgVideo || videoEndHandled) return;
    if (index >= STARGAZE_VIDEO_PLAYLIST.length) {
      // If playlist reached end but song is still playing, loop video playlist seamlessly until song ends
      if (stargazeHalleyAudio && !stargazeHalleyAudio.paused && !stargazeHalleyAudio.ended) {
        playStargazeVideoIndex(0);
      } else {
        onStargazeVideosFinished();
      }
      return;
    }

    currentStargazeVideoIdx = index;
    stargazeBgVideo.src = STARGAZE_VIDEO_PLAYLIST[index];
    stargazeBgVideo.muted = true;
    stargazeBgVideo.playsInline = true;
    stargazeBgVideo.setAttribute('playsinline', '');
    stargazeBgVideo.setAttribute('webkit-playsinline', '');
    try {
      stargazeBgVideo.currentTime = 0;
    } catch (e) { }
    stargazeBgVideo.classList.add('active');

    const playVideo = stargazeBgVideo.play();
    if (playVideo !== undefined) {
      playVideo.catch((err) => {
        console.log('Stargaze video play caught on index ' + index + ':', err);
        // If second video is blocked or fails, advance to finished state
        if (index > 0) {
          onStargazeVideosFinished();
        }
      });
    }

    stargazeBgVideo.onerror = () => {
      console.log('Stargaze video error on index:', index);
      if (index + 1 < STARGAZE_VIDEO_PLAYLIST.length) {
        playStargazeVideoIndex(index + 1);
      } else {
        onStargazeVideosFinished();
      }
    };

    // When the current video ends, chain to next video or loop until song ends
    stargazeBgVideo.onended = () => {
      stargazeBgVideo.ontimeupdate = null;
      if (videoEndHandled) return;
      if (currentStargazeVideoIdx + 1 < STARGAZE_VIDEO_PLAYLIST.length) {
        playStargazeVideoIndex(currentStargazeVideoIdx + 1);
      } else {
        if (stargazeHalleyAudio && !stargazeHalleyAudio.paused && !stargazeHalleyAudio.ended) {
          playStargazeVideoIndex(0);
        } else {
          onStargazeVideosFinished();
        }
      }
    };

    // Fallback: timeupdate check in case onended doesn't fire on mobile
    stargazeBgVideo.ontimeupdate = () => {
      if (videoEndHandled) return;
      if (stargazeBgVideo.duration && stargazeBgVideo.duration > 0) {
        if (stargazeBgVideo.duration - stargazeBgVideo.currentTime <= 0.35) {
          stargazeBgVideo.ontimeupdate = null;
          if (currentStargazeVideoIdx + 1 < STARGAZE_VIDEO_PLAYLIST.length) {
            playStargazeVideoIndex(currentStargazeVideoIdx + 1);
          } else {
            if (stargazeHalleyAudio && !stargazeHalleyAudio.paused && !stargazeHalleyAudio.ended) {
              playStargazeVideoIndex(0);
            } else {
              onStargazeVideosFinished();
            }
          }
        }
      }
    };
  }

  function stopStargazeMedia(restoreBgm = true) {
    if (stargazeReturnTimer) {
      clearTimeout(stargazeReturnTimer);
      stargazeReturnTimer = null;
    }
    hideStargazeEndTypewriter();

    isStargazeMediaActive = false;

    // Remove video-active background class so scenery colors smoothly return to original
    if (gardenView) {
      gardenView.classList.remove('stargaze-video-active');
    }

    // Fade out and pause background video
    if (stargazeBgVideo) {
      stargazeBgVideo.classList.remove('active');
      stargazeBgVideo.onended = null;
      stargazeBgVideo.ontimeupdate = null;
      stargazeBgVideo.onerror = null;
      setTimeout(() => {
        if (!isStargazeMediaActive && stargazeBgVideo) {
          stargazeBgVideo.pause();
        }
      }, 700);
    }

    // Stop halley audio
    if (stargazeHalleyAudio) {
      stargazeHalleyAudio.onended = null;
      stargazeHalleyAudio.ontimeupdate = null;
      stargazeHalleyAudio.pause();
      try {
        stargazeHalleyAudio.currentTime = 0;
      } catch (e) { }
    }

    // Restore original background music if it was playing before entering stargazing mode
    if (restoreBgm && wasBgmPlayingBeforeNight) {
      wasBgmPlayingBeforeNight = false;
      startBGM();
    }
  }

  function enterNightMode(fromFinale = false) {
    state.isNightMode = true;
    gardenView.classList.add('night-mode');

    // Start video playlist (IMG_0120.mp4 -> IMG_0119.mp4) & halley.MP3
    startStargazeMedia();

    if (nightBtnIcon) nightBtnIcon.textContent = '☀️';
    if (nightBtnLabel) nightBtnLabel.textContent = 'ยามเย็น';

    if (bannerFlowerIcon) bannerFlowerIcon.textContent = '🌙';
    if (bannerTitle) bannerTitle.textContent = 'ค่ำคืนใต้แสงจันทร์และหมู่ดาว ✨';
    if (bannerDesc) {
      bannerDesc.innerHTML = 'ในค่ำคืนนี้ที่มีดาวนับล้าน... คนที่ส่องสว่างที่สุดในใจเค้าก็คือเธอเสมอ 💛 <span class="highlight-badge">แตะบนท้องฟ้าเพื่อจุดพลุรัก 🎆</span>';
    }
    gardenBanner.classList.remove('dismissed');
    scheduleHintAutoDismiss(4500);

    // Immediate shooting stars shower
    setTimeout(spawnMeteor, 200);
    setTimeout(spawnMeteor, 650);
    setTimeout(spawnMeteor, 1100);

    // Launch celebratory fireworks show
    playCelebrationFanfare();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const x = window.innerWidth * (0.2 + Math.random() * 0.6);
        const y = window.innerHeight * (0.15 + Math.random() * 0.35);
        createHeartFirework(x, y);
      }, i * 350);
    }
  }

  function exitNightMode() {
    if (stargazeReturnTimer) {
      clearTimeout(stargazeReturnTimer);
      stargazeReturnTimer = null;
    }

    state.isNightMode = false;
    if (gardenView) {
      gardenView.classList.remove('night-mode');
      gardenView.classList.remove('stargaze-video-active');
    }

    // Stop stargaze media (video & halley) and restore original BGM
    stopStargazeMedia(true);

    if (nightBtnIcon) nightBtnIcon.textContent = '🌙';
    if (nightBtnLabel) nightBtnLabel.textContent = 'ดูดาว';

    if (bannerFlowerIcon) bannerFlowerIcon.textContent = '🌻';
    if (bannerTitle) bannerTitle.textContent = 'ยินดีต้อนรับสู่ทุ่งทานตะวันของเรา 💛';
    if (bannerDesc) {
      bannerDesc.innerHTML = 'ในทุ่งนี้มี <span class="highlight-badge">ดอกสีพิเศษ 3 ดอก</span> ที่ซ่อนรูปภาพและความในใจไว้ ลองแตะเพื่อเปิดอ่านดูนะ!';
    }
  }

  function toggleNightMode() {
    if (state.isNightMode) {
      exitNightMode();
    } else {
      enterNightMode();
    }
  }

  let hintDismissTimer = null;
  function scheduleHintAutoDismiss(delayMs = 4500) {
    if (hintDismissTimer) clearTimeout(hintDismissTimer);
    hintDismissTimer = setTimeout(() => {
      if (gardenBanner && !gardenBanner.classList.contains('dismissed')) {
        gardenBanner.classList.add('dismissed');
      }
      const gardenFooterHint = document.getElementById('garden-footer-hint');
      if (gardenFooterHint && !gardenFooterHint.classList.contains('dismissed')) {
        gardenFooterHint.classList.add('dismissed');
      }
    }, delayMs);
  }

  /* ==========================================================================
     7. PAGE NAVIGATION (HERO <-> GARDEN)
     ========================================================================== */
  let heroChatTimers = [];
  let isHeroChatFinishedAnimating = false;
  let isHeroChatCompleted = false;
  let card2Timers = [];
  let isCard2FinishedAnimating = false;

  function handleHeroInteraction() {
    const modal = document.getElementById('hero-surprise-modal');
    if (modal && !modal.classList.contains('active')) {
      openHeroSurpriseModal();
    } else if (!isHeroChatFinishedAnimating) {
      fastForwardChatMessages();
    } else if (!isHeroChatCompleted) {
      transitionChat1ToChat2();
    } else if (!isCard2FinishedAnimating) {
      fastForwardCard2();
    } else {
      closeHeroSurpriseModalAndGoToGarden();
    }
  }

  function openHeroSurpriseModal() {
    const modal = document.getElementById('hero-surprise-modal');
    if (modal) {
      modal.classList.add('active');
    }

    // Start background music automatically on user first interaction
    if (!state.isPlayingMusic) {
      toggleMusic();
    }

    // Sweet sound & celebratory sparkle burst on sunflower
    playChimeSound();
    createExplosionEffect(heroSunflowerInteractive, 20, ['#ffd116', '#ffb703', '#ff477e', '#ffffff']);

    // Begin Instagram Chat DM animation (Screen 1)
    startHeroChatAnimation();
  }

  function startHeroChatAnimation() {
    heroChatTimers.forEach(clearTimeout);
    heroChatTimers = [];
    card2Timers.forEach(clearTimeout);
    card2Timers = [];
    isHeroChatFinishedAnimating = false;
    isHeroChatCompleted = false;
    isCard2FinishedAnimating = false;

    const chatCard = document.getElementById('hero-chat-card');
    const chatCard2 = document.getElementById('hero-chat-card-2');
    const chatBody = document.getElementById('ig-chat-body');
    const chatPlaceholder = document.getElementById('ig-chat-input-placeholder');

    if (chatCard) {
      chatCard.style.display = 'flex';
      chatCard.classList.remove('fade-out', 'chat-finished', 'card-enter');
    }
    if (chatCard2) {
      chatCard2.style.display = 'none';
      chatCard2.classList.remove('fade-out', 'chat-finished', 'card-enter');
    }
    if (chatPlaceholder) {
      chatPlaceholder.textContent = 'ส่งข้อความ...';
      chatPlaceholder.classList.remove('pulse-hint');
    }

    const steps = document.querySelectorAll('#hero-chat-card [data-chat-step]');
    steps.forEach((el) => el.classList.remove('visible'));

    if (chatBody) {
      chatBody.scrollTop = 0;
    }

    // Timing for chat bubbles appearing top to bottom
    const stepDelays = [
      { step: 0, delay: 500 },    // 27 พ.ค. 15:32
      { step: 1, delay: 2000 },   // Tokyo: CS38 มั้ยย...
      { step: 2, delay: 4200 },   // Me: 37 คับน้องง555
      { step: 3, delay: 6000 },   // Me: พี่ชื่อปายนะ
      { step: 4, delay: 8400 },   // Tokyo: ตอบกลับคุณแล้ว... อาเคค่า แต่ก้แอบคิด...
      { step: 5, delay: 11000 },  // Tokyo: ตอบกลับคุณแล้ว... ยินดีที่ได้รจค่า
      { step: 6, delay: 13000 },  // Me: เช่นกันนคับ
      { step: 7, delay: 14800 },  // Me: ไว้เจอกันวันรับน้องนะะ
    ];

    stepDelays.forEach(({ step, delay }) => {
      const timer = setTimeout(() => {
        const el = document.querySelector(`#hero-chat-card [data-chat-step="${step}"]`);
        if (el) {
          el.classList.add('visible');
          const isOutgoing = el.classList.contains('outgoing');
          playChatBubbleSound(isOutgoing);
          if (chatBody) {
            chatBody.scrollTo({
              top: chatBody.scrollHeight,
              behavior: 'smooth'
            });
          }
        }
      }, delay);
      heroChatTimers.push(timer);
    });

    // When the final message is reached, wait for user tap
    const finishTimer = setTimeout(() => {
      markChatAnimationFinished();
    }, 15600);
    heroChatTimers.push(finishTimer);
  }

  function markChatAnimationFinished() {
    isHeroChatFinishedAnimating = true;
    const chatCard = document.getElementById('hero-chat-card');
    if (chatCard) {
      chatCard.classList.add('chat-finished');
    }
    const chatBody = document.getElementById('ig-chat-body');
    if (chatBody) {
      chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  function fastForwardChatMessages() {
    heroChatTimers.forEach(clearTimeout);
    heroChatTimers = [];
    const steps = document.querySelectorAll('#hero-chat-card [data-chat-step]');
    steps.forEach((el) => el.classList.add('visible'));
    markChatAnimationFinished();
  }

  function transitionChat1ToChat2() {
    if (isHeroChatCompleted) return;
    isHeroChatCompleted = true;
    isHeroChatFinishedAnimating = true;

    heroChatTimers.forEach(clearTimeout);
    heroChatTimers = [];

    const steps = document.querySelectorAll('#hero-chat-card [data-chat-step]');
    steps.forEach((el) => el.classList.add('visible'));

    const chatCard1 = document.getElementById('hero-chat-card');
    const chatCard2 = document.getElementById('hero-chat-card-2');

    if (chatCard1) {
      chatCard1.classList.add('fade-out');
    }

    setTimeout(() => {
      if (chatCard1) {
        chatCard1.style.display = 'none';
      }
      if (chatCard2) {
        chatCard2.style.display = 'flex';
        chatCard2.classList.remove('fade-out', 'chat-finished');
        chatCard2.classList.add('card-enter');
        startCard2Animation();
      }
    }, 280);
  }

  function startCard2Animation() {
    card2Timers.forEach(clearTimeout);
    card2Timers = [];
    isCard2FinishedAnimating = false;

    const steps2 = document.querySelectorAll('#hero-chat-card-2 [data-card2-step]');
    steps2.forEach((el) => el.classList.remove('visible'));

    const chatBody2 = document.getElementById('ig-chat-body-2');
    if (chatBody2) {
      chatBody2.scrollTop = 0;
    }
    const placeholder2 = document.getElementById('ig-chat-input-placeholder-2');
    if (placeholder2) {
      placeholder2.textContent = 'ส่งข้อความ...';
      placeholder2.classList.remove('pulse-hint');
    }

    // Step 0: Timestamp 27 ก.ย. 15:32
    const t0 = setTimeout(() => {
      const el0 = document.querySelector('#hero-chat-card-2 [data-card2-step="0"]');
      if (el0) el0.classList.add('visible');
    }, 250);
    card2Timers.push(t0);

    // Step 1: สุขสันต์วันครบรอบ 4 เดือน (Outgoing / Right)
    const t1 = setTimeout(() => {
      const el1 = document.querySelector('#hero-chat-card-2 [data-card2-step="1"]');
      if (el1) {
        el1.classList.add('visible');
        playChatBubbleSound(true);
        if (chatBody2) {
          chatBody2.scrollTo({ top: chatBody2.scrollHeight, behavior: 'smooth' });
        }
      }
    }, 800);
    card2Timers.push(t1);

    // Step 2: นะครับโตเกียว (Outgoing / Right)
    const t2 = setTimeout(() => {
      const el2 = document.querySelector('#hero-chat-card-2 [data-card2-step="2"]');
      if (el2) {
        el2.classList.add('visible');
        playChatBubbleSound(true);
        if (chatBody2) {
          chatBody2.scrollTo({ top: chatBody2.scrollHeight, behavior: 'smooth' });
        }
      }
    }, 1900);
    card2Timers.push(t2);

    // Step 3: ข้อความความในใจ 4 เดือน (Outgoing / Right)
    const t3 = setTimeout(() => {
      const el3 = document.querySelector('#hero-chat-card-2 [data-card2-step="3"]');
      if (el3) {
        el3.classList.add('visible');
        playChatBubbleSound(true);
        playChimeSound();
        const chatCard2 = document.getElementById('hero-chat-card-2');
        createExplosionEffect(chatCard2, 22, ['#ffd116', '#ffb703', '#ff477e', '#a855f7', '#ffffff']);
        if (chatBody2) {
          chatBody2.scrollTo({ top: chatBody2.scrollHeight, behavior: 'smooth' });
        }
      }
      markCard2AnimationFinished();
    }, 3200);
    card2Timers.push(t3);
  }

  function markCard2AnimationFinished() {
    isCard2FinishedAnimating = true;
    const chatCard2 = document.getElementById('hero-chat-card-2');
    if (chatCard2) {
      chatCard2.classList.add('chat-finished');
    }
    const chatBody2 = document.getElementById('ig-chat-body-2');
    if (chatBody2) {
      chatBody2.scrollTo({ top: chatBody2.scrollHeight, behavior: 'smooth' });
    }
  }

  function fastForwardCard2() {
    card2Timers.forEach(clearTimeout);
    card2Timers = [];
    const steps2 = document.querySelectorAll('#hero-chat-card-2 [data-card2-step]');
    steps2.forEach((el) => el.classList.add('visible'));
    const chatBody2 = document.getElementById('ig-chat-body-2');
    if (chatBody2) {
      chatBody2.scrollTo({ top: chatBody2.scrollHeight, behavior: 'smooth' });
    }
    playChimeSound();
    markCard2AnimationFinished();
  }

  function closeHeroSurpriseModalAndGoToGarden() {
    heroChatTimers.forEach(clearTimeout);
    heroChatTimers = [];
    card2Timers.forEach(clearTimeout);
    card2Timers = [];

    const modal = document.getElementById('hero-surprise-modal');
    const chatCard1 = document.getElementById('hero-chat-card');
    const chatCard2 = document.getElementById('hero-chat-card-2');
    if (chatCard1) chatCard1.classList.add('fade-out');
    if (chatCard2) chatCard2.classList.add('fade-out');

    setTimeout(() => {
      if (modal) {
        modal.classList.remove('active');
      }
      goToGardenView();
    }, 280);
  }

  function goToGardenView() {
    if (state.currentView === 'garden') return;

    heroChatTimers.forEach(clearTimeout);
    heroChatTimers = [];
    card2Timers.forEach(clearTimeout);
    card2Timers = [];

    const modal = document.getElementById('hero-surprise-modal');
    if (modal) {
      modal.classList.remove('active');
    }

    // Start background music automatically on user click
    if (!state.isPlayingMusic) {
      toggleMusic();
    }

    // Explosion on hero sunflower
    createExplosionEffect(heroSunflowerInteractive, 15, ['#ffd116', '#ffb703', '#ff477e', '#ffffff']);
    playChimeSound();

    // Transition
    heroView.classList.add('fade-out');

    setTimeout(() => {
      heroView.classList.remove('active', 'fade-out');
      gardenView.classList.add('active');
      state.currentView = 'garden';
      if (audioWidget) audioWidget.style.display = 'none';

      // Auto-dismiss banner & footer hint so flowers have completely clear view on mobile & tablet
      scheduleHintAutoDismiss(4500);

      // Welcome gentle breeze particles
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          createParticleBurst(window.innerWidth * Math.random(), window.innerHeight * 0.7);
        }, i * 80);
      }
    }, 300);
  }

  function goToHeroView() {
    if (state.currentView === 'hero') return;

    heroChatTimers.forEach(clearTimeout);
    heroChatTimers = [];
    card2Timers.forEach(clearTimeout);
    card2Timers = [];
    isHeroChatFinishedAnimating = false;
    isHeroChatCompleted = false;
    isCard2FinishedAnimating = false;

    const modal = document.getElementById('hero-surprise-modal');
    if (modal) {
      modal.classList.remove('active');
    }

    const chatCard1 = document.getElementById('hero-chat-card');
    const chatCard2 = document.getElementById('hero-chat-card-2');
    if (chatCard1) {
      chatCard1.style.display = 'flex';
      chatCard1.classList.remove('fade-out', 'chat-finished', 'card-enter');
    }
    if (chatCard2) {
      chatCard2.style.display = 'none';
      chatCard2.classList.remove('fade-out', 'chat-finished', 'card-enter');
    }
    const chatPlaceholder1 = document.getElementById('ig-chat-input-placeholder');
    if (chatPlaceholder1) {
      chatPlaceholder1.textContent = 'ส่งข้อความ...';
      chatPlaceholder1.classList.remove('pulse-hint');
    }
    const chatPlaceholder2 = document.getElementById('ig-chat-input-placeholder-2');
    if (chatPlaceholder2) {
      chatPlaceholder2.textContent = 'ส่งข้อความ...';
      chatPlaceholder2.classList.remove('pulse-hint');
    }

    if (state.isNightMode) {
      exitNightMode();
    } else {
      stopStargazeMedia(true);
    }

    gardenView.classList.remove('active');
    heroView.classList.add('active');
    state.currentView = 'hero';
    if (audioWidget) audioWidget.style.display = '';
  }

  /* ==========================================================================
     8. WEB AUDIO ROMANTIC SYNTHESIZER (No external files needed!)
     ========================================================================== */
  let audioCtx = null;
  let bgmInterval = null;

  function setupAudioSynth() {
    // Audio context will be activated on first user gesture
  }

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a soft romantic tone (sine + gentle lowpass filter)
  function playSynthTone(freq, duration = 1.2, timeOffset = 0, volume = 0.12) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = 850;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + timeOffset);

    // Envelope
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime + timeOffset);
    gain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + timeOffset + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + timeOffset + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + timeOffset);
    osc.stop(audioCtx.currentTime + timeOffset + duration);
  }

  // Romantic chord progression arpeggio:
  // Cmaj7 -> Am7 -> Fmaj7 -> Gsus4 / G7
  const chords = [
    [261.63, 329.63, 392.00, 493.88], // C4, E4, G4, B4
    [220.00, 261.63, 329.63, 392.00], // A3, C4, E4, G4
    [174.61, 220.00, 261.63, 329.63], // F3, A3, C4, E4
    [196.00, 261.63, 293.66, 392.00], // G3, C4, D4, G4
  ];

  let chordIndex = 0;
  function playRomanticChordArpeggio() {
    if (!state.isPlayingMusic || !audioCtx) return;

    const currentChord = chords[chordIndex % chords.length];
    chordIndex++;

    currentChord.forEach((freq, idx) => {
      playSynthTone(freq, 2.4, idx * 0.32, 0.08);
      // Delicate higher octave chime note
      if (idx === 2) {
        playSynthTone(freq * 2, 2.0, idx * 0.32 + 0.45, 0.035);
      }
    });
  }

  function startBGM() {
    state.isPlayingMusic = true;
    const audio = document.getElementById('romantic-bgm');
    if (audio) {
      audio.volume = 0.08;
      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => {
          initAudioContext();
          playRomanticChordArpeggio();
          if (bgmInterval) clearInterval(bgmInterval);
          bgmInterval = setInterval(playRomanticChordArpeggio, 2200);
        });
      }
    } else {
      initAudioContext();
      playRomanticChordArpeggio();
      if (bgmInterval) clearInterval(bgmInterval);
      bgmInterval = setInterval(playRomanticChordArpeggio, 2200);
    }
  }

  function stopBGM() {
    state.isPlayingMusic = false;
    const audio = document.getElementById('romantic-bgm');
    if (audio) {
      audio.pause();
    }
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
  }

  function toggleMusic() {
    if (state.isNightMode && isStargazeMediaActive) {
      if (stargazeHalleyAudio && !stargazeHalleyAudio.paused) {
        stargazeHalleyAudio.pause();
        if (stargazeBgVideo) stargazeBgVideo.pause();
      } else if (stargazeHalleyAudio) {
        stargazeHalleyAudio.play().catch(() => { });
        if (stargazeBgVideo) stargazeBgVideo.play().catch(() => { });
      }
      return;
    }
    if (state.isPlayingMusic) {
      stopBGM();
    } else {
      startBGM();
    }
  }

  function tryAutoplayMusic() {
    startBGM();

    const unlockOnGesture = () => {
      const audio = document.getElementById('romantic-bgm');
      if (audio && audio.paused) {
        audio.play().catch(() => { });
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => { });
      }
      ['click', 'touchstart', 'pointerdown', 'keydown', 'mousemove', 'scroll'].forEach((evt) => {
        window.removeEventListener(evt, unlockOnGesture);
      });
    };

    ['click', 'touchstart', 'pointerdown', 'keydown', 'mousemove', 'scroll'].forEach((evt) => {
      window.addEventListener(evt, unlockOnGesture, { passive: true, once: true });
    });
  }

  // Sound Effects: Chime when opening memories
  function playChimeSound() {
    initAudioContext();
    if (!audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      playSynthTone(freq, 1.2, i * 0.09, 0.1);
    });
  }

  // Sound Effects: Pop when tapping normal flowers
  function playPopSound() {
    initAudioContext();
    if (!audioCtx) return;
    playSynthTone(440, 0.25, 0, 0.07);
    playSynthTone(880, 0.3, 0.04, 0.05);
  }

  // Sound Effects: Soft bubble pop for chat messages
  function playChatBubbleSound(isOutgoing = false) {
    initAudioContext();
    if (!audioCtx) return;
    const freq = isOutgoing ? 680 : 540;
    playSynthTone(freq, 0.12, 0, 0.045);
  }

  // Sound Effects: Celebration fanfare
  function playCelebrationFanfare() {
    initAudioContext();
    if (!audioCtx) return;
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    fanfareNotes.forEach((freq, i) => {
      playSynthTone(freq, 1.8, i * 0.12, 0.12);
    });
  }

  /* ==========================================================================
     9. AMBIENT PARTICLES (GOLDEN DUST, FLOATING PETALS, HEARTS)
     ========================================================================== */
  function setupCanvas() {
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Ambient particles — more flying petals for atmosphere
    for (let i = 0; i < 40; i++) {
      state.particles.push(createAmbientParticle());
    }

    requestAnimationFrame(renderCanvas);
  }

  function createAmbientParticle() {
    const isHero = state.currentView === 'hero';
    // In Hero view, make floating sparkle stars a primary atmospheric element!
    const isSparkleStar = isHero ? (Math.random() < 0.45) : (Math.random() < 0.15);
    const isPetal = !isSparkleStar && (Math.random() < 0.50);
    const isHeart = !isSparkleStar && !isPetal && (Math.random() < 0.12);

    const starColors = ['#ffffff', '#fff9db', '#fef08a', '#fde047', '#ffd116'];
    const starColor = starColors[Math.floor(Math.random() * starColors.length)];

    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: isSparkleStar ? 2.5 + Math.random() * 3.5 : (isPetal ? 4 + Math.random() * 4 : 1.5 + Math.random() * 2.5),
      speedY: isSparkleStar ? -(0.2 + Math.random() * 0.45) : -(0.3 + Math.random() * 0.7),
      speedX: isSparkleStar ? (Math.random() - 0.45) * 0.5 : 0.2 + Math.random() * 0.8,
      opacity: isSparkleStar ? 0.35 + Math.random() * 0.55 : 0.2 + Math.random() * 0.6,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      twinkle: Math.random() * Math.PI * 2,
      isSparkleStar,
      isPetal,
      isHeart,
      color: isSparkleStar ? starColor : (isHeart ? '#ff477e' : (isPetal ? '#fbbf24' : '#fef08a')),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
    };
  }

  function renderCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Iterate backwards so we can splice out dead explosion particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];

      // Explosion/burst particles: fade & decelerate, then remove
      if (p.isExplosion) {
        p.speedX *= 0.92;
        p.speedY *= 0.92;
        p.opacity -= 0.028;
        if (p.opacity <= 0) {
          state.particles.splice(i, 1);
          continue;
        }
      }

      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 0.4;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      // Ambient particles: wrap around bounds
      if (!p.isExplosion) {
        if (p.y < -20) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x > canvas.width + 20) { p.x = -10; }
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);

      if (p.isSparkleStar) {
        p.twinkle = (p.twinkle || 0) + 0.04;
        const currentAlpha = p.opacity * (0.65 + 0.35 * Math.sin(p.twinkle));
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        drawSparkleStar(ctx, 0, 0, p.radius);
      } else if (p.isHeart) {
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        drawHeart(ctx, 0, 0, p.radius * 1.5);
      } else if (p.isPetal) {
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius * 2, p.radius, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Simple golden dust — no shadowBlur (expensive)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      ctx.restore();
    }

    // Cap total particles to prevent unbounded growth
    if (state.particles.length > 80) {
      state.particles.splice(0, state.particles.length - 80);
    }

    requestAnimationFrame(renderCanvas);
  }

  function drawSparkleStar(context, x, y, size) {
    context.beginPath();
    context.moveTo(x, y - size);
    context.quadraticCurveTo(x, y, x + size, y);
    context.quadraticCurveTo(x, y, x, y + size);
    context.quadraticCurveTo(x, y, x - size, y);
    context.quadraticCurveTo(x, y, x, y - size);
    context.closePath();
    context.fill();

    // Subtle white pinhead center
    context.beginPath();
    context.arc(x, y, size * 0.28, 0, Math.PI * 2);
    context.fillStyle = '#ffffff';
    context.fill();
  }

  function drawHeart(context, x, y, size) {
    context.beginPath();
    const topCurveHeight = size * 0.3;
    context.moveTo(x, y + topCurveHeight);
    context.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    context.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.5, x, y + size);
    context.bezierCurveTo(x, y + (size + topCurveHeight) / 1.5, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    context.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    context.fill();
  }

  // Particle explosion on clicks
  function createExplosionEffect(targetEl, count = 12, colors = ['#f59e0b', '#fbbf24', '#ff477e']) {
    const rect = targetEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 3;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 2 + Math.random() * 4;
      const color = colors[Math.floor(Math.random() * colors.length)];

      state.particles.push({
        x: originX, y: originY,
        radius: 3 + Math.random() * 3,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 1.5,
        opacity: 1,
        wobble: Math.random() * Math.PI,
        wobbleSpeed: 0.04,
        isPetal: Math.random() < 0.5,
        isHeart: Math.random() < 0.3,
        isExplosion: true,
        color,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
      });
    }
  }

  function createHeartFirework(x, y) {
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;
      const speed = 3 + Math.random() * 5;
      state.particles.push({
        x, y,
        radius: 4 + Math.random() * 3,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        opacity: 1,
        wobble: 0, wobbleSpeed: 0.04,
        isPetal: false, isHeart: true,
        isExplosion: true,
        color: ['#ff477e', '#ffd116', '#a855f7', '#38bdf8', '#fb7185'][i % 5],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
      });
    }
  }

  function createParticleBurst(x, y) {
    state.particles.push({
      x, y,
      radius: 3 + Math.random() * 3,
      speedX: 1 + Math.random() * 2,
      speedY: -(1 + Math.random() * 2),
      opacity: 0.9,
      wobble: 0, wobbleSpeed: 0.05,
      isPetal: true, isHeart: false,
      isExplosion: true,
      color: '#ffd116',
      rotation: Math.random() * 360,
      rotationSpeed: 2,
    });
  }

  /* ==========================================================================
     10. EVENT LISTENERS
     ========================================================================== */
  function setupEventListeners() {
    // Hero Sunflower Click -> 1st click reveals header, 2nd click enters garden
    heroSunflowerInteractive.addEventListener('click', () => {
      handleHeroInteraction();
    });

    heroSunflowerInteractive.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleHeroInteraction();
      }
    });

    // Prompt badge click -> Same 2-step interaction
    const heroFlowerPrompt = document.getElementById('hero-flower-prompt');
    if (heroFlowerPrompt) {
      heroFlowerPrompt.addEventListener('click', () => {
        handleHeroInteraction();
      });
      heroFlowerPrompt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleHeroInteraction();
        }
      });
    }

    // Whisper text click -> Same interaction
    const heroFlowerWhisper = document.getElementById('hero-flower-whisper');
    if (heroFlowerWhisper) {
      heroFlowerWhisper.addEventListener('click', () => {
        handleHeroInteraction();
      });
      heroFlowerWhisper.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleHeroInteraction();
        }
      });
    }

    // Hero modal interaction: IG Chat 1 -> IG Chat 2 -> Garden
    const heroSurpriseModal = document.getElementById('hero-surprise-modal');
    const heroChatCard = document.getElementById('hero-chat-card');
    const heroChatCard2 = document.getElementById('hero-chat-card-2');
    const heroModalBackdrop = document.getElementById('hero-modal-backdrop');

    if (heroChatCard) {
      heroChatCard.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isHeroChatFinishedAnimating) {
          transitionChat1ToChat2();
        } else {
          fastForwardChatMessages();
        }
      });
    }

    if (heroChatCard2) {
      heroChatCard2.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isCard2FinishedAnimating) {
          closeHeroSurpriseModalAndGoToGarden();
        } else {
          fastForwardCard2();
        }
      });
    }

    if (heroModalBackdrop) {
      heroModalBackdrop.addEventListener('click', () => {
        if (!isHeroChatFinishedAnimating) {
          fastForwardChatMessages();
        } else if (!isHeroChatCompleted) {
          transitionChat1ToChat2();
        } else if (!isCard2FinishedAnimating) {
          fastForwardCard2();
        } else {
          closeHeroSurpriseModalAndGoToGarden();
        }
      });
    }

    // Return to Hero view button
    btnBackHero.addEventListener('click', () => {
      goToHeroView();
    });

    // Audio Buttons (if present)
    if (audioToggleBtn) audioToggleBtn.addEventListener('click', toggleMusic);
    if (btnGardenAudio) btnGardenAudio.addEventListener('click', toggleMusic);

    // Modal Events
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeMemoryModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeMemoryModal);
    if (memoryModal) {
      memoryModal.addEventListener('click', (e) => {
        if (e.target === memoryModal) closeMemoryModal();
      });
    }
    if (modalUnderstandBtn) modalUnderstandBtn.addEventListener('click', closeMemoryModal);

    if (modalPrevBtn) modalPrevBtn.addEventListener('click', () => navigateMemory(-1));
    if (modalNextBtn) modalNextBtn.addEventListener('click', () => navigateMemory(1));

    // Lightbox Events
    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closePhotoLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closePhotoLightbox);

    // Click standard polaroid photo to open lightbox
    if (modalPhoto) {
      modalPhoto.style.cursor = 'pointer';
      modalPhoto.addEventListener('click', () => {
        if (modalPhoto.src && !modalPhoto.src.endsWith('#')) {
          openPhotoLightbox(modalPhoto.src, modalMemoryTitle ? modalMemoryTitle.textContent : '');
        }
      });
    }

    // Keyboard support for modals & lightbox
    window.addEventListener('keydown', (e) => {
      if (photoLightbox && photoLightbox.classList.contains('active')) {
        if (e.key === 'Escape') closePhotoLightbox();
        return;
      }
      if (memoryModal.classList.contains('active')) {
        if (e.key === 'Escape') closeMemoryModal();
        if (e.key === 'ArrowLeft') navigateMemory(-1);
        if (e.key === 'ArrowRight') navigateMemory(1);
      }
      if (finaleModal.classList.contains('active')) {
        if (e.key === 'Escape') closeFinaleModal();
      }
    });

    // Banner close
    btnCloseBanner.addEventListener('click', () => {
      gardenBanner.classList.add('dismissed');
    });

    // Legend hint close
    const btnCloseLegend = document.getElementById('btn-close-legend');
    const gardenFooterHint = document.getElementById('garden-footer-hint');
    if (btnCloseLegend && gardenFooterHint) {
      btnCloseLegend.addEventListener('click', (e) => {
        e.stopPropagation();
        gardenFooterHint.classList.add('dismissed');
      });
    }

    // Tap counter pill to toggle hints on/off on demand
    if (counterPill) {
      counterPill.style.cursor = 'pointer';
      counterPill.setAttribute('title', 'แตะเพื่อดูคำแนะนำ');
      counterPill.addEventListener('click', () => {
        const isDismissed = gardenBanner.classList.contains('dismissed');
        if (isDismissed) {
          gardenBanner.classList.remove('dismissed');
          if (gardenFooterHint) gardenFooterHint.classList.remove('dismissed');
          scheduleHintAutoDismiss(5000);
        } else {
          gardenBanner.classList.add('dismissed');
          if (gardenFooterHint) gardenFooterHint.classList.add('dismissed');
        }
      });
    }

    // Night Mode Toggle Button
    if (btnToggleNight) {
      btnToggleNight.addEventListener('click', toggleNightMode);
    }

    // Finale Events
    finaleCloseBtn.addEventListener('click', closeFinaleModal);
    if (btnNightStargaze) {
      btnNightStargaze.addEventListener('click', () => {
        closeFinaleModal();
        enterNightMode(true);
      });
    }
    if (btnFinaleFireworks) {
      btnFinaleFireworks.addEventListener('click', () => {
        createHeartFirework(window.innerWidth / 2, window.innerHeight * 0.4);
        playCelebrationFanfare();
      });
    }
    // Message card close button (returns to evening / garden)
    const msgCloseBtn = document.getElementById('stargaze-msg-close-btn');
    if (msgCloseBtn) {
      msgCloseBtn.addEventListener('click', () => {
        exitNightMode();
      });
    }
  }

  // Start app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
