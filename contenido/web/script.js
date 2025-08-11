document.getElementById('linkForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const original = document.getElementById('originalLink').value.trim();

    if (!original) {
        alert("Por favor, ingresa un enlace válido.");
        return;
    }

    // El formato correcto de un enlace monetizado según Linkvertise:
    const monetized = `https://linkvertise.com/${encodeURIComponent(original)}`;

    document.getElementById('monetizedLink').value = monetized;
    document.getElementById('resultContainer').style.display = 'block';
});

// Copiar al portapapeles
document.getElementById('copyBtn').addEventListener('click', function () {
    const linkField = document.getElementById('monetizedLink');
    linkField.select();
    document.execCommand('copy');
    alert("Enlace copiado al portapapeles.");
});
