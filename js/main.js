/**
 * AL HABIB WORLD TRAVEL & TOURS
 * Core Interactive Scripts, Currency Engine & Umrah Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Language Engine
  let currentLang = localStorage.getItem('alhabib_lang') || 'ur';
  let currentCurrency = localStorage.getItem('alhabib_currency') || 'PKR';

  // Currency Conversion Rates (Base: PKR)
  const currencyRates = {
    PKR: { rate: 1, symbol: 'PKR ', suffix: ' روپے' },
    USD: { rate: 1 / 280, symbol: '$', suffix: ' USD' },
    AED: { rate: 1 / 76, symbol: 'AED ', suffix: ' درہم' },
    SAR: { rate: 1 / 74.5, symbol: 'SAR ', suffix: ' ریال' }
  };

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('alhabib_lang', lang);
    const html = document.documentElement;
    const body = document.body;
    
    if (lang === 'ur') {
      html.setAttribute('lang', 'ur');
      html.setAttribute('dir', 'rtl');
      body.classList.add('rtl-mode');
    } else {
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
      body.classList.remove('rtl-mode');
    }

    document.querySelectorAll('.lang-btn-text').forEach(el => {
      el.textContent = lang === 'ur' ? 'English' : 'اردو';
    });

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });

    // Recalculate Umrah estimator in current language
    calculateUmrahCost();
  }

  // Bind language toggle button
  document.querySelectorAll('.lang-switch-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = currentLang === 'ur' ? 'en' : 'ur';
      applyLanguage(newLang);
    });
  });

  // Currency Selector
  const currencySelect = document.getElementById('currencySelector');
  if (currencySelect) {
    currencySelect.value = currentCurrency;
    currencySelect.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      localStorage.setItem('alhabib_currency', currentCurrency);
      calculateUmrahCost();
      updateTourCardCurrencies();
    });
  }

  function formatPrice(pkrAmount) {
    const info = currencyRates[currentCurrency] || currencyRates.PKR;
    const converted = Math.round(pkrAmount * info.rate);
    const formatted = converted.toLocaleString();
    if (currentLang === 'ur') {
      return `${formatted} ${info.suffix}`;
    } else {
      return `${info.symbol}${formatted}`;
    }
  }

  function updateTourCardCurrencies() {
    // Updates package cards if tagged with data-base-price
    document.querySelectorAll('[data-base-price]').forEach(el => {
      const base = parseFloat(el.getAttribute('data-base-price'));
      if (!isNaN(base)) {
        el.textContent = formatPrice(base);
      }
    });
  }

  // 2. Interactive Umrah Calculator
  const calcTier = document.getElementById('calcTier');
  const calcDays = document.getElementById('calcDays');
  const calcRoom = document.getElementById('calcRoom');
  const calcPersons = document.getElementById('calcPersons');
  const calcTotalDisplay = document.getElementById('calcTotalDisplay');
  const calcPerPersonDisplay = document.getElementById('calcPerPersonDisplay');
  const calcWhatsappBtn = document.getElementById('calcWhatsappBtn');

  function calculateUmrahCost() {
    if (!calcTier || !calcDays || !calcRoom || !calcPersons) return;

    const tier = calcTier.value; // economy, star4, vip5
    const days = parseInt(calcDays.value) || 14;
    const room = calcRoom.value; // quad, triple, double, single
    const persons = parseInt(calcPersons.value) || 1;

    // Base rates per person per day in PKR
    let baseDailyRate = 8000;
    if (tier === 'star4') baseDailyRate = 14000;
    if (tier === 'vip5') baseDailyRate = 26000;

    // Room multiplier
    let roomMultiplier = 1.0; // quad
    if (room === 'triple') roomMultiplier = 1.15;
    if (room === 'double') roomMultiplier = 1.35;
    if (room === 'single') roomMultiplier = 1.85;

    // Fixed Air Ticket + Visa + Transport cost per person
    let fixedCosts = 135000; // ticket + visa + insurance + ziyarat
    if (tier === 'star4') fixedCosts = 160000;
    if (tier === 'vip5') fixedCosts = 220000;

    const perPersonPKR = Math.round((baseDailyRate * (days - 1) * roomMultiplier) + fixedCosts);
    const totalPKR = perPersonPKR * persons;

    if (calcTotalDisplay) {
      calcTotalDisplay.textContent = formatPrice(totalPKR);
    }
    if (calcPerPersonDisplay) {
      calcPerPersonDisplay.textContent = formatPrice(perPersonPKR);
    }

    if (calcWhatsappBtn) {
      const msg = `Assalam-o-Alaikum! I calculated an Umrah package on your website:%0A- Package: ${tier.toUpperCase()}%0A- Duration: ${days} Days%0A- Room: ${room.toUpperCase()}%0A- Persons: ${persons}%0AEstimated: ${formatPrice(totalPKR)}%0APlease provide official final booking confirmation.`;
      calcWhatsappBtn.href = `https://wa.me/923001234567?text=${msg}`;
    }
  }

  [calcTier, calcDays, calcRoom, calcPersons].forEach(elem => {
    elem?.addEventListener('change', calculateUmrahCost);
    elem?.addEventListener('input', calculateUmrahCost);
  });

  // 3. Dynamic Hero Background Carousel
  const heroSection = document.getElementById('home');
  const heroBackgrounds = [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80', // Makkah
    'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1920&q=80', // Hunza
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80', // Dubai
    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=80'  // Turkey
  ];
  let currentBgIndex = 0;

  function cycleHeroBg() {
    if (!heroSection) return;
    currentBgIndex = (currentBgIndex + 1) % heroBackgrounds.length;
    const nextImg = new Image();
    nextImg.src = heroBackgrounds[currentBgIndex];
    nextImg.onload = () => {
      heroSection.style.backgroundImage = `linear-gradient(135deg, rgba(6, 21, 40, 0.88) 0%, rgba(11, 37, 69, 0.82) 100%), url('${heroBackgrounds[currentBgIndex]}')`;
    };
  }
  setInterval(cycleHeroBg, 7000);

  // 4. Promo Flash Deal Countdown Timer (Ends in 14 days)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 14);

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const dEl = document.getElementById('cdDays');
      const hEl = document.getElementById('cdHours');
      const mEl = document.getElementById('cdMins');
      const sEl = document.getElementById('cdSecs');

      if (dEl) dEl.textContent = days.toString().padStart(2, '0');
      if (hEl) hEl.textContent = hours.toString().padStart(2, '0');
      if (mEl) mEl.textContent = mins.toString().padStart(2, '0');
      if (sEl) sEl.textContent = secs.toString().padStart(2, '0');
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 5. WhatsApp Concierge Chat Widget Toggle
  const waTrigger = document.getElementById('waTriggerBtn');
  const waChatbox = document.getElementById('waChatbox');
  const waClose = document.getElementById('waCloseBtn');

  if (waTrigger && waChatbox) {
    waTrigger.addEventListener('click', () => {
      waChatbox.classList.toggle('open');
      const badge = document.querySelector('.whatsapp-unread-badge');
      if (badge) badge.style.display = 'none';
    });

    waClose?.addEventListener('click', () => {
      waChatbox.classList.remove('open');
    });
  }

  // 6. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // 7. Sticky Navbar & Back to Top
  const navbar = document.querySelector('.navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar?.classList.add('scrolled');
      backToTop?.classList.add('show');
    } else {
      navbar?.classList.remove('scrolled');
      backToTop?.classList.remove('show');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 8. Hero Booking Tabs Switcher
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 9. Tour Package Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const tourCards = document.querySelectorAll('.tour-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      tourCards.forEach(card => {
        if (filterVal === 'all' || card.getAttribute('data-category') === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 10. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 11. Toast Message Helper
  function showToast(msg) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-check-circle" style="color: #22c55e; font-size: 1.3rem;"></i> <span>${msg}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // 12. Booking Form Submission
  const inquiryForm = document.getElementById('travelInquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = translations[currentLang].alert_success;
      showToast(msg);
      inquiryForm.reset();
    });
  }

  // 13. Search Forms in Tabs
  document.querySelectorAll('.search-form-grid').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successText = currentLang === 'ur' 
        ? 'شکریہ! آپ کی تلاش کی تفصیلات موصول ہو چکی ہیں۔ ہماری ٹیم جلد آپ کو سستے ترین کرایوں کے ساتھ واٹس ایپ پر رابطہ کرے گی۔'
        : 'Thank you! Your search criteria have been received. Our team will contact you shortly with the lowest fares.';
      showToast(successText);
    });
  });

  // 14. Package Modal Trigger
  const modalOverlay = document.getElementById('packageModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalPackageTitle');

  document.querySelectorAll('.open-pkg-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pkgName = btn.getAttribute('data-package') || 'Al Habib Travel Package';
      if (modalTitle) modalTitle.textContent = pkgName;
      if (modalOverlay) modalOverlay.classList.add('open');
    });
  });

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
      }
    });
  }

  // 15. Stats Counter Animation on Scroll
  let animated = false;
  const statsSection = document.querySelector('.stats-bar');

  function animateCounters() {
    if (!statsSection || animated) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight - 50) {
      animated = true;
      document.querySelectorAll('.stat-number').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = target / 50;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.innerHTML = `${target.toLocaleString()}<span>${suffix}</span>`;
            clearInterval(timer);
          } else {
            counter.innerHTML = `${Math.ceil(current).toLocaleString()}<span>${suffix}</span>`;
          }
        }, 30);
      });
    }
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters();

  // Initial setup
  applyLanguage(currentLang);
  calculateUmrahCost();
  updateTourCardCurrencies();
});
