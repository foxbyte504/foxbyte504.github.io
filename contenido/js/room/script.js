import config from './config.js';

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
        menu.appendChild(closeButton);

        const image = document.createElement('img');
        image.src = article.imageUrl;
        image.alt = article.title;
        image.classList.add('article-menu-image');
        menu.appendChild(image);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('article-menu-content');

        if (article.description) {
            const description = document.createElement('p');
            description.textContent = article.description;
            description.classList.add('article-menu-description');
            contentDiv.appendChild(description);
        }

        const downloadsTitle = document.createElement('h3');
        downloadsTitle.textContent = 'Descargas';
        contentDiv.appendChild(downloadsTitle);

        const downloadLink1 = document.createElement('a');
        downloadLink1.href = article.link1;
        downloadLink1.textContent = article.title;
        downloadLink1.classList.add('article-menu-link');
        contentDiv.appendChild(downloadLink1);

        const downloadLink2 = document.createElement('a');
        downloadLink2.href = article.link2;
        downloadLink2.textContent = 'Enlace del creador';
        downloadLink2.classList.add('article-menu-link');
        contentDiv.appendChild(downloadLink2);

        menu.appendChild(contentDiv); // Append the content div to the menu

        document.body.appendChild(menu);
        return menu;
    };

    // Function to filter articles based on search input
    const filterArticles = (searchTerm) => {
        const articles = document.querySelectorAll('.article');
        articles.forEach(article => {
            const title = article.querySelector('h2').textContent.toLowerCase();
            if (title.includes(searchTerm.toLowerCase())) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    };

    // Event listener for search input
    searchInput.addEventListener('input', () => {
        filterArticles(searchInput.value);
    });

    // Event listener for search icon
    searchIcon.addEventListener('click', () => {
        searchInput.classList.toggle('active');
        if (searchInput.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // Generar los artículos dinámicamente desde la configuración
    config.articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('article');

        const imageElement = document.createElement('img');
        imageElement.src = article.imageUrl;
        imageElement.alt = article.title;

        const titleElement = document.createElement('h2');
        titleElement.textContent = article.title;

        articleElement.appendChild(imageElement);
        articleElement.appendChild(titleElement);

        // Crear el menú del artículo y almacenarlo
        const articleMenu = createArticleMenu(article);
        articleMenu.style.display = 'none'; // Initially hide the menu

        articleElement.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            // Close the currently open menu, if any
            if (currentMenu && currentMenu !== articleMenu) {
                currentMenu.style.display = 'none';
            }

            articleMenu.style.display = 'block';
            currentMenu = articleMenu; // Set the current menu to the newly opened menu
        });

        articlesContainer.appendChild(articleElement);
    });
});