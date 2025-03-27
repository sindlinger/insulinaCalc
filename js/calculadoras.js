// Funções de cálculo

// Arquivo: calculadoras.js - Funções de cálculo das diferentes calculadoras

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
    
    document.getElementById("resultadosPeso").style.display = "block";
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
}