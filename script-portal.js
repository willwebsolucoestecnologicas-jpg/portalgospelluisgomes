// ============================================================
// PORTAL GOSPEL LUISGOMENSE — v2
// SIMULAÇÃO DE DADOS (Substitua depois pela chamada ao Google Script)
// As datas abaixo são geradas em relação ao dia de hoje, apenas
// para fins de demonstração do layout.
// ============================================================

function chaveData(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function dataComOffset(offsetDias) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + offsetDias);
    return chaveData(d);
}

const HOJE = dataComOffset(0);

const eventosMock = [
    { igreja: "Assembleia de Deus", evento: "Culto de Oração e Doutrina", data: dataComOffset(0), hora: "19:30", local: "Templo Sede" },
    { igreja: "Igreja de Cristo", evento: "Encontro de Jovens", data: dataComOffset(0), hora: "19:30", local: "Rua Projetada, 10" },
    { igreja: "Igreja Pentecostal Missão Profética do Senhor", evento: "Vigília de Oração", data: dataComOffset(1), hora: "22:00", local: "Congregação Setor 02" },
    { igreja: "Batista", evento: "Escola Bíblica Dominical", data: dataComOffset(2), hora: "09:00", local: "Centro" },
    { igreja: "Assembleia de Deus", evento: "Culto de Celebração", data: dataComOffset(2), hora: "18:00", local: "Templo Sede" },
    { igreja: "Igreja de Cristo", evento: "Culto da Família", data: dataComOffset(2), hora: "19:00", local: "Rua Projetada, 10" },
    { igreja: "Assembleia de Deus", evento: "Culto de Doutrina", data: dataComOffset(4), hora: "19:30", local: "Templo Sede" },
    { igreja: "Batista", evento: "Culto de Oração", data: dataComOffset(4), hora: "19:30", local: "Centro" },
    { igreja: "Igreja de Cristo", evento: "Estudo Bíblico", data: dataComOffset(5), hora: "19:30", local: "Rua Projetada, 10" },
];

const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const DIAS_SEMANA_CURTO = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES_CURTO = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const estado = { dia: 'todos', igreja: 'todas' };

const ARCH_ICON = `<svg class="arch-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V11a7 7 0 0 1 14 0v10"/><path d="M5 21h14"/><path d="M9 21v-6h6v6"/></svg>`;

function parseDataLocal(dataStr) {
    const [y, m, d] = dataStr.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function rotuloDia(dataStr) {
    const diff = Math.round((parseDataLocal(dataStr) - parseDataLocal(HOJE)) / 86400000);
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Amanhã';
    const d = parseDataLocal(dataStr);
    return DIAS_SEMANA_CURTO[d.getDay()];
}

function dataFormatada(dataStr) {
    const d = parseDataLocal(dataStr);
    return `${d.getDate()} de ${MESES_CURTO[d.getMonth()]}`;
}

function montarChipsDias() {
    const container = document.getElementById('chipDias');
    const datasUnicas = [...new Set(eventosMock.map(e => e.data))].sort();

    const chips = [{ valor: 'todos', label: 'Todos os dias', sub: '' }].concat(
        datasUnicas.map(data => ({
            valor: data,
            label: rotuloDia(data),
            sub: dataFormatada(data),
        }))
    );

    container.innerHTML = chips.map(c => `
        <button class="chip ${c.valor === HOJE ? 'chip-today' : ''}" data-tipo="dia" data-valor="${c.valor}" aria-pressed="${estado.dia === c.valor}">
            ${c.label}${c.sub ? `<span class="chip-sub">${c.sub}</span>` : ''}
        </button>
    `).join('');
}

function montarChipsIgrejas() {
    const container = document.getElementById('chipIgrejas');
    const igrejasUnicas = [...new Set(eventosMock.map(e => e.igreja))].sort();

    const chips = [{ valor: 'todas', label: 'Todas' }].concat(
        igrejasUnicas.map(nome => ({ valor: nome, label: nome }))
    );

    container.innerHTML = chips.map(c => `
        <button class="chip" data-tipo="igreja" data-valor="${c.valor}" aria-pressed="${estado.igreja === c.valor}">
            ${c.label}
        </button>
    `).join('');
}

function atualizarStats(lista) {
    document.getElementById('statIgrejas').textContent = new Set(eventosMock.map(e => e.igreja)).size;
    document.getElementById('statEventos').textContent = eventosMock.length;
    document.getElementById('statHoje').textContent = eventosMock.filter(e => e.data === HOJE).length;
}

function cardHTML(e) {
    const isHoje = e.data === HOJE;
    return `
        <div class="portal-card">
            <div class="card-glow" aria-hidden="true"></div>
            <div class="card-top-row">
                <span class="badge-igreja">${e.igreja}</span>
                <span class="card-time-pill"><span class="material-icons">schedule</span>${e.hora}</span>
            </div>
            <h3>${e.evento}</h3>
            <div class="event-location">
                <span class="material-icons">place</span> ${e.local}
            </div>
        </div>
    `;
}

function renderizarAgenda() {
    const container = document.getElementById('agendaWrap');

    const filtrados = eventosMock.filter(e => {
        const passaDia = estado.dia === 'todos' || e.data === estado.dia;
        const passaIgreja = estado.igreja === 'todas' || e.igreja === estado.igreja;
        return passaDia && passaIgreja;
    });

    atualizarStats(filtrados);

    if (filtrados.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons">search_off</span>
                <h3>Nenhum culto encontrado</h3>
                <p>Tente ver todos os dias ou outra igreja.</p>
                <button id="resetFiltros" type="button">Ver todos os eventos</button>
            </div>
        `;
        document.getElementById('resetFiltros').addEventListener('click', () => {
            estado.dia = 'todos';
            estado.igreja = 'todas';
            montarChipsDias();
            montarChipsIgrejas();
            renderizarAgenda();
        });
        return;
    }

    const datasOrdenadas = [...new Set(filtrados.map(e => e.data))].sort();

    container.innerHTML = datasOrdenadas.map(data => {
        const eventosDoDia = filtrados
            .filter(e => e.data === data)
            .sort((a, b) => a.hora.localeCompare(b.hora));
        const ehHoje = data === HOJE;
        const d = parseDataLocal(data);

        return `
            <section class="date-group" id="dia-${data}">
                <div class="date-heading">
                    ${ARCH_ICON}
                    <h2>${DIAS_SEMANA[d.getDay()]} <span class="date-num">· ${dataFormatada(data)}</span></h2>
                    ${ehHoje ? '<span class="today-tag">Hoje</span>' : ''}
                    <span class="rule" aria-hidden="true"></span>
                </div>
                <div class="portal-grid">
                    ${eventosDoDia.map(cardHTML).join('')}
                </div>
            </section>
        `;
    }).join('');
}

function ligarEventosChips() {
    document.body.addEventListener('click', (evt) => {
        const btn = evt.target.closest('.chip');
        if (!btn) return;
        const tipo = btn.dataset.tipo;
        const valor = btn.dataset.valor;
        estado[tipo] = valor;

        document.querySelectorAll(`.chip[data-tipo="${tipo}"]`).forEach(b => {
            b.setAttribute('aria-pressed', String(b.dataset.valor === valor));
        });

        renderizarAgenda();
    });
}

function iniciarPortal() {
    montarChipsDias();
    montarChipsIgrejas();
    ligarEventosChips();
    renderizarAgenda();
}

window.addEventListener('DOMContentLoaded', iniciarPortal);