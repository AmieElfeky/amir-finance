

/* =========================================================
AMIR ELFEKY — site interactions
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
// Confirm JS is running before enabling any hide-then-reveal animation.
// Until this class is present, .reveal / .seal-stamp stay visible via
// plain CSS — so content can never get stuck invisible on a slow or
// flaky mobile connection.
document.documentElement.classList.add('js-ready');
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
}, 1200);
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
// Animated counters — supports integers, decimals, and custom suffixes.
// Hero counters fire immediately (above the fold).
// Platform KPI counters fire when scrolled into view.
const animateCounter = (el) => {
if (el.dataset.counted === 'true') return;
el.dataset.counted = 'true';
const target = parseFloat(el.dataset.count);
const suffix = el.dataset.suffix || '';
const prefix = el.dataset.prefix || '';
const decimals = parseInt(el.dataset.decimals || '0', 10);
if (prefersReduced || isNaN(target)) {
el.textContent = prefix + target.toFixed(decimals) + suffix; return;
}
const duration = 1100;
const startTime = performance.now();
const step = (now) => {
const progress = Math.min((now - startTime) / duration, 1);
const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
el.textContent = prefix + (eased * target).toFixed(decimals) + suffix;
if (progress < 1) requestAnimationFrame(step);
else el.textContent = prefix + target.toFixed(decimals) + suffix;
};
requestAnimationFrame(step);
};
const allCounters = document.querySelectorAll('[data-count]');
// Hero counters: fire immediately (they're above the fold)
document.querySelectorAll('.hero [data-count]').forEach(c => animateCounter(c));
// All other counters: fire when scrolled into view
const scrollCounters = document.querySelectorAll('[data-count]:not(.hero [data-count])');
if ('IntersectionObserver' in window && scrollCounters.length) {
const cntIO = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) { animateCounter(entry.target); cntIO.unobserve(entry.target); }
});
}, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
scrollCounters.forEach(c => cntIO.observe(c));
} else {
scrollCounters.forEach(c => animateCounter(c));
}
// Safety net: no counter can ever stay stuck at its default HTML value.
// Force-resolve anything left unanimated after 2 seconds, regardless of
// why the observer didn't fire (edge-case timing, anchor-link jumps, etc).
window.setTimeout(() => {
allCounters.forEach(c => animateCounter(c));
}, 2000);
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
// Contact form → WhatsApp redirect
// Builds a pre-filled message from the form fields and opens WhatsApp directly.
const WA_NUMBER = '201015555880';
const isArabic = document.documentElement.lang === 'ar';
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
status.textContent = isArabic
? 'من فضلك أدخل اسمك وبريدك الإلكتروني الصحيح ورسالتك.'
: 'Please fill in your name, a valid email, and a message.';
status.className = 'form-status err';
return;
}
const waText = isArabic
? `مرحبًا،\nالاسم: ${name}\nالبريد الإلكتروني: ${email}\n\nالرسالة:\n${message}`
: `Hello,\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
const newTab = window.open(waUrl, '_blank');
if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
// Popup was blocked by the browser — fall back to same-tab navigation
// and show a manual link so the message is never lost.
status.innerHTML = (isArabic
? 'المتصفح منع فتح نافذة جديدة. '
: 'Your browser blocked the popup. ') +
`<a href="${waUrl}" target="_blank" rel="noopener" style="color:var(--gold-soft);text-decoration:underline;">` +
(isArabic ? 'اضغط هنا لإرسال الرسالة عبر واتساب' : 'Click here to send via WhatsApp') +
'</a>';
status.className = 'form-status err';
} else {
status.textContent = isArabic
? 'جاري فتح واتساب لإرسال رسالتك...'
: 'Opening WhatsApp to send your message…';
status.className = 'form-status ok';
}
});
}
});
