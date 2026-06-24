window.addEventListener("scroll", () => {

    // Progress Bar
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    const bar = document.getElementById("progress-bar");
    if (bar) bar.style.width = scrolled + "%";

    // Scroll Spy
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    let current = "";

    sections.forEach(section => {
        const top = window.scrollY;
        const offset = section.offsetTop - 120;
        const height = section.offsetHeight;

        if (top >= offset && top < offset + height) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });

});
