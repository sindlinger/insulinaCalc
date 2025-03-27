/**
 * Integração do sistema de prescrição
 * Este arquivo contém o código para integrar o sistema de prescrição na aplicação
 */

// Inicializar o sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarSistemaPrescrição();
});

/**
 * Inicializa o sistema de prescrição
 */
function inicializarSistemaPrescrição() {
    // Inicializar o objeto de resultados se ainda não existir
    if (!window.ultimosResultados) {
        window.ultimosResultados = {
            peso: null,
            bolus: null,
            bomba: null
        };
    }
    
    // Verificar se a função original já existe e salvá-la para compatibilidade
    if (typeof window.mostrarExemploPrescricao === 'function' && 
        typeof window.mostrarExemploPrescricaoOriginal !== 'function') {
        window.mostrarExemploPrescricaoOriginal = window.mostrarExemploPrescricao;
    }
    
    // Substituir ou adicionar botões de prescrição existentes
    verificarBotoesExistentes();
    
    console.log('Sistema de prescrição unificado inicializado com sucesso!');
}

/**
 * Verifica se já existem botões de prescrição e os substitui pelo novo sistema
 */
function verificarBotoesExistentes() {
    // Verificar o botão da calculadora de peso
    const btnPesoExistente = document.getElementById('prescription-btn');
    if (btnPesoExistente) {
        btnPesoExistente.id = 'prescription-btn-peso';
        btnPesoExistente.setAttribute('onclick', "mostrarExemploPrescricao('peso')");
        console.log('Botão de prescrição existente atualizado para o sistema unificado');
    }
    
    // Verificar nos resultados já exibidos
    if (document.getElementById('resultadosPeso') && 
        document.getElementById('resultadosPeso').style.display === 'block') {
        // Recalcular para garantir que temos os dados salvos
        if (typeof calcularPeso === 'function') {
            calcularPeso();
        }
    }
    
    if (document.getElementById('resultadosBolus') && 
        document.getElementById('resultadosBolus').style.display === 'block') {
        // Recalcular para garantir que temos os dados salvos
        if (typeof calcularBolus === 'function') {
            calcularBolus();
        }
    }
    
    if (document.getElementById('resultadosBomba') && 
        document.getElementById('resultadosBomba').style.display === 'block') {
        // Recalcular para garantir que temos os dados salvos
        if (typeof calcularBomba === 'function') {
            calcularBomba();
        }
    }
}

/**
 * Adiciona os estilos CSS necessários para o sistema de prescrição
 */
function adicionarEstilosPrescrição() {
    // Verificar se os estilos já foram adicionados
    if (document.getElementById('prescricao-styles')) return;
    
    const estilos = `
        /* Estilos para o botão de prescrição */
        .prescription-btn {
            background-color: #f8f9fa;
            color: var(--primary-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 8px 12px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: auto;
            margin-top: 5px;
            margin-bottom: 10px;
            box-shadow: none;
        }

        .prescription-btn i {
            margin-right: 5px;
            color: #28a745;
        }

        .prescription-btn:hover {
            background-color: var(--primary-light);
            color: var(--primary-dark);
        }
        
        /* Estilos para o modal de prescrição */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
            background-color: #fefefe;
            margin: 5% auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            width: 80%;
            max-width: 800px;
            position: relative;
            max-height: 85vh;
            overflow-y: auto;
        }

        .close-modal {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }

        .close-modal:hover {
            color: #555;
        }

        .modal-title {
            color: var(--primary-color);
            margin-top: 0;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border-color);
        }
        
        /* Estilos para as listas nos detalhes da prescrição */
        .timing-list {
            list-style-type: none;
            padding-left: 5px;
            margin-top: 5px;
        }

        .timing-list li {
            margin-bottom: 5px;
            display: flex;
            align-items: center;
        }

        .timing-list li i {
            margin-right: 8px;
            color: var(--primary-color);
            font-size: 12px;
        }
    `;
    
    // Criar elemento de estilo
    const estiloElement = document.createElement('style');
    estiloElement.id = 'prescricao-styles';
    estiloElement.type = 'text/css';
    estiloElement.appendChild(document.createTextNode(estilos));
    
    // Adicionar ao head do documento
    document.head.appendChild(estiloElement);
    console.log('Estilos CSS para o sistema de prescrição adicionados');
}