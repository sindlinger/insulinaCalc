/**
 * InsulinaCalc - JavaScript principal
 * 
 * Este arquivo contém todas as funções necessárias para o funcionamento
 * da calculadora de insulina, incluindo os cálculos, manipulação da interface
 * e geração de prescrições médicas.
 * 
 * Desenvolvido por: Eduardo Candeia Gonçalves
 */

// Variáveis globais
let selectedRoute = 'sc';
let selectedRouteGL = 'sc';

// Funções de inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carregar componentes
    loadComponent('header-container', 'components/header.html');
    loadComponent('calculo-peso-container', 'components/calculo-peso.html');
    loadComponent('glargina-lispro-container', 'components/glargina-lispro.html');
    loadComponent('prescricao-container', 'components/prescricao.html');
    loadComponent('guia-info-container', 'components/guia-info-1.html');
    loadComponentAfter('guia-info-container', 'components/guia-info-2.html');
    loadComponent('footer-container', 'components/footer.html', function() {
        // Inicializar event listeners após carregar todos os componentes
        initEventListeners();
        
        // Inicializar collapsible sections
        initCollapsibleSections();
        
        // Verificar se há parâmetros na URL
        checkURLParams();
    });
});

// Função para carregar componentes
function loadComponent(containerId, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
            if (callback) callback();
        })
        .catch(error => {
            console.error(`Erro ao carregar ${url}:`, error);
        });
}

// Função para adicionar conteúdo após um elemento
function loadComponentAfter(containerId, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(containerId).innerHTML += html;
            if (callback) callback();
        })
        .catch(error => {
            console.error(`Erro ao carregar ${url}:`, error);
        });
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
            document.getElementById(tabId + '-container').classList.add('active');
            
            // Atualiza a URL com o ID da aba
            history.replaceState(null, null, '#' + tabId);
        });
    });
    
    // Event listeners para campos de fatores personalizados
    if (document.getElementById('selectFator')) {
        document.getElementById('selectFator').addEventListener('change', function() {
            const fatorPersonalizadoGroup = document.getElementById('fatorPersonalizadoGroup');
            if (this.value === '-1') {
                fatorPersonalizadoGroup.classList.remove('hidden');
            } else {
                fatorPersonalizadoGroup.classList.add('hidden');
            }
        });
    }
    
    if (document.getElementById('selectFatorGL')) {
        document.getElementById('selectFatorGL').addEventListener('change', function() {
            const fatorPersonalizadoGLGroup = document.getElementById('fatorPersonalizadoGLGroup');
            if (this.value === '-1') {
                fatorPersonalizadoGLGroup.classList.remove('hidden');
            } else {
                fatorPersonalizadoGLGroup.classList.add('hidden');
            }
        });
    }
    
    // Event listener para mudança de tipo de prescrição
    if (document.getElementById('selectTipoPrescrição')) {
        document.getElementById('selectTipoPrescrição').addEventListener('change', function() {
            const esquema1 = document.getElementById('prescricao-esquema1');
            const esquema2 = document.getElementById('prescricao-esquema2');
            
            if (this.value === 'esquema1') {
                esquema1.classList.remove('hidden');
                esquema2.classList.add('hidden');
            } else {
                esquema1.classList.add('hidden');
                esquema2.classList.remove('hidden');
            }
        });
    }
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

/**
 * Seleciona a via de administração para cálculo por peso
 * @param {string} route - Via de administração (sc)
 */
function selectRoute(route) {
    selectedRoute = route;
    
    // Remove a classe active de todas as opções
    document.querySelectorAll('#calculo-peso-container .route-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Adiciona a classe active na opção selecionada
    document.getElementById('route-' + route).classList.add('active');
    
    // Atualiza a descrição da via
    let description = 'Via subcutânea: Administração no tecido subcutâneo, geralmente abdômen, coxas ou braços. Via padrão para insulinoterapia.';
    document.getElementById('route-description').textContent = description;
}

/**
 * Seleciona a via de administração para Glargina/Lispro
 * @param {string} route - Via de administração (sc)
 */
function selectRouteGL(route) {
    selectedRouteGL = route;
    
    // Remove a classe active de todas as opções
    document.querySelectorAll('#glargina-lispro-container .route-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Adiciona a classe active na opção selecionada
    document.getElementById('route-' + route + '-gl').classList.add('active');
    
    // Atualiza a descrição da via
    let description = 'Via subcutânea: Administração no tecido subcutâneo, geralmente abdômen, coxas ou braços. Única via para Glargina e Lispro.';
    document.getElementById('route-description-gl').textContent = description;
}

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
    
    // Exibir resultados
    document.getElementById('doseTotalPeso').textContent = doseTotal;
    document.getElementById('doseManha').textContent = doseManha;
    document.getElementById('intermediariaManha').textContent = intermediariaManha;
    document.getElementById('rapidaManha').textContent = rapidaManha;
    document.getElementById('doseNoite').textContent = doseNoite;
    document.getElementById('intermediariaNoite').textContent = intermediariaNoite;
    document.getElementById('rapidaNoite').textContent = rapidaNoite;
    
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
    
    // Atualizar seletor de prescrição
    document.getElementById('selectTipoPrescrição').value = 'esquema2';
    const esquema1 = document.getElementById('prescricao-esquema1');
    const esquema2 = document.getElementById('prescricao-esquema2');
    esquema1.classList.add('hidden');
    esquema2.classList.remove('hidden');
    
    // Mostrar resultados
    document.getElementById('resultadosGL').classList.add('show');
}

/**

 * Gera prescrição médica com base no esquema selecionado e opções adicionais
 */
/**
 * Gera prescrição médica com base no esquema selecionado e opções adicionais
 */
/**
 * Gera prescrição médica com base no esquema selecionado e opções adicionais
 */
function gerarPrescricao() {
    const tipoEsquema = document.getElementById('selectTipoPrescrição').value;
    const tipoAcesso = document.getElementById('selectAcesso').value;
    const tipoDetalhamento = document.getElementById('selectDetalhamento').value;
    
    let prescricaoTexto = '';
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    // Cabeçalho da prescrição
    prescricaoTexto = `
    <h4>RECEITUÁRIO MÉDICO</h4>
    <p style="margin-bottom: 20px;">Data: ${dataAtual}</p>`;
    
    if (tipoEsquema === 'esquema1') {
        // Esquema NPH/Regular
        const nphManha = document.getElementById('nphManha').value || '0';
        const regularManha = document.getElementById('regularManha').value || '0';
        const nphNoite = document.getElementById('nphNoite').value || '0';
        const regularNoite = document.getElementById('regularNoite').value || '0';
        
        // Ajuste para diluição se necessário
        let diluicao = ''; 
        let detalheDiluicao = '';
        
        if (tipoAcesso === 'pediatrico') {
            diluicao = ' diluída na razão 1:10 (10 UI/ml)';
            detalheDiluicao = '<li><strong>Preparo da diluição (para 10ml):</strong> Aspire 10 unidades de insulina e complete com 90ml de Solução Fisiológica 0,9% para obter concentração final de 10 UI/ml.</li>';
        } else if (tipoAcesso === 'microgotas') {
            diluicao = ' diluída na razão 1:100 (1 UI/ml)';
            detalheDiluicao = '<li><strong>Preparo da diluição (para 10ml):</strong> Aspire 1 unidade de insulina e complete com 99ml de Solução Fisiológica 0,9% para obter concentração final de 1 UI/ml.</li>';
        }
        
        prescricaoTexto += `
        <ol>
            <li style="margin-bottom: 15px;">
                <strong>Insulina NPH Humana${diluicao}</strong><br>
                Apresentação: Frasco-ampola 10ml (100 UI/ml)<br>
                Posologia: 
                <ul>
                    <li>Manhã: ${nphManha} unidades, via subcutânea, 30 minutos antes do café da manhã</li>
                    <li>Noite: ${nphNoite} unidades, via subcutânea, 30 minutos antes do jantar</li>
                </ul>
            </li>
            
            <li style="margin-bottom: 15px;">
                <strong>Insulina Regular Humana${diluicao}</strong><br>
                Apresentação: Frasco-ampola 10ml (100 UI/ml)<br>
                Posologia: 
                <ul>
                    <li>Manhã: ${regularManha} unidades, via subcutânea, 30 minutos antes do café da manhã</li>
                    <li>Noite: ${regularNoite} unidades, via subcutânea, 30 minutos antes do jantar</li>
                </ul>
            </li>`;
            
        // Determinar tipo de seringa
        const maiorDose = Math.max(
            parseInt(nphManha) + parseInt(regularManha),
            parseInt(nphNoite) + parseInt(regularNoite)
        );
        
        let tipoSeringa = "100 unidades";
        if (maiorDose <= 30) {
            tipoSeringa = "30 unidades";
        } else if (maiorDose <= 50) {
            tipoSeringa = "50 unidades";
        }
        
        prescricaoTexto += `
            <li style="margin-bottom: 15px;">
                <strong>Seringas para insulina</strong><br>
                ${tipoSeringa} com agulha 8mm<br>
                Quantidade: 60 unidades
            </li>
        </ol>`;
            
    } else {
        // Esquema Glargina/Lispro
        const glargina = document.getElementById('glargina').value || '0';
        const lisproManha = document.getElementById('lisproManhaPrescricao').value || '0';
        const lisproAlmoco = document.getElementById('lisproAlmocoPrescricao').value || '0';
        const lisproJantar = document.getElementById('lisproJantarPrescricao').value || '0';
        
        // Ajuste para diluição se necessário
        let diluicaoGlargina = ''; 
        let diluicaoLispro = '';
        let detalheDiluicao = '';
        
        if (tipoAcesso === 'pediatrico') {
            diluicaoGlargina = ' diluída na razão 1:10 (10 UI/ml)';
            diluicaoLispro = ' diluída na razão 1:10 (10 UI/ml)';
            detalheDiluicao = '<li><strong>Preparo da diluição (para 10ml):</strong> Aspire 10 unidades de insulina e complete com 90ml de Solução Fisiológica 0,9% para obter concentração final de 10 UI/ml.</li>';
        } else if (tipoAcesso === 'microgotas') {
            diluicaoGlargina = ' diluída na razão 1:100 (1 UI/ml)';
            diluicaoLispro = ' diluída na razão 1:100 (1 UI/ml)';
            detalheDiluicao = '<li><strong>Preparo da diluição (para 10ml):</strong> Aspire 1 unidade de insulina e complete com 99ml de Solução Fisiológica 0,9% para obter concentração final de 1 UI/ml.</li>';
        }
        
        prescricaoTexto += `
        <ol>
            <li style="margin-bottom: 15px;">
                <strong>Insulina Glargina${diluicaoGlargina}</strong><br>
                Apresentação: Frasco-ampola 10ml (100 UI/ml) ou caneta 3ml (100 UI/ml)<br>
                Posologia: ${glargina} unidades, via subcutânea, uma vez ao dia, sempre no mesmo horário (preferencialmente entre 21-22h)
            </li>
            
            <li style="margin-bottom: 15px;">
                <strong>Insulina Lispro${diluicaoLispro}</strong><br>
                Apresentação: Frasco-ampola 10ml (100 UI/ml) ou caneta 3ml (100 UI/ml)<br>
                Posologia: 
                <ul>
                    <li>Café da manhã: ${lisproManha} unidades, via subcutânea, 0-15 minutos antes de iniciar a refeição</li>
                    <li>Almoço: ${lisproAlmoco} unidades, via subcutânea, 0-15 minutos antes de iniciar a refeição</li>
                    <li>Jantar: ${lisproJantar} unidades, via subcutânea, 0-15 minutos antes de iniciar a refeição</li>
                </ul>
            </li>`;
            
        // Determinar tipo de seringa
        const maiorDose = Math.max(
            parseInt(glargina),
            parseInt(lisproManha),
            parseInt(lisproAlmoco),
            parseInt(lisproJantar)
        );
        
        let tipoSeringa = "100 unidades";
        if (maiorDose <= 30) {
            tipoSeringa = "30 unidades";
        } else if (maiorDose <= 50) {
            tipoSeringa = "50 unidades";
        }
        
        prescricaoTexto += `
            <li style="margin-bottom: 15px;">
                <strong>Seringas para insulina</strong><br>
                ${tipoSeringa} com agulha 8mm${tipoAcesso === 'pediatrico' ? ' ou canetas com incrementos de 0.5U' : ''}<br>
                Quantidade: 60 unidades (ou 5 refis de 3ml se canetas)
            </li>
        </ol>`;
    }
    
    // Adicionar detalhes conforme o nível de detalhamento selecionado
    if (tipoDetalhamento === 'basico') {
        prescricaoTexto += `
        <div style="margin-top: 15px;">
            <p><strong>Orientações básicas:</strong></p>
            <ul>
                <li>Monitorar a glicemia regularmente.</li>
                <li>Em caso de hipoglicemia, ingerir carboidratos simples.</li>
                <li>Retornar em 30 dias para reavaliação.</li>
            </ul>
        </div>`;
    } else if (tipoDetalhamento === 'completo' || tipoDetalhamento === 'especializado') {
        prescricaoTexto += `
        <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p><strong>Detalhes sobre preparação e aplicação:</strong></p>
            <ul>`;
                
        if (tipoEsquema === 'esquema1') {
            prescricaoTexto += `
                <li><strong>Preparação da dose:</strong> Aspirar primeiro a insulina Regular e depois a NPH na mesma seringa, para evitar contaminação.</li>
                ${detalheDiluicao}`;
        } else {
            prescricaoTexto += `
                <li><strong>Insulina Glargina:</strong> Aplicar sempre no mesmo horário para manter um nível basal constante.</li>
                <li><strong>Insulina Lispro:</strong> Por ser de ação ultrarrápida, deve ser aplicada muito próximo ao início da refeição (0-15 minutos antes).</li>
                <li><strong>IMPORTANTE:</strong> NUNCA misturar Glargina com outras insulinas na mesma seringa.</li>
                ${detalheDiluicao}`;
        }
        
        prescricaoTexto += `
                <li><strong>Locais de aplicação:</strong> Realizar rodízio entre abdômen (absorção mais rápida), face externa das coxas, região posterior dos braços e região superior lateral das nádegas.</li>
                <li><strong>Técnica de aplicação:</strong> Limpar o local com álcool, pinçar a pele, introduzir a agulha a 90°, aspirar para verificar se não atingiu vaso sanguíneo, injetar lentamente e aguardar 5 segundos antes de retirar a agulha.</li>
                <li><strong>Armazenamento:</strong> Frascos em uso podem ser mantidos em temperatura ambiente (até 25°C) por até 30 dias. Frascos fechados devem ser refrigerados (2-8°C).</li>
            </ul>
        </div>
        
        <div style="margin-top: 15px;">
            <p><strong>Orientações adicionais:</strong></p>
            <ul>
                <li>Monitorar a glicemia antes das principais refeições e ao deitar.</li>
                <li>Em caso de hipoglicemia (glicemia <70 mg/dL), ingerir 15g de carboidratos (3 colheres de açúcar ou 150ml de suco).</li>
                <li>Não alterar as doses sem orientação médica.</li>
                <li>Retornar para reavaliação em 30 dias com registro das glicemias.</li>
            </ul>
        </div>`;
        
        // Adicionar justificativas técnicas para nível especializado
        if (tipoDetalhamento === 'especializado') {
            prescricaoTexto += `
            <div style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px;">
                <p><strong>Justificativas técnicas (para equipe de saúde):</strong></p>
                <ul>`;
                    
            if (tipoEsquema === 'esquema1') {
                prescricaoTexto += `
                    <li>O esquema NPH/Regular visa cobrir tanto a glicemia basal (através da NPH) quanto as excursões prandiais (através da Regular).</li>
                    <li>A divisão 70/30 matinal favorece uma maior cobertura durante o dia, período de maior atividade e ingestão alimentar.</li>
                    <li>A divisão 50/50 noturna visa reduzir o risco de hipoglicemia noturna, pois utiliza menos insulina intermediária.</li>
                    <li>Conforme ADA (2022), a aplicação de insulina Regular deve ser realizada 30 minutos antes das refeições para coincidir seu pico de ação com a elevação glicêmica pós-prandial.</li>`;
            } else {
                prescricaoTexto += `
                    <li>O esquema Glargina/Lispro proporciona um perfil mais fisiológico, com insulina basal constante (Glargina) e bolus prandiais (Lispro).</li>
                    <li>A proporção 60/40 é baseada na distribuição fisiológica da secreção endógena de insulina.</li>
                    <li>A Glargina administrada à noite favorece a supressão da gliconeogênese hepática, reduzindo a hiperglicemia de jejum.</li>
                    <li>A Lispro pode ser administrada imediatamente antes das refeições devido ao seu rápido início de ação (10-15min), melhorando a aderência ao tratamento.</li>
                    <li>Segundo estudo SWITCH 1 e 2, este esquema apresenta menor risco de hipoglicemias noturnas comparado ao esquema NPH/Regular.</li>`;
            }
            
            prescricaoTexto += `
                </ul>
            </div>`;
        }
    }
    
    prescricaoTexto += `
    <p style="margin-top: 40px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
        ________________________________<br>
        Carimbo e Assinatura do Médico<br>
        CRM: _________________
    </p>`;
    
    // Exibir a prescrição
    document.getElementById('prescricaoTexto').innerHTML = prescricaoTexto;
    document.getElementById('resultadoPrescricao').classList.add('show');

    // Mudar para a aba de prescrição
    document.querySelector(`.tab-link[data-tab="prescricao"]`).click();
}
/**
 * Exporta os resultados calculados diretamente para a prescrição
 * @param {string} esquema - Tipo de esquema ('esquema1' para NPH/Regular ou 'esquema2' para Glargina/Lispro)
 */
function exportarParaPrescricao(esquema) {
    // Selecionar aba prescrição
    document.querySelector(`.tab-link[data-tab="prescricao"]`).click();
    
    // Definir tipo de esquema
    document.getElementById('selectTipoPrescrição').value = esquema;
    
    // Simular mudança para mostrar/ocultar formulários corretos
    if (esquema === 'esquema1') {
        document.getElementById('prescricao-esquema1').classList.remove('hidden');
        document.getElementById('prescricao-esquema2').classList.add('hidden');
    } else {
        document.getElementById('prescricao-esquema1').classList.add('hidden');
        document.getElementById('prescricao-esquema2').classList.remove('hidden');
    }
    
    // Gerar prescrição automaticamente
    gerarPrescricao();
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
    <div class="print-container">
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
    const container = document.getElementById('app-container');
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
 * Abre o modal de informações
 */
function openModal() {
    document.getElementById('aboutModal').style.display = 'block';
}

/**
 * Fecha o modal de informações
 */
function closeModal() {
    document.getElementById('aboutModal').style.display = 'none';
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
    // Recarregar componentes
    location.reload();
}

// Fechar modais ao clicar fora deles
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};