// Fecha de hoy en español
const fecha = new Date().toLocaleDateString("es-SV", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
});
document.getElementById("fecha-hoy").textContent = fecha;

// Gráfico de dona: perfiles completos vs incompletos
const lienzo = document.getElementById("grafico-perfiles");
const completos = Number(lienzo.dataset.completos);
const incompletos = Number(lienzo.dataset.incompletos);

new Chart(lienzo, {
    type: "doughnut",
    data: {
        labels: ["Completos", "Incompletos"],
        datasets: [{
            data: [completos, incompletos],
            backgroundColor: ["#0d9488", "#e2e8f0"],
            borderWidth: 0
        }]
    },
    options: {
        cutout: "72%",
        plugins: { legend: { position: "bottom" } }
    }
});
