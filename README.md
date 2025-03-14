# Calculadora de Insulina

Uma ferramenta web para cálculos de dosagem de insulina baseados em diferentes métodos clínicos, desenvolvida para auxiliar profissionais de saúde na prescrição e ajuste de insulinoterapia.

## Sobre o Projeto

Esta calculadora implementa diferentes métodos de cálculo de doses de insulina:

- **Cálculo baseado no peso corporal** com diferentes fatores de sensibilidade
- **Esquema 70/30** (NPH/Regular) com distribuição diária
- **Esquema basal-bolus** com distribuição para refeições
- **Regras 500/1800** para cálculo de razão insulina/carboidrato e fator de sensibilidade
- **Cálculo de bolus** para correções de glicemia e cobertura de refeições

O projeto foi desenvolvido como uma ferramenta educativa e de auxílio clínico por Eduardo Candeia Gonçalves, estudante de medicina, com base na metodologia de cálculo do Dr. George Ibiapina.

## Funcionalidades

- Interface responsiva adaptada para dispositivos móveis
- Cálculos em tempo real
- Guia médico com informações sobre insulinoterapia
- Documentação detalhada dos algoritmos utilizados
- Explicações didáticas para cada método de cálculo

## Como Usar

A calculadora está disponível online através do Netlify. Basta acessar o link e utilizar diretamente no navegador, sem necessidade de instalação.

A interface é dividida em cinco abas principais:

1. **Cálculo por Peso**: Insira o peso do paciente e o fator de sensibilidade à insulina
2. **Regras 500/1800**: Calcule razão insulina/carboidrato e fator de sensibilidade
3. **Cálculo de Bolus**: Determine doses para correção de glicemia e cobertura de refeições
4. **Guia Médico**: Consulte informações detalhadas sobre insulinoterapia
5. **Algoritmos**: Veja a documentação técnica dos métodos de cálculo implementados

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- SVG para gráficos e diagramas

## Instalação Local

Para executar a calculadora localmente:

1. Clone este repositório:
```
git clone https://github.com/sindlinger/calculadora-insulina.git
```

2. Abra o arquivo `index.html` em qualquer navegador web moderno

Não há dependências externas ou necessidade de servidor para execução local.

## Notas Importantes

- Esta calculadora é uma ferramenta de auxílio e não substitui o julgamento clínico de um profissional de saúde qualificado
- Os cálculos devem ser verificados e ajustados conforme necessidades individuais de cada paciente
- Sempre considere fatores como função renal, atividade física, comorbidades e outros medicamentos ao prescrever insulina

## Contribuições

Contribuições são bem-vindas! Se você encontrou um bug ou tem sugestões para melhorias, por favor abra uma issue ou envie um pull request.

## Créditos

- **Desenvolvedor**: Eduardo Candeia Gonçalves ([GitHub](https://github.com/sindlinger))
- **Metodologia de Cálculo**: Dr. George Ibiapina

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.
