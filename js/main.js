document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1) Progress Bar (Optimized)
    ========================== */
    const progressBar = document.getElementById("progress-bar");

    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        const progress = (scrollTop / scrollHeight) * 100;

        if (progressBar) {
            progressBar.style.width = progress + "%";
        }
    });


    /* =========================
       2) Scroll Spy (Clean Version)
    ========================== */
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    const observerOptions = {
        root: null,
        threshold: 0.4
    };

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");

                navLinks.forEach(link => {
                    link.classList.remove("active");

                    if (link.getAttribute("href") === "#" + id) {
                        link.classList.add("active");
                    }
                });
            }

        });

    }, observerOptions);

    sections.forEach(section => {
        if (section.id) observer.observe(section);
    });


    /* =========================
       3) Smooth Reveal (Improved)
    ========================== */
    const revealObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }

        });

    }, { threshold: 0.12 });

    sections.forEach(section => {

        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition = "0.9s cubic-bezier(0.16, 1, 0.3, 1)";

        revealObserver.observe(section);
    });


    /* =========================
       4) Button Micro Interaction (Stable)
    ========================== */
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(btn => {

        btn.addEventListener("mouseenter", () => {
            btn.style.transform = "translateY(-3px) scale(1.03)";
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "translateY(0) scale(1)";
        });

    });

});
