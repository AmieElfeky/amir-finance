
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
 
  // Generic scroll-reveal for any element with .reveal or .seal-stamp.
  // Mobile fix: tall sections on narrow/short viewports could fail to ever
  // reach the old 18% visibility threshold, leaving content permanently
  // hidden. We use a much lower threshold + generous rootMargin so reveal
  // fires as soon as an element starts entering the viewport, and we add a
  // safety-net timeout that force-reveals anything left over just in case.
  const revealEls = document.querySelectorAll('.reveal, .seal-stamp');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -5% 0px' });
    revealEls.forEach(el => revealIO.observe(el));
 
    // Safety net: guarantee visibility even if the observer never fires
    // (e.g. unusual viewport sizes, fast navigation, edge-case browsers)
    window.setTimeout(() => {
      revealEls.forEach(el => el.classList.add('is-visible'));
    }, 2500);
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
      }, { threshold: 0.15 });
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
          navLinks.forEach(l => { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'true');
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
 
  // Animated counters (hero metrics) — these sit above the fold, so we
  // animate them directly on load instead of waiting on IntersectionObserver,
  // which can be unreliable for content that's already in view on first paint.
  const counters = document.querySelectorAll('[data-count]');
 
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (prefersReduced || isNaN(target)) { el.textContent = target + suffix; return; }
    const duration = 1100;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
 
  counters.forEach(c => animateCounter(c));
 
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
 
  // Contact form: validation, then a real backend if configured, else mailto fallback.
  // To receive submissions directly: paste your Formspree (or any POST-JSON) endpoint
  // below. Example: 'https://formspree.io/f/your-id'. Leave empty to keep using mailto.
  const FORM_ENDPOINT = '';
 
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && status) {
    form.addEventListener('submit', async (e) => {
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
 
      if (FORM_ENDPOINT) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        try {
          const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name, email, message })
          });
          if (res.ok) {
            status.textContent = 'Thank you — your request has been sent. I will be in touch shortly.';
            status.className = 'form-status ok';
            form.reset();
          } else {
            throw new Error('Request failed');
          }
        } catch (err) {
          status.textContent = 'Something went wrong sending the form. Please email directly instead.';
          status.className = 'form-status err';
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
        return;
      }
 
      // Fallback: open the visitor's email client
      const subject = encodeURIComponent('New consultation request from ' + name);
      const body = encodeURIComponent(message + '\n\nReply to: ' + email);
      window.location.href = `mailto:amir.elfeky.finance@outlook.com?subject=${subject}&body=${body}`;
 
      status.textContent = 'Opening your email client to send the request…';
      status.className = 'form-status ok';
    });
  }
});
 
