// SIMULAÇÃO DE DADOS (Substitua depois pela chamada ao Google Script)
const eventosMock = [
    { igreja: "Assembleia de Deus", evento: "Culto de Doutrina", data: "2025-04-18", hora: "19:00", local: "Templo Sede" },
    { igreja: "Igreja de Cristo", evento: "Encontro de Jovens", data: "2025-04-19", hora: "19:30", local: "Rua Projetada, 10" },
    { igreja: "Igreja Pentecostal Missão Profética do Senhor", evento: "Círculo de Oração", data: "2025-04-20", hora: "08:00", local: "Congregação Setor 02" },
    { igreja: "Batista", evento: "Culto de Celebração", data: "2025-04-20", hora: "18:00", local: "Centro" }
];

function renderizarPortal(filtro = "todas") {
    const container = document.getElementById('listaPortal');
    container.innerHTML = "";

    const filtrados = filtro === "todas" ? eventosMock : eventosMock.filter(e => e.igreja === filtro);

    filtrados.forEach(e => {
        const card = document.createElement('div');
        card.className = "portal-card";
        card.innerHTML = `
            <div class="badge-igreja">${e.igreja}</div>
            <h3 style="margin: 5px 0; color: #333;">${e.evento}</h3>
            <div style="display: flex; gap: 15px; margin-top: 10px; color: #666; font-size: 0.9rem;">
                <span class="material-icons" style="font-size: 16px;">calendar_today</span> ${new Date(e.data).toLocaleDateString('pt-BR')}
                <span class="material-icons" style="font-size: 16px;">schedule</span> ${e.hora}
            </div>
            <div style="margin-top: 8px; color: #888; font-size: 0.85rem;">
                <span class="material-icons" style="font-size: 16px; vertical-align: middle;">place</span> ${e.local}
            </div>
        `;
        container.appendChild(card);
    });
}

function filtrarEventos() {
    const valor = document.getElementById('filtroIgreja').value;
    renderizarPortal(valor);
}

// Inicializa o portal
window.onload = () => renderizarPortal();