/* ============================================================
   TRADITIO VENTURES — MAIN JAVASCRIPT
   Animations, Interactions, Scroll Effects
   ============================================================ */

'use strict';

/* ============================================================
   PAGE LOADER
   ============================================================ */
function initLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 1600);
  });
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Scroll behavior
  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link
  const links = nav.querySelectorAll('.nav__link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Hamburger / mobile menu
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   HERO GOLD LINE ANIMATION
   ============================================================ */
function initHeroLine() {
  const line = document.querySelector('.hero__line');
  if (!line) return;

  // Trigger after a short delay so the transition fires
  requestAnimationFrame(() => {
    setTimeout(() => {
      line.classList.add('animate');
    }, 300);
  });
}

/* ============================================================
   GOLD PARTICLES — CANVAS
   ============================================================ */
function initParticles() {
  const canvas = document.querySelector('.hero__canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const PARTICLE_COUNT = window.innerWidth < 768 ? 30 : 60;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25 - 0.1,
        alpha: Math.random() * 0.5 + 0.1,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        alphaSpeed: Math.random() * 0.005 + 0.002,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Update
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.alphaDir * p.alphaSpeed;

      if (p.alpha >= 0.65 || p.alpha <= 0.05) p.alphaDir *= -1;
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
    }, 200);
  });
}

/* ============================================================
   PARALLAX HERO BACKGROUND
   ============================================================ */
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const onScroll = () => {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.3;
    // Apply to the hero background offset
    hero.style.backgroundPositionY = `calc(50% + ${rate}px)`;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   INTERSECTION OBSERVER — SCROLL ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  const options = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================================
   STATS COUNT-UP
   ============================================================ */
function initCountUp() {
  const stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;

  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2200;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      el.textContent = prefix + value.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

/* ============================================================
   STAGGER CHILDREN ANIMATIONS
   ============================================================ */
function initStaggerAnimations() {
  const staggerParents = document.querySelectorAll('[data-stagger]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll(':scope > *');
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.1}s`;
          child.classList.add('visible');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  staggerParents.forEach(el => {
    el.querySelectorAll(':scope > *').forEach(child => {
      child.classList.add('fade-up');
    });
    observer.observe(el);
  });
}

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navH = document.querySelector('.nav')?.offsetHeight || 80;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   FORM INTERACTIONS
   ============================================================ */
function initForm() {
  const form = document.querySelector('.apply-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Received — We\'ll Be In Touch';
    btn.disabled = true;
    btn.style.opacity = '0.8';

    // Show confirmation message
    const msg = document.createElement('p');
    msg.className = 'form-confirm';
    msg.style.cssText = `
      text-align: center;
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 1.1rem;
      color: #C9A84C;
      margin-top: 24px;
      opacity: 0;
      transition: opacity 0.6s ease;
    `;
    msg.textContent = 'Your application has been submitted. We read every one personally and will respond within 5 business days.';
    form.appendChild(msg);

    setTimeout(() => { msg.style.opacity = '1'; }, 100);

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '';
      msg.remove();
      form.reset();
    }, 8000);
  });
}

/* ============================================================
   BUTTON HOVER RIPPLE
   ============================================================ */
function initRipple() {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        left: ${x}px;
        top: ${y}px;
        animation: rippleEffect 0.6s ease-out forwards;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe if not present
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleEffect {
        to { transform: translate(-50%, -50%) scale(80); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ============================================================
   INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNav();
  initHeroLine();
  initParticles();
  initParallax();
  initScrollAnimations();
  initCountUp();
  initStaggerAnimations();
  initSmoothScroll();
  initForm();
  initRipple();
});
