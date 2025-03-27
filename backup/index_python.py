import sys
from PySide6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout,
                              QHBoxLayout, QTabWidget, QLabel, QLineEdit,
                              QPushButton, QComboBox, QScrollArea, QGroupBox,
                              QFormLayout, QDialog, QTextBrowser, QSizePolicy)
from PySide6.QtCore import Qt, QUrl
from PySide6.QtGui import QIcon, QFont, QDesktopServices

class CalculadoraInsulinaModel:
    """Modelo para a Calculadora de Insulina"""
    
    def calcular_por_peso(self, peso, fator):
        """Calcula as doses de insulina baseado no peso"""
        # Cálculo principal: Peso * Fator = Dose total
        dose_total = peso * fator
        
        # Divisão principal (70% NPH, 30% Regular)
        dose_nph = dose_total * 0.7
        dose_regular = dose_total * 0.3
        
        # Esquema duas doses (2/3 manhã, 1/3 noite)
        dose_manha = dose_total * (2/3)
        dose_noite = dose_total * (1/3)
        
        # Manhã (2/3)
        nph_manha = dose_manha * 0.7
        regular_manha = dose_manha * 0.3
        
        # Noite (1/3)
        nph_noite = dose_noite * 0.7
        regular_noite = dose_noite * 0.3
        
        # Esquema basal-bolus alternativo (50/50)
        basal = dose_total * 0.5
        bolus_total = dose_total * 0.5
        
        # Dividir bolus em 3 refeições
        bolus_cafe = bolus_total * 0.4  # 40% no café
        bolus_almoco = bolus_total * 0.3  # 30% no almoço
        bolus_jantar = bolus_total * 0.3  # 30% no jantar
        
        resultados = {
            "dose_total": dose_total,
            "dose_nph": dose_nph,
            "dose_regular": dose_regular,
            "dose_manha": dose_manha,
            "nph_manha": nph_manha,
            "regular_manha": regular_manha,
            "dose_noite": dose_noite,
            "nph_noite": nph_noite,
            "regular_noite": regular_noite,
            "basal": basal,
            "bolus_total": bolus_total,
            "bolus_cafe": bolus_cafe,
            "bolus_almoco": bolus_almoco,
            "bolus_jantar": bolus_jantar
        }
        
        return resultados
    
    def calcular_regras(self, dose_total):
        """Calcula as regras 500/1800"""
        # Regra dos 500 - Razão insulina/carboidrato
        razao_ic_500 = 500 / dose_total
        
        # Regra dos 450 - Variação para razão IC
        razao_ic_450 = 450 / dose_total
        
        # Regra dos 1800 - Fator de sensibilidade à insulina (FSI) em mg/dL
        fsi_1800 = 1800 / dose_total
        
        # Regra dos 1500 - Variação do FSI
        fsi_1500 = 1500 / dose_total
        
        resultados = {
            "razao_ic_500": razao_ic_500,
            "razao_ic_450": razao_ic_450,
            "fsi_1800": fsi_1800,
            "fsi_1500": fsi_1500
        }
        
        return resultados
    
    def calcular_bolus(self, glicemia_atual, glicemia_alvo, carboidratos, razao_ic, fsi):
        """Calcula o bolus de insulina"""
        # Cálculo do bolus de correção
        diferenca_glicemia = max(0, glicemia_atual - glicemia_alvo)
        bolus_correcao = diferenca_glicemia / fsi
        
        # Cálculo do bolus alimentar
        bolus_alimentar = carboidratos / razao_ic
        
        # Bolus total
        bolus_total = bolus_correcao + bolus_alimentar
        
        resultados = {
            "diferenca_glicemia": diferenca_glicemia,
            "bolus_correcao": bolus_correcao,
            "bolus_alimentar": bolus_alimentar,
            "bolus_total": bolus_total
        }
        
        return resultados


class SobreDialog(QDialog):
    """Diálogo 'Sobre' que contém as informações de créditos"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Sobre a Calculadora de Insulina")
        self.setMinimumWidth(500)
        self.setup_ui()
        
    def setup_ui(self):
        layout = QVBoxLayout(self)
        
        # Título
        titulo = QLabel("Calculadora de Insulina")
        titulo.setAlignment(Qt.AlignmentFlag.AlignCenter)
        font = titulo.font()
        font.setPointSize(16)
        font.setBold(True)
        titulo.setFont(font)
        layout.addWidget(titulo)
        
        # Texto informativo
        texto = QTextBrowser()
        texto.setOpenExternalLinks(True)
        texto.setHtml("""
        <div style="text-align: center;">
            <p><b>Desenvolvido por:</b> Eduardo Candeia Gonçalves</p>
            <p><a href="https://github.com/sindlinger" style="text-decoration: none; color: #3498db;">github.com/sindlinger</a></p>
            <br>
            <p><b>Metodologia de cálculo por peso:</b> Dr. George Ibiapina</p>
            <p>Sinceros agradecimentos ao Dr. George Ibiapina pela metodologia de cálculo e orientação científica.</p>
            <br>
            <p><b>Versão:</b> 1.0.0</p>
            <p><b>Licença:</b> MIT</p>
            <p>Esta aplicação é uma ferramenta educativa e não substitui a orientação médica profissional.</p>
        </div>
        """)
        texto.setStyleSheet("background-color: transparent; border: none;")
        layout.addWidget(texto)
        
        # Botão de fechar
        botao_fechar = QPushButton("Fechar")
        botao_fechar.clicked.connect(self.accept)
        layout.addWidget(botao_fechar)
        
        self.setLayout(layout)


class CalculadoraInsulinaView(QMainWindow):
    """View principal para a Calculadora de Insulina"""
    
    def __init__(self):
        super().__init__()
        
        self.setWindowTitle("Calculadora de Insulina")
        self.setMinimumSize(800, 600)
        
        # Configuração de estilos gerais
        self.setup_styles()
        
        # Configuração da UI
        self.setup_ui()
    
    def setup_styles(self):
        """Configura os estilos da aplicação"""
        # Definição de uma folha de estilo global (CSS)
        self.setStyleSheet("""
        QMainWindow {
            background-color: #f5f7fa;
        }
        
        QTabWidget::pane {
            border: 1px solid #ddd;
            background-color: white;
            border-radius: 8px;
        }
        
        QTabBar::tab {
            background-color: #f5f7fa;
            border: 1px solid #ddd;
            padding: 8px 16px;
            margin-right: 2px;
        }
        
        QTabBar::tab:selected {
            background-color: white;
            border-bottom-color: white;
        }
        
        QLabel {
            color: #333;
        }
        
        QLineEdit, QComboBox {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        QPushButton {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
        }
        
        QPushButton:hover {
            background-color: #2980b9;
        }
        
        QGroupBox {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-top: 10px;
            padding-top: 10px;
        }
        
        QGroupBox::title {
            subcontrol-origin: margin;
            left: 10px;
            padding: 0 5px;
        }
        """)
    
    def setup_ui(self):
        """Configura a interface do usuário"""
        # Widget central
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Layout principal
        main_layout = QVBoxLayout()
        central_widget.setLayout(main_layout)
        
        # Cabeçalho
        header_layout = QVBoxLayout()
        
        titulo = QLabel("Calculadora de Insulina")
        titulo.setAlignment(Qt.AlignmentFlag.AlignCenter)
        font = titulo.font()
        font.setPointSize(20)
        font.setBold(True)
        titulo.setFont(font)
        header_layout.addWidget(titulo)
        
        # Layout para o texto de auxílio e o botão "Sobre"
        info_layout = QHBoxLayout()
        
        descricao = QLabel("Auxílio no cálculo de doses de insulina com base em diferentes métodos")
        descricao.setAlignment(Qt.AlignmentFlag.AlignCenter)
        info_layout.addStretch()
        info_layout.addWidget(descricao)
        info_layout.addStretch()
        
        # Botão Sobre
        sobre_btn = QPushButton("Sobre")
        sobre_btn.setFixedWidth(80)
        sobre_btn.clicked.connect(self.mostrar_sobre)
        info_layout.addWidget(sobre_btn)
        
        header_layout.addLayout(info_layout)
        main_layout.addLayout(header_layout)
        
        # Tabs
        self.tabs = QTabWidget()
        main_layout.addWidget(self.tabs)
        
        # Criar as abas
        self.criar_aba_peso()
        self.criar_aba_regras()
        self.criar_aba_bolus()
        self.criar_aba_guia_medico()
        self.criar_aba_algoritmos()
    
    def criar_aba_peso(self):
        """Cria a aba de cálculo por peso"""
        aba_peso = QWidget()
        layout = QVBoxLayout()
        
        # Título da aba
        titulo = QLabel("Cálculo baseado no Peso")
        font = titulo.font()
        font.setPointSize(16)
        font.setBold(True)
        titulo.setFont(font)
        layout.addWidget(titulo)
        
        # Formulário para entrada
        form_layout = QFormLayout()
        
        # Campo de peso
        self.input_peso = QLineEdit()
        self.input_peso.setPlaceholderText("Digite o peso em kg")
        form_layout.addRow("Peso (kg):", self.input_peso)
        
        # Seleção de fator
        self.select_fator = QComboBox()
        self.select_fator.addItem("0,3 - Muito sensível", 0.3)
        self.select_fator.addItem("0,5 - Sensível", 0.5)
        self.select_fator.addItem("0,7 - Padrão", 0.7)
        self.select_fator.addItem("1,0 - Resistente", 1.0)
        self.select_fator.addItem("1,5 - Muito resistente", 1.5)
        self.select_fator.addItem("2,0 - Extremamente resistente", 2.0)
        self.select_fator.addItem("Personalizado", -1)
        self.select_fator.setCurrentIndex(2)  # Define 0.7 como padrão
        self.select_fator.currentIndexChanged.connect(self.toggle_fator_personalizado)
        form_layout.addRow("Fator (U/kg):", self.select_fator)
        
        # Campo para fator personalizado
        self.fator_personalizado_group = QWidget()
        fator_layout = QFormLayout(self.fator_personalizado_group)
        self.input_fator_personalizado = QLineEdit()
        self.input_fator_personalizado.setPlaceholderText("Digite o fator personalizado")
        fator_layout.addRow("Fator personalizado:", self.input_fator_personalizado)
        self.fator_personalizado_group.setVisible(False)
        form_layout.addRow("", self.fator_personalizado_group)
        
        layout.addLayout(form_layout)
        
        # Botão para calcular
        btn_calcular = QPushButton("Calcular Doses")
        btn_calcular.clicked.connect(self.calcular_peso)
        layout.addWidget(btn_calcular)
        
        # Área de resultados
        self.resultados_peso = QGroupBox("Resultados")
        self.resultados_peso.setVisible(False)
        resultados_layout = QVBoxLayout()
        
        # Layout para exibir os resultados
        form_resultados = QFormLayout()
        
        # Dose Total
        self.lbl_dose_total = QLabel("--")
        form_resultados.addRow("Dose Total Diária:", self.lbl_dose_total)
        
        # Seção NPH/Regular
        secao_nph_regular = QGroupBox("Esquema 70/30 (NPH/Regular):")
        secao_layout = QFormLayout()
        
        self.lbl_dose_nph = QLabel("--")
        secao_layout.addRow("NPH Total (70%):", self.lbl_dose_nph)
        
        self.lbl_dose_regular = QLabel("--")
        secao_layout.addRow("Regular Total (30%):", self.lbl_dose_regular)
        
        secao_nph_regular.setLayout(secao_layout)
        form_resultados.addRow("", secao_nph_regular)
        
        # Seção 2 doses diárias
        secao_doses = QGroupBox("Distribuição em 2 doses diárias:")
        secao_layout = QFormLayout()
        
        self.lbl_dose_manha = QLabel("--")
        secao_layout.addRow("Dose Matinal (2/3):", self.lbl_dose_manha)
        
        self.lbl_nph_manha = QLabel("--")
        secao_layout.addRow("• NPH Manhã:", self.lbl_nph_manha)
        
        self.lbl_regular_manha = QLabel("--")
        secao_layout.addRow("• Regular Manhã:", self.lbl_regular_manha)
        
        self.lbl_dose_noite = QLabel("--")
        secao_layout.addRow("Dose Noturna (1/3):", self.lbl_dose_noite)
        
        self.lbl_nph_noite = QLabel("--")
        secao_layout.addRow("• NPH Noite:", self.lbl_nph_noite)
        
        self.lbl_regular_noite = QLabel("--")
        secao_layout.addRow("• Regular Noite:", self.lbl_regular_noite)
        
        secao_doses.setLayout(secao_layout)
        form_resultados.addRow("", secao_doses)
        
        # Seção Basal-Bolus
        secao_basal_bolus = QGroupBox("Esquema Basal-Bolus (50/50):")
        secao_layout = QFormLayout()
        
        self.lbl_basal = QLabel("--")
        secao_layout.addRow("Insulina Basal (50%):", self.lbl_basal)
        
        self.lbl_bolus_total = QLabel("--")
        secao_layout.addRow("Insulina Bolus Total (50%):", self.lbl_bolus_total)
        
        self.lbl_bolus_cafe = QLabel("--")
        secao_layout.addRow("• Bolus Café (40%):", self.lbl_bolus_cafe)
        
        self.lbl_bolus_almoco = QLabel("--")
        secao_layout.addRow("• Bolus Almoço (30%):", self.lbl_bolus_almoco)
        
        self.lbl_bolus_jantar = QLabel("--")
        secao_layout.addRow("• Bolus Jantar (30%):", self.lbl_bolus_jantar)
        
        secao_basal_bolus.setLayout(secao_layout)
        form_resultados.addRow("", secao_basal_bolus)
        
        resultados_layout.addLayout(form_resultados)
        self.resultados_peso.setLayout(resultados_layout)
        
        layout.addWidget(self.resultados_peso)
        
        # Adiciona informações adicionais
        info_box = QGroupBox("Informações sobre o cálculo:")
        info_layout = QVBoxLayout()
        
        info_text = QLabel(
            "<p><strong>Dose Total Diária:</strong> Geralmente calculada como 0,5 a 1,0 unidades por kg de peso corporal.</p>"
            "<p><strong>Esquema 70/30:</strong> Divisão clássica em 70% NPH (insulina intermediária) e 30% Regular (insulina rápida).</p>"
            "<p><strong>Distribuição diária:</strong> Tipicamente 2/3 da dose pela manhã e 1/3 à noite.</p>"
            "<p><strong>Esquema Basal-Bolus:</strong> Alternativa com 50% da dose como insulina basal e 50% como bolus distribuídos nas refeições.</p>"
            "<p>Esta calculadora é uma ferramenta educativa. Ajustes individualizados devem ser feitos com base nos diversos fatores clínicos e resposta do paciente.</p>"
        )
        info_text.setWordWrap(True)
        info_layout.addWidget(info_text)
        
        info_box.setLayout(info_layout)
        layout.addWidget(info_box)
        
        # Adiciona um espaçador para empurrar tudo para cima
        layout.addStretch()
        
        # Configura a aba com rolagem
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll_content = QWidget()
        scroll_content.setLayout(layout)
        scroll.setWidget(scroll_content)
        
        scroll_layout = QVBoxLayout()
        scroll_layout.addWidget(scroll)
        aba_peso.setLayout(scroll_layout)
        
        self.tabs.addTab(aba_peso, "Cálculo por Peso")
    
    def criar_aba_regras(self):
        """Cria a aba de regras 500/1800"""
        aba_regras = QWidget()
        layout = QVBoxLayout()
        
        # Título da aba
        titulo = QLabel("Regras 500/1800")
        font = titulo.font()
        font.setPointSize(16)
        font.setBold(True)
        titulo.setFont(font)
        layout.addWidget(titulo)
        
        # Formulário para entrada
        form_layout = QFormLayout()
        
        # Campo de dose total
        self.input_dose_total = QLineEdit()
        self.input_dose_total.setPlaceholderText("Digite a dose total diária")
        form_layout.addRow("Dose Total Diária (U):", self.input_dose_total)
        
        layout.addLayout(form_layout)
        
        # Botão para calcular
        btn_calcular = QPushButton("Calcular Fatores")
        btn_calcular.clicked.connect(self.calcular_regras)
        layout.addWidget(btn_calcular)
        
        # Área de resultados
        self.resultados_regras = QGroupBox("Resultados")
        self.resultados_regras.setVisible(False)
        resultados_layout = QVBoxLayout()
        
        # Layout para exibir os resultados
        form_resultados = QFormLayout()
        
        # Seção Razão Insulina/Carboidrato
        secao_ic = QGroupBox("Razão Insulina/Carboidrato:")
        secao_layout = QFormLayout()
        
        self.lbl_razao_ic_500 = QLabel("--")
        secao_layout.addRow("Regra dos 500:", self.lbl_razao_ic_500)
        
        self.lbl_razao_ic_450 = QLabel("--")
        secao_layout.addRow("Regra dos 450:", self.lbl_razao_ic_450)
        
        secao_ic.setLayout(secao_layout)
        form_resultados.addRow("", secao_ic)
        
        # Seção Fator de Sensibilidade
        secao_fsi = QGroupBox("Fator de Sensibilidade à Insulina (FSI):")
        secao_layout = QFormLayout()
        
        self.lbl_fsi_1800 = QLabel("--")
        secao_layout.addRow("Regra dos 1800:", self.lbl_fsi_1800)
        
        self.lbl_fsi_1500 = QLabel("--")
        secao_layout.addRow("Regra dos 1500:", self.lbl_fsi_1500)
        
        secao_fsi.setLayout(secao_layout)
        form_resultados.addRow("", secao_fsi)
        
        resultados_layout.addLayout(form_resultados)
        self.resultados_regras.setLayout(resultados_layout)
        
        layout.addWidget(self.resultados_regras)
        
        # Adiciona informações adicionais
        info_box = QGroupBox("Explicação:")
        info_layout = QVBoxLayout()
        
        info_text = QLabel(
            "<p><strong>Regra dos 500 (Razão Insulina/Carboidrato):</strong> Determina quantos gramas de carboidrato são cobertos por 1 unidade de insulina.</p>"
            "<p><strong>Fórmula:</strong> 500 ÷ Dose Total Diária = g de carboidrato por 1U de insulina</p>"
            "<p><strong>Base fisiológica:</strong> A quantidade de carboidratos metabolizada por unidade de insulina está inversamente relacionada à dose total diária. Pacientes que precisam de mais insulina diária (mais resistentes à insulina) têm uma razão menor, onde cada unidade de insulina cobre menos carboidratos.</p>"
            "<p><strong>Regra dos 1800 (Fator de Sensibilidade):</strong> Determina quantos mg/dL a glicemia será reduzida por 1 unidade de insulina.</p>"
            "<p><strong>Fórmula:</strong> 1800 ÷ Dose Total Diária = mg/dL reduzidos por 1U de insulina</p>"
            "<p><strong>Base fisiológica:</strong> Quantifica a potência da insulina em diferentes indivíduos. Quanto maior a dose total diária, menor o impacto de cada unidade na glicemia.</p>"
            "<p><strong>Aplicação prática:</strong><br>• Bolus alimentar = Carboidratos (g) ÷ Razão IC<br>• Bolus correção = (Glicemia atual - Glicemia alvo) ÷ FSI</p>"
            "<p><strong>Observação:</strong> Estas regras são aproximações e devem ser ajustadas com base na resposta glicêmica individual de cada paciente.</p>"
        )
        info_text.setWordWrap(True)
        info_layout.addWidget(info_text)
        
        info_box.setLayout(info_layout)
        layout.addWidget(info_box)
        
        # Adiciona um espaçador para empurrar tudo para cima
        layout.addStretch()
        
        # Configura a aba com rolagem
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll_content = QWidget()
        scroll_content.setLayout(layout)
        scroll.setWidget(scroll_content)
        
        scroll_layout = QVBoxLayout()
        scroll_layout.addWidget(scroll)
        aba_regras.setLayout(scroll_layout)
        
        self.tabs.addTab(aba_regras, "Regras 500/1800")
    
    def criar_aba_bolus(self):
        """Cria a aba de cálculo de bolus"""
        aba_bolus = QWidget()
        layout = QVBoxLayout()
        
        # Título da aba
        titulo = QLabel("Cálculo de Bolus")
        font = titulo.font()
        font.setPointSize(16)
        font.setBold(True)
        titulo.setFont(font)
        layout.addWidget(titulo)
        
        # Formulário para entrada
        form_layout = QFormLayout()
        
        # Campo de glicemia atual
        self.input_glicemia_atual = QLineEdit()
        self.input_glicemia_atual.setPlaceholderText("Digite a glicemia atual")
        form_layout.addRow("Glicemia Atual (mg/dL):", self.input_glicemia_atual)
        
        # Campo de glicemia alvo
        self.input_glicemia_alvo = QLineEdit()
        self.input_glicemia_alvo.setPlaceholderText("Digite a glicemia alvo")
        self.input_glicemia_alvo.setText("100")
        form_layout.addRow("Glicemia Alvo (mg/dL):", self.input_glicemia_alvo)
        
        # Campo de carboidratos
        self.input_carboidratos = QLineEdit()
        self.input_carboidratos.setPlaceholderText("Digite a quantidade de carboidratos")
        form_layout.addRow("Carboidratos a serem consumidos (g):", self.input_carboidratos)
        
        # Campo de razão IC
        self.input_razao_ic = QLineEdit()
        self.input_razao_ic.setPlaceholderText("g de carboidrato por 1U de insulina")
        form_layout.addRow("Razão Insulina/Carboidrato:", self.input_razao_ic)
        
        # Campo de FSI
        self.input_fsi = QLineEdit()
        self.input_fsi.setPlaceholderText("mg/dL reduzidos por 1U de insulina")
        form_layout.addRow("Fator de Sensibilidade (FSI):", self.input_fsi)
        
        layout.addLayout(form_layout)
        
        # Botão para calcular
        btn_calcular = QPushButton("Calcular Bolus")
        btn_calcular.clicked.connect(self.calcular_bolus)
        layout.addWidget(btn_calcular)
        
        # Área de resultados
        self.resultados_bolus = QGroupBox("Resultados do Cálculo de Bolus")
        self.resultados_bolus.setVisible(False)
        resultados_layout = QVBoxLayout()
        
        # Layout para exibir os resultados
        form_resultados = QFormLayout()
        
        self.lbl_diferenca_glicemia = QLabel("--")
        form_resultados.addRow("Diferença de Glicemia (atual - alvo):", self.lbl_diferenca_glicemia)
        
        self.lbl_bolus_correcao = QLabel("--")
        form_resultados.addRow("Bolus de Correção:", self.lbl_bolus_correcao)
        
        self.lbl_bolus_alimentar = QLabel("--")
        form_resultados.addRow("Bolus Alimentar:", self.lbl_bolus_alimentar)
        
        self.lbl_bolus_total = QLabel("--")
        form_resultados.addRow("Bolus Total:", self.lbl_bolus_total)
        
        resultados_layout.addLayout(form_resultados)
        self.resultados_bolus.setLayout(resultados_layout)
        
        layout.addWidget(self.resultados_bolus)
        
        # Adiciona informações adicionais
        info_box = QGroupBox("Como o cálculo é feito:")
        info_layout = QVBoxLayout()
        
        info_text = QLabel(
            "<p><strong>Bolus de Correção:</strong> Corrige a glicemia elevada</p>"
            "<p><em>Fórmula:</em> (Glicemia Atual - Glicemia Alvo) ÷ FSI = Unidades de insulina</p>"
            "<p><strong>Bolus Alimentar:</strong> Cobre os carboidratos a serem consumidos</p>"
            "<p><em>Fórmula:</em> Quantidade de Carboidratos ÷ Razão IC = Unidades de insulina</p>"
            "<p><strong>Bolus Total:</strong> Bolus de Correção + Bolus Alimentar</p>"
            "<p><strong>Observação:</strong> Se a glicemia estiver abaixo do alvo, considere reduzir o bolus alimentar ou consumir carboidratos extras.</p>"
        )
        info_text.setWordWrap(True)
        info_layout.addWidget(info_text)
        
        info_box.setLayout(info_layout)
        layout.addWidget(info_box)
        
        # Adiciona um espaçador para empurrar tudo para cima
        layout.addStretch()
        
        # Configura a aba com rolagem
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll_content = QWidget()
        scroll_content.setLayout(layout)
        scroll.setWidget(scroll_content)
        
        scroll_layout = QVBoxLayout()
        scroll_layout.addWidget(scroll)
        aba_bolus.setLayout(scroll_layout)
        
        self.tabs.addTab(aba_bolus, "Cálculo de Bolus")
    
    def criar_aba_guia_medico(self):
        """Cria a aba de guia médico"""
        aba_guia = QWidget()
        layout = QVBoxLayout()
        
        # Título da aba
        titulo = QLabel("Guia Médico - Insulinoterapia")
        font = titulo.font()
        font.setPointSize(16)
        font.setBold(True)
        titulo.setFont(font)
        layout.addWidget(titulo)
        
        # Seções do guia médico
        self.criar_secao_tipos_insulina(layout)
        self.criar_secao_esquemas_tratamento(layout)
        self.criar_secao_ajustes_dose(layout)
        self.criar_secao_complicacoes(layout)
        self.criar_secao_situacoes_especiais(layout)
        self.criar_secao_pearls(layout)
        
        # Adiciona um espaçador para empurrar tudo para cima
        layout.addStretch()
        
        # Configura a aba com rolagem
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll_content = QWidget()
        scroll_content.setLayout(layout)
        scroll.setWidget(scroll_content)
        
        scroll_layout = QVBoxLayout()
        scroll_layout.addWidget(scroll)
        aba_guia.setLayout(scroll_layout)
        
        self.tabs.addTab(aba_guia, "Guia Médico")
    
    def criar_secao_tipos_insulina(self, layout):
        """Cria a seção de tipos de insulina"""
        secao = QGroupBox("Tipos de Insulina e Farmacocinética")
        secao_layout = QVBoxLayout()
        
        # Tabela de tipos de insulina
        tabela_html = """
        <style>
            table {
                border-collapse: collapse;
                width: 100%;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
        </style>
        <table>
            <tr>
                <th>Tipo</th>
                <th>Início de ação</th>
                <th>Pico</th>
                <th>Duração</th>
            </tr>
            <tr>
                <td>Ultra-rápida (Lispro, Aspart, Glulisina)</td>
                <td>10-15 min</td>
                <td>1-2h</td>
                <td>3-5h</td>
            </tr>
            <tr>
                <td>Rápida (Regular)</td>
                <td>30 min</td>
                <td>2-3h</td>
                <td>5-8h</td>
            </tr>
            <tr>
                <td>Intermediária (NPH)</td>
                <td>2-4h</td>
                <td>4-10h</td>
                <td>10-16h</td>
            </tr>
            <tr>
                <td>Longa (Glargina)</td>
                <td>2-4h</td>
                <td>Sem pico</td>
                <td>20-24h</td>
            </tr>
            <tr>
                <td>Ultra-longa (Degludeca)</td>
                <td>1-2h</td>
                <td>Sem pico</td>
                <td>>42h</td>
            </tr>
        </table>
        <p><strong>Observação:</strong> A insulina NPH apresenta grande variabilidade entre pacientes e mesmo no mesmo paciente em dias diferentes.</p>
        """
        
        tabela = QLabel()
        tabela.setTextFormat(Qt.TextFormat.RichText)
        tabela.setText(tabela_html)
        tabela.setWordWrap(True)
        
        secao_layout.addWidget(tabela)
        secao.setLayout(secao_layout)
        layout.addWidget(secao)
    
    def criar_secao_esquemas_tratamento(self, layout):
        """Cria a seção de esquemas de tratamento"""
        secao = QGroupBox("Esquemas de Tratamento")
        secao_layout = QVBoxLayout()
        
        texto_html = """
        <h4>1. Esquema Convencional (70/30 ou 2 doses)</h4>
        <p>Mais simples, menos flexível, geralmente 2 injeções por dia (manhã e noite).</p>
        <ul>
            <li><strong>2/3 da dose pela manhã:</strong> 70% NPH + 30% Regular (antes do café)</li>
            <li><strong>1/3 da dose à noite:</strong> 70% NPH + 30% Regular (antes do jantar)</li>
        </ul>
        <p><strong>Indicações:</strong> Pacientes com rotina regular, idosos, dificuldade de adesão a esquemas complexos.</p>
        
        <h4>2. Esquema Basal-Bolus (múltiplas doses)</h4>
        <p>Mais fisiológico, flexível, geralmente 4 injeções por dia.</p>
        <ul>
            <li><strong>Basal (50% da dose total):</strong> Insulina de ação longa 1x/dia (Glargina, Degludeca) ou NPH 2x/dia</li>
            <li><strong>Bolus (50% da dose total):</strong> Insulina de ação rápida antes das refeições
                <ul>
                    <li>40% no café da manhã</li>
                    <li>30% no almoço</li>
                    <li>30% no jantar</li>
                </ul>
            </li>
        </ul>
        <p><strong>Indicações:</strong> DM1, gestantes, rotina variável, melhor controle glicêmico.</p>
        
        <h4>3. Esquema Misto Adaptado</h4>
        <p>Flexibilidade intermediária.</p>
        <ul>
            <li><strong>Basal:</strong> Insulina de ação longa 1x/dia</li>
            <li><strong>Correções:</strong> Insulina de ação rápida de acordo com as glicemias capilares</li>
        </ul>
        <p><strong>Indicações:</strong> Pacientes com dificuldade para múltiplas doses mas que precisam de melhor controle.</p>
        """
        
        texto = QLabel()
        texto.setTextFormat(Qt.TextFormat.RichText)
        texto.setText(texto_html)
        texto.setWordWrap(True)
        
        secao_layout.addWidget(texto)
        secao.setLayout(secao_layout)
        layout.addWidget(secao)
    
    def criar_secao_ajustes_dose(self, layout):
        """Cria a seção de ajustes de dose"""
        secao = QGroupBox("Ajustes de Dose e Monitoramento")
        secao_layout = QVBoxLayout()
        
        texto_html = """
        <h4>Monitoramento ideal para ajuste:</h4>
        <ul>
            <li>Glicemia de jejum (ajusta basal noturna)</li>
            <li>Glicemia pré-almoço (ajusta basal matinal)</li>
            <li>Glicemia pré-jantar (ajusta basal vespertina)</li>
            <li>Glicemia 2h pós-refeições (ajusta bolus)</li>
        </ul>
        
        <h4>Regras para ajuste de dose:</h4>
        <ul>
            <li><strong>Ajustes lentos e pequenos:</strong> 10-20% da dose a cada 2-3 dias</li>
            <li><strong>Hipoglicemias:</strong> Reduzir dose da insulina correspondente ao período em 20%</li>
            <li><strong>Hiperglicemia persistente:</strong> Aumentar insulina correspondente ao período em 10-20%</li>
            <li><strong>Fenômeno do alvorecer:</strong> Hiperglicemia matinal por aumento de hormônios contrarreguladores; pode requerer ajuste na NPH noturna ou Glargina</li>
        </ul>
        
        <h4>Alvo glicêmico:</h4>
        <ul>
            <li><strong>Jovens saudáveis:</strong> 80-130 mg/dL (jejum) e &lt;180 mg/dL (pós-prandial)</li>
            <li><strong>Idosos ou com comorbidades:</strong> 100-180 mg/dL (jejum) e &lt;200 mg/dL (pós-prandial)</li>
            <li><strong>Gestantes:</strong> &lt;95 mg/dL (jejum) e &lt;120 mg/dL (pós-prandial)</li>
        </ul>
        """
        
        texto = QLabel()
        texto.setTextFormat(Qt.TextFormat.RichText)
        texto.setText(texto_html)
        texto.setWordWrap(True)
        
        secao_layout.addWidget(texto)
        secao.setLayout(secao_layout)
        layout.addWidget(secao)
    
    def criar_secao_complicacoes(self, layout):
        """Cria a seção de complicações"""
        secao = QGroupBox("Complicações e Manejo")
        secao_layout = QVBoxLayout()
        
        texto_html = """
        <h4>Hipoglicemia:</h4>
        <p><strong>Definição:</strong> Glicemia &lt;70 mg/dL</p>
        <ul>
            <li><strong>Tratamento:</strong> 
                <ul>
                    <li>Paciente consciente: 15g de carboidrato rápido (3 colheres de açúcar, 150ml de suco)</li>
                    <li>Paciente inconsciente: Glucagon IM/SC ou Glicose 50% EV</li>
                </ul>
            </li>
            <li><strong>Prevenção:</strong> 
                <ul>
                    <li>Monitoramento frequente</li>
                    <li>Ajuste de dose (reduzir em 20% se hipoglicemias frequentes)</li>
                    <li>Considerar lanches intermediários</li>
                </ul>
            </li>
        </ul>
        
        <h4>Lipodistrofia:</h4>
        <ul>
            <li>Alteração do tecido subcutâneo por injeções repetidas no mesmo local</li>
            <li><strong>Impacto:</strong> Absorção errática de insulina</li>
            <li><strong>Prevenção:</strong> Rodízio dos locais de aplicação</li>
        </ul>
        
        <h4>Efeito Somogyi:</h4>
        <p>Hiperglicemia matinal paradoxal após hipoglicemia noturna (rebote hiperglicêmico).</p>
        <p><strong>Manejo:</strong> Reduzir dose de insulina noturna.</p>
        """
        
        texto = QLabel()
        texto.setTextFormat(Qt.TextFormat.RichText)
        texto.setText(texto_html)
        texto.setWordWrap(True)
        
        secao_layout.addWidget(texto)
        secao.setLayout(secao_layout)
        layout.addWidget(secao)
    
    def criar_secao_situacoes_especiais(self, layout):
        """Cria a seção de situações especiais"""
        secao = QGroupBox("Situações Especiais")
        secao_layout = QVBoxLayout()
        
        texto_html = """
        <h4>Paciente hospitalizado:</h4>
        <ul>
            <li><strong>Não crítico:</strong> Esquema basal-bolus-correção. Evitar sliding scale isolado</li>
            <li><strong>Crítico:</strong> Infusão EV contínua, alvo 140-180 mg/dL</li>
            <li><strong>Jejum para procedimentos:</strong> 50-80% da basal, suspender bolus</li>
        </ul>
        
        <h4>Paciente com Doença Renal Crônica:</h4>
        <ul>
            <li>Maior risco de hipoglicemia por redução da degradação renal de insulina</li>
            <li>Reduzir doses em 25-50% conforme TFG</li>
            <li>Preferir insulinas com metabolização hepática (Detemir)</li>
        </ul>
        
        <h4>Paciente corticodependente:</h4>
        <ul>
            <li>Aumento importante da resistência à insulina</li>
            <li>Pode requerer 30-40% a mais de insulina</li>
            <li>Maior necessidade de bolus à tarde se corticoide matinal</li>
        </ul>
        
        <h4>Gravidez:</h4>
        <ul>
            <li>Controle rigoroso: jejum <95 mg/dL, 1h pós-prandial <140 mg/dL, 2h <120 mg/dL</li>
            <li>Esquema basal-bolus preferencial</li>
            <li>Necessidade crescente de insulina ao longo da gestação</li>
        </ul>
        """
        
        texto = QLabel()
        texto.setTextFormat(Qt.TextFormat.RichText)
        texto.setText(texto_html)
        texto.setWordWrap(True)
        
        secao_layout.addWidget(texto)
        secao.setLayout(secao_layout)
        layout.addWidget(secao)
    
    def criar_secao_pearls(self, layout):
        """Cria a seção de pearls"""
        secao = QGroupBox("Pearls para Prescrição e Acompanhamento")
        secao_layout = QVBoxLayout()
        
        texto_html = """
        <ul>
            <li>Informe ao paciente que em média são necessários 3 dias para que um ajuste de dose basal se estabilize e mostre resultados;</li>
            <li>Considerar o momento alimentar em relação ao pico da insulina: Regular deve ser aplicada 30 min antes das refeições;</li>
            <li>Pacientes com neuropatia autonômica podem não perceber sintomas adrenérgicos de hipoglicemia - monitoramento mais frequente;</li>
            <li>Uma simples regra prática: para cada 30 mg/dL acima do alvo, adicione 2U de insulina de correção;</li>
            <li>Ao iniciar corticoterapia, aumente a dose de insulina em 20% e monitore para ajustes adicionais;</li>
            <li>O efeito cumulativo da insulina NPH pode causar hipoglicemias tardias - atenção aos esquemas BID;</li>
            <li>Exercícios podem aumentar a sensibilidade à insulina por até 48h - oriente redução de dose para atividades não rotineiras;</li>
            <li>Infecções e estresse agudo podem aumentar a necessidade de insulina em 20-50%;</li>
            <li>Bolus prandial: aplique antes das refeições. Bolus de correção: pode ser aplicado a qualquer momento;</li>
            <li>Na ausência de automonitoramento, prefira esquemas menos intensivos e mais previsíveis.</li>
        </ul>
        """
        
        texto = QLabel()
        texto.setTextFormat(Qt.TextFormat.RichText)
        texto.setText(texto_html)
        texto.setWordWrap(True)
        
        secao_layout.addWidget(texto)
        secao.setLayout(secao_layout)
        layout.addWidget(secao)
    
    def criar_aba_algoritmos(self):
        """Cria a aba de algoritmos"""
        from PySide6.QtGui import QPainter, QBrush, QPen, QColor, QPainterPath
        from PySide6.QtWidgets import QGraphicsView, QGraphicsScene
        
        class DiagramaInsulina(QGraphicsView):
            """Widget personalizado para desenhar o diagrama de distribuição de insulina"""
            
            def __init__(self, parent=None):
                super().__init__(parent)
                self.scene = QGraphicsScene(self)
                self.setScene(self.scene)
                self.setMinimumHeight(350)
                self.setRenderHint(QPainter.RenderHint.Antialiasing)
                
                # Desenha o diagrama
                self.desenhar_diagrama()
            
            def desenhar_diagrama(self):
                """Desenha o diagrama de distribuição de insulina"""
                self.scene.clear()
                
                # Cores
                cor_nph = QColor(180, 200, 255)
                cor_regular = QColor(255, 180, 180)
                
                # Tamanho e posições
                largura = 600
                altura = 300
                centro_x = largura / 2
                centro_y = altura / 2
                
                # Barra horizontal principal
                self.scene.addRect(50, 100, 500, 60, QPen(Qt.GlobalColor.black), QBrush(Qt.GlobalColor.white))
                
                # Divisão NPH (70%) / Regular (30%)
                self.scene.addRect(50, 100, 350, 60, QPen(Qt.GlobalColor.black), QBrush(cor_nph))  # NPH (70%)
                self.scene.addRect(400, 100, 150, 60, QPen(Qt.GlobalColor.black), QBrush(cor_regular))  # Regular (30%)
                
                # Textos para a divisão principal
                self.scene.addText("NPH (70%)").setPos(175, 70)
                self.scene.addText("Regular (30%)").setPos(425, 70)
                
                # Setas de subdivisão
                # Divisão da manhã (2/3)
                self.scene.addLine(150, 160, 150, 200, QPen(Qt.GlobalColor.black, 2))
                # Divisão da noite (1/3)
                self.scene.addLine(450, 160, 450, 200, QPen(Qt.GlobalColor.black, 2))
                
                # Barras de subdivisão da manhã (2/3 da dose total)
                self.scene.addRect(50, 200, 200, 50, QPen(Qt.GlobalColor.black), QBrush(Qt.GlobalColor.white))
                # NPH manhã (70% da dose da manhã)
                self.scene.addRect(50, 200, 140, 50, QPen(Qt.GlobalColor.black), QBrush(cor_nph))
                # Regular manhã (30% da dose da manhã)
                self.scene.addRect(190, 200, 60, 50, QPen(Qt.GlobalColor.black), QBrush(cor_regular))
                
                # Textos para a subdivisão da manhã
                self.scene.addText("Manhã (2/3)").setPos(100, 175)
                self.scene.addText("NPH (70%)").setPos(75, 205)
                self.scene.addText("R (30%)").setPos(195, 205)
                
                # Barras de subdivisão da noite (1/3 da dose total)
                self.scene.addRect(350, 200, 200, 50, QPen(Qt.GlobalColor.black), QBrush(Qt.GlobalColor.white))
                # NPH noite (70% da dose da noite)
                self.scene.addRect(350, 200, 140, 50, QPen(Qt.GlobalColor.black), QBrush(cor_nph))
                # Regular noite (30% da dose da noite)
                self.scene.addRect(490, 200, 60, 50, QPen(Qt.GlobalColor.black), QBrush(cor_regular))
                
                # Textos para a subdivisão da noite
                self.scene.addText("Noite (1/3)").setPos(420, 175)
                self.scene.addText("NPH (70%)").setPos(375, 205)
                self.scene.addText("R (30%)").setPos(495, 205)
                
                # Título do diagrama
                titulo = self.scene.addText("Distribuição da Dose Total de Insulina (Esquema 70/30)")
                fonte = titulo.font()
                fonte.setPointSize(12)
                fonte.setBold(True)
                titulo.setFont(fonte)
                titulo.setPos(150, 20)
                
                # Legenda
                self.scene.addRect(50, 270, 20, 20, QPen(Qt.GlobalColor.black), QBrush(cor_nph))
                self.scene.addText("NPH").setPos(80, 270)
                
                self.scene.addRect(150, 270, 20, 20, QPen(Qt.GlobalColor.black), QBrush(cor_regular))
                self.scene.addText("Regular").setPos(180, 270)
                
                # Ajusta a cena para o tamanho do diagrama
                self.scene.setSceneRect(0, 0, largura, altura)
        
        aba_algoritmos = QWidget()
        layout = QVBoxLayout()
        
        # Título da aba
        titulo = QLabel("Algoritmos e Metodologia de Cálculo")
        font = titulo.font()
        font.setPointSize(16)
        font.setBold(True)
        titulo.setFont(font)
        layout.addWidget(titulo)
        
        # Descrição
        descricao = QLabel("Esta seção detalha os algoritmos e fórmulas utilizados na calculadora para revisão técnica e validação.")
        descricao.setWordWrap(True)
        layout.addWidget(descricao)
        
        # Calculadora baseada no peso
        calculo_peso = QGroupBox("1. Cálculo Baseado no Peso")
        calculo_peso_layout = QVBoxLayout()
        
        formula_base = QLabel("<h4>Fórmula Base:</h4>")
        formula_base.setTextFormat(Qt.TextFormat.RichText)
        calculo_peso_layout.addWidget(formula_base)
        
        formula_texto = QLabel(
            "<pre>"
            "Dose Total Diária (DTD) = Peso (kg) × Fator (U/kg)\n\n"
            "Onde Fator pode ser:\n"
            "- 0,3 U/kg: Pacientes muito sensíveis à insulina\n"
            "- 0,5 U/kg: Pacientes sensíveis\n"
            "- 0,7 U/kg: Sensibilidade padrão\n"
            "- 1,0 U/kg: Pacientes resistentes\n"
            "- 1,5 U/kg: Pacientes muito resistentes\n"
            "- 2,0 U/kg: Pacientes extremamente resistentes"
            "</pre>"
        )
        formula_texto.setTextFormat(Qt.TextFormat.RichText)
        calculo_peso_layout.addWidget(formula_texto)
        
        esquema_7030 = QLabel("<h4>Esquema 70/30 (Divisão NPH/Regular):</h4>")
        esquema_7030.setTextFormat(Qt.TextFormat.RichText)
        calculo_peso_layout.addWidget(esquema_7030)
        
        esquema_texto = QLabel(
            "<pre>"
            "NPH total = DTD × 0,7\n"
            "Regular total = DTD × 0,3"
            "</pre>"
        )
        esquema_texto.setTextFormat(Qt.TextFormat.RichText)
        calculo_peso_layout.addWidget(esquema_texto)
        
        distribuicao = QLabel("<h4>Distribuição em 2 Doses Diárias:</h4>")
        distribuicao.setTextFormat(Qt.TextFormat.RichText)
        calculo_peso_layout.addWidget(distribuicao)
        
        distribuicao_texto = QLabel(
            "<pre>"
            "Dose Matinal = DTD × (2/3)\n"
            "NPH Manhã = Dose Matinal × 0,7\n"
            "Regular Manhã = Dose Matinal × 0,3\n\n"
            "Dose Noturna = DTD × (1/3)\n"
            "NPH Noite = Dose Noturna × 0,7\n"
            "Regular Noite = Dose Noturna × 0,3"
            "</pre>"
        )
        distribuicao_texto.setTextFormat(Qt.TextFormat.RichText)
        calculo_peso_layout.addWidget(distribuicao_texto)
        
        esquema_alt = QLabel("<h4>Esquema Basal-Bolus Alternativo:</h4>")
        esquema_alt.setTextFormat(Qt.TextFormat.RichText)
        calculo_peso_layout.addWidget(esquema_alt)
        
        esquema_alt_texto = QLabel(
            "<pre>"
            "Insulina Basal = DTD × 0,5\n"
            "Insulina Bolus Total = DTD × 0,5\n"
            "Bolus Café = Insulina Bolus Total × 0,4\n"
            "Bolus Almoço = Insulina Bolus Total × 0,3\n"
            "Bolus Jantar = Insulina Bolus Total × 0,3"
            "</pre>"
        )
        esquema_alt_texto.setTextFormat(Qt.TextFormat.RichText)
        calculo_peso_layout.addWidget(esquema_alt_texto)
        
        calculo_peso.setLayout(calculo_peso_layout)
        layout.addWidget(calculo_peso)
        
        # Diagrama de distribuição corrigido
        diagrama_group = QGroupBox("Representação Visual do Esquema 70/30")
        diagrama_layout = QVBoxLayout()
        
        diagrama = DiagramaInsulina()
        diagrama_layout.addWidget(diagrama)
        
        diagrama_group.setLayout(diagrama_layout)
        layout.addWidget(diagrama_group)
        
        # Regras 500/1800
        regras = QGroupBox("2. Regras 500/1800")
        regras_layout = QVBoxLayout()
        
        razao_ic = QLabel("<h4>Razão Insulina/Carboidrato:</h4>")
        razao_ic.setTextFormat(Qt.TextFormat.RichText)
        regras_layout.addWidget(razao_ic)
        
        razao_ic_texto = QLabel(
            "<pre>"
            "Regra dos 500:\n"
            "Razão IC = 500 ÷ DTD\n"
            "(g de carboidrato cobertos por 1U de insulina)\n\n"
            "Variação (para pacientes mais sensíveis):\n"
            "Razão IC = 450 ÷ DTD"
            "</pre>"
        )
        razao_ic_texto.setTextFormat(Qt.TextFormat.RichText)
        regras_layout.addWidget(razao_ic_texto)
        
        fsi = QLabel("<h4>Fator de Sensibilidade à Insulina (FSI):</h4>")
        fsi.setTextFormat(Qt.TextFormat.RichText)
        regras_layout.addWidget(fsi)
        
        fsi_texto = QLabel(
            "<pre>"
            "Regra dos 1800:\n"
            "FSI = 1800 ÷ DTD\n"
            "(mg/dL reduzidos por 1U de insulina)\n\n"
            "Variação (para pacientes mais sensíveis):\n"
            "FSI = 1500 ÷ DTD"
            "</pre>"
        )
        fsi_texto.setTextFormat(Qt.TextFormat.RichText)
        regras_layout.addWidget(fsi_texto)
        
        regras.setLayout(regras_layout)
        layout.addWidget(regras)
        
        # Cálculo de Bolus
        bolus = QGroupBox("3. Cálculo de Bolus")
        bolus_layout = QVBoxLayout()
        
        bolus_correcao = QLabel("<h4>Bolus de Correção:</h4>")
        bolus_correcao.setTextFormat(Qt.TextFormat.RichText)
        bolus_layout.addWidget(bolus_correcao)
        
        bolus_correcao_texto = QLabel(
            "<pre>"
            "Diferença Glicêmica = max(0, Glicemia Atual - Glicemia Alvo)\n"
            "Bolus de Correção = Diferença Glicêmica ÷ FSI\n\n"
            "Onde:\n"
            "- Glicemia Atual: valor atual da glicemia em mg/dL\n"
            "- Glicemia Alvo: valor alvo da glicemia em mg/dL (geralmente 100-120 mg/dL)\n"
            "- FSI: Fator de Sensibilidade à Insulina (mg/dL por 1U)"
            "</pre>"
        )
        bolus_correcao_texto.setTextFormat(Qt.TextFormat.RichText)
        bolus_layout.addWidget(bolus_correcao_texto)
        
        bolus_alimentar = QLabel("<h4>Bolus Alimentar:</h4>")
        bolus_alimentar.setTextFormat(Qt.TextFormat.RichText)
        bolus_layout.addWidget(bolus_alimentar)
        
        bolus_alimentar_texto = QLabel(
            "<pre>"
            "Bolus Alimentar = Quantidade de Carboidratos (g) ÷ Razão IC\n\n"
            "Onde:\n"
            "- Razão IC: gramas de carboidrato cobertas por 1U de insulina"
            "</pre>"
        )
        bolus_alimentar_texto.setTextFormat(Qt.TextFormat.RichText)
        bolus_layout.addWidget(bolus_alimentar_texto)
        
        bolus_total = QLabel("<h4>Bolus Total:</h4>")
        bolus_total.setTextFormat(Qt.TextFormat.RichText)
        bolus_layout.addWidget(bolus_total)
        
        bolus_total_texto = QLabel(
            "<pre>"
            "Bolus Total = Bolus de Correção + Bolus Alimentar"
            "</pre>"
        )
        bolus_total_texto.setTextFormat(Qt.TextFormat.RichText)
        bolus_layout.addWidget(bolus_total_texto)
        
        bolus.setLayout(bolus_layout)
        layout.addWidget(bolus)
        
        # Configura a aba com rolagem
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll_content = QWidget()
        scroll_content.setLayout(layout)
        scroll.setWidget(scroll_content)
        
        scroll_layout = QVBoxLayout()
        scroll_layout.addWidget(scroll)
        aba_algoritmos.setLayout(scroll_layout)
        
        self.tabs.addTab(aba_algoritmos, "Algoritmos")
    
    def mostrar_sobre(self):
        """Mostra o diálogo 'Sobre'"""
        sobre_dialog = SobreDialog(self)
        sobre_dialog.exec()
    
    def toggle_fator_personalizado(self, index):
        """Alterna a visibilidade do campo de fator personalizado"""
        if self.select_fator.itemData(index) == -1:
            self.fator_personalizado_group.setVisible(True)
        else:
            self.fator_personalizado_group.setVisible(False)
    
    def formatar_numero(self, valor):
        """Formata um número com uma casa decimal"""
        return f"{valor:.1f} U"
    
    def calcular_peso(self):
        """Calcula as doses com base no peso"""
        try:
            peso = float(self.input_peso.text())
            if peso <= 0:
                raise ValueError("Peso deve ser maior que zero")
            
            # Obter o fator
            fator_idx = self.select_fator.currentIndex()
            fator = self.select_fator.itemData(fator_idx)
            
            if fator == -1:  # Fator personalizado
                try:
                    fator = float(self.input_fator_personalizado.text())
                    if fator <= 0:
                        raise ValueError("Fator personalizado deve ser maior que zero")
                except ValueError:
                    return
            
            # Calcular usando o modelo
            resultados = CalculadoraInsulinaModel().calcular_por_peso(peso, fator)
            
            # Exibir resultados
            self.lbl_dose_total.setText(self.formatar_numero(resultados["dose_total"]))
            self.lbl_dose_nph.setText(self.formatar_numero(resultados["dose_nph"]))
            self.lbl_dose_regular.setText(self.formatar_numero(resultados["dose_regular"]))
            self.lbl_dose_manha.setText(self.formatar_numero(resultados["dose_manha"]))
            self.lbl_nph_manha.setText(self.formatar_numero(resultados["nph_manha"]))
            self.lbl_regular_manha.setText(self.formatar_numero(resultados["regular_manha"]))
            self.lbl_dose_noite.setText(self.formatar_numero(resultados["dose_noite"]))
            self.lbl_nph_noite.setText(self.formatar_numero(resultados["nph_noite"]))
            self.lbl_regular_noite.setText(self.formatar_numero(resultados["regular_noite"]))
            self.lbl_basal.setText(self.formatar_numero(resultados["basal"]))
            self.lbl_bolus_total.setText(self.formatar_numero(resultados["bolus_total"]))
            self.lbl_bolus_cafe.setText(self.formatar_numero(resultados["bolus_cafe"]))
            self.lbl_bolus_almoco.setText(self.formatar_numero(resultados["bolus_almoco"]))
            self.lbl_bolus_jantar.setText(self.formatar_numero(resultados["bolus_jantar"]))
            
            # Mostrar área de resultados
            self.resultados_peso.setVisible(True)
            
        except ValueError:
            return
    
    def calcular_regras(self):
        """Calcula as regras 500/1800"""
        try:
            dose_total = float(self.input_dose_total.text())
            if dose_total <= 0:
                raise ValueError("Dose total deve ser maior que zero")
            
            # Calcular usando o modelo
            resultados = CalculadoraInsulinaModel().calcular_regras(dose_total)
            
            # Exibir resultados
            self.lbl_razao_ic_500.setText(f"{resultados['razao_ic_500']:.1f} g de carboidrato por 1U de insulina")
            self.lbl_razao_ic_450.setText(f"{resultados['razao_ic_450']:.1f} g de carboidrato por 1U de insulina")
            self.lbl_fsi_1800.setText(f"{resultados['fsi_1800']:.1f} mg/dL reduzidos por 1U de insulina")
            self.lbl_fsi_1500.setText(f"{resultados['fsi_1500']:.1f} mg/dL reduzidos por 1U de insulina")
            
            # Mostrar área de resultados
            self.resultados_regras.setVisible(True)
            
        except ValueError:
            return
    
    def calcular_bolus(self):
        """Calcula o bolus de insulina"""
        try:
            glicemia_atual = float(self.input_glicemia_atual.text())
            glicemia_alvo = float(self.input_glicemia_alvo.text())
            carboidratos = float(self.input_carboidratos.text())
            razao_ic = float(self.input_razao_ic.text())
            fsi = float(self.input_fsi.text())
            
            if razao_ic <= 0 or fsi <= 0:
                raise ValueError("Razão IC e FSI devem ser maiores que zero")
            
            # Calcular usando o modelo
            resultados = CalculadoraInsulinaModel().calcular_bolus(glicemia_atual, glicemia_alvo, carboidratos, razao_ic, fsi)
            
            # Exibir resultados
            self.lbl_diferenca_glicemia.setText(f"{resultados['diferenca_glicemia']:.1f} mg/dL")
            self.lbl_bolus_correcao.setText(f"{resultados['bolus_correcao']:.1f} U")
            self.lbl_bolus_alimentar.setText(f"{resultados['bolus_alimentar']:.1f} U")
            self.lbl_bolus_total.setText(f"{resultados['bolus_total']:.1f} U")
            
            # Mostrar área de resultados
            self.resultados_bolus.setVisible(True)
            
        except ValueError:
            return


class CalculadoraInsulinaController:
    """Controller para a Calculadora de Insulina"""
    
    def __init__(self):
        self.app = QApplication(sys.argv)
        self.view = CalculadoraInsulinaView()
        self.model = CalculadoraInsulinaModel()
    
    def executar(self):
        """Inicia a aplicação"""
        self.view.show()
        return self.app.exec()


if __name__ == "__main__":
    controller = CalculadoraInsulinaController()
    sys.exit(controller.executar())