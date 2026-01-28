document.addEventListener("DOMContentLoaded", () => {

    const modList = document.getElementById("modList");
    const hero = document.getElementById("hero");
    const heroText = document.getElementById("heroText");
    const carousel = document.getElementById("carousel");
    const noResults = document.getElementById("noResults");

    const statTotal = document.getElementById("statTotal");
    const statAddon = document.getElementById("statAddon");
    const statMap = document.getElementById("statMap");
    const statTexture = document.getElementById("statTexture");
    const statShader = document.getElementById("statShader");

    const heroTexts = [
        "Mods optimizados y testeados",
        "Compatibles con Java y Bedrock",
        "Actualizados a las últimas versiones",
        "Instalación rápida y segura"
    ];

    let heroIndex = 0;
    setInterval(() => {
        heroText.textContent = heroTexts[heroIndex];
        heroIndex = (heroIndex + 1) % heroTexts.length;
    }, 3000);

    let allMods = [];
    let filteredMods = [];
    let featuredMods = [];

    let currentPage = 1;
    const ITEMS_PER_PAGE = 12;
    let carouselIndex = 0;

    function showSkeleton() {
        modList.innerHTML = "";
        for (let i = 0; i < 8; i++) {
            const s = document.createElement("div");
            s.className = "skeleton";
            modList.appendChild(s);
        }
    }

    async function loadMods() {
        try {
            showSkeleton();

            const res = await fetch("/data/mod.json");
            allMods = await res.json();

            featuredMods = allMods.filter(m => m.topgame === true);

            initCarousel();
            applyFilters();

            if (featuredMods[0]?.background) {
                updateHeroBackground();
            }

        } catch (err) {
            console.error(err);
        }
    }

    function applyFilters() {
        filteredMods = [...allMods];
        currentPage = 1;

        updateStats(filteredMods);
        renderPage();
    }

    function renderPage() {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        renderMods(filteredMods.slice(start, end));
        renderPagination();
    }

    function renderMods(mods) {
        modList.innerHTML = "";

        if (mods.length === 0) {
            noResults.classList.remove("hidden");
            return;
        }

        noResults.classList.add("hidden");

        mods.forEach(mod => {
            const div = document.createElement("a");
            div.href = `details.html?id=${mod.id}`;
            div.className = "game-card";

            div.innerHTML = `
                <img src="${mod.background}" class="game-cover" alt="${mod.title}">
                <h3 class="game-title">${mod.title}</h3>
            `;

            modList.appendChild(div);
        });
    }

    function updateStats(list) {
        statTotal.textContent = `Mods: ${list.length}`;
        statAddon.textContent = `Addon: ${list.filter(m => m.type === "addon").length}`;
        statMap.textContent = `Mapas: ${list.filter(m => m.type === "map").length}`;
        statTexture.textContent = `Textura: ${list.filter(m => m.type === "texture").length}`;
        statShader.textContent = `Shader: ${list.filter(m => m.type === "shader").length}`;
    }

    function renderPagination() {
        const container = document.getElementById("pagination");
        container.innerHTML = "";

        const totalPages = Math.ceil(filteredMods.length / ITEMS_PER_PAGE);
        if (totalPages <= 1) return;

        if (currentPage > 1) {
            container.appendChild(pageButton("←", currentPage - 1));
        }

        for (let i = 1; i <= totalPages; i++) {
            container.appendChild(pageButton(i, i));
        }

        if (currentPage < totalPages) {
            container.appendChild(pageButton("→", currentPage + 1));
        }
    }

    function pageButton(text, page) {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.className = "page-btn";
        if (page === currentPage) btn.classList.add("active");

        btn.onclick = () => {
            currentPage = page;
            renderPage();
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
        return btn;
    }

    let carouselTimer = null;

    function initCarousel() {
        if (featuredMods.length < 1) return;
        buildCarousel(true);
        carouselTimer = setInterval(nextCarousel, 5000);
    }

    function nextCarousel() {
        carouselIndex = (carouselIndex + 1) % featuredMods.length;
        buildCarousel();
        updateHeroBackground();
    }

    function buildCarousel(first = false) {
        carousel.innerHTML = "";

        const indexes = [
            (carouselIndex - 1 + featuredMods.length) % featuredMods.length,
            carouselIndex,
            (carouselIndex + 1) % featuredMods.length
        ];

        indexes.forEach((idx, pos) => {
            const m = featuredMods[idx];

            const card = document.createElement("a");
            card.href = `details.html?id=${m.id}`;
            card.className = "carousel-card";

            if (pos === 1) card.classList.add("carousel-center");
            else card.classList.add("carousel-side");

            card.innerHTML = `
                <img src="${m.background}" alt="${m.title}">
                <span class="carousel-title">${m.title}</span>
            `;

            card.style.opacity = first ? "1" : "0";
            requestAnimationFrame(() => card.style.opacity = "1");

            carousel.appendChild(card);
        });
    }

    function updateHeroBackground() {

        // EN PC NO HACER NADA
        if (window.innerWidth >= 1100) return;

        const img = featuredMods[carouselIndex]?.background;
        if (!img) return;

        hero.style.setProperty("--hero-bg", `url(${img})`);
        hero.classList.add("fade");

        hero.style.backgroundImage = `url(${img})`;

        setTimeout(() => hero.classList.remove("fade"), 600);
    }

    carousel.addEventListener("mouseenter", () => clearInterval(carouselTimer));
    carousel.addEventListener("mouseleave", () => carouselTimer = setInterval(nextCarousel, 5000));

    loadMods();
});
