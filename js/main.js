document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1) Progress Bar
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
       2) Scroll Spy (Active Nav)
    ========================== */
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {

        let current = "";

        document.querySelectorAll("section").forEach(section => {
            const top = window.scrollY;
            const offset = section.offsetTop - 120;
            const height = section.offsetHeight;

            if (top >= offset && top < offset + height) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });

    });


    /* =========================
       3) Reveal Animation (YOUR CODE - FIXED)
    ========================== */
    const sections = document.querySelectorAll("section");

    const revealObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }

        });

    }, {
        threshold: 0.2
    });

    sections.forEach(section => {
        revealObserver.observe(section);
    });

});
