// Abrir y cerrar el menú lateral en móvil
const menu = document.getElementById("menu");
const fondo = document.getElementById("fondo-menu");

function abrirMenu() {
    menu.classList.remove("-translate-x-full");
    fondo.classList.remove("hidden");
}

function cerrarMenu() {
    menu.classList.add("-translate-x-full");
    fondo.classList.add("hidden");
}

document.getElementById("abrir-menu").addEventListener("click", abrirMenu);
fondo.addEventListener("click", cerrarMenu);
