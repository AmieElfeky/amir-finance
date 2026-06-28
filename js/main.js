/* =========================================================
   AMIR ELFEKY — site interactions
   ========================================================= */
 
document.addEventListener('DOMContentLoaded', () => {
 
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
 
  // Animated counters (hero metrics), respects reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
 
