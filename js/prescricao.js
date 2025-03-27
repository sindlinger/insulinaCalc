/**
 * Sistema de prescrição reutilizável para calculadoras de insulina
 * Este módulo permite gerar exemplos de prescrição para diferentes calculadoras
 */

// Objeto para armazenar os últimos resultados de cada calculadora
window.ultimosResultados = {
    peso: null,
    bolus: null,
    bomba: null
};

/**
 * Adiciona um botão de prescrição à div especificada
 * @param {string} containerId - ID do container onde o botão será adicionado
 * @param {string} tipoCalculo - Tipo de cálculo ('peso', 'bolus', 'bomba')
 */
function adicionarBotaoPrescrição(containerId, tipoCalculo) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Verificar se o botão já existe
    const btnExistente = document.getElementById('prescription-btn-' + tipoCalculo);
    if (btnExistente) {
        btnExistente.style.display = 'flex';
        return;
    }
    
    // Criar o botão se não existe
    const btnHTML = `<button id="prescription-btn-${tipoCalculo}" class="prescription-btn" 
        onclick="mostrarExemploPrescricao('${tipoCalculo}')">
        <i class="fas fa-file-prescription"></i> Ver exemplo de prescrição
    </button>`;
    
    container.insertAdjacentHTML('afterend', btnHTML);
}

/**
 * Mostra um exemplo de prescrição baseado no tipo de cálculo
 * @param {string} tipoCalculo - Tipo de cálculo ('peso', 'bolus', 'bomba')
 */
function mostrarExemploPrescricao(tipoCalculo) {
    // Se não for especificado um tipo, usar a função original para peso (compatibilidade)
    if (!tipoCalculo) {
        if (typeof window.mostrarExemploPrescricaoOriginal === 'function') {
            return window.mostrarExemploPrescricaoOriginal();
        } else if (window.ultimoResultado) {
            // Usar a implementação original se existir
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
            
            if (window.ultimoResultado.via === 'sc') {
                modalHTML += gerarConteudoPrescricaoPeso(window.ultimoResultado);
            } else if (window.ultimoResultado.via === 'iv') {
                modalHTML += gerarConteudoPrescricaoPesoIV(window.ultimoResultado);
            } else if (window.ultimoResultado.via === 'im') {
                modalHTML += gerarConteudoPrescricaoPesoIM(window.ultimoResultado);
            }
            
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
            return;
        }
    }
    
    const resultado = window.ultimosResultados[tipoCalculo];
    
    if (!resultado) {
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
                </h3>`;
    
    // Conteúdo específico para cada tipo de cálculo
    switch(tipoCalculo) {
        case 'peso':
            modalHTML += gerarConteudoPrescricaoPeso(resultado);
            break;
        case 'bolus':
            modalHTML += gerarConteudoPrescricaoBolus(resultado);
            break;
        case 'bomba':
            modalHTML += gerarConteudoPrescricaoBomba(resultado);
            break;
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
    
    // Verificar se o modal já existe e removê-lo se necessário
    const modalExistente = document.getElementById('prescricaoModal');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    // Adicionar o modal ao corpo do documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar o modal
    document.getElementById('prescricaoModal').style.display = 'block';
}

/**
 * Gera o conteúdo HTML da prescrição baseada no peso
 * @param {Object} resultado - Objeto com os resultados do cálculo
 * @returns {string} HTML formatado
 */
function gerarConteudoPrescricaoPeso(resultado) {
    let conteudoHTML = `
        <p><strong>Paciente:</strong> _____________________ &nbsp;&nbsp;&nbsp; <strong>Peso:</strong> ${resultado.peso} kg</p>
        
        <h4 style="margin-top: 15px;">Esquema Convencional (70/30)</h4>
    `;
    
    // Ajustar conteúdo de acordo com a via
    if (resultado.via === 'sc') {
        // Via subcutânea
        conteudoHTML += `
            <p>1. Insulina NPH ${formatarNumero(resultado.intermediariaManha)} U, subcutânea, 30 minutos antes do café da manhã.</p>
            <p>2. Insulina Regular ${formatarNumero(resultado.rapidaManha)} U, subcutânea, 30 minutos antes do café da manhã.</p>
            <p>3. Insulina NPH ${formatarNumero(resultado.intermediariaNoite)} U, subcutânea, 30 minutos antes do jantar.</p>
            <p>4. Insulina Regular ${formatarNumero(resultado.rapidaNoite)} U, subcutânea, 30 minutos antes do jantar.</p>
            
            <div style="margin: 15px 0; border-top: 1px dashed #ccc; padding-top: 15px;">
                <h4>Alternativa: Esquema Basal-Bolus</h4>
                <p>1. Insulina Glargina ${formatarNumero(resultado.basal)} U, subcutânea, 1x ao dia (mesmo horário).</p>
                <p>2. Insulina Regular ${formatarNumero(resultado.bolusCafe)} U, subcutânea, 30 minutos antes do café da manhã.</p>
                <p>3. Insulina Regular ${formatarNumero(resultado.bolusAlmoco)} U, subcutânea, 30 minutos antes do almoço.</p>
                <p>4. Insulina Regular ${formatarNumero(resultado.bolusJantar)} U, subcutânea, 30 minutos antes do jantar.</p>
            </div>
        `;
    } else if (resultado.via === 'iv') {
        // Via intravenosa
        conteudoHTML += gerarConteudoPrescricaoPesoIV(resultado);
    } else if (resultado.via === 'im') {
        // Via intramuscular
        conteudoHTML += gerarConteudoPrescricaoPesoIM(resultado);
    }
    
    return conteudoHTML;
}

/**
 * Gera o conteúdo HTML da prescrição para via intravenosa
 * @param {Object} resultado - Objeto com os resultados do cálculo
 * @returns {string} HTML formatado
 */
function gerarConteudoPrescricaoPesoIV(resultado) {
    return `
        <p><strong>PRESCRIÇÃO PARA USO INTRAVENOSO (AMBIENTE HOSPITALAR):</strong></p>
        <p>1. Insulina Regular ${formatarNumero(resultado.doseTotal / 24)} U/h em infusão contínua (diluir em SF 0,9%).</p>
        <p>2. Monitorizar glicemia capilar a cada 1-2 horas inicialmente, depois a cada 4-6 horas.</p>
        <p>3. Ajustar velocidade de infusão conforme protocolo institucional.</p>
        <p><strong>Preparo da solução:</strong> Diluir ${formatarNumero(resultado.doseTotal)} U de Insulina Regular em 100 mL de SF 0,9%.</p>
        <p><strong>Concentração final:</strong> ${formatarNumero(resultado.doseTotal / 100)} U/mL.</p>
        <p><strong>Velocidade de infusão inicial:</strong> ${formatarNumero(resultado.doseTotal / 24)} mL/h.</p>
        
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
}

/**
 * Gera o conteúdo HTML da prescrição para via intramuscular
 * @param {Object} resultado - Objeto com os resultados do cálculo
 * @returns {string} HTML formatado
 */
function gerarConteudoPrescricaoPesoIM(resultado) {
    return `
        <p><strong>PRESCRIÇÃO PARA USO INTRAMUSCULAR (SITUAÇÕES ESPECIAIS):</strong></p>
        <p>1. Insulina Regular ${formatarNumero(resultado.rapidaManha)} U, intramuscular, 15 minutos antes do café da manhã.</p>
        <p>2. Insulina NPH ${formatarNumero(resultado.intermediariaManha)} U, intramuscular, após o café da manhã.</p>
        <p>3. Insulina Regular ${formatarNumero(resultado.rapidaNoite)} U, intramuscular, 15 minutos antes do jantar.</p>
        <p>4. Insulina NPH ${formatarNumero(resultado.intermediariaNoite)} U, intramuscular, após o jantar.</p>
        
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

/**
 * Gera o conteúdo HTML da prescrição baseada no bolus
 * @param {Object} resultado - Objeto com os resultados do cálculo
 * @returns {string} HTML formatado
 */
function gerarConteudoPrescricaoBolus(resultado) {
    let conteudoHTML = `
        <p><strong>Paciente:</strong> _____________________ &nbsp;&nbsp;&nbsp; <strong>Data/Hora:</strong> ${formatarDataHora()}</p>
        <p><strong>Glicemia atual:</strong> ${resultado.glicemiaAtual} mg/dL &nbsp;&nbsp;&nbsp; <strong>Meta:</strong> ${resultado.glicemiaAlvo} mg/dL</p>
        <p><strong>Conteúdo de carboidratos da refeição:</strong> ${resultado.carboidratos || 0} g</p>
        
        <h4 style="margin-top: 15px;">Prescrição de Bolus de Insulina</h4>
    `;
    
    if (resultado.tipoInsulina === 'rapid') {
        conteudoHTML += `
            <p><strong>Insulina:</strong> Análoga Ultrarrápida (Lispro, Aspart ou Glulisina)</p>
            <p><strong>Dose:</strong> ${formatarNumero(resultado.bolusTotal)} U, via subcutânea</p>
            <p><strong>Aplicação:</strong> Imediatamente antes da refeição</p>
            
            <div style="margin: 15px 0; padding: 10px; background-color: #f1f8e9; border-radius: 4px; border-left: 4px solid #7cb342;">
                <p><strong>Detalhamento da dose:</strong></p>
                <ul style="margin-left: 20px;">
                    <li>Correção da glicemia: ${formatarNumero(resultado.bolusCorrecao)} U</li>
                    <li>Cobertura de carboidratos: ${formatarNumero(resultado.bolusAlimentar)} U</li>
                </ul>
            </div>
        `;
    } else {
        conteudoHTML += `
            <p><strong>Insulina:</strong> Regular</p>
            <p><strong>Dose:</strong> ${formatarNumero(resultado.bolusTotal)} U, via subcutânea</p>
            <p><strong>Aplicação:</strong> 30 minutos antes da refeição</p>
            
            <div style="margin: 15px 0; padding: 10px; background-color: #f1f8e9; border-radius: 4px; border-left: 4px solid #7cb342;">
                <p><strong>Detalhamento da dose:</strong></p>
                <ul style="margin-left: 20px;">
                    <li>Correção da glicemia: ${formatarNumero(resultado.bolusCorrecao)} U</li>
                    <li>Cobertura de carboidratos: ${formatarNumero(resultado.bolusAlimentar)} U</li>
                </ul>
            </div>
        `;
    }
    
    conteudoHTML += `
        <div style="margin: 15px 0; border-top: 1px dashed #ccc; padding-top: 15px;">
            <p><strong>Monitorização:</strong></p>
            <p>Verificar glicemia capilar 2 horas após a aplicação do bolus.</p>
            <p>Meta pós-prandial: < 180 mg/dL (ou conforme orientação médica específica).</p>
        </div>
    `;
    
    return conteudoHTML;
}

/**
 * Gera o conteúdo HTML da prescrição baseada na bomba de infusão
 * @param {Object} resultado - Objeto com os resultados do cálculo
 * @returns {string} HTML formatado
 */
function gerarConteudoPrescricaoBomba(resultado) {
    return `
        <p><strong>Paciente:</strong> _____________________ &nbsp;&nbsp;&nbsp; <strong>Peso:</strong> ${resultado.peso} kg</p>
        
        <h4 style="margin-top: 15px;">Prescrição de Infusão Intravenosa de Insulina</h4>
        
        <p><strong>PRESCRIÇÃO PARA USO INTRAVENOSO (AMBIENTE HOSPITALAR):</strong></p>
        <p>1. Preparo da solução: Diluir ${formatarNumero(resultado.doseDia)} U de Insulina Regular em 100 mL de Soro Fisiológico 0,9%.</p>
        <p>2. Concentração final: ${formatarNumero(resultado.concentracao)} U/mL</p>
        <p>3. Velocidade de infusão inicial: ${formatarNumero(resultado.velocidadeInfusao)} mL/h (equivalente a ${formatarNumero(resultado.doseHoraria)} U/h).</p>
        <p>4. Monitorizar glicemia capilar a cada 1 hora inicialmente, depois a cada 2-4 horas conforme estabilidade do paciente.</p>
        <p>5. Ajustar velocidade de infusão conforme protocolo institucional e valores de glicemia.</p>
        
        <div style="margin: 15px 0; border-top: 1px dashed #ccc; padding-top: 15px;">
            <p><strong>Observações importantes:</strong></p>
            <ul style="margin-left: 20px;">
                <li>Utilizar bomba de infusão.</li>
                <li>Trocar a solução e o sistema a cada 24 horas.</li>
                <li>Volume total em 24h: ${formatarNumero(resultado.volumeDia)} mL</li>
                <li>Dose total em 24h: ${formatarNumero(resultado.doseDia)} U</li>
                <li>Meta glicêmica: 140-180 mg/dL (pacientes críticos).</li>
                <li>Avaliar potássio sérico antes de iniciar a infusão e a cada 6 horas.</li>
                <li>Considerar infusão paralela de glicose 5-10% se risco de hipoglicemia.</li>
            </ul>
        </div>
    `;
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
 * Formata um número para exibição
 * @param {number} numero - Número a ser formatado
 * @returns {string} Número formatado com uma casa decimal
 */
function formatarNumero(numero) {
    // Arredondar para uma casa decimal
    return Number(numero.toFixed(1)).toLocaleString('pt-BR');
}

// Quando o documento estiver carregado, verificar se a função original existe e guardar referência
document.addEventListener('DOMContentLoaded', function() {
    // Salvar referência para a função original se existir
    if (typeof window.mostrarExemploPrescricao === 'function' && window.mostrarExemploPrescricao !== mostrarExemploPrescricao) {
        window.mostrarExemploPrescricaoOriginal = window.mostrarExemploPrescricao;
        
        // Substituir pela nova função
        window.mostrarExemploPrescricao = mostrarExemploPrescricao;
    }
    
    // Adicionar estilos CSS necessários
    adicionarEstilosPrescrição();
});