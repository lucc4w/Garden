/* ==========================================================================
   lucc4w - SITE ENGINE & LOGIC
   ========================================================================== */

// 1. INITIAL DATABASE (PORTUGUESE)
const INITIAL_CONTENT_DATA = [
  {
    id: "filosofia-jardim",
    title: "A Filosofia dos Jardins Digitais",
    type: "texto",
    tags: ["filosofia", "webdesign", "conhecimento"],
    content: "Um jardim digital é um espaço pessoal na web focado em curadoria e no crescimento de ideias a longo prazo. Diferente de um blog tradicional que organiza posts de forma puramente cronológica, este modelo foca na interconexão e evolução constante das informações.\n\nAqui, os textos e notas não precisam estar 100% polidos antes da publicação. São rascunhos, anotações de estudo e referências que revisamos e desenvolvemos de forma incremental conforme nosso aprendizado avança.\n\nEsse ecossistema estimula o pensamento hipertextual, a autoaprendizagem e a criação de um repositório pessoal duradouro, devolvendo à web sua proposta original: uma rede de conexões orgânicas e conhecimento compartilhado.",
    date: "2026-06-01",
    connections: ["design-systems-organicos", "estetica-ludico"]
  },
  {
    id: "ecotracker-project",
    title: "EcoTracker: Monitor de Consumo Consciente",
    type: "projeto",
    tags: ["sustentabilidade", "javascript", "opensource", "webdev"],
    content: "O EcoTracker é um aplicativo web de código aberto feito para ajudar usuários a monitorarem suas pegadas de carbono diárias de maneira direta. O app estima emissões baseado em deslocamento, hábitos de alimentação e gastos elétricos básicos.\n\nDesenvolvido inteiramente em Javascript (sem dependências externas), o app roda inteiramente do lado do cliente para respeitar a privacidade do usuário.\n\nPróximos passos planejam a adição de suporte para salvar dados localmente através de Progressive Web App (PWA) e a criação de gráficos interativos com a API Canvas.",
    date: "2026-05-15",
    connections: ["design-systems-organicos"]
  },
  {
    id: "design-systems-organicos",
    title: "Design Systems Flexíveis e Fluidos",
    type: "texto",
    tags: ["css", "design-system", "ux", "front-end"],
    content: "Design systems corporativos muitas vezes tentam impor regras rígidas sobre componentes e layouts. Em uma web aberta e responsiva, porém, o controle rígido muitas vezes causa quebras em dispositivos não previstos.\n\nUm design system flexível prioriza fluidez. Usamos Container Queries, unidades de viewport e funções dinâmicas do CSS (como clamp(), min() e max()) para permitir que a tipografia e o espaçamento respirem de acordo com o contexto.\n\nA estética moderna abraça sombras leves, curvas sutis inspiradas em formas físicas e animações elásticas que tornam a interface reativa e agradável para leitura prolongada.",
    date: "2026-06-08",
    connections: ["filosofia-jardim", "ecotracker-project"]
  },
  {
    id: "canvas-video",
    title: "Como Funciona o Handshake de Criptografia",
    type: "video",
    tags: ["seguranca", "computacao", "tutorial"],
    content: "Neste tutorial explicativo, eu apresento visualmente o funcionamento do handshake Diffie-Hellman para troca segura de chaves em canais inseguros.\n\nTópicos abordados:\n- A diferença essencial entre criptografia simétrica e assimétrica\n- A matemática modular simplificada por trás da segurança de chaves\n- Demonstração prática do algoritmo simulado em Javascript no console.",
    date: "2026-06-12",
    connections: ["criptografia-estudo"]
  },
  {
    id: "estetica-ludico",
    title: "A Estética do Lúdico no Desenvolvimento Web",
    type: "texto",
    tags: ["criatividade", "front-end", "ux"],
    content: "Por que as páginas da web modernas parecem tão parecidas? O design corporativo limpo e cinzento engoliu a estranheza lúdica dos anos 90 e início dos 2000.\n\nAcredito que o futuro da web reside no retorno de elementos interativos lúdicos: animações baseadas em física, esquemas de cores audaciosos e mecânicas escondidas que convidam o usuário a explorar em vez de apenas consumir.\n\nInserir 'brinquedos' de código em portfólios cria uma conexão emocional imediata com o visitante.",
    date: "2026-06-14",
    connections: ["filosofia-jardim"]
  },
  {
    id: "criptografia-estudo",
    title: "Princípios Básicos de Criptografia Moderna",
    type: "texto",
    tags: ["seguranca", "estudos", "computacao"],
    content: "Anotações rápidas de estudo pessoal sobre o funcionamento de sistemas de criptografia:\n\n1. Criptografia Simétrica: Usa a mesma chave para cifrar e decifrar (ex: AES). É muito rápida, excelente para grandes volumes de dados, mas o desafio é compartilhar a chave de forma segura.\n\n2. Criptografia Assimétrica: Par de chaves (pública e privada). A chave pública cifra, a correspondente privada decifra (ex: RSA). Essencial para assinaturas digitais e troca de chaves iniciais.\n\nPretendo aprofundar este estudo criando uma ferramenta visual simples para demonstrar o handshake Diffie-Hellman em JS.",
    date: "2026-06-10",
    connections: ["canvas-video"]
  }
];

// 2. STATE MANAGEMENT
class AppState {
  constructor() {
    this.items = this.loadData();
    this.activeTypeFilter = "type-all";
    this.searchQuery = "";
    this.theme = localStorage.getItem("lucc4w-theme") || "dark";
  }

  loadData() {
    const saved = localStorage.getItem("lucc4w-items");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar dados salvos. Usando padrão.", e);
      }
    }
    // Set default data
    localStorage.setItem("lucc4w-items", JSON.stringify(INITIAL_CONTENT_DATA));
    return [...INITIAL_CONTENT_DATA];
  }

  saveData() {
    localStorage.setItem("lucc4w-items", JSON.stringify(this.items));
  }

  addItem(newItem) {
    this.items.push(newItem);
    this.saveData();
    
    // Establish bidirectional connections
    if (newItem.connections && newItem.connections.length > 0) {
      newItem.connections.forEach(connId => {
        const connectedItem = this.items.find(item => item.id === connId);
        if (connectedItem && !connectedItem.connections.includes(newItem.id)) {
          connectedItem.connections.push(newItem.id);
        }
      });
      this.saveData();
    }
  }

  getFilteredItems() {
    return this.items.filter(item => {
      // Filter by type
      if (this.activeTypeFilter !== "type-all" && item.type !== this.activeTypeFilter) {
        return false;
      }
      // Filter by search
      if (this.searchQuery.trim() !== "") {
        const query = this.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesContent = item.content.toLowerCase().includes(query);
        const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(query));
        return matchesTitle || matchesContent || matchesTags;
      }
      return true;
    });
  }
}

// Instantiate Global State
const state = new AppState();

// 3. UI ELEMENT REFERENCES
const elements = {
  themeToggleBtn: document.getElementById("theme-toggle"),
  searchInput: document.getElementById("search-input"),
  clearSearchBtn: document.getElementById("clear-search"),
  
  // Navigation / Filters
  typeFilters: document.getElementById("filter-type-container").querySelectorAll(".filter-btn"),
  openPlantFormBtn: document.getElementById("open-plant-form-btn"),
  
  // Stage Controls
  activeFiltersInfo: document.getElementById("active-filters-info"),
  
  // Views
  notesGrid: document.getElementById("notes-grid-container"),
  emptyStateMsg: document.getElementById("empty-state-msg"),
  resetFiltersBtn: document.getElementById("reset-filters-btn"),
  
  // Details Modal
  detailsModal: document.getElementById("details-modal"),
  modalTypeBadge: document.getElementById("modal-type-badge"),
  modalDate: document.getElementById("modal-date"),
  modalCloseBtn: document.getElementById("close-details-btn"),
  modalTitle: document.getElementById("modal-title"),
  modalTags: document.getElementById("modal-tags"),
  modalVideoContainer: document.getElementById("modal-video-container"),
  modalBody: document.getElementById("modal-body"),
  modalLinkContainer: document.getElementById("modal-link-container"),
  modalExternalLink: document.getElementById("modal-external-link"),
  modalBacklinksContainer: document.getElementById("modal-backlinks-container"),
  modalBacklinks: document.getElementById("modal-backlinks"),
  
  // Add Modal
  plantModal: document.getElementById("plant-modal"),
  plantForm: document.getElementById("plant-idea-form"),
  plantFormCloseBtn: document.getElementById("close-plant-btn"),
  plantFormCancelBtn: document.getElementById("cancel-plant-btn"),
  ideaTypeSelect: document.getElementById("idea-type"),
  formLinkUrlGroup: document.getElementById("form-link-url-group"),
  connectionsSelector: document.getElementById("connections-selector-container")
};

// 4. THEME TOGGLER
function initTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  localStorage.setItem("lucc4w-theme", state.theme);
}

elements.themeToggleBtn.addEventListener("click", toggleTheme);

// 5. FILTERING AND SEARCH ACTIONS
function updateFilterSelection(buttons, selectedBtn) {
  buttons.forEach(btn => btn.classList.remove("active"));
  selectedBtn.classList.add("active");
}

function updateActiveFiltersText() {
  const typeLabels = {
    "type-all": "Todos os conteúdos",
    "projeto": "Projetos 💻",
    "texto": "Textos 📝",
    "video": "Vídeos 🎥",
    "link": "Referências 🔗"
  };

  const typeText = typeLabels[state.activeTypeFilter];
  let searchSuffix = state.searchQuery ? ` contendo "${state.searchQuery}"` : "";
  
  elements.activeFiltersInfo.innerText = `Filtrando: ${typeText}${searchSuffix}`;
}

function handleFilterChange() {
  updateActiveFiltersText();
  renderGridView();
}

// Type filters
elements.typeFilters.forEach(btn => {
  btn.addEventListener("click", (e) => {
    state.activeTypeFilter = e.currentTarget.getAttribute("data-filter");
    updateFilterSelection(elements.typeFilters, e.currentTarget);
    handleFilterChange();
  });
});

// Reset filters
elements.resetFiltersBtn.addEventListener("click", () => {
  state.activeTypeFilter = "type-all";
  state.searchQuery = "";
  elements.searchInput.value = "";
  elements.clearSearchBtn.classList.remove("visible");
  
  updateFilterSelection(elements.typeFilters, elements.typeFilters[0]);
  handleFilterChange();
});

// Search input interaction
elements.searchInput.addEventListener("input", (e) => {
  state.searchQuery = e.target.value;
  if (state.searchQuery) {
    elements.clearSearchBtn.classList.add("visible");
  } else {
    elements.clearSearchBtn.classList.remove("visible");
  }
  handleFilterChange();
});

elements.clearSearchBtn.addEventListener("click", () => {
  state.searchQuery = "";
  elements.searchInput.value = "";
  elements.clearSearchBtn.classList.remove("visible");
  handleFilterChange();
});


// 6. GRID VIEW RENDERING
function renderGridView() {
  const filtered = state.getFilteredItems();
  elements.notesGrid.innerHTML = "";

  if (filtered.length === 0) {
    elements.emptyStateMsg.style.display = "flex";
    elements.notesGrid.style.display = "none";
    return;
  }

  elements.emptyStateMsg.style.display = "none";
  elements.notesGrid.style.display = "grid";

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.classList.add("note-card");
    card.setAttribute("data-type", item.type);
    card.setAttribute("data-id", item.id);

    const typeLabel = getTypeLabelAndIcon(item.type);
    
    // Create excerpt
    const excerpt = item.content.length > 130 
      ? item.content.slice(0, 130).trim() + "..." 
      : item.content;

    const formattedDate = formatDate(item.date);

    card.innerHTML = `
      <div class="card-top">
        <div class="card-badges">
          <span class="badge-type">${typeLabel}</span>
        </div>
        <h3>${item.title}</h3>
        <p class="excerpt">${excerpt}</p>
      </div>
      <div class="card-bottom">
        <div class="tags-container">
          ${item.tags.map(tag => `<span class="tag">#${tag}</span>`).join("")}
        </div>
        <div class="card-meta">
          <time datetime="${item.date}">${formattedDate}</time>
          ${item.connections && item.connections.length > 0 
            ? `<span class="connections-indicator" title="${item.connections.length} conexões">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                ${item.connections.length}
               </span>`
            : ""
          }
        </div>
      </div>
    `;

    card.addEventListener("click", () => openDetailsModal(item.id));
    elements.notesGrid.appendChild(card);
  });
}

function getTypeLabelAndIcon(type) {
  switch (type) {
    case "projeto": return "💻 Projeto";
    case "texto": return "📝 Texto";
    case "video": return "🎥 Vídeo";
    case "link": return "🔗 Referência";
    default: return "📝 Nota";
  }
}

function formatDate(dateStr) {
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parts[2];
    
    const months = [
      "jan", "fev", "mar", "abr", "mai", "jun", 
      "jul", "ago", "set", "out", "nov", "dez"
    ];
    return `${day} de ${months[monthIndex]}, ${year}`;
  }
  return dateStr;
}


// 7. DETAILS MODAL LOGIC
function openDetailsModal(id) {
  const item = state.items.find(x => x.id === id);
  if (!item) return;

  // Header Details
  elements.modalTypeBadge.className = "badge badge-info";
  elements.modalTypeBadge.innerText = getTypeLabelAndIcon(item.type);
  elements.modalDate.innerText = `Publicado em: ${formatDate(item.date)}`;
  
  // Title & Tags
  elements.modalTitle.innerText = item.title;
  elements.modalTags.innerHTML = item.tags.map(tag => `<span class="tag">#${tag}</span>`).join("");
  
  // Content rendering
  const paragraphHtml = item.content.split("\n\n").map(paragraph => {
    if (paragraph.startsWith("-") || paragraph.startsWith("*")) {
      const items = paragraph.split(/\n[-*]\s/).map(li => `<li>${li.replace(/^[-*]\s/, "")}</li>`).join("");
      return `<ul>${items}</ul>`;
    }
    if (/^\d+\./.test(paragraph)) {
      const items = paragraph.split(/\n\d+\.\s/).map(li => `<li>${li.replace(/^\d+\.\s/, "")}</li>`).join("");
      return `<ol>${items}</ol>`;
    }
    return `<p>${paragraph.replace(/\n/g, "<br>")}</p>`;
  }).join("");
  
  elements.modalBody.innerHTML = paragraphHtml;
  
  // Video player toggling
  if (item.type === "video") {
    elements.modalVideoContainer.style.display = "block";
  } else {
    elements.modalVideoContainer.style.display = "none";
  }

  // Link container toggling
  if (item.type === "link" && item.url) {
    elements.modalLinkContainer.style.display = "block";
    elements.modalExternalLink.href = item.url;
  } else {
    elements.modalLinkContainer.style.display = "none";
  }

  // Backlinks (connected items)
  elements.modalBacklinks.innerHTML = "";
  if (item.connections && item.connections.length > 0) {
    elements.modalBacklinksContainer.style.display = "block";
    
    item.connections.forEach(connId => {
      const connItem = state.items.find(x => x.id === connId);
      if (connItem) {
        const linkCard = document.createElement("div");
        linkCard.classList.add("backlink-card");
        linkCard.innerHTML = `
          <div class="backlink-title">${connItem.title}</div>
          <div class="backlink-meta">
            <span>${getTypeLabelAndIcon(connItem.type).split(" ")[0]}</span>
          </div>
        `;
        linkCard.addEventListener("click", () => {
          openDetailsModal(connId);
        });
        elements.modalBacklinks.appendChild(linkCard);
      }
    });
  } else {
    elements.modalBacklinksContainer.style.display = "none";
  }

  // Show Modal
  elements.detailsModal.classList.add("open");
  elements.detailsModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // block scroll
}

function closeDetailsModal() {
  elements.detailsModal.classList.remove("open");
  elements.detailsModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = ""; // restore scroll
}

elements.modalCloseBtn.addEventListener("click", closeDetailsModal);
elements.detailsModal.addEventListener("click", (e) => {
  if (e.target === elements.detailsModal) {
    closeDetailsModal();
  }
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDetailsModal();
    closeAddModal();
  }
});


// 8. ADD NEW CONTENT FORM LOGIC
function openAddModal() {
  elements.plantForm.reset();
  elements.formLinkUrlGroup.style.display = "none";
  
  // Populate connections
  elements.connectionsSelector.innerHTML = "";
  if (state.items.length === 0) {
    elements.connectionsSelector.innerHTML = `<p style="font-size:0.85rem; color:var(--text-muted);">Nenhum conteúdo cadastrado ainda.</p>`;
  } else {
    state.items.forEach(item => {
      const checkboxLabel = document.createElement("label");
      checkboxLabel.classList.add("checkbox-label");
      checkboxLabel.innerHTML = `
        <input type="checkbox" name="connections" value="${item.id}">
        <span>${getTypeLabelAndIcon(item.type).split(" ")[0]} ${item.title}</span>
      `;
      elements.connectionsSelector.appendChild(checkboxLabel);
    });
  }

  elements.plantModal.classList.add("open");
  elements.plantModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeAddModal() {
  elements.plantModal.classList.remove("open");
  elements.plantModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

elements.openPlantFormBtn.addEventListener("click", openAddModal);
elements.plantFormCloseBtn.addEventListener("click", closeAddModal);
elements.plantFormCancelBtn.addEventListener("click", closeAddModal);
elements.plantModal.addEventListener("click", (e) => {
  if (e.target === elements.plantModal) {
    closeAddModal();
  }
});

// Show/hide URL input based on type
elements.ideaTypeSelect.addEventListener("change", (e) => {
  if (e.target.value === "link") {
    elements.formLinkUrlGroup.style.display = "flex";
    document.getElementById("idea-link-url").setAttribute("required", "true");
  } else {
    elements.formLinkUrlGroup.style.display = "none";
    document.getElementById("idea-link-url").removeAttribute("required");
  }
});

// Handle Form Submit
elements.plantForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("idea-title").value.trim();
  const type = elements.ideaTypeSelect.value;
  
  const tagsInput = document.getElementById("idea-tags").value;
  const tags = tagsInput
    ? tagsInput.split(",").map(t => t.trim().toLowerCase()).filter(t => t.length > 0)
    : ["geral"];
    
  const content = document.getElementById("idea-content").value.trim();
  const url = type === "link" ? document.getElementById("idea-link-url").value.trim() : "";
  
  // Selected Connections
  const checkboxes = elements.plantForm.querySelectorAll('input[name="connections"]:checked');
  const connections = Array.from(checkboxes).map(cb => cb.value);

  // Generate unique clean ID
  const baseId = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  
  const id = `${baseId}-${Date.now().toString().slice(-4)}`;

  const today = new Date();
  const date = today.toISOString().split("T")[0]; // YYYY-MM-DD

  const newContent = { id, title, type, tags, content, date, connections };
  if (url) newContent.url = url;

  // Add and save
  state.addItem(newContent);

  // Refresh UI
  renderGridView();

  // Close Modal
  closeAddModal();
});


// 9. INITIALIZATION
function init() {
  initTheme();
  handleFilterChange();
}

window.addEventListener("DOMContentLoaded", init);
