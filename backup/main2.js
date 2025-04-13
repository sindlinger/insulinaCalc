// JavaScript principal

// Arquivo: main.js - JavaScript principal do aplicativo

/**
 * Inicializa a aplicação quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("Calculadora de Insulina v1.3.1 inicializada");
    
    // Verificar e exibir dados salvos no localStorage, se existirem
    carregarDadosSalvos();
    
    // Definir as configurações iniciais da UI
    inicializarUI();
});

/**
 * Carrega dados salvos anteriormente, se existirem
 */
function carregarDadosSalvos() {
    // Exemplo de implementação para carregar valores salvos
    // Esta função pode ser expandida para carregar valores de todas as calculadoras
    if (localStorage.getItem('pesoSalvo')) {
        document.getElementById('inputPeso').value = localStorage.getItem('pesoSalvo');
    }
    
    if (localStorage.getItem('fatorSalvo')) {
        document.getElementById('selectFator').value = localStorage.getItem('fatorSalvo');
        
        // Se for personalizado, mostrar o campo correspondente
        if (localStorage.getItem('fatorSalvo') === '-1' && localStorage.getItem('fatorPersonalizado')) {
            document.getElementById('fatorPersonalizadoGroup').style.display = 'block';
            document.getElementById('inputFatorPersonalizado').value = localStorage.getItem('fatorPersonalizado');
        }
    }
}

/**
 * Salva os dados da calculadora para uso futuro
 */
function salvarDados() {
    // Exemplo para a calculadora de peso
    localStorage.setItem('pesoSalvo', document.getElementById('inputPeso').value);
    localStorage.setItem('fatorSalvo', document.getElementById('selectFator').value);
    
    if (document.getElementById('selectFator').value === '-1') {
        localStorage.setItem('fatorPersonalizado', document.getElementById('inputFatorPersonalizado').value);
    }
    
    // Esta função pode ser expandida para salvar valores de todas as calculadoras
}

/**
 * Inicializa elementos da UI
 */
function inicializarUI() {
    // Atualizar a versão da aplicação no rodapé, se necessário
    if (document.getElementById('versaoApp')) {
        document.getElementById('versaoApp').textContent = '1.3.1';
    }
    
    // Adicionar outros listeners e inicializações específicas aqui
}