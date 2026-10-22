const form = document.getElementById("form-login");
const btn = document.getElementById("btn-entrar");
const error = document.getElementById("mensaje-error");
const clave = document.getElementById("clave");

// Mostrar / ocultar clave
document.getElementById("ver-clave").addEventListener("click", (e) => {
    const oculta = clave.type === "password";
    clave.type = oculta ? "text" : "password";
    e.target.textContent = oculta ? "Ocultar" : "Ver";
});

// Enviar al hacer clic o al presionar Enter
form.addEventListener("submit", (e) => {
    e.preventDefault();
    entrar();
});

function entrar() {
    let datos = {
        usuario: document.getElementById("usuario").value,
        clave: clave.value
    };

    error.classList.add("hidden");
    btn.disabled = true;
    btn.textContent = "Verificando...";

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            if (resultado.exito == true) {
                window.location.href = "/index";
            } else {
                error.classList.remove("hidden");
                btn.disabled = false;
                btn.textContent = "Ingresar";
            }
        })
        .catch(() => {
            error.textContent = "No se pudo conectar con el servidor. Inténtalo de nuevo.";
            error.classList.remove("hidden");
            btn.disabled = false;
            btn.textContent = "Ingresar";
        });
}
