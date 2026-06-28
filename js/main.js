/* =========================================================
AMIR ELFEKY — EXECUTIVE FINANCIAL INTELLIGENCE JS (DEVELOPED)
========================================================= */

// ===== Scroll Progress Bar =====
const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
document.body.appendChild(scrollProgress);

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = progress + "%";
});

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll(".reveal");
const revealOnScroll = () => {
  revealElements.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add("is-visible");
      el.style.setProperty("--i", i);
    }
  });
};
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ===== KPI Progress Animation =====
const kpiBars = document.querySelectorAll(".kpi-card .bar span");
window.addEventListener("load", () => {
  kpiBars.forEach(bar => {
    bar.style.width = "100%";
  });
});

// ===== Audit Seal Animation =====
const sealStamp = document.querySelector(".seal-stamp");
window.addEventListener("load", () => {
  if(sealStamp){
    setTimeout(() => {
      sealStamp.classList.add("is-visible");
    }, 600);
  }
});

// ===== Navbar Shadow on Scroll =====
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if(window.scrollY > 50){
    navbar.style.boxShadow = "0 2px 12px rgba(0,0,0,0.25)";
  } else {
    navbar.style.boxShadow = "none";
  }
});

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll(".navigation a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);
    if(target){
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: "smooth"
      });
    }
  });
});

// ===== Hero Badge Pulse =====
const heroBadge = document.querySelector(".hero-badge");
if(heroBadge){
  heroBadge.addEventListener("mouseenter", () => {
    heroBadge.style.transform = "scale(1.05)";
  });
  heroBadge.addEventListener("mouseleave", () => {
    heroBadge.style.transform = "scale(1)";
  });
}
