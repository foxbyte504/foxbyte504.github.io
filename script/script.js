/* =========================
   ICONOS SUPERIORES
   ========================= */
document.getElementById("icon-a").onclick = () => window.location.href = "/page/moder.html";
document.getElementById("icon-b").onclick = () => alert("player.html aún no existe");
// PC → filtra juegos de PC
document.getElementById("icon-c").onclick = () => {
    window.location.href = "/page/game.html?platform=computer";};
// Android → filtra juegos de Android
document.getElementById("icon-d").onclick = () => {
    window.location.href = "/page/game.html?platform=android";};


/* ===================== FILTRO DESDE URL ===================== */
const urlParams = new URLSearchParams(window.location.search);
const platformFromUrl = urlParams.get("platform");


/* =========================
   INIT
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
    cargarUltimos();
    loadGamesCarousel();
    loadModsCarousel();
});


/* =========================
   SIDEBAR
   ========================= */
const hamburger = document.getElementById("hamburger");
const overlay = document.getElementById("overlay");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
});

overlay.addEventListener("click", closeAll);
closeSidebar.addEventListener("click", closeAll);

function closeAll() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}


/* =========================
   CARRUSEL DE PORTADA
   ========================= */
let index = 0;
const items = document.querySelectorAll(".carousel-item");

function showCarousel() {
    items.forEach((it, i) => it.style.opacity = i === index ? 1 : 0);
    index = (index + 1) % items.length;
}

setInterval(showCarousel, 3500);
showCarousel();


/* =========================
   ÚLTIMOS AÑADIDOS (GRID)
   ========================= */
async function cargarUltimos() {
    const cont = document.getElementById("last-container");
    cont.innerHTML = "";

    try {
        const games = await fetch("/data/game.json").then(r => r.json());

        const ultimos = games
            .slice()
            .sort((a, b) => b.id.localeCompare(a.id))
            .slice(0, 6);

        ultimos.forEach(item => {
            const div = document.createElement("div");
            div.className = "card";
            div.innerHTML = `
                <img src="${item.background}" alt="${item.title}">
                <h3>${item.title}</h3>
            `;
            div.onclick = () => window.location.href = `details.html?id=${item.id}`;
            cont.appendChild(div);
        });

    } catch (e) {
        cont.innerHTML = "<p>No se pudo cargar el contenido.</p>";
        console.error(e);
    }
}


/* =========================
   UTILIDAD CARRUSEL HORIZONTAL
   ========================= */
function buildHorizontalCarousel(containerId, title, itemsHtml) {
    const id = "carousel_" + Math.random().toString(36).substr(2, 9);
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `
        <div class="related-carousel">
            <div class="related-header">
                ${title ? `<h3>${title}</h3>` : ""}
                <div class="carousel-arrows">
                    <button class="arrow left" data-target="${id}">‹</button>
                    <button class="arrow right" data-target="${id}">›</button>
                </div>
            </div>

            <div class="carousel-viewport">
                <div class="carousel-row" id="${id}">
                    ${itemsHtml}
                </div>
            </div>
        </div>
    `;
}

/* =========================
   FLECHAS DEL CARRUSEL
   ========================= */
document.addEventListener("click", e => {
    const btn = e.target.closest(".arrow");
    if (!btn) return;

    const row = document.getElementById(btn.dataset.target);
    if (!row || !row.children.length) return;

    const step = row.children[0].offsetWidth + 12;

    row.scrollBy({
        left: btn.classList.contains("right") ? step : -step,
        behavior: "smooth"
    });
});


/* =========================
   JUEGOS DESTACADOS (20)
   ========================= */
async function loadGamesCarousel() {
    try {
        const games = await fetch("/data/game.json").then(r => r.json());

        const html = games
            .slice(0, 20)
            .map(game => `
                <a href="page/details.html?id=${game.id}" class="game-card">
                    <img src="${game.background || "/img/default.jpg"}" class="game-cover">
                    <div class="game-title-row">
                        <img src="${game.icon}" class="game-icon">
                        <h3 class="game-title">${game.title}</h3>
                    </div>
                </a>
            `).join("");

        buildHorizontalCarousel("games-carousel", "Añadidos recientemente", html);

    } catch (e) {
        console.error("Error cargando juegos", e);
    }
}


/* =========================
   MODS DESTACADOS (20)
   ========================= */
async function loadModsCarousel() {
    try {
        const mods = await fetch("/data/mod.json").then(r => r.json());

        const html = mods
            .slice(0, 20)
            .map(m => `
                <a href="page/details.html?id=${m.id}" class="game-card">
                    <img src="${m.background || "/img/default.jpg"}" class="game-cover">
                    <span class="game-title">${m.title}</span>
                </a>
            `).join("");

        buildHorizontalCarousel("mods-carousel", "", html);

    } catch (e) {
        console.error("Error cargando mods", e);
    }
}

