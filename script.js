/**
 * ==========================================================================
 * A TWO MINUTE STORY — CONFIGURATION & CORE ENGINE
 * ==========================================================================
 * Easy-to-edit configuration object at the top.
 * Replace photo URLs, text lines, and EmailJS settings here!
 */

// ==========================================================================
// 1. STORY CONFIGURATION (CUSTOMIZE HERE)
// ==========================================================================
const STORY_CONFIG = {
  // Target recipient email for "YES" choice
  recipientEmail: "pprateek26@gmail.com",

  // EmailJS Configuration (Set these up at emailjs.com for auto email sending)
  emailjs: {
    serviceID: "YOUR_SERVICE_ID",   // e.g. "service_abcd123"
    templateID: "YOUR_TEMPLATE_ID", // e.g. "template_xyz456"
    publicKey: "YOUR_PUBLIC_KEY"   // e.g. "user_123456789"
  },

  // Photos (Defaulting to generated photos of Mitali & Prateek)
  photos: {
    // Page 2: My Photo Funny Intro
    myPhoto1: "./src/assets/images/story-photo-1.jpg",
    
    // Page 3: My Photo Fun Fact
    myPhoto2: "./src/assets/images/story-photo-2.jpg",
    
    // Page 4: Her Photo (Mitali)
    herPhoto: "./src/assets/images/story-photo-3.jpeg",
    
    // Page 6: Memory Gallery Items
    memories: [
      {
        id: 1,
        image: "./src/assets/images/story-photo-2.jpg",
        caption: "Every moment with you is precious. I hate the thought of causing you any distress.",
        location: "Happy Times",
        date: "Together"
      },
      {
        id: 2,
        image: "./src/assets/images/story-photo-3.jpeg",
        caption: "Your bright smile is my favorite thing. I want to bring that joy back!",
        location: "Mitali's Smile",
        date: "Always Special"
      },
      {
        id: 3,
        image: "./src/assets/images/story-photo-4.jpg",
        caption: "Looking back at our moments... I promise to do better and cherish you every day.",
        location: "Sincere Promise",
        date: "Forever"
      }
    ]
  },

  // Page 2 Typewriter Lines (Apology intro)
  typewriterLines: [
    "Mitali, I know I messed up or acted silly...",
    "Main honestly darr raha tha ki aap gusse me ise close kar doge.",
    "But since you're still reading this...",
    "Please give me a moment to say sorry and make things right. 🥺👉👈"
  ],

  // Page 7 Open Letter
  letter: {
    title: "Dearest Mitali,",
    lines: [
      "I wanted to take a quiet moment to write this sincere apology to you.",
      "I know I made a mistake or said something that hurt or annoyed you, and I feel truly terrible about it.",
      "Your presence, your cute laughter, and your warmth mean the world to me, and I hate being the cause of any distance.",
      "I promise to learn, listen better, and always treat your feelings with the affection and care you deserve.",
      "Thank you for reading this. Please accept my heartfelt apology? 🥺👉👈"
    ],
    signature: "— Yours sincerely, Prateek ❤️"
  },

  // Page 5 Quiz Options
  quizWrongResponses: [
    "Nice try Mitali! 😂 Pizza is great, but your forgiveness is priceless!",
    "Lifetime immunity?! I wish! But I just want to see you smile again. 🥺",
    "Close, but you know what my heart is asking for! ❤️",
    "Cake is sweet, but your forgiveness is sweeter! 🍰"
  ]
};

// SVG Placeholder Generator Helper
function createSvgPlaceholder(title, accentColor, subtitle) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#181a24" />
        <stop offset="50%" stop-color="#212534" />
        <stop offset="100%" stop-color="#0f1118" />
      </linearGradient>
      <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    <rect width="600" height="700" fill="url(#grad)" rx="24"/>
    <circle cx="300" cy="300" r="140" fill="url(#glow)"/>
    <circle cx="300" cy="300" r="100" fill="#181a24" stroke="${accentColor}" stroke-width="2" stroke-dasharray="8 6"/>
    <path d="M270 310 C270 280, 330 280, 330 310 C330 330, 300 340, 300 360" fill="none" stroke="${accentColor}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="300" cy="385" r="5" fill="${accentColor}"/>
    <text x="300" y="470" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="600" fill="#ffffff" text-anchor="middle">${title}</text>
    <text x="300" y="510" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">${subtitle}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}


// ==========================================================================
// 2. STATE & CORE APP ENGINE
// ==========================================================================
class StoryApp {
  constructor() {
    window.storyApp = this;
    this.photoStorageKey = 'a-two-minute-story:photos:v1';
    this.currentPage = 1;
    this.totalPages = 8;
    this.currentMemoryIndex = 0;
    this.evasionCount = 0;
    this.maxEvasions = 3;
    this.audioEnabled = false;
    this.audioCtx = null;
    this.typewriterActive = false;
    this.typewriterIndex = 0;

    this.initDOM();
    this.initBackgroundCanvas();
    this.initConfettiCanvas();
    this.initEventListeners();
    this.preloadAssets();
  }

  initDOM() {
    // DOM Elements
    this.loadingScreen = document.getElementById('loading-screen');
    this.loaderFill = document.getElementById('loader-fill');
    this.loaderStatus = document.getElementById('loader-status');
    this.progressBar = document.getElementById('story-progress');
    this.stepIndicator = document.getElementById('step-indicator');
    this.audioToggleBtn = document.getElementById('audio-toggle-btn');
    this.audioIcon = document.getElementById('audio-icon');
    this.soundWaves = document.getElementById('sound-waves');

    // Photos
    document.getElementById('img-my-photo-1').src = STORY_CONFIG.photos.myPhoto1;
    document.getElementById('img-my-photo-2').src = STORY_CONFIG.photos.myPhoto2;
    document.getElementById('img-her-photo').src = STORY_CONFIG.photos.herPhoto;

    // Letter setup
    document.getElementById('letter-title').textContent = STORY_CONFIG.letter.title;
    const letterBodyEl = document.getElementById('letter-body');
    letterBodyEl.innerHTML = STORY_CONFIG.letter.lines
      .map((line, idx) => `<p style="transition-delay: ${idx * 0.15}s">${line}</p>`)
      .join('');
    document.getElementById('letter-sign').textContent = STORY_CONFIG.letter.signature;

    // Memory Gallery setup
    this.renderMemoryGallery();
  }

  // Preloader animation
  preloadAssets() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          if (this.loadingScreen) {
            this.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
              this.loadingScreen.style.display = 'none';
            }, 800);
          }
        }, 300);
      }
      if (this.loaderFill) this.loaderFill.style.width = `${progress}%`;
      if (this.loaderStatus) this.loaderStatus.textContent = `Preparing memories (${progress}%)`;
    }, 120);
  }

  // Memory Gallery renderer
  renderMemoryGallery() {
    const sliderEl = document.getElementById('memory-slider');
    const dotsEl = document.getElementById('slider-dots');
    
    sliderEl.innerHTML = '';
    dotsEl.innerHTML = '';

    STORY_CONFIG.photos.memories.forEach((mem, idx) => {
      // Memory Item Card
      const itemEl = document.createElement('div');
      itemEl.className = `memory-item ${idx === 0 ? 'active' : ''}`;
      itemEl.dataset.index = idx;
      itemEl.innerHTML = `
        <div class="memory-photo-frame">
          <img src="${mem.image}" alt="Memory ${idx + 1}" class="memory-photo" loading="lazy" />
          <div class="photo-glow"></div>
          <div class="photo-tag">${mem.location}</div>
        </div>
        <p class="memory-caption">${mem.caption.replace(/\n/g, '<br/>')}</p>
      `;
      sliderEl.appendChild(itemEl);

      // Dot Indicator
      const dotEl = document.createElement('div');
      dotEl.className = `dot ${idx === 0 ? 'active' : ''}`;
      dotEl.addEventListener('click', () => this.showMemory(idx));
      dotsEl.appendChild(dotEl);
    });
  }

  showMemory(index) {
    const items = document.querySelectorAll('.memory-item');
    const dots = document.querySelectorAll('.dot');
    if (index < 0 || index >= items.length) return;

    this.currentMemoryIndex = index;

    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === index);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  // Page Navigation System
  navigateToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > this.totalPages) return;

    const currentSection = document.getElementById(`page-${this.currentPage}`);
    const nextSection = document.getElementById(`page-${pageNumber}`);

    if (currentSection) {
      currentSection.classList.remove('active');
    }

    this.currentPage = pageNumber;

    if (nextSection) {
      nextSection.classList.add('active');
    }

    // Update Progress Bar
    const percent = (pageNumber / this.totalPages) * 100;
    this.progressBar.style.width = `${percent}%`;
    this.stepIndicator.textContent = `${pageNumber} / ${this.totalPages}`;

    // Handle Page Specific Triggers
    if (pageNumber === 2) {
      this.startTypewriterPage2();
    }
    if (pageNumber === 7) {
      this.animateOpenLetter();
    }

    // Scroll to top of card smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Typewriter effect for Page 2
  startTypewriterPage2() {
    if (this.typewriterActive) return;
    this.typewriterActive = true;
    const targetEl = document.getElementById('typewriter-p2');
    targetEl.innerHTML = '';
    
    let lineIdx = 0;
    let charIdx = 0;
    const lines = STORY_CONFIG.typewriterLines;

    const typeNextChar = () => {
      if (lineIdx >= lines.length) {
        this.typewriterActive = false;
        return;
      }

      const currentLine = lines[lineIdx];
      if (charIdx < currentLine.length) {
        targetEl.innerHTML = lines.slice(0, lineIdx).join('<br/>') +
          (lineIdx > 0 ? '<br/>' : '') +
          currentLine.substring(0, charIdx + 1) +
          '<span class="typewriter-cursor">|</span>';
        charIdx++;
        setTimeout(typeNextChar, 45);
      } else {
        lineIdx++;
        charIdx = 0;
        setTimeout(typeNextChar, 500);
      }
    };

    typeNextChar();
  }

  // Animate Open Letter line by line
  animateOpenLetter() {
    const paragraphs = document.querySelectorAll('#letter-body p');
    paragraphs.forEach((p) => {
      setTimeout(() => {
        p.classList.add('visible');
      }, 100);
    });
  }

  // Mini Game Handler
  handleQuizOption(btnEl) {
    const isCorrect = btnEl.dataset.correct === 'true';
    const feedbackEl = document.getElementById('game-feedback');

    if (isCorrect) {
      feedbackEl.className = 'game-feedback correct';
      feedbackEl.innerHTML = '❤️ Correct! Just one question... let\'s go!';
      feedbackEl.classList.remove('hidden');

      // Highlight correct button
      btnEl.style.borderColor = '#10b981';
      btnEl.style.background = 'rgba(16, 185, 129, 0.2)';

      setTimeout(() => {
        this.navigateToPage(6);
      }, 1200);
    } else {
      // Pick random funny wrong message
      const wrongMsg = STORY_CONFIG.quizWrongResponses[
        Math.floor(Math.random() * STORY_CONFIG.quizWrongResponses.length)
      ];
      feedbackEl.className = 'game-feedback wrong';
      feedbackEl.innerHTML = wrongMsg;
      feedbackEl.classList.remove('hidden');

      // Toast alert
      this.showToast(wrongMsg);
    }
  }

  // Evasive Button Evasion
  handleNoButtonEvasion(btnEl) {
    if (this.evasionCount >= this.maxEvasions) return;

    this.evasionCount++;

    const maxOffset = 100;
    const randomX = (Math.random() - 0.5) * maxOffset * 2.2;
    const randomY = (Math.random() - 0.5) * maxOffset * 1.5;

    btnEl.style.transform = `translate(${randomX}px, ${randomY}px)`;

    // Playful romantic micro-messages
    const evasionMessages = [
      "Are you sure Mitali? 🙈",
      "Catch me if you can! 🏃💨",
      "Hey, 'No' is strictly out of stock! 💖",
      "Give Prateek a chance! 🥺👉👈",
      "Fine fine, I'll hold still now! 😄"
    ];
    this.showToast(evasionMessages[this.evasionCount - 1] || "Okay, I'm holding still!");

    if (this.evasionCount >= this.maxEvasions) {
      setTimeout(() => {
        btnEl.style.transform = 'translate(0, 0)';
      }, 1000);
    }
  }

  // Handle YES Choice
  handleYesChoice() {
    document.getElementById('final-question-box').classList.add('hidden');
    document.getElementById('final-response-yes').classList.remove('hidden');

    // Trigger Confetti Particle Explosion
    this.triggerConfetti();

    // Play victory chime sound
    this.playVictoryChime();

    // Gather Metadata
    const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
    const metadata = {
      timestamp: new Date().toLocaleString(),
      device: deviceType,
      platform: navigator.platform,
      screenResolution: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent
    };

    document.getElementById('yes-meta-details').innerHTML = `
      Submitted at: ${metadata.timestamp}<br/>
      Device: ${metadata.device} (${metadata.platform})
    `;

    // Attempt Email Notification
    this.sendEmailNotification(metadata);
  }

  // Handle NOT TODAY Choice
  handleNoChoice() {
    document.getElementById('final-question-box').classList.add('hidden');
    document.getElementById('final-response-no').classList.remove('hidden');
  }

  // Email Notification Helper
  sendEmailNotification(meta) {
    console.log("Sending YES notification to pprateek26@gmail.com...", meta);
    const recipient = STORY_CONFIG.recipientEmail || "pprateek26@gmail.com";

    // 1. Send via FormSubmit AJAX service directly to pprateek26@gmail.com
    fetch(`https://formsubmit.co/ajax/${recipient}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        _subject: "❤️ Mitali accepted your apology and clicked YES!",
        _captcha: "false",
        email: recipient,
        name: "Mitali",
        message: `Mitali accepted your apology and clicked YES! ❤️\n\nDetails:\n- Time: ${meta.timestamp}\n- Device: ${meta.device}\n- Platform: ${meta.platform}\n- Resolution: ${meta.screenResolution}`
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("FormSubmit email notification sent:", data);
      this.showToast("Email notification sent to " + recipient + "! ❤️");
    })
    .catch(err => {
      console.warn("FormSubmit send error:", err);
    });

    // 2. Also send via EmailJS if keys are provided
    if (window.emailjs && STORY_CONFIG.emailjs.publicKey !== "YOUR_PUBLIC_KEY") {
      window.emailjs.send(
        STORY_CONFIG.emailjs.serviceID,
        STORY_CONFIG.emailjs.templateID,
        {
          to_email: recipient,
          subject: "Mitali clicked YES ❤️",
          timestamp: meta.timestamp,
          device: meta.device,
          platform: meta.platform,
          screen: meta.screenResolution
        },
        STORY_CONFIG.emailjs.publicKey
      ).catch((err) => {
        console.warn("EmailJS error:", err);
      });
    }
  }

  // Toast Notification
  showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // ================= Event Listeners =================
  initEventListeners() {
    // Navigation Buttons
    document.getElementById('btn-page-1').addEventListener('click', () => this.navigateToPage(2));
    document.getElementById('btn-page-2').addEventListener('click', () => this.navigateToPage(3));
    document.getElementById('btn-page-3').addEventListener('click', () => this.navigateToPage(4));
    document.getElementById('btn-page-4').addEventListener('click', () => this.navigateToPage(5));
    document.getElementById('btn-page-6').addEventListener('click', () => this.navigateToPage(7));
    document.getElementById('btn-page-7').addEventListener('click', () => this.navigateToPage(8));

    // Progress Bar / Step Badge Jump Navigation
    const progressWrapper = document.querySelector('.story-progress-wrapper');
    if (progressWrapper) {
      progressWrapper.style.cursor = 'pointer';
      progressWrapper.title = 'Click to jump to next page or step';
      progressWrapper.addEventListener('click', () => {
        const nextPage = this.currentPage >= this.totalPages ? 1 : this.currentPage + 1;
        this.navigateToPage(nextPage);
      });
    }

    // Memory Gallery Nav
    document.getElementById('prev-memory').addEventListener('click', () => {
      this.showMemory(this.currentMemoryIndex - 1);
    });
    document.getElementById('next-memory').addEventListener('click', () => {
      this.showMemory(this.currentMemoryIndex + 1);
    });

    // Quiz Buttons
    document.querySelectorAll('.game-option-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleQuizOption(e.currentTarget));
    });

    // Evasive No Button
    const noBtn = document.getElementById('btn-no');
    noBtn.addEventListener('mouseenter', () => this.handleNoButtonEvasion(noBtn));
    noBtn.addEventListener('touchstart', (e) => {
      if (this.evasionCount < this.maxEvasions) {
        e.preventDefault();
        this.handleNoButtonEvasion(noBtn);
      }
    });
    noBtn.addEventListener('click', () => this.handleNoChoice());

    // Yes Button
    document.getElementById('btn-yes').addEventListener('click', () => this.handleYesChoice());

    // Replay Buttons
    document.getElementById('btn-restart-yes').addEventListener('click', () => this.resetStory());
    document.getElementById('btn-restart-no').addEventListener('click', () => this.resetStory());

    // Photo Modal Handlers
    const photoModal = document.getElementById('photo-modal');
    const photoModalBtn = document.getElementById('photo-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const savePhotosBtn = document.getElementById('save-photos-btn');

    if (photoModalBtn && photoModal) {
      photoModalBtn.addEventListener('click', () => {
        photoModal.classList.remove('hidden');
      });
    }

    if (closeModalBtn && photoModal) {
      closeModalBtn.addEventListener('click', () => {
        photoModal.classList.add('hidden');
      });
    }

    if (savePhotosBtn) {
      savePhotosBtn.addEventListener('click', () => {
        this.applyUploadedPhotos();
        if (photoModal) photoModal.classList.add('hidden');
        this.showToast("Photos updated! ✨");
      });
    }

    // Audio Toggle
    this.audioToggleBtn.addEventListener('click', () => this.toggleAudio());

    // Button Ripple Effect
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.ripple-btn');
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const circle = document.createElement('span');
        circle.className = 'ripple-effect';
        circle.style.width = circle.style.height = `${Math.max(rect.width, rect.height)}px`;
        circle.style.left = `${e.clientX - rect.left - rect.width / 2}px`;
        circle.style.top = `${e.clientY - rect.top - rect.height / 2}px`;
        btn.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
      }
    });
  }

  applyUploadedPhotos() {
    const fileReads = [];

    const handleFileInput = (elementId, targetCallback) => {
      const input = document.getElementById(elementId);
      if (input && input.files && input.files[0]) {
        fileReads.push(new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            targetCallback(e.target.result);
            resolve();
          };
          reader.onerror = () => resolve();
          reader.readAsDataURL(input.files[0]);
        }));
      }
    };

    handleFileInput('input-my-photo-1-file', (url) => {
      STORY_CONFIG.photos.myPhoto1 = url;
      document.getElementById('img-my-photo-1').src = url;
    });

    handleFileInput('input-my-photo-2-file', (url) => {
      STORY_CONFIG.photos.myPhoto2 = url;
      document.getElementById('img-my-photo-2').src = url;
    });

    handleFileInput('input-her-photo-file', (url) => {
      STORY_CONFIG.photos.herPhoto = url;
      document.getElementById('img-her-photo').src = url;
    });

    handleFileInput('input-mem-1-file', (url) => {
      if (STORY_CONFIG.photos.memories[0]) STORY_CONFIG.photos.memories[0].image = url;
      this.renderMemoryGallery();
    });

    handleFileInput('input-mem-2-file', (url) => {
      if (STORY_CONFIG.photos.memories[1]) STORY_CONFIG.photos.memories[1].image = url;
      this.renderMemoryGallery();
    });

    handleFileInput('input-mem-3-file', (url) => {
      if (STORY_CONFIG.photos.memories[2]) STORY_CONFIG.photos.memories[2].image = url;
      this.renderMemoryGallery();
    });

    Promise.all(fileReads).then(() => {
      if (fileReads.length > 0) {
        this.savePhotosToStorage();
      }
    });
  }

  loadSavedPhotos() {
    try {
      const savedPhotos = JSON.parse(localStorage.getItem(this.photoStorageKey) || 'null');
      if (!savedPhotos) return;

      if (savedPhotos.myPhoto1) STORY_CONFIG.photos.myPhoto1 = savedPhotos.myPhoto1;
      if (savedPhotos.myPhoto2) STORY_CONFIG.photos.myPhoto2 = savedPhotos.myPhoto2;
      if (savedPhotos.herPhoto) STORY_CONFIG.photos.herPhoto = savedPhotos.herPhoto;
      if (Array.isArray(savedPhotos.memories)) {
        savedPhotos.memories.forEach((image, idx) => {
          if (image && STORY_CONFIG.photos.memories[idx]) {
            STORY_CONFIG.photos.memories[idx].image = image;
          }
        });
      }
    } catch (err) {
      console.warn('Could not load saved story photos:', err);
    }
  }

  savePhotosToStorage() {
    try {
      localStorage.setItem(this.photoStorageKey, JSON.stringify({
        myPhoto1: STORY_CONFIG.photos.myPhoto1,
        myPhoto2: STORY_CONFIG.photos.myPhoto2,
        herPhoto: STORY_CONFIG.photos.herPhoto,
        memories: STORY_CONFIG.photos.memories.map((mem) => mem.image)
      }));
      this.showToast('Photos saved permanently in this browser! ✨');
    } catch (err) {
      console.warn('Could not save story photos:', err);
      this.showToast('Photos applied, but this browser could not store them permanently.');
    }
  }

  resetStory() {
    this.evasionCount = 0;
    document.getElementById('final-question-box').classList.remove('hidden');
    document.getElementById('final-response-yes').classList.add('hidden');
    document.getElementById('final-response-no').classList.add('hidden');
    document.getElementById('game-feedback').classList.add('hidden');
    this.navigateToPage(1);
  }

  // ================= Audio Engine =================
  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;

    if (this.audioEnabled) {
      this.audioIcon.classList.add('hidden');
      this.soundWaves.classList.remove('hidden');
      this.startAmbientSynth();
    } else {
      this.audioIcon.classList.remove('hidden');
      this.soundWaves.classList.add('hidden');
      this.stopAmbientSynth();
    }
  }

  startAmbientSynth() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Create soothing chord oscillator sequence
    const notes = [261.63, 329.63, 392.00, 493.88]; // Cmaj7 notes
    this.synthOscs = notes.map((freq) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      return { osc, gain };
    });
  }

  stopAmbientSynth() {
    if (this.synthOscs) {
      this.synthOscs.forEach(({ osc }) => osc.stop());
      this.synthOscs = null;
    }
  }

  playVictoryChime() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C6 arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + idx * 0.1 + 0.6);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(this.audioCtx.currentTime + idx * 0.1);
      osc.stop(this.audioCtx.currentTime + idx * 0.1 + 0.7);
    });
  }

  // ================= Canvas Background & Hearts =================
  initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Particle Array
    const particles = [];
    const particleCount = Math.min(35, Math.floor(width / 25));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        isHeart: Math.random() > 0.6
      });
    }

    const drawHeart = (x, y, size, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 10, size / 10);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-5, -5, -10, 0, 0, 10);
      ctx.bezierCurveTo(10, 0, 5, -5, 0, 0);
      ctx.fillStyle = `rgba(255, 117, 151, ${opacity})`;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        if (p.isHeart) {
          drawHeart(p.x, p.y, p.radius * 3, p.opacity);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229, 184, 105, ${p.opacity})`;
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  // ================= Canvas Confetti =================
  initConfettiCanvas() {
    this.confettiCanvas = document.getElementById('confetti-canvas');
    this.confettiCtx = this.confettiCanvas.getContext('2d');
  }

  triggerConfetti() {
    const canvas = this.confettiCanvas;
    const ctx = this.confettiCtx;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const confettiPieces = [];
    const colors = ['#e5b869', '#ff6584', '#ff85a2', '#ffffff', '#a855f7'];

    for (let i = 0; i < 120; i++) {
      confettiPieces.push({
        x: width / 2,
        y: height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let frame = 0;
    const animateConfetti = () => {
      ctx.clearRect(0, 0, width, height);

      confettiPieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rotSpeed;
        p.opacity -= 0.008;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frame++;
      if (frame < 160) {
        requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animateConfetti();
  }
}

// Initialize App immediately if DOM is ready, or on DOMContentLoaded
function startStoryApp() {
  if (!window.storyApp) {
    window.storyApp = new StoryApp();
  }
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  startStoryApp();
} else {
  document.addEventListener('DOMContentLoaded', startStoryApp);
}
