// Arquivo: modals.js - Funcionalidades dos modais

/**
 * Abre o modal "Sobre"
 */
function openModal() {
    document.getElementById("aboutModal").style.display = "block";
}

/**
 * Fecha o modal "Sobre"
 */
function closeModal() {
    document.getElementById("aboutModal").style.display = "none";
}

/**
 * Abre o modal de referências
 */
function openReferencesModal() {
    document.getElementById("referencesModal").style.display = "block";
}

/**
 * Fecha o modal de referências
 */
function closeReferencesModal() {
    document.getElementById("referencesModal").style.display = "none";
}

/**
 * Abre o modal de emergência
 */
function abrirEmergencia() {
    document.getElementById("modalEmergencia").style.display = "block";
    document.getElementById("senhaEmergencia").value = "";
    document.getElementById("erro-senha").style.display = "none";
}

/**
 * Fecha o modal de emergência
 */
function fecharModalEmergencia() {
    document.getElementById("modalEmergencia").style.display = "none";
}

/**
 * Verifica a senha do modal de emergência
 */
function verificarSenha() {
    const senha = document.getElementById("senhaEmergencia").value;
    if (senha === "endo2023") {
        window.location.href = "./emergencia.html";
    } else {
        document.getElementById("erro-senha").style.display = "block";
    }
}

/**
 * Função para mostrar o modal de ajuda com conteúdo específico
 * @param {string} tipo - Tipo de ajuda a ser exibida
 */
function mostrarAjuda(tipo) {
    const modal = document.getElementById("ajudaModal");
    const titulo = document.getElementById("ajudaTitulo");
    const conteudo = document.getElementById("ajudaConteudo");
    
    // Definir o título e conteúdo com base no tipo de ajuda solicitado
    switch (tipo) {
        case 'glicemia-atual':
            titulo.textContent = "Glicemia Atual";
            conteudo.innerHTML = `
                <p>A glicemia atual é o nível de glicose no sangue do paciente no momento da avaliação.</p>
                
                <div class="help-tip">
                    <strong>Como obter:</strong> Verificar resultado recente da glicemia capilar (HGT) ou resultado laboratorial de glicose sérica.
                </div>
                
                <h4>Relevância clínica</h4>
                <ul>
                    <li>Fornece o ponto de partida para calcular quanto de insulina é necessária para correção</li>
                    <li>Valores elevados (>180 mg/dL) geralmente requerem insulina de correção</li>
                    <li>Valores baixos (<70 mg/dL) indicam hipoglicemia e podem requerer ajuste na dose de bolus planejada</li>
                </ul>
                
                <div class="help-example">
                    <strong>Exemplo:</strong> Um paciente com glicemia atual de 220 mg/dL antes do almoço necessitará de insulina adicional para corrigir esta hiperglicemia, além da dose para cobrir os carboidratos da refeição.
                </div>
                
                <h4>Valores de referência</h4>
                <ul>
                    <li>Normoglicemia: 70-99 mg/dL (jejum)</li>
                    <li>Alvo hospitalar: 140-180 mg/dL</li>
                    <li>Hipoglicemia: <70 mg/dL</li>
                    <li>Hiperglicemia: >180 mg/dL</li>
                </ul>
            `;
            break;
            
        case 'glicemia-alvo':
            titulo.textContent = "Glicemia Alvo";
            conteudo.innerHTML = `
                <p>A glicemia alvo representa o nível de glicose sanguínea que você deseja que o paciente alcance após a administração de insulina.</p>
                
                <div class="help-tip">
                    <strong>Como definir:</strong> Baseado nas diretrizes atuais, condição clínica do paciente e risco de hipoglicemia.
                </div>
                
                <h4>Valores recomendados por guidelines</h4>
                <ul>
                    <li><strong>Pacientes hospitalizados críticos:</strong> 140-180 mg/dL (ADA 2022)</li>
                    <li><strong>Pacientes hospitalizados não-críticos:</strong> <140 mg/dL pré-prandial e <180 mg/dL aleatório (ADA 2022)</li>
                    <li><strong>Pacientes ambulatoriais:</strong> 80-130 mg/dL pré-prandial (ADA 2022)</li>
                    <li><strong>Gestantes com diabetes:</strong> <95 mg/dL jejum, <140 mg/dL 1h pós-prandial (SBD)</li>
                </ul>
                
                <h4>Considerações especiais</h4>
                <ul>
                    <li>Pacientes idosos ou com hipoglicemia frequente: considerar alvos menos rígidos (100-180 mg/dL)</li>
                    <li>Pacientes com hipoglicemia severa recente: elevar temporariamente o alvo</li>
                    <li>Pacientes com comorbidades graves: individualizar o alvo</li>
                </ul>
                
                <div class="help-example">
                    <strong>Exemplo:</strong> Para um adulto com diabetes tipo 2 estável, um alvo de 100-120 mg/dL pode ser apropriado. Para um idoso frágil, um alvo de 140-160 mg/dL pode ser mais seguro.
                </div>
            `;
            break;
            
        case 'carboidratos':
            titulo.textContent = "Carboidratos a serem consumidos";
            conteudo.innerHTML = `
                <p>Quantidade total de carboidratos (em gramas) que o paciente irá consumir na refeição para a qual você está calculando o bolus de insulina.</p>
                
                <div class="help-tip">
                    <strong>Como obter:</strong> Através da contagem de carboidratos da refeição ou estimativa baseada no plano alimentar do paciente.
                </div>
                
                <h4>Métodos para determinar a quantidade de carboidratos</h4>
                <ul>
                    <li><strong>Tabelas de contagem de carboidratos:</strong> Referências com o conteúdo de carboidratos dos alimentos</li>
                    <li><strong>Etiquetas nutricionais:</strong> Verificar os gramas de carboidratos por porção</li>
                    <li><strong>Estimativas padronizadas:</strong> Porções hospitalares geralmente têm valores padronizados</li>
                </ul>
                
                <h4>Valores aproximados de referência</h4>
                <ul>
                    <li>Café da manhã hospitalar padrão: ~45-60g</li>
                    <li>Almoço/Jantar hospitalar padrão: ~60-75g</li>
                    <li>Lanche: ~15-30g</li>
                </ul>
                
                <div class="help-example">
                    <strong>Exemplo:</strong> Um almoço hospitalar contendo 1 porção de arroz (20g), 1 porção de feijão (15g), 1 porção de legumes (5g) e 1 fruta de sobremesa (15g) totaliza aproximadamente 55g de carboidratos.
                </div>
                
                <div class="help-action">
                    <p>Precisa de valores mais específicos? Consulte a <span class="help-link" onclick="mostrarTabelaCarboidratos()">tabela de carboidratos</span>.</p>
                </div>
            `;
            break;
            
        case 'razao-ic':
            titulo.textContent = "Razão Insulina/Carboidrato (IC)";
            conteudo.innerHTML = `
                <p>A razão IC indica quantos gramas de carboidratos são cobertos por 1 unidade de insulina. Este é um parâmetro individualizado que varia de paciente para paciente.</p>
                
                <div class="help-formula">
                    <strong>Fórmula para cálculo do bolus alimentar:</strong><br>
                    Bolus alimentar = Carboidratos (g) ÷ Razão IC
                </div>
                
                <div class="help-tip">
                    <strong>Como obter:</strong> Do histórico do paciente, calculando com base na regra 500 ou por teste empírico.
                </div>
                
                <h4>Métodos para determinar a razão IC</h4>
                <ul>
                    <li><strong>Regra 500:</strong> Razão IC = 500 ÷ Dose Total Diária de insulina</li>
                    <li><strong>Ajuste por período do dia:</strong> A razão IC pode ser diferente no café da manhã (mais resistência) vs. jantar</li>
                    <li><strong>Teste empírico:</strong> Iniciar com uma estimativa e ajustar conforme a resposta do paciente</li>
                </ul>
                
                <h4>Valores típicos de referência</h4>
                <ul>
                    <li><strong>Alta sensibilidade à insulina:</strong> 15-20g por 1U</li>
                    <li><strong>Sensibilidade moderada:</strong> 10-15g por 1U</li>
                    <li><strong>Baixa sensibilidade (resistência):</strong> 5-8g por 1U</li>
                    <li><strong>Resistência grave (ex: infecção aguda):</strong> 3-5g por 1U</li>
                </ul>
                
                <div class="help-example">
                    <strong>Exemplo:</strong> Se um paciente tem uma razão IC de 10, significa que 1 unidade de insulina cobrirá 10g de carboidratos. Para uma refeição com 50g de carboidratos, seriam necessárias 5 unidades de insulina (50 ÷ 10 = 5).
                </div>
            `;
            break;
            
        case 'fsi':
            titulo.textContent = "Fator de Sensibilidade à Insulina (FSI)";
            conteudo.innerHTML = `
                <p>O FSI indica quanto a glicemia diminui (em mg/dL) com 1 unidade de insulina. Também chamado de fator de correção ou fator de sensibilidade, é um parâmetro individualizado.</p>
                
                <div class="help-formula">
                    <strong>Fórmula para cálculo do bolus de correção:</strong><br>
                    Bolus de correção = (Glicemia atual - Glicemia alvo) ÷ FSI
                </div>
                
                <div class="help-tip">
                    <strong>Como obter:</strong> Do histórico do paciente, calculando com base na regra 1800/1500 ou por teste empírico.
                </div>
                
                <h4>Métodos para determinar o FSI</h4>
                <ul>
                    <li><strong>Regra 1800 (para insulina Regular):</strong> FSI = 1800 ÷ Dose Total Diária de insulina</li>
                    <li><strong>Regra 1500 (para insulina rápida):</strong> FSI = 1500 ÷ Dose Total Diária de insulina</li>
                    <li><strong>Exemplo:</strong> Um paciente usando 50U/dia terá FSI = 1500 ÷ 50 = 30 mg/dL por unidade</li>
                </ul>
                
                <h4>Valores típicos de referência</h4>
                <ul>
                    <li><strong>Alta sensibilidade à insulina:</strong> 80-100 mg/dL por 1U</li>
                    <li><strong>Sensibilidade moderada:</strong> 40-60 mg/dL por 1U</li>
                    <li><strong>Baixa sensibilidade (resistência):</strong> 20-30 mg/dL por 1U</li>
                    <li><strong>Resistência grave:</strong> 10-15 mg/dL por 1U</li>
                </ul>
                
                <div class="help-example">
                    <strong>Exemplo prático:</strong> Se o paciente tem FSI de 40, glicemia atual de 220 mg/dL e alvo de 120 mg/dL, o bolus de correção será (220 - 120) ÷ 40 = 2,5 unidades.
                </div>
            `;
            break;
            
        case 'tipo-insulina':
            titulo.textContent = "Tipo de Insulina para Bolus";
            conteudo.innerHTML = `
                <p>A escolha do tipo de insulina para bolus influencia diretamente o momento de aplicação, início de ação e duração do efeito.</p>
                
                <h4>Características das insulinas para bolus</h4>
                <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                    <tr style="background-color: var(--primary-light);">
                        <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Parâmetro</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Insulina Regular</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Insulina Ultrarrápida</th>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">Exemplos</td>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">Humulin R, Novolin R</td>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">Lispro (Humalog), Aspart (NovoRapid), Glulisina (Apidra)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">Início de ação</td>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">30 minutos</td>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">5-15 minutos</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">Pico de ação</td>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">2-3 horas</td>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">1-2 horas</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">Duração</td>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">5-8 horas</td>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">3-5 horas</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">Momento de aplicação</td>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">30 minutos antes da refeição</td>
                        <td style="padding: 8px; border: 1px solid var(--border-color);">0-15 minutos antes da refeição</td>
                    </tr>
                </table>
                
                <h4>Indicações para escolha</h4>
                <ul>
                    <li><strong>Insulina Regular:</strong>
                        <ul>
                            <li>Custo mais acessível</li>
                            <li>Pacientes estáveis com horários regulares de alimentação</li>
                            <li>Tratamento hospitalar de hiperglicemia (quando ultrarrápida não disponível)</li>
                        </ul>
                    </li>
                    <li><strong>Insulina Ultrarrápida:</strong>
                        <ul>
                            <li>Melhor controle pós-prandial</li>
                            <li>Maior flexibilidade nas refeições</li>
                            <li>Menor risco de hipoglicemia tardia</li>
                            <li>Pacientes com alimentação imprevisível (ex: crianças)</li>
                        </ul>
                    </li>
                </ul>
                
                <div class="help-tip">
                    <strong>Dica:</strong> A insulina ultrarrápida pode ser administrada imediatamente após a refeição em casos onde há incerteza sobre a quantidade de alimento que o paciente irá consumir.
                </div>
                
                <p>Fonte: Sociedade Brasileira de Diabetes (2022) e American Diabetes Association (2022).</p>
            `;
            break;
            
        default:
            titulo.textContent = "Informação";
            conteudo.innerHTML = "<p>Informação não disponível.</p>";
    }
    
    modal.style.display = "block";
}

/**
 * Função para fechar o modal de ajuda
 */
function fecharAjuda() {
    document.getElementById("ajudaModal").style.display = "none";
}

/**
 * Função para mostrar a tabela de carboidratos
 */
function mostrarTabelaCarboidratos() {
    const modal = document.getElementById("ajudaModal");
    const titulo = document.getElementById("ajudaTitulo");
    const conteudo = document.getElementById("ajudaConteudo");
    
    titulo.textContent = "Tabela de Contagem de Carboidratos";
    conteudo.innerHTML = `
        <p>Tabela de referência rápida para contagem de carboidratos dos alimentos mais comuns:</p>
        
        <h4>Grãos e Cereais (por porção)</h4>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background-color: var(--primary-light);">
                <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Alimento</th>
                <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Porção</th>
                <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Carboidratos (g)</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Arroz branco cozido</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">4 colh. sopa (100g)</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">28</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Macarrão cozido</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">1/2 xícara (100g)</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">30</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Pão francês</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">1 unidade (50g)</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">28</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Batata cozida</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">1 unidade média (100g)</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">15</td>
            </tr>
        </table>
        
        <h4>Frutas (por unidade média)</h4>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background-color: var(--primary-light);">
                <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Fruta</th>
                <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Porção</th>
                <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Carboidratos (g)</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Maçã</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">1 unidade média</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">15</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Banana</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">1 unidade média</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">20</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Laranja</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">1 unidade média</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">12</td>
            </tr>
        </table>
        
        <h4>Laticínios</h4>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background-color: var(--primary-light);">
                <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Alimento</th>
                <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Porção</th>
                <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Carboidratos (g)</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Leite integral</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">1 copo (200ml)</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">10</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Iogurte natural</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">1 pote (170g)</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">12</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Iogurte com frutas</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">1 pote (170g)</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">25</td>
            </tr>
        </table>
        
        <h4>Feijões e Leguminosas</h4>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background-color: var(--primary-light);">
                <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Alimento</th>
                <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Porção</th>
                <th style="padding: 8px; text-align: left; border: 1px solid var(--border-color);">Carboidratos (g)</th>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Feijão cozido</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">4 colh. sopa (100g)</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">15</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Lentilha cozida</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">4 colh. sopa (100g)</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">20</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid var(--border-color);">Grão de bico cozido</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">4 colh. sopa (100g)</td>
                <td style="padding: 8px; border: 1px solid var(--border-color);">22</td>
            </tr>
        </table>
        
        <div class="help-tip">
            <strong>Dica clínica:</strong> Ao calcular os carboidratos de uma refeição, some os valores de cada alimento que compõe o prato. Para pacientes hospitalizados, é recomendável que a equipe de nutrição forneça informações sobre o conteúdo de carboidratos das refeições.
        </div>
        
        <div class="help-action">
            <button onclick="fecharAjuda()" style="max-width: 200px; margin: 20px auto;">Voltar</button>
        </div>
    `;
    
    modal.style.display = "block";
}

// Configuração para fechar os modais quando clicar fora deles
window.onclick = function(event) {
    if (event.target == document.getElementById("aboutModal")) {
        closeModal();
    }
    if (event.target == document.getElementById("referencesModal")) {
        closeReferencesModal();
    }
    if (event.target == document.getElementById("modalEmergencia")) {
        fecharModalEmergencia();
    }
    if (event.target == document.getElementById("ajudaModal")) {
        fecharAjuda();
    }
}