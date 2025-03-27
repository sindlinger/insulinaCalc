// Funções utilitárias

// Arquivo: utils.js - Funções utilitárias comuns

/**
 * Função para formatar números com uma casa decimal
 * @param {number} valor - O valor a ser formatado
 * @return {string} Valor formatado com uma casa decimal
 */
function formatarNumero(valor) {
    return parseFloat(valor).toFixed(1);
}

/**
 * Detecta automaticamente se o dispositivo é mobile 
 * @return {boolean} True se for mobile, false caso contrário
 */
function detectMobileDevice() {
    return (window.innerWidth <= 768) || 
            (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

/**
 * Função para alternar entre visualização desktop e mobile
 */
function toggleView() {
    const container = document.getElementById('appContainer');
    const viewToggle = document.querySelector('.view-toggle i');
    
    if (container.classList.contains('mobile-view')) {
        container.classList.remove('mobile-view');
        viewToggle.className = 'fas fa-mobile-alt';
        viewToggle.title = "Visualização Mobile";
    } else {
        container.classList.add('mobile-view');
        viewToggle.className = 'fas fa-desktop';
        viewToggle.title = "Visualização Desktop";
    }
}

/**
 * Função para selecionar a via de administração de insulina
 * @param {string} route - Código da via (sc, iv, im)
 */
function selectRoute(route) {
    // Remover classe active de todas as opções
    document.querySelectorAll('.route-option').forEach(function(option) {
        option.classList.remove('active');
    });
    
    // Adicionar classe active à opção selecionada
    document.getElementById('route-' + route).classList.add('active');
    
    // Atualizar a descrição conforme a via selecionada
    let description = "";
    switch(route) {
        case 'sc':
            description = "Via subcutânea: Administração no tecido subcutâneo, geralmente abdômen, coxas ou braços.";
            break;
        case 'iv':
            description = "Via intravenosa: Administração direta na corrente sanguínea, uso hospitalar ou emergencial.";
            break;
        case 'im':
            description = "Via intramuscular: Administração no tecido muscular, absorção mais rápida que a subcutânea.";
            break;
    }
    document.getElementById('route-description').textContent = description;
}

/**
 * Função para selecionar o tipo de insulina para bolus
 * @param {string} type - Tipo de insulina (regular, rapid)
 */
function selectInsulinType(type) {
    // Remover classe active de todas as opções
    document.querySelectorAll('.route-option').forEach(function(option) {
        option.classList.remove('active');
    });
    
    // Adicionar classe active à opção selecionada
    document.getElementById('insulin-' + type).classList.add('active');
    
    // Atualizar a descrição e o timing info conforme o tipo selecionado
    let description = "";
    let timingInfo = "";
    
    switch(type) {
        case 'regular':
            description = "Insulina Regular: Início em 30min, pico em 2-3h, duração 5-8h. Aplicar 30min antes das refeições.";
            timingInfo = `
                <strong>Insulina Regular:</strong> 
                <ul class="timing-list">
                    <li><i class="fas fa-angle-right"></i> Aplicar 30 minutos antes da refeição</li>
                    <li><i class="fas fa-angle-right"></i> Esperar absorção antes de se alimentar para evitar picos glicêmicos</li>
                </ul>
            `;
            break;
        case 'rapid':
            description = "Insulina Ultrarrápida: Início em 10-15min, pico em 1-2h, duração 3-5h. Aplicar 0-15min antes das refeições.";
            timingInfo = `
                <strong>Insulina Ultrarrápida:</strong> 
                <ul class="timing-list">
                    <li><i class="fas fa-angle-right"></i> Aplicar 0-15 minutos antes da refeição</li>
                    <li><i class="fas fa-angle-right"></i> Pode ser aplicada imediatamente antes ou até logo após iniciar a refeição</li>
                </ul>
            `;
            break;
    }
    document.getElementById('insulin-description').innerHTML = description;
    
    // Se os resultados do bolus estiverem visíveis, atualizar o timing info
    if (document.getElementById('resultadosBolus').style.display === 'block') {
        document.getElementById('bolus-timing-info').innerHTML = timingInfo;
    }
}