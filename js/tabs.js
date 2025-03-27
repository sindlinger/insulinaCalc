// Arquivo: tabs.js - Funcionalidades relacionadas às abas

/**
 * Configura os eventos para as abas e elementos colapsáveis
 */
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar visualização adequada conforme o dispositivo
    if (detectMobileDevice()) {
        document.getElementById('appContainer').classList.add('mobile-view');
        document.querySelector('.view-toggle i').className = 'fas fa-desktop';
    }
    
    const tabLinks = document.querySelectorAll('.tab-link');
    
    // Adiciona evento de clique a todos os links de abas
    tabLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (!this.getAttribute('onclick')) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                openTab(tabId);
            }
        });
    });
    
    // Inicializar a primeira aba como ativa
    openTab('peso');
    
    // Configurar os botões colapsáveis para o guia médico
    var coll = document.getElementsByClassName("collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active-collapse");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
    
    // Configurar evento para o seletor de fator personalizado
    document.getElementById("selectFator").addEventListener("change", function() {
        if (this.value === "-1") {
            document.getElementById("fatorPersonalizadoGroup").style.display = "block";
        } else {
            document.getElementById("fatorPersonalizadoGroup").style.display = "none";
        }
    });
    
    // Configurar evento para o seletor de dose bomba personalizada
    document.getElementById("selectDoseBomba").addEventListener("change", function() {
        if (this.value === "-1") {
            document.getElementById("doseBombaPersonalizadaGroup").style.display = "block";
        } else {
            document.getElementById("doseBombaPersonalizadaGroup").style.display = "none";
        }
    });
});

/**
 * Função para abrir uma aba específica
 * @param {string} tabName - ID da aba a ser aberta
 */
function openTab(tabName) {
    // Esconde todas as abas
    const tabContent = document.querySelectorAll('.tab-content');
    tabContent.forEach(function(tab) {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });
    
    // Remove a classe "active" de todos os links
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(function(link) {
        link.classList.remove('active');
    });
    
    // Mostra a aba atual e adiciona a classe "active" ao link
    document.getElementById(tabName).style.display = 'block';
    document.getElementById(tabName).classList.add('active');
    
    // Ativa o link correspondente
    document.querySelector(`.tab-link[data-tab="${tabName}"]`).classList.add('active');
}