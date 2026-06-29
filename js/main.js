/* =========================================================
   AMIR ELFEKY — site interactions
   ========================================================= */
 
document.addEventListener('DOMContentLoaded', () => {
 
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
 
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  // Scroll progress bar
  const progress = document.getElementById('scrollProgress');
  if (progress) {
    const updateProgress = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      progress.style.width = scrolled + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }
 
  // Generic scroll-reveal for any element with .reveal or .seal-stamp
  const revealEls = document.querySelectorAll('.reveal, .seal-stamp');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealEls.forEach(el => revealIO.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }
 
  // KPI bars fill to their data-width when scrolled into view
  const kpiBars = document.querySelectorAll('.kpi-card .bar span[data-width]');
  if (kpiBars.length) {
    const fillBar = (el) => { el.style.width = prefersReduced ? el.dataset.width + '%' : '0%'; requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = el.dataset.width + '%'; })); };
    if ('IntersectionObserver' in window) {
      const kpiIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { fillBar(entry.target); kpiIO.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      kpiBars.forEach(b => kpiIO.observe(b));
    } else {
      kpiBars.forEach(b => b.style.width = b.dataset.width + '%');
    }
  }
 
  // Scrollspy: highlight the nav link for the section currently in view
  const navLinks = document.querySelectorAll('.navigation a[href^="#"]');
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spyIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = document.querySelector(`.navigation a[href="#${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(s => spyIO.observe(s));
  }
 
  // Staggered hero entrance for a smoother first-load feel
  const heroEntrance = document.querySelectorAll('.hero-content > *');
  if (heroEntrance.length && !prefersReduced) {
    heroEntrance.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      el.style.transitionDelay = (i * 90) + 'ms';
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      heroEntrance.forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    }));
  }
 
  // Animated counters (hero metrics), respects reduced-motion
  const counters = document.querySelectorAll('[data-count]');
 
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    if (prefersReduced || isNaN(target)) { el.textContent = target; return; }
    const duration = 900;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
 
  if ('IntersectionObserver' in window && counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => io.observe(c));
  } else {
    counters.forEach(c => c.textContent = c.dataset.count);
  }
 
  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navigation = document.querySelector('.navigation');
  if (navToggle && navigation) {
    navToggle.addEventListener('click', () => {
      const isOpen = navigation.classList.contains('is-open');
      navigation.classList.toggle('is-open');
      navigation.style.display = isOpen ? 'none' : 'flex';
      navigation.style.flexDirection = 'column';
      navigation.style.position = 'absolute';
      navigation.style.top = '100%';
      navigation.style.left = '0';
      navigation.style.right = '0';
      navigation.style.background = 'var(--ink)';
      navigation.style.padding = '16px 28px';
      navigation.style.borderTop = '1px solid var(--line)';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
    });
 
    // Close mobile menu after a link is tapped
    navigation.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 980) {
          navigation.style.display = 'none';
          navigation.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
 
  // Contact form: client-side validation + mailto fallback
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 
      if (!name || !emailOk || !message) {
        status.textContent = 'Please fill in your name, a valid email, and a message.';
        status.className = 'form-status err';
        return;
      }
 
      const subject = encodeURIComponent('New consultation request from ' + name);
      const body = encodeURIComponent(message + '\n\nReply to: ' + email);
      window.location.href = `mailto:amir.elfeky.finance@outlook.com?subject=${subject}&body=${body}`;
 
      status.textContent = 'Opening your email client to send the request…';
      status.className = 'form-status ok';
    });
  }
});
 
