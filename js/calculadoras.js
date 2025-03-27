// Arquivo: calculadoras.js - Funções de cálculo das diferentes calculadoras

// Variáveis globais para controle de seleções
let viaAdministracaoSelecionada = 'sc'; // Padrão: subcutânea
let tipoInsulinaSelecionada = 'regular'; // Padrão: regular

// Objeto para armazenar os últimos resultados de cada calculadora
window.ultimosResultados = {
    peso: null,
    bolus: null,
    bomba: null
};

/**
 * Calcula doses de insulina com base no peso
 */
function calcularPeso() {
    var peso = parseFloat(document.getElementById("inputPeso").value);
    
    // Validar entrada
    if (isNaN(peso) || peso <= 0) {
        alert("Por favor, insira um peso válido.");
        return;
    }
    
    // Obter o fator correto
    var fatorSelect = document.getElementById("selectFator");
    var fator;
    
    if (fatorSelect.value === "-1") {
        fator = parseFloat(document.getElementById("inputFatorPersonalizado").value);
        if (isNaN(fator) || fator <= 0) {
            alert("Por favor, insira um fator personalizado válido.");
            return;
        }
    } else {
        fator = parseFloat(fatorSelect.value);
    }
    
    // Cálculo principal: Peso * Fator = Dose total
    var doseTotal = peso * fator;

    // Distribuição dia/noite (70% dia, 30% noite)
    var doseDia = doseTotal * 0.7;
    var doseNoite = doseTotal * 0.3;

    // Divisão do dia (70% NPH, 30% Regular)
    var intermediariaManha = doseDia * 0.7;
    var rapidaManha = doseDia * 0.3;

    // Divisão da noite (50% NPH, 50% Regular)
    var intermediariaNoite = doseNoite * 0.5;
    var rapidaNoite = doseNoite * 0.5;
    
    // Esquema basal-bolus alternativo (50/50)
    var basal = doseTotal * 0.5;
    var bolusTotal = doseTotal * 0.5;
    
    // Dividir bolus em 3 refeições
    var bolusCafe = bolusTotal * 0.4;  // 40% no café
    var bolusAlmoco = bolusTotal * 0.3;  // 30% no almoço
    var bolusJantar = bolusTotal * 0.3;  // 30% no jantar
    
    // Aplicar ajustes baseados na via de administração selecionada
    let ajusteDose = 1.0; // Fator de ajuste padrão (sem alteração)
    let infoVia = "";
    
    switch(viaAdministracaoSelecionada) {
        case 'sc':
            // Subcutânea - valor de referência (sem ajuste)
            infoVia = "Via subcutânea: Administração padrão, sem ajustes necessários.";
            break;
        case 'iv':
            // Intravenosa - dose menor pela absorção direta
            ajusteDose = 0.7; // 70% da dose SC
            infoVia = "Via intravenosa: Dose reduzida para 80% da dose subcutânea devido à absorção direta. Monitorar glicemia a cada 1-2h inicialmente.";
            break;
        case 'im':
            // Intramuscular - absorção mais rápida, ajuste intermediário
            ajusteDose = 0.85; // 85% da dose SC
            infoVia = "Via intramuscular: Dose reduzida para 85% da dose subcutânea. Absorção mais rápida e menos previsível que SC.";
            break;
    }
    
    // Aplicar o ajuste a todas as doses
    doseTotal *= ajusteDose;
    doseDia *= ajusteDose;
    doseNoite *= ajusteDose;
    intermediariaManha *= ajusteDose;
    rapidaManha *= ajusteDose;
    intermediariaNoite *= ajusteDose;
    rapidaNoite *= ajusteDose;
    basal *= ajusteDose;
    bolusTotal *= ajusteDose;
    bolusCafe *= ajusteDose;
    bolusAlmoco *= ajusteDose;
    bolusJantar *= ajusteDose;
    
    // Exibir resultados
    document.getElementById("doseTotalPeso").textContent = formatarNumero(doseTotal);
    document.getElementById("doseManha").textContent = formatarNumero(doseDia);
    document.getElementById("intermediariaManha").textContent = formatarNumero(intermediariaManha);
    document.getElementById("rapidaManha").textContent = formatarNumero(rapidaManha);
    document.getElementById("doseNoite").textContent = formatarNumero(doseNoite);
    document.getElementById("intermediariaNoite").textContent = formatarNumero(intermediariaNoite);
    document.getElementById("rapidaNoite").textContent = formatarNumero(rapidaNoite);
    document.getElementById("doseBasal").textContent = formatarNumero(basal);
    document.getElementById("bolusTotal").textContent = formatarNumero(bolusTotal);
    document.getElementById("bolusCafe").textContent = formatarNumero(bolusCafe);
    document.getElementById("bolusAlmoco").textContent = formatarNumero(bolusAlmoco);
    document.getElementById("bolusJantar").textContent = formatarNumero(bolusJantar);
    
    // Atualizar a descrição da via com informações sobre o impacto
    document.getElementById('route-description').innerHTML = infoVia + 
        '<span class="route-impact-info">A via selecionada impactou o cálculo das doses.</span>';
    
    // Mostrar o botão de exemplo de prescrição
    const btnPrescrição = document.getElementById('prescription-btn');
    if (btnPrescrição) {
        btnPrescrição.style.display = 'flex';
    } else {
        // Criar o botão se ainda não existe
        const resultadosDiv = document.getElementById('resultadosPeso');
        const btnHTML = `<button id="prescription-btn" class="prescription-btn" onclick="mostrarExemploPrescricao()">
            <i class="fas fa-file-prescription"></i> Ver exemplo de prescrição
        </button>`;
        
        resultadosDiv.insertAdjacentHTML('afterend', btnHTML);
    }
    
    document.getElementById("resultadosPeso").style.display = "block";
    
    // Salvar os valores calculados para uso na função de prescrição antiga
    window.ultimoResultado = {
        doseTotal, 
        intermediariaManha, 
        rapidaManha, 
        intermediariaNoite, 
        rapidaNoite,
        basal,
        bolusCafe,
        bolusAlmoco,
        bolusJantar,
        via: viaAdministracaoSelecionada,
        peso: peso
    };
    
    // Salvar os valores calculados no sistema unificado
    window.ultimosResultados.peso = {
        doseTotal, 
        intermediariaManha, 
        rapidaManha, 
        intermediariaNoite, 
        rapidaNoite,
        basal,
        bolusCafe,
        bolusAlmoco,
        bolusJantar,
        via: viaAdministracaoSelecionada,
        peso: peso
    };
}

/**
 * Mostra um exemplo de prescrição baseado nos resultados calculados
 * Função original, mantida para compatibilidade
 */
function mostrarExemploPrescricao() {
    if (!window.ultimoResultado) {
        alert("Por favor, calcule as doses primeiro.");
        return;
    }
    
    // Preparar o conteúdo do modal de prescrição
    let modalHTML = `
    <div id="prescricaoModal" class="modal">
        <div class="modal-content" style="max-width: 700px;">
            <span class="close-modal" onclick="document.getElementById('prescricaoModal').style.display='none'">&times;</span>
            <h2 class="modal-title">Exemplo de Prescrição</h2>
            
            <div style="padding: 20px; background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 8px;">
                <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 15px;">
                    Prescrição Médica - Insulinoterapia (${formatarData()})
                </h3>
                
                <p><strong>Paciente:</strong> _____________________ &nbsp;&nbsp;&nbsp; <strong>Peso:</strong> ${window.ultimoResultado.peso} kg</p>
                
                <h4 style="margin-top: 15px;">Esquema Convencional (70/30)</h4>
    `;
    
    // Ajustar conteúdo de acordo com a via
    if (window.ultimoResultado.via === 'sc') {
        // Via subcutânea
        modalHTML += `
                <p>1. Insulina NPH ${formatarNumero(window.ultimoResultado.intermediariaManha)} U, subcutânea, 30 minutos antes do café da manhã.</p>
                <p>2. Insulina Regular ${formatarNumero(window.ultimoResultado.rapidaManha)} U, subcutânea, 30 minutos antes do café da manhã.</p>
                <p>3. Insulina NPH ${formatarNumero(window.ultimoResultado.intermediariaNoite)} U, subcutânea, 30 minutos antes do jantar.</p>
                <p>4. Insulina Regular ${formatarNumero(window.ultimoResultado.rapidaNoite)} U, subcutânea, 30 minutos antes do jantar.</p>
                
                <div style="margin: 15px 0; border-top: 1px dashed #ccc; padding-top: 15px;">
                    <h4>Alternativa: Esquema Basal-Bolus</h4>
                    <p>1. Insulina Glargina ${formatarNumero(window.ultimoResultado.basal)} U, subcutânea, 1x ao dia (mesmo horário).</p>
                    <p>2. Insulina Regular ${formatarNumero(window.ultimoResultado.bolusCafe)} U, subcutânea, 30 minutos antes do café da manhã.</p>
                    <p>3. Insulina Regular ${formatarNumero(window.ultimoResultado.bolusAlmoco)} U, subcutânea, 30 minutos antes do almoço.</p>
                    <p>4. Insulina Regular ${formatarNumero(window.ultimoResultado.bolusJantar)} U, subcutânea, 30 minutos antes do jantar.</p>
                </div>
        `;
    } else if (window.ultimoResultado.via === 'iv') {
        // Via intravenosa
        modalHTML += `
                <p><strong>PRESCRIÇÃO PARA USO INTRAVENOSO (AMBIENTE HOSPITALAR):</strong></p>
                <p>1. Insulina Regular ${formatarNumero(window.ultimoResultado.doseTotal / 24)} U/h em infusão contínua (diluir em SF 0,9%).</p>
                <p>2. Monitorizar glicemia capilar a cada 1-2 horas inicialmente, depois a cada 4-6 horas.</p>
                <p>3. Ajustar velocidade de infusão conforme protocolo institucional.</p>
                <p><strong>Preparo da solução:</strong> Diluir ${formatarNumero(window.ultimoResultado.doseTotal)} U de Insulina Regular em 100 mL de SF 0,9%.</p>
                <p><strong>Concentração final:</strong> ${formatarNumero(window.ultimoResultado.doseTotal / 100)} U/mL.</p>
                <p><strong>Velocidade de infusão inicial:</strong> ${formatarNumero(window.ultimoResultado.doseTotal / 24)} mL/h.</p>
                
                <div style="margin: 15px 0; border-top: 1px dashed #ccc; padding-top: 15px;">
                    <p><strong>Observações importantes:</strong></p>
                    <ul style="margin-left: 20px;">
                        <li>Utilizar bomba de infusão de seringa.</li>
                        <li>Trocar a solução e o sistema a cada 24 horas.</li>
                        <li>Meta glicêmica: 140-180 mg/dL (pacientes críticos).</li>
                        <li>Avaliar potássio sérico antes de iniciar a infusão e a cada 4-6 horas.</li>
                    </ul>
                </div>
        `;
    } else if (window.ultimoResultado.via === 'im') {
        // Via intramuscular
        modalHTML += `
                <p><strong>PRESCRIÇÃO PARA USO INTRAMUSCULAR (SITUAÇÕES ESPECIAIS):</strong></p>
                <p>1. Insulina Regular ${formatarNumero(window.ultimoResultado.rapidaManha)} U, intramuscular, 15 minutos antes do café da manhã.</p>
                <p>2. Insulina NPH ${formatarNumero(window.ultimoResultado.intermediariaManha)} U, intramuscular, após o café da manhã.</p>
                <p>3. Insulina Regular ${formatarNumero(window.ultimoResultado.rapidaNoite)} U, intramuscular, 15 minutos antes do jantar.</p>
                <p>4. Insulina NPH ${formatarNumero(window.ultimoResultado.intermediariaNoite)} U, intramuscular, após o jantar.</p>
                
                <div style="margin: 15px 0; border-top: 1px dashed #ccc; padding-top: 15px;">
                    <p><strong>Observações importantes:</strong></p>
                    <ul style="margin-left: 20px;">
                        <li>A via intramuscular deve ser utilizada apenas em situações excepcionais, quando a via subcutânea não for possível.</li>
                        <li>A absorção é mais rápida e menos previsível que a via subcutânea.</li>
                        <li>Monitorar glicemia capilar a cada 4 horas.</li>
                        <li>Retornar à via subcutânea assim que possível.</li>
                    </ul>
                </div>
        `;
    }
    
    // Finalizar o HTML do modal
    modalHTML += `
                <div style="margin-top: 15px; padding: 10px; background-color: #e8f4fc; border-radius: 4px;">
                    <p style="font-size: 13px;"><strong>Nota:</strong> Esta prescrição é um exemplo educativo baseado nos cálculos da calculadora e deve ser adaptada considerando a condição clínica individual do paciente, protocolos institucionais e avaliação médica.</p>
                </div>
            </div>
            
            <div style="margin-top: 15px; text-align: right;">
                <button class="reference-btn" onclick="imprimirPrescricao()">
                    <i class="fas fa-print"></i> Imprimir
                </button>
            </div>
        </div>
    </div>
    `;
    
    // Adicionar o modal ao corpo do documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar o modal
    document.getElementById('prescricaoModal').style.display = 'block';
}

/**
 * Função para impressão da prescrição
 */
function imprimirPrescricao() {
    const conteudo = document.querySelector('.modal-content').innerHTML;
    const janelaImpressao = window.open('', '', 'height=600,width=800');
    
    janelaImpressao.document.write('<html><head><title>Exemplo de Prescrição</title>');
    // Adicionar estilos básicos para impressão
    janelaImpressao.document.write('<style>body { font-family: Arial, sans-serif; } h2, h3, h4 { color: #2980b9; }</style>');
    janelaImpressao.document.write('</head><body>');
    janelaImpressao.document.write(conteudo);
    janelaImpressao.document.write('</body></html>');
    
    janelaImpressao.document.close();
    janelaImpressao.focus();
    
    // Remover botões da impressão
    const botoesRemover = janelaImpressao.document.querySelectorAll('button, .close-modal');
    botoesRemover.forEach(btn => btn.style.display = 'none');
    
    // Imprimir após um pequeno delay para garantir que o documento foi carregado
    setTimeout(() => {
        janelaImpressao.print();
        janelaImpressao.close();
    }, 500);
}

/**
 * Formata a data atual no formato brasileiro
 * @returns {string} Data formatada (ex: 15/04/2023)
 */
function formatarData() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
}

/**
 * Formata a data e hora atual no formato brasileiro
 * @returns {string} Data e hora formatadas (ex: 15/04/2023 14:30)
 */
function formatarDataHora() {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');
    
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

/**
 * Selecionar a via de administração
 * @param {string} route - Código da via (sc, iv, im)
 */
function selectRoute(route) {
    // Remover classe active de todas as opções
    document.querySelectorAll('.route-option').forEach(function(option) {
        option.classList.remove('active');
    });
    
    // Adicionar classe active à opção selecionada
    document.getElementById('route-' + route).classList.add('active');
    
    // Guardar a via selecionada
    viaAdministracaoSelecionada = route;
    
    // Atualizar a descrição conforme a via selecionada
    let description = "";
    switch(route) {
        case 'sc':
            description = "Via subcutânea: Administração no tecido subcutâneo, geralmente abdômen, coxas ou braços. Via padrão para insulinoterapia.";
            break;
        case 'iv':
            description = "Via intravenosa: Administração direta na corrente sanguínea. Uso hospitalar ou emergencial. Requer ajuste de dose.";
            break;
        case 'im':
            description = "Via intramuscular: Administração no tecido muscular. Absorção mais rápida que a subcutânea. Uso em situações especiais.";
            break;
    }
    document.getElementById('route-description').innerHTML = description + 
        '<span class="route-impact-info">Esta seleção afetará os resultados do cálculo.</span>';
    
    // Se já temos resultados exibidos, recalcular automaticamente
    if (document.getElementById('resultadosPeso').style.display === 'block') {
        calcularPeso();
    }
}

/**
 * Calcula bolus de insulina com base na glicemia atual e carboidratos
 */
function calcularBolus() {
    var glicemiaAtual = parseFloat(document.getElementById("inputGlicemiaAtual").value);
    var glicemiaAlvo = parseFloat(document.getElementById("inputGlicemiaAlvo").value);
    var carboidratos = parseFloat(document.getElementById("inputCarboidratos").value);
    var razaoIC = parseFloat(document.getElementById("inputRazaoIC").value);
    var fsi = parseFloat(document.getElementById("inputFSI").value);
    
    // Validar entradas
    if (isNaN(glicemiaAtual) || isNaN(glicemiaAlvo) || isNaN(razaoIC) || isNaN(fsi)) {
        alert("Por favor, preencha todos os campos obrigatórios com valores válidos.");
        return;
    }
    
    if (razaoIC <= 0 || fsi <= 0) {
        alert("Razão IC e FSI devem ser maiores que zero.");
        return;
    }
    
    // Se não houver carboidratos, definir como 0
    if (isNaN(carboidratos)) {
        carboidratos = 0;
    }
    
    // Cálculo do bolus de correção
    var diferencaGlicemia = Math.max(0, glicemiaAtual - glicemiaAlvo);
    var bolusCorrecao = diferencaGlicemia / fsi;
    
    // Cálculo do bolus alimentar
    var bolusAlimentar = carboidratos / razaoIC;
    
    // Bolus total
    var bolusTotal = bolusCorrecao + bolusAlimentar;
    
    // Exibir resultados
    document.getElementById("diferencaGlicemia").textContent = formatarNumero(diferencaGlicemia);
    document.getElementById("bolusCorrecao").textContent = formatarNumero(bolusCorrecao);
    document.getElementById("bolusAlimentar").textContent = formatarNumero(bolusAlimentar);
    document.getElementById("bolusTotalFinal").textContent = formatarNumero(bolusTotal);
    
    // Atualizar timing info baseado no tipo de insulina selecionado
    let timingInfo = "";
    if (document.getElementById('insulin-rapid').classList.contains('active')) {
        timingInfo = `
            <strong>Insulina Ultrarrápida:</strong> 
            <ul class="timing-list">
                <li><i class="fas fa-angle-right"></i> Aplicar 0-15 minutos antes da refeição</li>
                <li><i class="fas fa-angle-right"></i> Pode ser aplicada imediatamente antes ou até logo após iniciar a refeição</li>
            </ul>
        `;
    } else {
        timingInfo = `
            <strong>Insulina Regular:</strong> 
            <ul class="timing-list">
                <li><i class="fas fa-angle-right"></i> Aplicar 30 minutos antes da refeição</li>
                <li><i class="fas fa-angle-right"></i> Esperar absorção antes de se alimentar para evitar picos glicêmicos</li>
            </ul>
        `;
    }
    document.getElementById('bolus-timing-info').innerHTML = timingInfo;
    
    document.getElementById("resultadosBolus").style.display = "block";
    
    // Salvar os valores calculados no sistema unificado
    window.ultimosResultados.bolus = {
        glicemiaAtual,
        glicemiaAlvo,
        carboidratos,
        diferencaGlicemia,
        bolusCorrecao,
        bolusAlimentar,
        bolusTotal,
        tipoInsulina: document.getElementById('insulin-rapid').classList.contains('active') ? 'rapid' : 'regular'
    };
    
    // Adicionar botão de prescrição
    if (typeof adicionarBotaoPrescrição === 'function') {
        adicionarBotaoPrescrição('resultadosBolus', 'bolus');
    }
}

/**
 * Seleciona o tipo de insulina para bolus
 * @param {string} type - Tipo de insulina (regular, rapid)
 */
function selectInsulinType(type) {
    // Remover classe active de todas as opções
    document.querySelectorAll('.route-option').forEach(function(option) {
        option.classList.remove('active');
    });
    
    // Adicionar classe active à opção selecionada
    document.getElementById('insulin-' + type).classList.add('active');
    
    // Guardar o tipo selecionado
    tipoInsulinaSelecionada = type;
    
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

/**
 * Calcula doses para bomba de infusão com base no peso
 */
function calcularBomba() {
    var peso = parseFloat(document.getElementById("inputPesoBomba").value);
    var doseBombaSelect = document.getElementById("selectDoseBomba");
    var doseBomba;
    
    // Validar entrada
    if (isNaN(peso) || peso <= 0) {
        alert("Por favor, insira um peso válido.");
        return;
    }
    
    // Obter a dose correta
    if (doseBombaSelect.value === "-1") {
        doseBomba = parseFloat(document.getElementById("inputDoseBombaPersonalizada").value);
        if (isNaN(doseBomba) || doseBomba <= 0) {
            alert("Por favor, insira uma dosagem personalizada válida.");
            return;
        }
    } else {
        doseBomba = parseFloat(doseBombaSelect.value);
    }
    
    // Obter a concentração
    var concentracao = parseFloat(document.getElementById("selectConcentracao").value);
    
    // Cálculos
    var doseHoraria = peso * doseBomba;
    var volumeInfusao = doseHoraria / concentracao;
    var velocidadeInfusao = volumeInfusao;
    
    var doseDia = doseHoraria * 24;
    var volumeDia = volumeInfusao * 24;
    
    // Exibir resultados
    document.getElementById("doseHorariaBomba").textContent = formatarNumero(doseHoraria);
    document.getElementById("volumeInfusao").textContent = formatarNumero(volumeInfusao);
    document.getElementById("velocidadeInfusao").textContent = formatarNumero(velocidadeInfusao);
    document.getElementById("doseDia").textContent = formatarNumero(doseDia);
    document.getElementById("volumeDia").textContent = formatarNumero(volumeDia);
    document.getElementById("resultadosBomba").style.display = "block";
    
    // Salvar dados para possível prescrição (para compatibilidade com código antigo)
    window.ultimoResultadoBomba = {
        doseHoraria,
        volumeInfusao,
        velocidadeInfusao,
        doseDia,
        volumeDia,
        concentracao,
        peso
    };
    
    // Salvar dados no sistema unificado
    window.ultimosResultados.bomba = {
        doseHoraria,
        volumeInfusao,
        velocidadeInfusao,
        doseDia,
        volumeDia,
        concentracao,
        peso
    };
    
    // Adicionar botão de prescrição
    if (typeof adicionarBotaoPrescrição === 'function') {
        adicionarBotaoPrescrição('resultadosBomba', 'bomba');
    }
}

/**
 * Formata um número para exibição
 * @param {number} numero - Número a ser formatado
 * @returns {string} Número formatado com uma casa decimal
 */
function formatarNumero(numero) {
    // Arredondar para uma casa decimal
    return Number(numero.toFixed(1)).toLocaleString('pt-BR');
}

/**
 * Funções do sistema de prescrição unificado
 * Estas funções são definidas em detalhe no arquivo prescricao.js
 * Estão aqui apenas como stubs para garantir compatibilidade no caso do arquivo não estar carregado
 */

// Verifica se a função já existe antes de definir
if (typeof adicionarBotaoPrescrição !== 'function') {
    function adicionarBotaoPrescrição(containerId, tipoCalculo) {
        console.log("Sistema de prescrição unificado não carregado. Usando função padrão.");
        // Para calculadora de peso, usa o comportamento padrão
        if (tipoCalculo === 'peso' && containerId === 'resultadosPeso') {
            const btnPrescrição = document.getElementById('prescription-btn');
            if (btnPrescrição) {
                btnPrescrição.style.display = 'flex';
            } else {
                // Criar o botão se ainda não existe
                const resultadosDiv = document.getElementById('resultadosPeso');
                const btnHTML = `<button id="prescription-btn" class="prescription-btn" onclick="mostrarExemploPrescricao()">
                    <i class="fas fa-file-prescription"></i> Ver exemplo de prescrição
                </button>`;
                
                resultadosDiv.insertAdjacentHTML('afterend', btnHTML);
            }
        }
    }
}

// Inicializar o objeto de resultados se ainda não existir
if (!window.ultimosResultados) {
    window.ultimosResultados = {
        peso: null,
        bolus: null,
        bomba: null
    };
}