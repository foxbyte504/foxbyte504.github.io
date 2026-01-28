document.addEventListener("DOMContentLoaded", () => {

    /* ===================== ELEMENTOS ===================== */
    const gameList = document.getElementById("gameList");
    const hero = document.getElementById("hero");
    const heroText = document.getElementById("heroText");
    const carousel = document.getElementById("carousel");
    const noResults = document.getElementById("noResults");

    const filterPlatform = document.getElementById("filterPlatform");
    const searchInput = document.getElementById("searchInput");
    const filterSize = document.getElementById("filterSize");
    const filterToggle = document.getElementById("filterToggle");
    const filterContainer = document.getElementById("filterContainer");
    const sizeMin = document.getElementById("sizeMin");
    const sizeMax = document.getElementById("sizeMax");

    const statTotal = document.getElementById("statTotal");
    const statPC = document.getElementById("statPC");
    const statAndroid = document.getElementById("statAndroid");

    /* ===================== HERO TEXTO ===================== */
    const heroTexts = [
        "Más de 100 juegos disponibles",
        "Juegos livianos para PC y Android",
        "Descargas rápidas y seguras",
        "Testeados por VirusTotal"
    ];

    let heroIndex = 0;
    setInterval(() => {
        heroText.textContent = heroTexts[heroIndex];
        heroIndex = (heroIndex + 1) % heroTexts.length;
    }, 3000);

    /* ===================== ESTADO ===================== */
    let allGames = [];
    let filteredGames = [];
    let featuredGames = [];

    let currentPage = 1;
    const ITEMS_PER_PAGE = 12;

    let carouselIndex = 0;


    /* ===================== FILTRO DESDE URL ===================== */
    const urlParams = new URLSearchParams(window.location.search);
    const platformFromUrl = urlParams.get("platform");

    /* ===================== FILTROS UI ===================== */
    filterToggle.addEventListener("click", () => {
        filterContainer.classList.toggle("filters-box-expanded");
        filterContainer.classList.toggle("filters-box-collapsed");
    });

    /* ===================== SKELETON ===================== */
    function showSkeleton() {
        gameList.innerHTML = "";
        for (let i = 0; i < 8; i++) {
            const s = document.createElement("div");
            s.className = "skeleton";
            gameList.appendChild(s);
        }
    }

    /* ===================== LOAD JSON ===================== */
    async function loadGames() {
        try {
            showSkeleton();

            const res = await fetch("/data/game.json");
            allGames = await res.json();

            featuredGames = allGames.filter(g => g.topgame === true);

            // aplicar filtro desde URL si existe
            if (platformFromUrl && ["computer", "android"].includes(platformFromUrl)) {
                filterPlatform.value = platformFromUrl;
            }

            initCarousel();
            applyFilters();

            if (featuredGames[0]?.background) {
                updateHeroBackground();
            }

            filterPlatform.addEventListener("change", applyFilters);
            searchInput.addEventListener("input", applyFilters);
            filterSize.addEventListener("change", applyFilters);
            sizeMin.addEventListener("input", applyFilters);
            sizeMax.addEventListener("input", applyFilters);

        } catch (err) {
            console.error("Error cargando JSON:", err);
        }
    }

    /* ===================== TAMAÑOS ===================== */
    function parseSizeToMB(size) {
        if (!size) return 0;
        size = size.toUpperCase();
        if (size.includes("GB")) return parseFloat(size) * 1024;
        if (size.includes("MB")) return parseFloat(size);
        return parseFloat(size) || 0;
    }

    function inputToMB(v) {
        if (!v) return null;
        v = v.toUpperCase();
        if (v.includes("GB")) return parseFloat(v) * 1024;
        if (v.includes("MB")) return parseFloat(v);
        return parseFloat(v);
    }

    /* ===================== FILTRADO ===================== */
    function applyFilters() {
        let list = [...allGames];

        const platform = filterPlatform.value;
        const search = searchInput.value.toLowerCase();
        const preset = filterSize.value;

        const minMB = inputToMB(sizeMin.value);
        const maxMB = inputToMB(sizeMax.value);

        if (platform !== "all") {
            list = list.filter(g => g.platform === platform);
        }

        if (search) {
            list = list.filter(g => g.title.toLowerCase().includes(search));
        }

        list = list.filter(g => {
            const mb = parseSizeToMB(g.size);
            if (preset === "small") return mb <= 1000;
            if (preset === "medium") return mb > 1000 && mb <= 5000;
            if (preset === "big") return mb > 5000;
            return true;
        });

        list = list.filter(g => {
            const mb = parseSizeToMB(g.size);
            if (minMB !== null && mb < minMB) return false;
            if (maxMB !== null && mb > maxMB) return false;
            return true;
        });

        filteredGames = list;
        currentPage = 1;

        updateStats(list);
        renderPage();
    }

    /* ===================== RENDER ===================== */
    function renderPage() {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageGames = filteredGames.slice(start, end);

        renderGames(pageGames);
        renderPagination();
    }

    function renderGames(games) {
        gameList.innerHTML = "";

        if (games.length === 0) {
            noResults.classList.remove("hidden");
            return;
        }

        noResults.classList.add("hidden");

        games.forEach(game => {
            const cover = game.background || "/img/default.jpg";

            const div = document.createElement("a");
            div.href = `details.html?id=${game.id}`;
            div.className = "game-card";

            div.innerHTML = `
                <img src="${cover}" class="game-cover" alt="${game.title}">
                <div class="game-title-row">
                    <img src="${game.icon}" class="game-icon" alt="${game.title} icon">
                    <h3 class="game-title">${game.title}</h3>
                </div>
            `;

            gameList.appendChild(div);
        });
    }

    /* ===================== STATS ===================== */
    function updateStats(list) {
        statTotal.textContent = `Juegos: ${list.length}`;
        statPC.textContent = `PC: ${list.filter(g => g.platform === "computer").length}`;
        statAndroid.textContent = `Android: ${list.filter(g => g.platform === "android").length}`;
    }

    /* ===================== PAGINACIÓN ===================== */
    function renderPagination() {
        const container = document.getElementById("pagination");
        container.innerHTML = "";

        const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
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

    /* ===================== CARRUSEL ===================== */
    let carouselTimer = null;

    function initCarousel() {
        if (featuredGames.length < 1) return;

        buildCarousel(true);

        carouselTimer = setInterval(nextCarousel, 5000);
    }

    function nextCarousel() {
        carouselIndex = (carouselIndex + 1) % featuredGames.length;
        buildCarousel();
        updateHeroBackground();
    }

    function buildCarousel(first = false) {
        carousel.innerHTML = "";

        const indexes = [
            (carouselIndex - 1 + featuredGames.length) % featuredGames.length,
            carouselIndex,
            (carouselIndex + 1) % featuredGames.length
        ];

        indexes.forEach((idx, pos) => {
            const g = featuredGames[idx];

            const card = document.createElement("a");
            card.href = `details.html?id=${g.id}`;
            card.className = "carousel-card";

            if (pos === 1) card.classList.add("carousel-center");
            else card.classList.add("carousel-side");

            card.innerHTML = `
                <img src="${g.background}" alt="${g.title}">
                <span class="carousel-title">${g.title}</span>
            `;

            // animación de entrada
            card.style.opacity = first ? "1" : "0";
            requestAnimationFrame(() => {
                card.style.opacity = "1";
            });

            carousel.appendChild(card);
        });
    }

    /* ===================== HERO BACKGROUND SUAVE ===================== */
    function updateHeroBackground() {
        const img = featuredGames[carouselIndex]?.background;
        if (!img) return;

        hero.style.setProperty("--hero-bg", `url(${img})`);

        // solo mobile usa fade + background directo
        if (window.innerWidth < 1100) {
            hero.classList.add("fade");
            hero.style.backgroundImage = `url(${img})`;

            setTimeout(() => {
                hero.classList.remove("fade");
            }, 600);
        }
    }

    window.addEventListener("resize", () => {
    buildCarousel();
    });

    carousel.addEventListener("mouseenter", () => {
        clearInterval(carouselTimer);
    });

    carousel.addEventListener("mouseleave", () => {
        carouselTimer = setInterval(nextCarousel, 5000);
    });

    /* ===================== INIT ===================== */
    loadGames();
});
