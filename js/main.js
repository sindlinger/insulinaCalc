/**
 * InsulinaCalc - JavaScript principal
 * 
 * Este arquivo contém todas as funções necessárias para o funcionamento
 * da calculadora de insulina, incluindo os cálculos, manipulação da interface
 * e geração de prescrições médicas.
 */

// Variáveis globais
let selectedRoute = 'sc';
let selectedRouteGL = 'sc';
let selectedInsulinType = 'regular';

/**
 * Seleciona a via de administração para cálculo por peso
 * @param {string} route - Via de administração (sc, iv, im)
 */
function selectRoute(route) {
    selectedRoute = route;
    
    // Remove a classe active de todas as opções
    document.querySelectorAll('#calculo-peso .route-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Adiciona a classe active na opção selecionada
    document.getElementById('route-' + route).classList.add('active');
    
    // Atualiza a descrição da via
    let description = '';
    switch(route) {
        case 'sc':
            description = 'Via subcutânea: Administração no tecido subcutâneo, geralmente abdômen, coxas ou braços. Via padrão para insulinoterapia.';
            break;
        case 'iv':
            description = 'Via intravenosa: Administração direta na corrente sanguínea. Uso restrito a ambiente hospitalar e situações de emergência.';
            break;
        case 'im':
            description = 'Via intramuscular: Administração no tecido muscular. Absorção mais rápida que SC, utilizada em situações específicas.';
            break;
    }
    document.getElementById('route-description').textContent = description;
}

/**
 * Seleciona a via de administração para Glargina/Lispro
 * @param {string} route - Via de administração (sc)
 */
function selectRouteGL(route) {
    selectedRouteGL = route;
    
    // Remove a classe active de todas as opções
    document.querySelectorAll('#glargina-lispro .route-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Adiciona a classe active na opção selecionada
    document.getElementById('route-' + route + '-gl').classList.add('active');
    
    // Atualiza a descrição da via
    let description = 'Via subcutânea: Administração no tecido subcutâneo, geralmente abdômen, coxas ou braços. Única via para Glargina e Lispro.';
    document.getElementById('route-description-gl').textContent = description;
}

// Funções de inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar event listeners
    initEventListeners();
    
    // Inicializar collapsible sections
    initCollapsibleSections();
    
    // Verificar se há parâmetros na URL
    checkURLParams();
});

/**
 * Calcula doses de insulina baseadas no peso
 */
function calcularPeso() {
    // Obter valores do formulário
    const peso = parseFloat(document.getElementById('inputPeso').value);
    let fator;
    
    if (document.getElementById('selectFator').value === '-1') {
        fator = parseFloat(document.getElementById('inputFatorPersonalizado').value);
    } else {
        fator = parseFloat(document.getElementById('selectFator').value);
    }
    
    // Validação
    if (isNaN(peso) || peso <= 0) {
        alert('Por favor, informe um peso válido.');
        return;
    }
    
    if (isNaN(fator) || fator <= 0) {
        alert('Por favor, informe um fator válido.');
        return;
    }
    
    // Aplicar ajuste baseado na via de administração
    let fatorAjustado = fator;
    if (selectedRoute === 'iv') {
        fatorAjustado = fator * 0.8; // 80% da dose SC para IV
    } else if (selectedRoute === 'im') {
        fatorAjustado = fator * 0.85; // 85% da dose SC para IM
    }
    
    // Cálculo da dose total diária
    let doseTotal = peso * fatorAjustado;
    
    // Arredondamento das doses
    doseTotal = Math.round(doseTotal);
    
    // Cálculo do esquema 70/30
    const doseManha = Math.round(doseTotal * 0.7); // 70% da dose total para manhã
    const doseNoite = Math.round(doseTotal * 0.3); // 30% da dose total para noite
    
    const intermediariaManha = Math.round(doseManha * 0.7); // 70% da dose da manhã é NPH
    const rapidaManha = Math.round(doseManha * 0.3); // 30% da dose da manhã é Regular
    
    const intermediariaNoite = Math.round(doseNoite * 0.5); // 50% da dose da noite é NPH
    const rapidaNoite = Math.round(doseNoite * 0.5); // 50% da dose da noite é Regular
    
    // Cálculo do esquema Basal-Bolus
    const doseBasal = Math.round(doseTotal * 0.5); // 50% da dose total para basal
    const bolusTotal = Math.round(doseTotal * 0.5); // 50% da dose total para bolus
    
    const bolusCafe = Math.round(bolusTotal * 0.4); // 40% do bolus total para café
    const bolusAlmoco = Math.round(bolusTotal * 0.3); // 30% do bolus total para almoço
    const bolusJantar = Math.round(bolusTotal * 0.3); // 30% do bolus total para jantar
    
    // Exibir resultados
    document.getElementById('doseTotalPeso').textContent = doseTotal;
    document.getElementById('doseManha').textContent = doseManha;
    document.getElementById('intermediariaManha').textContent = intermediariaManha;
    document.getElementById('rapidaManha').textContent = rapidaManha;
    document.getElementById('doseNoite').textContent = doseNoite;
    document.getElementById('intermediariaNoite').textContent = intermediariaNoite;
    document.getElementById('rapidaNoite').textContent = rapidaNoite;
    document.getElementById('doseBasal').textContent = doseBasal;
    document.getElementById('bolusTotal').textContent = bolusTotal;
    document.getElementById('bolusCafe').textContent = bolusCafe;
    document.getElementById('bolusAlmoco').textContent = bolusAlmoco;
    document.getElementById('bolusJantar').textContent = bolusJantar;
    
    // Preencher automaticamente os campos de prescrição
    document.getElementById('nphManha').value = intermediariaManha;
    document.getElementById('regularManha').value = rapidaManha;
    document.getElementById('nphNoite').value = intermediariaNoite;
    document.getElementById('regularNoite').value = rapidaNoite;
    
    // Mostrar resultados
    document.getElementById('resultadosPeso').classList.add('show');
}

/**
 * Calcula doses de insulina baseadas no esquema Glargina/Lispro
 */
function calcularGlarginaLispro() {
    // Obter valores do formulário
    const peso = parseFloat(document.getElementById('inputPesoGL').value);
    let fator;
    
    if (document.getElementById('selectFatorGL').value === '-1') {
        fator = parseFloat(document.getElementById('inputFatorPersonalizadoGL').value);
    } else {
        fator = parseFloat(document.getElementById('selectFatorGL').value);
    }
    
    // Validação
    if (isNaN(peso) || peso <= 0) {
        alert('Por favor, informe um peso válido.');
        return;
    }
    
    if (isNaN(fator) || fator <= 0) {
        alert('Por favor, informe um fator válido.');
        return;
    }
    
    // Cálculo da dose total diária
    let doseTotal = Math.round(peso * fator);
    
    // Cálculo Glargina/Lispro
    const doseGlargina = Math.round(doseTotal * 0.6); // 60% da dose total para Glargina
    const doseLisproTotal = Math.round(doseTotal * 0.4); // 40% da dose total para Lispro
    
    // Distribuição da Lispro nas refeições (1/3 para cada)
    const lisproManha = Math.round(doseLisproTotal / 3);
    const lisproAlmoco = Math.round(doseLisproTotal / 3);
    const lisproJantar = doseLisproTotal - lisproManha - lisproAlmoco; // Garante que a soma seja exata
    
    // Exibir resultados
    document.getElementById('doseTotalGL').textContent = doseTotal;
    document.getElementById('doseGlargina').textContent = doseGlargina;
    document.getElementById('doseLisproTotal').textContent = doseLisproTotal;
    document.getElementById('lisproManha').textContent = lisproManha;
    document.getElementById('lisproAlmoco').textContent = lisproAlmoco;
    document.getElementById('lisproJantar').textContent = lisproJantar;
    
    // Preencher automaticamente os campos de prescrição
    document.getElementById('glargina').value = doseGlargina;
    document.getElementById('lisproManhaPrescricao').value = lisproManha;
    document.getElementById('lisproAlmocoPrescricao').value = lisproAlmoco;
    document.getElementById('lisproJantarPrescricao').value = lisproJantar;
    
    // Mostrar resultados
    document.getElementById('resultadosGL').classList.add('show');
}

/**
 * Inicializa todos os event listeners necessários para a aplicação
 */
function initEventListeners() {
    // Event listeners para navegação por abas
    document.querySelectorAll('.tab-link').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove a classe active de todas as abas e conteúdos
            document.querySelectorAll('.tab-link').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(item => {
                item.classList.remove('active');
            });
            
            // Adiciona a classe active na aba clicada
            this.classList.add('active');
            
            // Mostra o conteúdo correspondente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Atualiza a URL com o ID da aba
            history.replaceState(null, null, '#' + tabId);
        });
    });
    
    // Event listeners para campos de fatores personalizados
    document.getElementById('selectFator').addEventListener('change', function() {
        const fatorPersonalizadoGroup = document.getElementById('fatorPersonalizadoGroup');
        if (this.value === '-1') {
            fatorPersonalizadoGroup.style.display = 'block';
        } else {
            fatorPersonalizadoGroup.style.display = 'none';
        }
    });
    
    document.getElementById('selectFatorGL').addEventListener('change', function() {
        const fatorPersonalizadoGLGroup = document.getElementById('fatorPersonalizadoGLGroup');
        if (this.value === '-1') {
            fatorPersonalizadoGLGroup.style.display = 'block';
        } else {
            fatorPersonalizadoGLGroup.style.display = 'none';
        }
    });
    
    // Event listener para mudança de tipo de prescrição
    document.getElementById('selectTipoPrescrição').addEventListener('change', function() {
        const esquema1 = document.getElementById('prescricao-esquema1');
        const esquema2 = document.getElementById('prescricao-esquema2');
        
        if (this.value === 'esquema1') {
            esquema1.style.display = 'block';
            esquema2.style.display = 'none';
        } else {
            esquema1.style.display = 'none';
            esquema2.style.display = 'block';
        }
    });
}

/**
 * Verifica se há parâmetros na URL para abrir aba específica
 */
function checkURLParams() {
    const hash = window.location.hash;
    if (hash) {
        const tabId = hash.substring(1);
        const tabLink = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
        
        if (tabLink) {
            tabLink.click();
        }
    }
}

/**
 * Gera prescrição médica com base no esquema selecionado
 */
function gerarPrescricao() {
    const tipoEsquema = document.getElementById('selectTipoPrescrição').value;
    let prescricaoTexto = '';
    
    if (tipoEsquema === 'esquema1') {
        // Esquema NPH/Regular
        const nphManha = document.getElementById('nphManha').value || '0';
        const regularManha = document.getElementById('regularManha').value || '0';
        const nphNoite = document.getElementById('nphNoite').value || '0';
        const regularNoite = document.getElementById('regularNoite').value || '0';
        
        prescricaoTexto = `
        <h4>RECEITUÁRIO MÉDICO</h4>
        <p style="margin-bottom: 20px;">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
        
        <ol>
            <li style="margin-bottom: 15px;">
                <strong>Insulina NPH Humana</strong><br>
                Apresentação: Frasco-ampola 10ml (100 UI/ml)<br>
                Posologia: Aplicar ${nphManha} unidades pela manhã (30 minutos antes do café) e ${nphNoite} unidades à noite (30 minutos antes do jantar), por via subcutânea.
            </li>
            
            <li style="margin-bottom: 15px;">
                <strong>Insulina Regular Humana</strong><br>
                Apresentação: Frasco-ampola 10ml (100 UI/ml)<br>
                Posologia: Aplicar ${regularManha} unidades pela manhã (30 minutos antes do café) e ${regularNoite} unidades à noite (30 minutos antes do jantar), por via subcutânea.
            </li>
            
            <li style="margin-bottom: 15px;">
                <strong>Seringas para insulina</strong><br>
                100 unidades com agulha 8mm<br>
                Quantidade: 60 unidades
            </li>
        </ol>
        
        <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p><strong>Orientações:</strong></p>
            <ul>
                <li>Rodizie os locais de aplicação (abdômen, coxas, braços).</li>
                <li>Aplique a insulina NPH e Regular na mesma seringa, aspirando primeiro a Regular.</li>
                <li>Monitore a glicemia antes das principais refeições e ao deitar.</li>
                <li>Em caso de hipoglicemia, ingerir 15g de carboidratos (3 colheres de açúcar ou 150ml de suco).</li>
            </ul>
        </div>
        
        <p style="margin-top: 40px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
            ________________________________<br>
            Carimbo e Assinatura do Médico
        </p>`;
    } else {
        // Esquema Glargina/Lispro
        const glargina = document.getElementById('glargina').value || '0';
        const lisproManha = document.getElementById('lisproManhaPrescricao').value || '0';
        const lisproAlmoco = document.getElementById('lisproAlmocoPrescricao').value || '0';
        const lisproJantar = document.getElementById('lisproJantarPrescricao').value || '0';
        
        prescricaoTexto = `
        <h4>RECEITUÁRIO MÉDICO</h4>
        <p style="margin-bottom: 20px;">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
        
        <ol>
            <li style="margin-bottom: 15px;">
                <strong>Insulina Glargina</strong><br>
                Apresentação: Frasco-ampola 10ml (100 UI/ml) ou caneta 3ml (100 UI/ml)<br>
                Posologia: Aplicar ${glargina} unidades uma vez ao dia, antes de dormir, por via subcutânea.
            </li>
            
            <li style="margin-bottom: 15px;">
                <strong>Insulina Lispro</strong><br>
                Apresentação: Frasco-ampola 10ml (100 UI/ml) ou caneta 3ml (100 UI/ml)<br>
                Posologia: Aplicar ${lisproManha} unidades antes do café da manhã, ${lisproAlmoco} unidades antes do almoço e ${lisproJantar} unidades antes do jantar, por via subcutânea (0-15 minutos antes das refeições).
            </li>
            
            <li style="margin-bottom: 15px;">
                <strong>Seringas para insulina</strong><br>
                100 unidades com agulha 8mm<br>
                Quantidade: 60 unidades
            </li>
        </ol>
        
        <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p><strong>Orientações:</strong></p>
            <ul>
                <li>A insulina Glargina deve ser aplicada sempre no mesmo horário, preferencialmente antes de dormir.</li>
                <li>A insulina Lispro deve ser aplicada 0-15 minutos antes das refeições.</li>
                <li>Rodizie os locais de aplicação (abdômen, coxas, braços).</li>
                <li>Monitore a glicemia antes das principais refeições e ao deitar.</li>
                <li>Em caso de hipoglicemia, ingerir 15g de carboidratos (3 colheres de açúcar ou 150ml de suco).</li>
            </ul>
        </div>
        
        <p style="margin-top: 40px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
            ________________________________<br>
            Carimbo e Assinatura do Médico
        </p>`;
    }
    
    // Exibir a prescrição
    document.getElementById('prescricaoTexto').innerHTML = prescricaoTexto;
    document.getElementById('resultadoPrescricao').classList.add('show');
}

/**
 * Copia o texto da prescrição para a área de transferência
 */
function copiarPrescricao() {
    const prescricaoTexto = document.getElementById('prescricaoTexto').innerText;
    
    // Criar elemento temporário
    const tempElement = document.createElement('textarea');
    tempElement.value = prescricaoTexto;
    document.body.appendChild(tempElement);
    
    // Selecionar e copiar
    tempElement.select();
    document.execCommand('copy');
    
    // Remover elemento temporário
    document.body.removeChild(tempElement);
    
    // Feedback para o usuário
    alert('Prescrição copiada para a área de transferência!');
}

/**
 * Imprime a prescrição médica
 */
function imprimirPrescricao() {
    const conteudoOriginal = document.body.innerHTML;
    const conteudoImpressao = document.getElementById('prescricaoTexto').innerHTML;
    
    // Substituir conteúdo da página
    document.body.innerHTML = `
    <div style="padding: 20px; max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">
        ${conteudoImpressao}
    </div>`;
    
    // Imprimir
    window.print();
    
    // Restaurar conteúdo original
    document.body.innerHTML = conteudoOriginal;
    
    // Recarregar eventos e funcionalidades
    carregarFuncoes();
}

/**
 * Alterna entre visualização desktop e mobile
 */
function toggleView() {
    const container = document.getElementById('appContainer');
    container.classList.toggle('mobile-view');
    
    const toggleBtn = document.querySelector('.view-toggle');
    if (container.classList.contains('mobile-view')) {
        toggleBtn.innerHTML = '<i class="fas fa-desktop"></i>';
        toggleBtn.querySelector('i').style.marginRight = '0';
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-mobile-alt"></i>';
        toggleBtn.querySelector('i').style.marginRight = '0';
    }
}

/**
 * Abre o modal de referências
 */
function openReferencesModal() {
    document.getElementById('referencesModal').style.display = 'block';
}

/**
 * Fecha o modal de referências
 */
function closeReferencesModal() {
    document.getElementById('referencesModal').style.display = 'none';
}

/**
 * Recarrega todas as funcionalidades após impressão
 */
function carregarFuncoes() {
    // Inicializar event listeners
    initEventListeners();
    
    // Inicializar collapsible sections
    initCollapsibleSections();
}

/**
 * Inicializa as seções colapsáveis (collapsible)
 */
function initCollapsibleSections() {
    const coll = document.getElementsByClassName('collapsible');
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    }
}