document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1) Progress Bar
    ========================== */
    window.addEventListener("scroll", () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        const bar = document.getElementById("progress-bar");
        if (bar) bar.style.width = scrolled + "%";
    });


    /* =========================
       2) Active Section (Scroll Spy)
    ========================== */
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {

        let currentSection = "";

        sections.forEach(section => {
            const top = window.scrollY;
            const offset = section.offsetTop - 120;
            const height = section.offsetHeight;

            if (top >= offset && top < offset + height) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("active");
            }
        });
    });


    /* =========================
       3) Smooth Reveal Animation
    ========================== */
    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });

    }, {
        threshold: 0.15
    });

    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(25px)";
        section.style.transition = "0.8s ease";
        observer.observe(section);
    });


    /* =========================
       4) Button Micro Interaction
    ========================== */
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            btn.style.transform = "translateY(-3px) scale(1.02)";
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "translateY(0) scale(1)";
        });
    });

});
