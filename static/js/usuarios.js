let usuarios = [];   // lista que llega del servidor
const $ = (id) => document.getElementById(id);

// ---------- Utilidades ----------
function esc(texto) {
    const d = document.createElement("div");
    d.textContent = texto ?? "";
    return d.innerHTML;
}

function aviso(mensaje) {
    const caja = $("aviso");
    caja.textContent = mensaje;
    caja.classList.remove("opacity-0", "translate-y-4");
    setTimeout(() => caja.classList.add("opacity-0", "translate-y-4"), 2800);
}

function enviar(datos) {
    return fetch("/crud_usuarios_usss002825", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    }).then(res => res.json());
}

// ---------- Guardar / Editar ----------
function guardarDatos() {
    let id = $("idUsuario").value;
    let tipoAccion = "guardar";

    if (id != "") {
        tipoAccion = "editar";
    }

    let datos = {
        accion: tipoAccion,
        idUsuario: id,
        usuario: $("usuario").value,
        clave: $("clave").value,
        nombre: $("nombre").value,
        direccion: $("direccion").value,
        telefono: $("telefono").value
    };

    enviar(datos).then(respuesta => {
        aviso(respuesta.mensaje);
        limpiar();
        buscarUsuarios();
    });
}

// ---------- Buscar ----------
function buscarUsuarios() {
    let texto = $("buscador").value;

    enviar({ accion: "buscar", texto: texto }).then(lista => {
        usuarios = lista;
        pintarTabla();
    });
}

function pintarTabla() {
    $("tabla").innerHTML = usuarios.map(u => `
        <tr class="hover:bg-slate-50">
            <td class="px-6 py-4 text-slate-500">${Number(u.idUsuario)}</td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">${esc((u.nombre || "?").charAt(0).toUpperCase())}</span>
                    <span class="font-semibold text-slate-900">${esc(u.nombre)}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-slate-600">${esc(u.usuario)}</td>
            <td class="px-6 py-4 text-slate-600">${esc(u.direccion) || "—"}</td>
            <td class="px-6 py-4 text-slate-600">${esc(u.telefono) || "—"}</td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
                <button data-editar="${Number(u.idUsuario)}" class="rounded-lg px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50">Editar</button>
                <button data-eliminar="${Number(u.idUsuario)}" class="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Eliminar</button>
            </td>
        </tr>
    `).join("");

    $("vacio").classList.toggle("hidden", usuarios.length > 0);
    $("contador").textContent = usuarios.length + (usuarios.length === 1 ? " usuario" : " usuarios");
}

// ---------- Editar ----------
function cargarParaEditar(id) {
    const u = usuarios.find(x => Number(x.idUsuario) === id);
    if (!u) return;

    $("idUsuario").value = u.idUsuario;
    $("usuario").value = u.usuario ?? "";
    $("clave").value = u.clave ?? "";
    $("nombre").value = u.nombre ?? "";
    $("direccion").value = u.direccion ?? "";
    $("telefono").value = u.telefono ?? "";

    $("titulo-form").textContent = "Editar usuario";
    $("btn-guardar").textContent = "Actualizar usuario";
    $("btn-limpiar").textContent = "Cancelar";
    $("etiqueta-edicion").classList.remove("hidden");
    $("form-usuario").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- Eliminar ----------
function eliminar(id) {
    if (confirm("¿Seguro que desea eliminar este usuario?")) {
        enviar({ accion: "eliminar", idUsuario: id }).then(respuesta => {
            aviso(respuesta.mensaje);
            buscarUsuarios();
        });
    }
}

// ---------- Limpiar ----------
function limpiar() {
    $("form-usuario").reset();
    $("idUsuario").value = "";
    $("titulo-form").textContent = "Nuevo usuario";
    $("btn-guardar").textContent = "Guardar usuario";
    $("btn-limpiar").textContent = "Limpiar";
    $("etiqueta-edicion").classList.add("hidden");
}

// ---------- Eventos ----------
$("form-usuario").addEventListener("submit", (e) => {
    e.preventDefault();
    guardarDatos();
});
$("btn-limpiar").addEventListener("click", limpiar);
$("buscador").addEventListener("input", buscarUsuarios);

$("ver-clave").addEventListener("click", (e) => {
    const campo = $("clave");
    const oculta = campo.type === "password";
    campo.type = oculta ? "text" : "password";
    e.target.textContent = oculta ? "Ocultar" : "Ver";
});

// Botones Editar / Eliminar de la tabla
$("tabla").addEventListener("click", (e) => {
    const btnEditar = e.target.closest("[data-editar]");
    const btnEliminar = e.target.closest("[data-eliminar]");
    if (btnEditar) cargarParaEditar(Number(btnEditar.dataset.editar));
    if (btnEliminar) eliminar(Number(btnEliminar.dataset.eliminar));
});

// Cargar la lista al abrir la página (antes era onload en el body)
buscarUsuarios();
