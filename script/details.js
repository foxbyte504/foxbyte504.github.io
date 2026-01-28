document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("contentDetails");
    const id = new URLSearchParams(location.search).get("id");

    if (!id) {
        container.innerHTML = "<p>No se indicó un ID.</p>";
        return;
    }

    // ==================== CARGA JSON ====================
    const sources = [
        "/data/game.json",
        "/data/mod.json"
    ];

    let allItems = [];

    for (const src of sources) {
        try {
            const res = await fetch(src);
            if (!res.ok) continue;
            const json = await res.json();
            if (Array.isArray(json)) allItems.push(...json);
        } catch {}
    }

    const item = allItems.find(i => i.id === id);

    if (!item) {
        container.innerHTML = "<h2>No encontrado</h2>";
        return;
    }

    renderItem(item);
    renderRelated(item, allItems);
});


// =================================================
// RENDER PRINCIPAL
// =================================================
function renderItem(item) {

    const container = document.getElementById("contentDetails");
    const isMod = !!item.filetype;

    const cover = item.background || "/img/default.jpg";
    const icon  = item.icon || cover;

    container.innerHTML = `
        <div class="details-wrapper ${isMod ? "mod-layout" : ""}">

            <img src="${cover}" class="details-cover">

            <div class="details-left">

                <div class="details-header">
                    ${!isMod ? `<img src="${icon}" class="details-icon">` : ""}

                    <div class="title-block">
                        <h2>${item.title}</h2>

                        ${
                            item.download
                                ? `
                                <a href="#"
                                   class="download-btn ${isMod ? "mod-download" : ""} lv-download"
                                   data-download="${item.download}">
                                    Descargar ${isMod ? item.filetype.toUpperCase() : ""}
                                    <img src="/public/img/icons/download.jpg" class="download-img">
                                </a>
                                `
                                : `<p>Sin enlace de descarga</p>`
                        }
                    </div>
                </div>

                <div class="info-icons">
                    ${
                        isMod
                        ? `
                            <div class="info-item"><i class="fa-solid fa-cubes"></i> MC ${item.version || "—"}</div>
                            <div class="info-item"><i class="fa-solid fa-database"></i> ${item.size || "—"}</div>
                            <div class="info-item"><i class="fa-solid fa-puzzle-piece"></i> ${item.filetype || "—"}</div>
                            <div class="info-item"><i class="fa-solid fa-server"></i>
                                ${Array.isArray(item.soporte) ? item.soporte.join(" / ") : "—"}
                            </div>
                          `
                        : `
                            <div class="info-item"><i class="fa-solid fa-microchip"></i> ${item.version || "—"}</div>
                            <div class="info-item"><i class="fa-solid fa-database"></i> ${item.size || "—"}</div>
                            <div class="info-item"><i class="fa-solid fa-gamepad"></i> ${item.platform || "—"}</div>
                            <div class="info-item"><i class="fa-solid fa-user"></i> ${item.developer || "—"}</div>
                          `
                    }
                </div>

                ${
                    item.description
                        ? `<div class="description">${formatText(item.description)}</div>`
                        : ""
                }

            </div>
        </div>

        <div class="related-section" id="relatedSection"></div>
    `;
}


// =================================================
// LINKVERTISE – INTERCEPTOR REAL
// =================================================
document.addEventListener("click", e => {
    const btn = e.target.closest(".lv-download");
    if (!btn) return;

    e.preventDefault();

    const url = btn.dataset.download;
    if (!url) return;

    const hidden = document.getElementById("lv-hidden-link");
    hidden.href = url;
    hidden.click(); // ← Linkvertise intercepta esto
});


// =================================================
// RELATED / CARRUSELES
// =================================================
function renderRelated(current, allItems) {

    const container = document.getElementById("relatedSection");
    if (!container) return;

    const isMod = !!current.filetype;
    let carousels = [];

    if (current.developer) {
        const dev = current.developer.toLowerCase().trim();
        carousels.push({
            title: "Del mismo desarrollador",
            items: allItems.filter(i =>
                i.id !== current.id &&
                i.developer &&
                i.developer.toLowerCase().trim() === dev
            )
        });
    }

    carousels.push({
        title: "Relacionados",
        items: allItems.filter(i =>
            i.id !== current.id &&
            similarity(i.title, current.title) > 0.4
        )
    });

    if (isMod && current.soporte) {
        carousels.push({
            title: "Mismo soporte",
            items: allItems.filter(i =>
                i.id !== current.id &&
                Array.isArray(i.soporte) &&
                i.soporte.some(s => current.soporte.includes(s))
            )
        });
    }

    if (!isMod && current.platform) {
        carousels.push({
            title: "Misma plataforma",
            items: allItems.filter(i =>
                i.id !== current.id &&
                i.platform === current.platform
            )
        });
    }

    carousels = carousels
        .map(c => ({ ...c, items: c.items.slice(0, 15) }))
        .filter(c => c.items.length)
        .slice(0, 3);

    container.innerHTML = carousels.map(renderCarousel).join("");
}

function renderCarousel(section) {
    const id = "rel_" + Math.random().toString(36).slice(2, 9);

    return `
        <div class="related-carousel">
            <h3>${section.title}</h3>
            <div class="carousel-row" id="${id}">
                ${section.items.map(renderCard).join("")}
            </div>
        </div>
    `;
}

function renderCard(item) {
    return `
        <a href="details.html?id=${item.id}" class="carousel-card-small">
            <img src="${item.background || "/img/default.jpg"}">
            <span>${item.title}</span>
        </a>
    `;
}


// =================================================
// HELPERS
// =================================================
function similarity(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    let matches = 0;

    a.split(" ").forEach(w => {
        if (b.includes(w)) matches++;
    });

    return matches / a.split(" ").length;
}

function formatText(text = "") {
    return text
        .replace(/\*(.*?)\*/g, "<b>$1</b>")
        .replace(/_(.*?)_/g, "<i>$1</i>")
        .replace(/\n/g, "<br>");
}
