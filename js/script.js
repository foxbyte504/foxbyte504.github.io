document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('main-image');
    const articlesContainer = document.getElementById('articles-container');
    let currentMenu = null; // To track the currently open menu
    const menuTitle = document.getElementById('menu-title');
    const menuOptions = document.getElementById('menu-options');
    const menuArrow = document.createElement('span');
    menuArrow.classList.add('menu-arrow');
    menuTitle.appendChild(menuArrow);
    const pokemonTitle = document.getElementById('pokemon-title');
    const pokemonOptions = document.getElementById('pokemon-options');
    const pokemonArrow = document.createElement('span');
    pokemonArrow.classList.add('menu-arrow');
    pokemonTitle.appendChild(pokemonArrow);
    const videoJuegoTitle = document.getElementById('videojuego-title');
    const videoJuegoOptions = document.getElementById('videojuego-options');
    const videoJuegoArrow = document.createElement('span');
    videoJuegoArrow.classList.add('menu-arrow');
    videoJuegoTitle.appendChild(videoJuegoArrow);
    const searchInput = document.getElementById('search-input');

    const searchIcon = document.getElementById('search-icon');
    const searchContainer = document.getElementById('search-container');

    // Function to update the menu arrow direction
    const updateMenuArrow = (menuOptionsParam, menuArrowParam) => {
        if (menuOptionsParam.style.display === 'none') {
            menuArrowParam.textContent = '>'; // Right arrow
        } else {
            menuArrowParam.textContent = 'v'; // Down arrow
        }
    };

    // Initial arrow direction
    updateMenuArrow(menuOptions, menuArrow);
    updateMenuArrow(pokemonOptions, pokemonArrow);
    updateMenuArrow(videoJuegoOptions, videoJuegoArrow);

    menuTitle.addEventListener('click', () => {
        menuOptions.style.display = menuOptions.style.display === 'none' ? 'block' : 'none';
        updateMenuArrow(menuOptions, menuArrow);
    });

    pokemonTitle.addEventListener('click', () => {
        pokemonOptions.style.display = pokemonOptions.style.display === 'none' ? 'block' : 'none';
        updateMenuArrow(pokemonOptions, pokemonArrow);
    });

    videoJuegoTitle.addEventListener('click', () => {
        videoJuegoOptions.style.display = videoJuegoOptions.style.display === 'none' ? 'block' : 'none';
        updateMenuArrow(videoJuegoOptions, videoJuegoArrow);
    });

    // Establecer la imagen principal desde la configuración
    mainImage.src = config.mainImage;
    mainImage.alt = 'Imagen Principal';

    // Función para crear el menú del artículo
    const createArticleMenu = (article) => {
        const menu = document.createElement('div');
        menu.classList.add('article-menu');
        menu.id = `article-menu-${article.title.replace(/\s+/g, '-').toLowerCase()}`;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.classList.add('article-menu-close-button');
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the article click event
            menu.style.display = 'none';
            currentMenu = null; // Reset the current menu
        });
    };
});