// Funcionalidades dos modais

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
}