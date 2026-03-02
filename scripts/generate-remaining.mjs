/**
 * Gera conteúdo estático para os tópicos restantes que não foram cobertos pela API Gemini.
 * Conteúdo educacional real em PT-BR, focado em concurso público Ênfase 6 (CESGRANRIO).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data', 'generated');

function writeJson(topicId, filename, data) {
  const dir = path.join(OUTPUT_DIR, topicId);
  fs.mkdirSync(dir, { recursive: true });
  const fp = path.join(dir, filename);
  if (fs.existsSync(fp)) {
    console.log(`  ⏭️  ${topicId}/${filename} já existe, pulando.`);
    return;
  }
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✅ ${topicId}/${filename} gerado.`);
}

function makeTheory(topicId, sections) {
  return sections.map((s, i) => ({
    id: `section_${s.type}_${topicId}`,
    type: s.type,
    title: s.title,
    content: s.content,
    order: i + 1
  }));
}

function makeExercises(topicId, blocoId, exercises) {
  return exercises.map((ex, i) => ({
    id: `ex_${topicId}_${i + 1}`,
    topicId,
    blocoId,
    question: ex.question,
    options: ex.options,
    difficulty: ex.difficulty,
    source: 'autoral',
    detailedExplanation: ex.detailedExplanation,
    technicalJustification: ex.technicalJustification,
    relatedConcepts: ex.relatedConcepts,
    order: i + 1
  }));
}

function makeFlashcards(topicId, cards) {
  return cards.map((fc, i) => ({
    id: `fc_${topicId}_${i + 1}`,
    topicId,
    front: fc.front,
    back: fc.back,
    difficulty: fc.difficulty,
    correctCount: 0,
    incorrectCount: 0
  }));
}

// ═══════════════════════════════════════════════════════════
// CONTEÚDO: b2-storytelling (falta apenas exercises)
// ═══════════════════════════════════════════════════════════
const storytellingExercises = [
  {
    question: "Uma analista de dados da Petrobras precisa apresentar à diretoria os resultados trimestrais de produção de petróleo. Segundo os princípios de storytelling com dados propostos por Cole Nussbaumer Knaflic, a apresentação deve seguir uma estrutura narrativa clara. Qual das seguintes práticas é a MAIS adequada para garantir que a mensagem seja compreendida de forma eficaz?",
    options: [
      { letter: "A", text: "Incluir o maior número possível de gráficos para demonstrar domínio técnico dos dados disponíveis.", isCorrect: false, explanation: "Excesso de gráficos pode causar sobrecarga cognitiva e diluir a mensagem principal." },
      { letter: "B", text: "Estruturar a apresentação com contexto, conflito e resolução, destacando os insights mais relevantes para a tomada de decisão.", isCorrect: true, explanation: "A estrutura narrativa com setup-conflict-resolution é fundamental no storytelling com dados." },
      { letter: "C", text: "Utilizar exclusivamente tabelas numéricas para garantir a precisão dos dados apresentados.", isCorrect: false, explanation: "Tabelas são úteis para consulta, mas visualizações gráficas comunicam padrões com mais eficiência." },
      { letter: "D", text: "Apresentar todos os dados brutos antes de qualquer análise para que a diretoria possa tirar suas próprias conclusões.", isCorrect: false, explanation: "O papel do analista é filtrar e contextualizar; dados brutos sobrecarregam o público." },
      { letter: "E", text: "Priorizar gráficos tridimensionais e com efeitos visuais elaborados para tornar a apresentação mais atrativa.", isCorrect: false, explanation: "Efeitos 3D distorcem a percepção e violam o princípio de clareza de Tufte (data-ink ratio)." }
    ],
    difficulty: "facil",
    detailedExplanation: "O storytelling com dados, conforme Knaflic (2015), segue uma estrutura narrativa clássica: (1) Setup/Contexto — estabelecer o cenário e o que o público precisa saber; (2) Conflito/Tensão — apresentar o problema ou insight relevante; (3) Resolução — propor ações ou conclusões baseadas nos dados. Essa abordagem transforma dados em informação acionável. As alternativas incorretas violam princípios fundamentais: excesso de gráficos (A) causa sobrecarga, tabelas exclusivas (C) são menos eficazes para comunicar padrões, dados brutos (D) não são adequados para apresentações executivas, e efeitos 3D (E) distorcem a visualização conforme Tufte alerta sobre 'chartjunk'.",
    technicalJustification: "Knaflic, C. N. (2015). Storytelling with Data. Wiley. Capítulos 1-7 sobre estrutura narrativa.",
    relatedConcepts: ["estrutura narrativa", "data-ink ratio", "público-alvo", "call to action"]
  },
  {
    question: "Edward Tufte, em sua obra 'The Visual Display of Quantitative Information', apresentou o conceito de data-ink ratio. Um engenheiro de dados está revisando um dashboard operacional e encontra um gráfico de barras com grades pesadas, bordas decorativas, preenchimento gradiente e legenda redundante. Aplicando o princípio de Tufte, qual medida deve ser adotada?",
    options: [
      { letter: "A", text: "Manter os elementos decorativos pois melhoram a estética e atraem o olhar do usuário.", isCorrect: false, explanation: "Tufte chama esses elementos de 'chartjunk' — poluição visual que prejudica a comunicação." },
      { letter: "B", text: "Adicionar mais rótulos de dados em cada barra para compensar a complexidade visual.", isCorrect: false, explanation: "Adicionar mais elementos não resolve o problema fundamental de excesso de 'ink' não-informativa." },
      { letter: "C", text: "Remover elementos que não representam dados (grades pesadas, bordas, gradientes) para maximizar o data-ink ratio.", isCorrect: true, explanation: "O data-ink ratio mede a proporção de tinta usada para representar dados versus decoração." },
      { letter: "D", text: "Substituir o gráfico de barras por uma tabela com os mesmos dados, eliminando toda a visualização.", isCorrect: false, explanation: "A solução não é eliminar visualizações, mas torná-las mais eficientes." },
      { letter: "E", text: "Converter para gráfico de pizza 3D para simplificar a representação visual.", isCorrect: false, explanation: "Gráficos de pizza 3D são uma das piores práticas de visualização segundo Tufte." }
    ],
    difficulty: "facil",
    detailedExplanation: "O data-ink ratio de Tufte é calculado como data-ink / total-ink. O objetivo é maximizar essa razão, removendo elementos visuais que não contribuem diretamente para a comunicação dos dados. Tufte cunhou o termo 'chartjunk' para descrever acessórios visuais desnecessários como grades pesadas, bordas decorativas, preenchimentos gradiente, efeitos 3D e fundos estampados. A prática correta é aplicar o princípio de 'erase non-data-ink': remover sistematicamente elementos decorativos, verificando se a remoção prejudica a compreensão. Na maioria dos casos, grades leves, fundo limpo e cores sóbrias comunicam melhor. A legendas redundantes (quando os rótulos já estão nas barras) também devem ser removidos.",
    technicalJustification: "Tufte, E. R. (2001). The Visual Display of Quantitative Information, 2nd ed. Graphics Press. Conceito de data-ink ratio e chartjunk.",
    relatedConcepts: ["data-ink ratio", "chartjunk", "visualização eficiente", "Tufte"]
  },
  {
    question: "Uma equipe de Business Intelligence da Petrobras está construindo um dashboard executivo para monitorar KPIs de segurança operacional. O dashboard será utilizado pelo CEO e diretores em reuniões semanais. Considerando os princípios de storytelling com dados e design de dashboards, analise as afirmativas:\n\nI. O dashboard deve usar cores de semáforo (verde, amarelo, vermelho) para indicar rapidamente o status dos indicadores.\nII. Gráficos de sparklines são adequados para mostrar tendências temporais de forma compacta.\nIII. A narrativa textual complementar aos gráficos é desnecessária em dashboards executivos.\n\nEstá(ão) correta(s) a(s) afirmativa(s):",
    options: [
      { letter: "A", text: "I, apenas.", isCorrect: false, explanation: "As afirmativas I e II estão corretas." },
      { letter: "B", text: "I e II, apenas.", isCorrect: true, explanation: "Cores semafóricas e sparklines são boas práticas; narrativa textual agrega valor." },
      { letter: "C", text: "II e III, apenas.", isCorrect: false, explanation: "A afirmativa III é incorreta; narrativas textuais são valiosas em dashboards." },
      { letter: "D", text: "I, II e III.", isCorrect: false, explanation: "A afirmativa III está incorreta." },
      { letter: "E", text: "III, apenas.", isCorrect: false, explanation: "A afirmativa III contraria as boas práticas de storytelling." }
    ],
    difficulty: "medio",
    detailedExplanation: "Afirmativa I (CORRETA): O uso de cores de semáforo (verde/amarelo/vermelho) é uma convenção universal reconhecida por Few (2006) como eficaz para dashboards executivos, pois permite avaliação rápida do status sem necessidade de análise detalhada. Afirmativa II (CORRETA): Sparklines, conceito popularizado por Tufte, são gráficos compactos inline que mostram tendências temporais sem ocupar espaço excessivo — ideais para dashboards densos. Afirmativa III (INCORRETA): Knaflic enfatiza que narrativas textuais (annotations, call-outs, resumos) são essenciais para contextualizar os dados e guiar a interpretação. Um bom dashboard executivo combina visualizações com textos explicativos curtos que direcionam a atenção para os pontos mais relevantes.",
    technicalJustification: "Few, S. (2006). Information Dashboard Design. Analytics Press. Knaflic (2015). Storytelling with Data. Wiley.",
    relatedConcepts: ["dashboard executivo", "sparklines", "cores semafóricas", "anotações"]
  },
  {
    question: "Na Petrobras, uma cientista de dados precisa comunicar uma descoberta importante: a correlação entre temperatura ambiente e eficiência de um processo de refino. Ela tem disponíveis diversos tipos de gráficos. Segundo os princípios de escolha de visualização adequada de Knaflic (2015), qual é o tipo de gráfico MAIS apropriado para demonstrar essa correlação entre duas variáveis contínuas?",
    options: [
      { letter: "A", text: "Gráfico de pizza para mostrar a proporção de cada variável no resultado total.", isCorrect: false, explanation: "Gráfico de pizza é para proporções de um todo, não para correlação entre variáveis." },
      { letter: "B", text: "Gráfico de barras empilhadas para comparar as duas variáveis lado a lado.", isCorrect: false, explanation: "Barras empilhadas são para composição, não para correlação." },
      { letter: "C", text: "Gráfico de dispersão (scatter plot) com linha de tendência para mostrar o padrão de correlação.", isCorrect: true, explanation: "O scatter plot é o gráfico ideal para visualizar correlação entre duas variáveis contínuas." },
      { letter: "D", text: "Gráfico de áreas empilhadas para mostrar a evolução das duas variáveis ao longo do tempo.", isCorrect: false, explanation: "Gráfico de áreas é para tendências temporais, não para correlação entre variáveis." },
      { letter: "E", text: "Histograma para mostrar a distribuição de frequência de ambas as variáveis.", isCorrect: false, explanation: "Histograma mostra distribuição de uma variável, não correlação entre duas." }
    ],
    difficulty: "medio",
    detailedExplanation: "A escolha correta de visualização é fundamental no storytelling com dados. Knaflic propõe um framework de seleção baseado no objetivo da comunicação. Para demonstrar correlação entre duas variáveis contínuas (temperatura e eficiência), o gráfico de dispersão (scatter plot) é a opção ideal. Cada ponto representa uma observação com valores nas duas dimensões (eixo X = temperatura, eixo Y = eficiência). A adição de uma linha de tendência (regressão linear ou LOWESS) ajuda a visualizar o padrão de correlação. Um coeficiente R² pode ser adicionado como anotação textual. As demais alternativas usam tipos de gráficos inadequados: pizza (proporções de um todo), barras empilhadas (composição), áreas (tendências temporais) e histograma (distribuição univariada).",
    technicalJustification: "Knaflic, C. N. (2015). Storytelling with Data, Cap. 2: Choosing an effective visual. Few, S. (2012). Show Me the Numbers.",
    relatedConcepts: ["scatter plot", "correlação", "linha de tendência", "seleção de gráfico"]
  },
  {
    question: "Um analista de dados está preparando uma apresentação sobre a evolução dos custos operacionais das plataformas offshore da Petrobras nos últimos 5 anos. Ele deseja contar uma história convincente que leve à aprovação de investimentos em manutenção preventiva. Considerando a técnica de 'Big Idea' proposta por Knaflic, que consiste em articular a mensagem central em uma única frase, qual das alternativas apresenta a MELHOR formulação dessa Big Idea?",
    options: [
      { letter: "A", text: "Os custos operacionais das plataformas offshore variaram ao longo dos últimos 5 anos conforme diversos fatores.", isCorrect: false, explanation: "Frase vaga, sem insight acionável ou proposta de ação." },
      { letter: "B", text: "Investimentos em manutenção preventiva reduziram custos de parada não programada em 35%, justificando a ampliação do programa para todas as plataformas.", isCorrect: true, explanation: "Combina dado específico, insight e proposta de ação — perfeita Big Idea." },
      { letter: "C", text: "A Petrobras possui 47 plataformas offshore com diferentes perfis de custo operacional e necessidades de manutenção.", isCorrect: false, explanation: "Frase informativa mas sem direcionamento para ação." },
      { letter: "D", text: "Precisamos discutir os investimentos em manutenção das plataformas offshore.", isCorrect: false, explanation: "Genérica demais, não contém insight baseado em dados." },
      { letter: "E", text: "Os dados mostram que há correlação entre investimentos e custos operacionais nas plataformas.", isCorrect: false, explanation: "Vaga e sem número concreto ou proposta de ação." }
    ],
    difficulty: "dificil",
    detailedExplanation: "A 'Big Idea' de Knaflic deve conter três elementos: (1) deve articular seu ponto de vista único, (2) deve comunicar o que está em jogo (stakes), e (3) deve ser uma frase completa que direciona para ação. A alternativa B atende aos três critérios: contém um dado específico (35% de redução), um insight claro (manutenção preventiva reduz custos) e uma proposta de ação (ampliar o programa). As demais alternativas falham: A é descritiva sem insight, C é factual sem direcionamento, D é genérica sem dados, e E é vaga sem proposta concreta. A capacidade de sintetizar uma mensagem complexa em uma Big Idea é essencial para comunicação executiva eficaz.",
    technicalJustification: "Knaflic, C. N. (2015). Storytelling with Data, Cap. 1: The importance of context. Conceito de Big Idea.",
    relatedConcepts: ["Big Idea", "call to action", "comunicação executiva", "insight acionável"]
  }
];

// ═══════════════════════════════════════════════════════════
// CONTEÚDO: b3-dashboards (falta apenas theory)
// ═══════════════════════════════════════════════════════════
const dashboardsTheory = [
  {
    type: "introduction",
    title: "Introdução e Contextualização",
    content: `## Dashboards e Visualização de Dados no Contexto da Petrobras

Os dashboards são ferramentas essenciais de **Business Intelligence** que consolidam, em uma única tela, os indicadores-chave de desempenho (KPIs) de uma organização. No contexto do concurso da **Petrobras — Ênfase 6**, esse tópico conecta-se diretamente a **BI, OLAP, Data Warehouse e Storytelling com Dados**.

### Por que é crítico para o concurso?

A CESGRANRIO cobra frequentemente os **princípios de design de dashboards**, a diferença entre dashboards **operacionais, táticos e estratégicos**, e o uso correto de visualizações. Questões sobre **Power BI**, **Tableau** e boas práticas de visualização aparecem regularmente.

### Mapa de conexões
- **Data Warehouse** → fonte dos dados consolidados
- **OLAP** → permite drill-down nos dashboards
- **ETL** → alimenta os dados exibidos
- **Storytelling** → narrativa visual que complementa o dashboard

### Analogia
Pense em um **painel de avião**: o piloto precisa ver altitude, velocidade, combustível e direção em um único olhar. Se o painel fosse desorganizado ou tivesse informações irrelevantes, a tomada de decisão seria prejudicada. Um dashboard de negócios funciona da mesma forma — apresenta o essencial de forma clara para decisões rápidas.`
  },
  {
    type: "fundamentals",
    title: "Fundamentos Teóricos",
    content: `## Fundamentos de Dashboards

### Definição
Um **dashboard** é uma exibição visual das informações mais importantes necessárias para alcançar um ou mais objetivos, consolidadas e organizadas em uma única tela para que possam ser monitoradas de relance (Stephen Few, 2006).

### Tipos de Dashboards

| Tipo | Objetivo | Atualização | Público |
|------|----------|-------------|---------|
| **Operacional** | Monitorar processos em tempo real | Minutos/horas | Operadores, analistas |
| **Tático** | Analisar tendências e progresso | Diário/semanal | Gerentes |
| **Estratégico** | Visão executiva de KPIs | Mensal/trimestral | Diretores, C-Level |

### Princípios Fundamentais de Design

1. **Clareza**: Cada elemento deve comunicar uma informação específica
2. **Simplicidade**: Evitar poluição visual (chartjunk)
3. **Relevância**: Mostrar apenas o que é necessário para decisão
4. **Contexto**: Comparações, metas e benchmarks dão significado aos números
5. **Hierarquia visual**: Informações mais importantes em destaque

### Data-Ink Ratio (Tufte)
A razão entre a tinta usada para representar dados e o total de tinta no gráfico deve ser **maximizada**. Remova grades desnecessárias, bordas decorativas e efeitos 3D.

### Gestalt e Percepção Visual
Os princípios da Gestalt (proximidade, similaridade, continuidade, fechamento) guiam como organizamos elementos no dashboard para que o cérebro interprete padrões rapidamente.`
  },
  {
    type: "definitions",
    title: "Definições e Terminologia",
    content: `## Glossário de Termos Essenciais

| Termo | Definição |
|-------|-----------|
| **KPI** | Key Performance Indicator — métrica quantificável que reflete o desempenho em relação a objetivos estratégicos |
| **Dashboard** | Painel visual que consolida KPIs e métricas em uma única tela para monitoramento rápido |
| **Drill-down** | Navegação de um nível agregado para um nível mais detalhado nos dados |
| **Drill-through** | Navegação para uma página/relatório diferente com detalhes adicionais |
| **Sparkline** | Gráfico compacto inline que mostra tendências sem eixos ou rótulos |
| **Tooltip** | Informação contextual exibida ao passar o mouse sobre um elemento |
| **Slicer/Filtro** | Componente interativo que filtra todos os visuais do dashboard |
| **Medida** | Cálculo dinâmico sobre dados (ex: soma, média, contagem) |
| **Dimensão** | Atributo categórico usado para agrupar dados (ex: região, produto) |
| **Chartjunk** | Elementos decorativos em gráficos que não contribuem para a comunicação (Tufte) |
| **Data-ink ratio** | Proporção de tinta dedicada a representar dados vs total de tinta no gráfico |
| **Heat map** | Visualização que usa cores para representar intensidade de valores |

### Ferramentas Principais
- **Power BI** (Microsoft): Ferramenta líder de mercado, integrada ao ecossistema Microsoft (Excel, Azure, SharePoint). Usa DAX para cálculos e Power Query para ETL.
- **Tableau**: Pioneiro em visualização interativa, forte em exploração ad hoc.
- **Qlik Sense**: Motor associativo de dados, descoberta automatizada de insights.
- **Looker** (Google): BI baseado em modelagem semântica com LookML.`
  },
  {
    type: "technical",
    title: "Aprofundamento Técnico",
    content: `## Detalhamento Técnico

### Escolha do Tipo de Gráfico

| Objetivo | Gráfico Recomendado |
|----------|-------------------|
| Comparar categorias | Barras horizontais/verticais |
| Mostrar tendência temporal | Linha |
| Proporção de um todo | Pizza (máx. 5-6 fatias) ou barras empilhadas |
| Correlação entre variáveis | Dispersão (scatter plot) |
| Distribuição | Histograma, box plot |
| Composição ao longo do tempo | Áreas empilhadas |
| Ranking | Barras horizontais ordenadas |
| KPI único | Card / Big Number |
| Tendência compacta | Sparkline |
| Geográfico | Mapa coroplético |

### Power BI — Conceitos Técnicos

**DAX (Data Analysis Expressions)**: linguagem de fórmulas para criar medidas calculadas.
\`\`\`
Receita Total = SUM(Vendas[Valor])
Receita YoY% = DIVIDE([Receita Total] - CALCULATE([Receita Total], SAMEPERIODLASTYEAR('Calendario'[Data])), CALCULATE([Receita Total], SAMEPERIODLASTYEAR('Calendario'[Data])))
\`\`\`

**Power Query (M Language)**: motor de ETL embutido para transformação de dados antes da modelagem.

**Modelo Estrela**: Power BI funciona melhor com modelos em estrela (tabelas fato + dimensão), aproveitando compressão colunar do VertiPaq.

### Boas Práticas de Performance
1. Minimizar o número de visuais por página (máximo 8-10)
2. Usar medidas em vez de colunas calculadas quando possível
3. Evitar tabelas excessivamente grandes no modelo
4. Utilizar agregações e modo de armazenamento Import vs DirectQuery conforme necessidade`
  },
  {
    type: "examples",
    title: "Exemplos Práticos Resolvidos",
    content: `## Exemplos Práticos

### Exemplo 1: Dashboard Operacional de Produção (Petrobras)
**Cenário**: Uma plataforma offshore precisa monitorar produção em tempo real.

**Elementos do dashboard**:
- **Card KPI**: Produção atual (bbl/dia) com indicador de meta
- **Gráfico de linhas**: Produção das últimas 24h com linha de meta
- **Semáforo**: Status dos poços (verde=produzindo, amarelo=manutenção, vermelho=parado)
- **Tabela**: Top 5 poços por produção com sparklines de tendência

**Tipo**: Dashboard operacional, atualização em tempo real, público: operadores da plataforma.

### Exemplo 2: Dashboard Estratégico de C-Level
**Cenário**: CEO precisa ver resultados consolidados trimestrais.

**Elementos**:
- **Big Numbers**: Receita, EBITDA, Produção Total
- **Gráfico de barras**: Receita por segmento (E&P, Refino, Gás)
- **Gráfico waterfall**: Composição do resultado (receita → custos → lucro)
- **Mapa**: Produção por região geográfica

**Tipo**: Dashboard estratégico, atualização mensal, público: diretores.

### Exemplo 3: Redesign seguindo princípios de Tufte
**Antes** (ruim): Gráfico de pizza 3D com 12 fatias, cores vibrantes, legenda externa, efeitos de sombra.

**Depois** (bom): Gráfico de barras horizontais ordenado do maior para menor, cores suaves, rótulos diretos nas barras, sem legenda necessária.

**Justificativa**: Barras são mais precisas que pizza para comparação. Ordenação facilita ranking. Rótulos diretos eliminam necessidade de legenda (reduzir eye travel).`
  },
  {
    type: "comparisons",
    title: "Comparações e Tabelas",
    content: `## Comparações Importantes

### Power BI vs Tableau

| Critério | Power BI | Tableau |
|----------|----------|---------|
| **Licença** | Gratuito (Desktop) + Pro ($10/mês) | Mais caro (~$70/mês) |
| **Integração** | Ecossistema Microsoft (Excel, Azure, Teams) | Ampla conectividade |
| **Linguagem de cálculo** | DAX | Cálculos nativos + LOD Expressions |
| **ETL** | Power Query (M) embutido | Prep Builder (separado) |
| **Publicação** | Power BI Service (nuvem Microsoft) | Tableau Server/Cloud |
| **Força** | Self-service BI corporativo | Exploração visual ad-hoc |
| **Curva de aprendizado** | Moderada | Moderada-alta |

### Dashboard Operacional vs Tático vs Estratégico

| Aspecto | Operacional | Tático | Estratégico |
|---------|-------------|--------|-------------|
| **Frequência** | Tempo real / minutos | Diário / semanal | Mensal / trimestral |
| **Detalhamento** | Alto (transacional) | Médio (agregações) | Baixo (KPIs macro) |
| **Interatividade** | Alta (alertas, drill) | Média (filtros) | Baixa (visão geral) |
| **Público** | Operadores, analistas | Gerentes, coordenadores | Diretores, C-Level |
| **Exemplo** | Monitor de produção de poço | Análise de vendas regional | P&L consolidado |
| **Ação** | Resposta imediata | Ajuste tático | Decisão estratégica |

### Gráfico de Pizza vs Barras

| Critério | Pizza | Barras |
|----------|-------|--------|
| Comparação precisa | ❌ Difícil | ✅ Fácil |
| Muitas categorias | ❌ Máximo 5-6 | ✅ Escalável |
| Proporção do todo | ✅ Intuitivo | ⚠️ Menos direto |
| Mobile-friendly | ❌ Difícil de ler | ✅ Adapta bem |`
  },
  {
    type: "exam_tips",
    title: "Dicas para a Prova CESGRANRIO",
    content: `## Como a CESGRANRIO Cobra Este Assunto

### Padrões Identificados
1. **Questões conceituais**: "O que é um dashboard operacional?" / "Qual a diferença entre drill-down e drill-through?"
2. **Boas práticas**: "Qual princípio de Tufte é violado ao usar gráficos 3D?"
3. **Escolha de gráfico**: "Qual gráfico é mais adequado para mostrar tendência temporal?"
4. **Ferramentas**: Características específicas de Power BI (DAX, Power Query)

### Dicas de Resolução

- **Quando perguntarem sobre "melhor gráfico"**: Barras para comparação, Linhas para tendência, Dispersão para correlação, Pizza para proporção (máx. 5 fatias)
- **Questões sobre Tufte**: A resposta correta sempre elimina elementos decorativos e maximiza data-ink ratio
- **Dashboard executivo**: Sempre é o ESTRATÉGICO (não operacional). Atualização mensal/trimestral, poucos KPIs, Big Numbers.
- **Power BI**: A CESGRANRIO cobra DAX como linguagem de medidas e Power Query como motor de ETL integrado

### ⚠️ Pegadinhas Semânticas
- **"Painel de controle"** pode ser usado como sinônimo de dashboard
- **Dashboard ≠ Relatório**: Dashboard é para monitoramento rápido (single screen); relatório é para análise detalhada (múltiplas páginas)
- **Infográfico ≠ Dashboard**: Infográfico é estático e narrativo; dashboard é interativo e atualizado`
  },
  {
    type: "gotchas",
    title: "Pegadinhas e Armadilhas",
    content: `## Pegadinhas Mais Perigosas

⚠️ **1. Dashboard = Uma única tela**
Erro: Achar que dashboard pode ter múltiplas páginas. Por definição (Few), um dashboard cabe em **uma tela** sem necessidade de scroll. O que tem múltiplas páginas é um **relatório**.

⚠️ **2. Gráfico de pizza 3D**
Erro: Considerar gráficos 3D como "mais informativos". Na realidade, distorcem a percepção de proporções. A resposta correta sempre condena efeitos 3D.

⚠️ **3. Confundir drill-down com drill-through**
Erro: Usar como sinônimos. **Drill-down** = detalhar dentro do mesmo visual (país → estado → cidade). **Drill-through** = navegar para outra página/relatório com contexto filtrado.

⚠️ **4. Dashboard operacional para diretores**
Erro: Achar que a diretoria quer dashboard operacional. Diretores usam dashboard **estratégico**. Operacional é para quem executa processos.

⚠️ **5. Power Query = DAX**
Erro: Confundir. Power Query (linguagem M) é para **ETL/transformação** de dados. DAX é para **cálculos e medidas** no modelo.

⚠️ **6. Mais gráficos = melhor dashboard**
Erro: Colocar 20+ gráficos em uma página. Boas práticas recomendam **8-10 visuais no máximo** por dashboard.

⚠️ **7. KPI ≠ Métrica**
Erro: Toda métrica é KPI. Na verdade, KPI é um subconjunto: é a métrica que está **diretamente ligada a um objetivo estratégico**. Número de funcionários é métrica; taxa de turnover é KPI.`
  },
  {
    type: "summary",
    title: "Resumo Estratégico",
    content: `## Resumo para Memorização

### Mnemônico: **TDCRE** (Tipos de Dashboard: Consulte Rapidamente Esses)
- **T**ipo operacional → tempo real → operadores
- **D**ashboard tático → diário/semanal → gerentes
- **C**-Level → estratégico → mensal/trimestral
- **R**emoção de chartjunk = Tufte
- **E**scolha de gráfico = depende do objetivo

### 10 Pontos Essenciais

1. Dashboard cabe em **uma única tela** (definição de Few)
2. Tipos: **Operacional** (real-time), **Tático** (diário), **Estratégico** (mensal)
3. **Data-ink ratio** (Tufte): maximizar proporção de tinta informativa
4. **Chartjunk**: elementos decorativos que prejudicam a comunicação
5. Gráfico de barras para **comparação**, linhas para **tendências**, dispersão para **correlação**
6. **Power BI**: DAX (medidas) + Power Query (ETL) + VertiPaq (compressão)
7. Dashboard ≠ Relatório (uma tela vs. múltiplas páginas)
8. Princípios Gestalt guiam organização visual (proximidade, similaridade)
9. Sparklines: gráficos compactos inline para tendências
10. Drill-down (detalhar nível) ≠ Drill-through (navegar para outra página)

### Palavras-Chave
- **Few**: definição de dashboard, tipos (operacional/tático/estratégico)
- **Tufte**: data-ink ratio, chartjunk, sparklines
- **Knaflic**: storytelling, escolha de gráfico, Big Idea
- **DAX**: linguagem de cálculo do Power BI
- **Power Query**: motor ETL integrado ao Power BI`
  },
  {
    type: "checklist",
    title: "Checklist de Auto-Avaliação",
    content: `## Checklist de Domínio

### Conceitos Fundamentais
- [ ] Sei definir dashboard segundo Stephen Few
- [ ] Conheço os 3 tipos: operacional, tático e estratégico
- [ ] Entendo data-ink ratio e chartjunk (Tufte)
- [ ] Sei explicar os princípios da Gestalt aplicados a dashboards

### Visualizações
- [ ] Domino a escolha do gráfico adequado para cada objetivo
- [ ] Sei quando usar barras, linhas, pizza, dispersão, sparklines
- [ ] Entendo por que gráficos 3D são problemáticos
- [ ] Conheço heat maps, treemaps e gráficos waterfall

### Ferramentas
- [ ] Conheço as características do Power BI (DAX, Power Query, Service)
- [ ] Sei diferenciar Power BI de Tableau
- [ ] Entendo modelo estrela (star schema) no contexto de BI
- [ ] Conheço Import vs DirectQuery no Power BI

### Boas Práticas
- [ ] Sei o limite recomendado de visuais por dashboard (8-10)
- [ ] Entendo a diferença entre dashboard e relatório
- [ ] Sei quando usar cores de semáforo e Big Numbers
- [ ] Conheço o princípio de hierarquia visual

### Interatividade
- [ ] Sei definir drill-down e drill-through
- [ ] Entendo filtros/slicers e cross-filtering
- [ ] Conheço tooltips e bookmarks
- [ ] Sei o que são alertas em dashboards operacionais`
  }
];

// ═══════════════════════════════════════════════════════════
// HELPER: Gera conteúdo de segurança completo por tópico
// ═══════════════════════════════════════════════════════════

function generateSecurityTopic(config) {
  const { id, blocoId, title, intro, fundamentals, definitions, technical, examples, comparisons, examTips, gotchas, summary, checklist, exercises, flashcards } = config;

  const theory = makeTheory(id, [
    { type: "introduction", title: "Introdução e Contextualização", content: intro },
    { type: "fundamentals", title: "Fundamentos Teóricos", content: fundamentals },
    { type: "definitions", title: "Definições e Terminologia", content: definitions },
    { type: "technical", title: "Aprofundamento Técnico", content: technical },
    { type: "examples", title: "Exemplos Práticos Resolvidos", content: examples },
    { type: "comparisons", title: "Comparações e Tabelas", content: comparisons },
    { type: "exam_tips", title: "Dicas para a Prova CESGRANRIO", content: examTips },
    { type: "gotchas", title: "Pegadinhas e Armadilhas", content: gotchas },
    { type: "summary", title: "Resumo Estratégico", content: summary },
    { type: "checklist", title: "Checklist de Auto-Avaliação", content: checklist },
  ]);

  writeJson(id, 'theory.json', theory);
  writeJson(id, 'exercises.json', makeExercises(id, blocoId, exercises));
  writeJson(id, 'flashcards.json', makeFlashcards(id, flashcards));
}

// ═══════════════════════════════════════════════════════════
// b3-seguranca-info — Segurança da Informação - Fundamentos
// ═══════════════════════════════════════════════════════════
const segInfoConfig = {
  id: 'b3-seguranca-info', blocoId: 'bloco-3', title: 'Segurança da Informação - Fundamentos',
  intro: `## Segurança da Informação no Contexto Petrobras

A **Segurança da Informação** é o pilar que sustenta a proteção dos ativos informacionais de qualquer organização. Para a **Petrobras**, uma empresa do setor de energia com dados estratégicos sobre reservas, produção e operações offshore, a segurança é crítica.

### Tríade CIA
O modelo fundamental é a **Tríade CIA**: **Confidencialidade** (garantir que a informação só é acessível a quem tem autorização), **Integridade** (assegurar que dados não foram alterados indevidamente) e **Disponibilidade** (garantir acesso aos dados quando necessário).

### Conexões com o Edital
- **ISO 27002** → controles técnicos e organizacionais
- **ISO 31000** → gestão de riscos de segurança
- **ISO 22301** → continuidade de negócios
- **LGPD** → proteção de dados pessoais

### Analogia
A segurança da informação é como a segurança de um prédio: você precisa de **muros** (confidencialidade), **câmeras de vigilância** (integridade — detectar alterações indevidas) e **geradores de energia** (disponibilidade — garantir funcionamento mesmo em emergências). Cada camada protege contra um tipo diferente de ameaça.`,

  fundamentals: `## Base Teórica Completa

### A Tríade CIA (CID em português)

**Confidencialidade**: Propriedade de que a informação não está disponível ou acessível a indivíduos, entidades ou processos não autorizados (ISO 27000).
- Mecanismos: criptografia, controle de acesso, classificação da informação
- Exemplo: Dados de reservas de petróleo da Petrobras devem ser acessíveis apenas a funcionários autorizados

**Integridade**: Propriedade de exatidão e completude da informação (ISO 27000).
- Mecanismos: hash, assinatura digital, controle de versão, checksums
- Exemplo: Relatórios financeiros não podem ser alterados após publicação

**Disponibilidade**: Propriedade de ser acessível e utilizável sob demanda por uma entidade autorizada (ISO 27000).
- Mecanismos: redundância, backup, DRP, alta disponibilidade, SLA
- Exemplo: Sistemas de monitoramento de plataformas offshore devem estar disponíveis 24/7

### Propriedades Complementares

| Propriedade | Definição |
|-------------|-----------|
| **Autenticação** | Verificação da identidade de um usuário, processo ou dispositivo |
| **Autorização** | Concessão de permissão para acessar recursos após autenticação |
| **Não-repúdio** | Incapacidade de negar autoria de uma ação (prova de origem e destino) |
| **Auditabilidade** | Capacidade de rastrear ações realizadas no sistema (logs) |
| **Legalidade** | Conformidade com legislações aplicáveis (LGPD, Marco Civil) |

### Classificação da Informação
- **Pública**: Acesso irrestrito
- **Interna**: Acesso restrito a funcionários
- **Confidencial**: Acesso limitado a grupos específicos
- **Secreta/Restrita**: Acesso controlado individualmente`,

  definitions: `## Definições Formais

| Termo | Definição |
|-------|-----------|
| **Ativo** | Qualquer coisa que tenha valor para a organização (dados, hardware, software, pessoas) |
| **Ameaça** | Causa potencial de um incidente indesejado que pode resultar em dano (ISO 27000) |
| **Vulnerabilidade** | Fraqueza de um ativo que pode ser explorada por uma ameaça |
| **Risco** | Efeito da incerteza nos objetivos; combinação de probabilidade e impacto |
| **Controle** | Medida que modifica o risco (preventivo, detectivo, corretivo) |
| **Incidente** | Evento ou série de eventos indesejados que têm probabilidade significativa de comprometer operações |
| **Política de Segurança** | Conjunto de diretrizes formais sobre como proteger ativos informacionais |
| **Autenticação multifator (MFA)** | Uso de 2+ fatores: algo que sabe (senha), algo que tem (token), algo que é (biometria) |
| **Princípio do menor privilégio** | Conceder apenas as permissões mínimas necessárias para executar uma função |
| **Defesa em profundidade** | Camadas múltiplas de controles para que a falha de um não comprometa todo o sistema |
| **Zero Trust** | Modelo que assume que nenhuma entidade é confiável por padrão, verificando continuamente |
| **SIEM** | Security Information and Event Management — correlação centralizada de logs e alertas |`,

  technical: `## Aprofundamento Técnico

### Controle de Acesso — Modelos

| Modelo | Sigla | Descrição |
|--------|-------|-----------|
| **Discretionary** | DAC | O proprietário do recurso define permissões (ex: permissões de arquivo Linux) |
| **Mandatory** | MAC | Baseado em classificação de segurança e clearance do usuário (militar, governo) |
| **Role-Based** | RBAC | Permissões atribuídas a papéis, não a indivíduos (mais usado em empresas) |
| **Attribute-Based** | ABAC | Decisão baseada em atributos do sujeito, recurso, ação e contexto |

### Autenticação — Fatores

| Fator | Tipo | Exemplos |
|-------|------|----------|
| **1º Fator** | Algo que você **sabe** | Senha, PIN, frase secreta |
| **2º Fator** | Algo que você **tem** | Token, smart card, celular (OTP) |
| **3º Fator** | Algo que você **é** | Impressão digital, íris, face |

**MFA (Multi-Factor Authentication)**: Combina 2 ou mais fatores de categorias DIFERENTES. Duas senhas NÃO é MFA.

### Ciclo de Gestão de Riscos (ISO 27005)
1. **Identificação** do contexto e dos ativos
2. **Identificação** de ameaças e vulnerabilidades
3. **Análise** de probabilidade e impacto
4. **Avaliação** do risco (comparar com critérios de aceitação)
5. **Tratamento**: aceitar, mitigar, transferir ou evitar
6. **Monitoramento** contínuo e comunicação

### Tipos de Controles

| Tipo | Quando atua | Exemplo |
|------|-------------|---------|
| **Preventivo** | Antes do incidente | Firewall, política de senha, treinamento |
| **Detectivo** | Durante/após o incidente | IDS/IPS, SIEM, audit logs |
| **Corretivo** | Após o incidente | Backup restore, patch, plano de contingência |
| **Dissuasivo** | Antes (por intimidação) | Câmeras, avisos legais |
| **Compensatório** | Quando o controle principal falha | Controle alternativo temporário |`,

  examples: `## Exemplos Práticos

### Exemplo 1: Classificação de Ativos na Petrobras
**Cenário**: A Petrobras precisa classificar seus ativos de informação.

| Ativo | Classificação | Justificativa |
|-------|---------------|---------------|
| Dados de reservas provadas | **Secreta** | Impacto no valor de mercado |
| E-mails internos | **Interna** | Comunicação corporativa |
| Relatório anual publicado | **Pública** | Disponível a todos |
| Dados pessoais de funcionários | **Confidencial** (LGPD) | Dados pessoais sensíveis |

### Exemplo 2: Implementação de MFA
**Cenário**: Um sistema de controle de produção offshore precisa de MFA.

**Solução implementada**:
- 1º Fator: Senha forte (mínimo 12 caracteres, complexidade)
- 2º Fator: Token físico RSA SecurID (algo que você tem)
- Biometria opcional para acesso administrativo (algo que você é)

**Resultado**: Tentativas de acesso não autorizado reduziram 95%.

### Exemplo 3: Análise de Risco
**Cenário**: Avaliar risco de vazamento de dados de produção.

- **Ameaça**: Phishing direcionado (spear phishing)
- **Vulnerabilidade**: Funcionários sem treinamento de segurança
- **Probabilidade**: Alta (4/5)
- **Impacto**: Muito Alto (5/5 — dados estratégicos)
- **Risco**: Crítico (20/25)
- **Tratamento**: Programa de conscientização + filtro anti-phishing + MFA`,

  comparisons: `## Comparações Fundamentais

### Autenticação vs Autorização

| Aspecto | Autenticação | Autorização |
|---------|-------------|-------------|
| **Pergunta** | "Quem é você?" | "O que você pode fazer?" |
| **Momento** | Primeiro (identificação) | Segundo (após autenticação) |
| **Mecanismo** | Login/senha, biometria, token | Permissões, ACLs, papéis |
| **Protocolo** | SAML, OAuth (parcial), Kerberos | OAuth, RBAC, ABAC |
| **Exemplo** | Digitar usuário e senha | Apenas leitura vs leitura/escrita |

### Ameaça vs Vulnerabilidade vs Risco

| Conceito | Definição | Exemplo |
|----------|-----------|---------|
| **Ameaça** | Agente ou evento que pode causar dano | Hacker, incêndio, funcionário malicioso |
| **Vulnerabilidade** | Fraqueza que pode ser explorada | Software desatualizado, porta aberta |
| **Risco** | Probabilidade × Impacto da ameaça explorar a vulnerabilidade | 80% de chance de ataque com impacto de R$1M |

### Controles Preventivos vs Detectivos vs Corretivos

| Tipo | Timing | Analogia | Exemplos |
|------|--------|----------|----------|
| **Preventivo** | Antes | Tranca da porta | Firewall, criptografia, treinamento |
| **Detectivo** | Durante | Alarme | IDS, SIEM, auditoria, câmeras |
| **Corretivo** | Depois | Conserto | Restore de backup, patches, resposta a incidentes |`,

  examTips: `## Dicas para a CESGRANRIO

### Padrões de Questão
1. **Tríade CIA**: "Qual propriedade garante que dados não foram alterados?" → Integridade
2. **MFA**: "Dois fatores de autenticação são..." → devem ser de CATEGORIAS diferentes
3. **Controles**: "Um firewall é um controle..." → Preventivo
4. **Modelos de acesso**: RBAC é o mais cobrado (baseado em papéis)

### Regras de Ouro
- Se a questão fala em "alteração não autorizada" → **Integridade**
- Se fala em "acesso restrito" → **Confidencialidade**
- Se fala em "sistema fora do ar" → **Disponibilidade**
- Se fala em "provar que enviou" → **Não-repúdio**
- Se fala em "verificar identidade" → **Autenticação** (não autorização!)

### Cuidado!
- **Autenticação ≠ Autorização** — a CESGRANRIO ADORA esse pega
- **Engenharia social** é ameaça, não vulnerabilidade
- **IDS detecta, IPS previne** (detecta E bloqueia)
- **Criptografia simétrica** = mesma chave; **assimétrica** = par de chaves`,

  gotchas: `## Pegadinhas Perigosas

⚠️ **1. Duas senhas = MFA?** NÃO. MFA exige fatores de categorias DIFERENTES (sabe + tem, por exemplo). Duas senhas são apenas autenticação reforçada.

⚠️ **2. Firewall = 100% seguro?** NÃO. Firewall é apenas uma camada. Defesa em profundidade requer múltiplos controles.

⚠️ **3. IDS = IPS?** NÃO. IDS apenas **detecta** e alerta. IPS **detecta e bloqueia** automaticamente.

⚠️ **4. Criptografia garante integridade?** Sozinha, NÃO. Criptografia garante **confidencialidade**. Para integridade, use **hash** ou **assinatura digital**.

⚠️ **5. RBAC = DAC?** NÃO. No RBAC, permissões são atribuídas a **papéis/funções**, não a indivíduos. No DAC, o **dono** do recurso controla o acesso.

⚠️ **6. Risco = Ameaça?** NÃO. Risco = Ameaça × Vulnerabilidade × Impacto. Uma ameaça sem vulnerabilidade correspondente tem risco zero.

⚠️ **7. Disponibilidade é apenas "sistema ligado"?** NÃO. Inclui também **tempo de resposta aceitável**, **capacidade adequada** e **acesso autorizado disponível**.

⚠️ **8. Confidencialidade e privacidade são sinônimos?** NÃO. Confidencialidade é sobre informações em geral. Privacidade refere-se especificamente a **dados pessoais** (LGPD).`,

  summary: `## Resumo Estratégico

### Mnemônico: **CIA + ANAL** (Confidencialidade, Integridade, Disponibilidade + Autenticação, Não-repúdio, Auditabilidade, Legalidade)

### 10 Pontos para Memorizar
1. **Tríade CIA**: Confidencialidade, Integridade, Disponibilidade
2. **Autenticação** verifica QUEM; **Autorização** define O QUÊ pode fazer
3. **MFA** = 2+ fatores de categorias DIFERENTES (sabe, tem, é)
4. **RBAC** atribui permissões a PAPÉIS, não a indivíduos
5. **Controles**: Preventivo (antes), Detectivo (durante), Corretivo (depois)
6. **Risco** = Probabilidade × Impacto; Tratamento: aceitar, mitigar, transferir, evitar
7. **IDS** detecta; **IPS** detecta + bloqueia
8. **Defesa em profundidade** = múltiplas camadas de controle
9. **Zero Trust** = nunca confiar, sempre verificar
10. **Princípio do menor privilégio** = permissão mínima necessária

### Mapa de Palavras-Chave
| Termo | Definição Rápida |
|-------|-----------------|
| CIA | Modelo de 3 propriedades fundamentais |
| MFA | Autenticação com múltiplos fatores de tipos diferentes |
| RBAC | Controle de acesso baseado em papéis/funções |
| SIEM | Sistema centralizado de correlação de eventos de segurança |
| Zero Trust | Modelo que nunca assume confiança por padrão |`,

  checklist: `## Checklist de Auto-Avaliação

### Tríade CIA
- [ ] Sei definir Confidencialidade, Integridade e Disponibilidade
- [ ] Consigo identificar qual propriedade é afetada em cada cenário
- [ ] Conheço mecanismos de proteção para cada propriedade

### Autenticação e Autorização
- [ ] Sei diferenciar autenticação de autorização
- [ ] Domino os 3 fatores de autenticação (sabe, tem, é)
- [ ] Entendo por que duas senhas NÃO é MFA
- [ ] Conheço os modelos DAC, MAC, RBAC e ABAC

### Gestão de Riscos
- [ ] Sei diferenciar ameaça, vulnerabilidade e risco
- [ ] Conheço as 4 estratégias de tratamento de risco
- [ ] Entendo o ciclo de gestão de riscos (ISO 27005)

### Controles de Segurança
- [ ] Sei classificar controles em preventivo, detectivo e corretivo
- [ ] Conheço exemplos de cada tipo de controle
- [ ] Entendo defesa em profundidade

### Conceitos Complementares
- [ ] Sei definir não-repúdio e auditabilidade
- [ ] Conheço o modelo Zero Trust
- [ ] Entendo classificação da informação (pública → secreta)
- [ ] Sei o que é SIEM e sua função
- [ ] Conheço a diferença entre IDS e IPS
- [ ] Entendo o princípio do menor privilégio`,

  exercises: [
    {
      question: "A segurança da informação é sustentada por três propriedades fundamentais conhecidas como Tríade CIA. UmPetrobras de energia sofre um ataque que torna seus sistemas de monitoramento de produção inacessíveis por 12 horas. Qual propriedade da Tríade CIA foi comprometida nesse cenário?",
      options: [
        { letter: "A", text: "Confidencialidade, pois informações do sistema foram expostas.", isCorrect: false, explanation: "O cenário não menciona exposição de dados, mas sim indisponibilidade." },
        { letter: "B", text: "Integridade, pois os dados do sistema foram corrompidos.", isCorrect: false, explanation: "O cenário não indica alteração de dados, mas falta de acesso." },
        { letter: "C", text: "Disponibilidade, pois os sistemas ficaram inacessíveis.", isCorrect: true, explanation: "Disponibilidade garante acesso quando necessário; a indisponibilidade por 12h compromete essa propriedade." },
        { letter: "D", text: "Autenticidade, pois a identidade dos usuários foi comprometida.", isCorrect: false, explanation: "O cenário não envolve questões de identidade ou autenticação." },
        { letter: "E", text: "Legalidade, pois houve violação da LGPD.", isCorrect: false, explanation: "O cenário trata de indisponibilidade, não de violação de dados pessoais." }
      ],
      difficulty: "facil",
      detailedExplanation: "A Tríade CIA compreende: Confidencialidade (informação acessível apenas a autorizados), Integridade (dados íntegros e não alterados indevidamente) e Disponibilidade (informação acessível quando necessário). No cenário apresentado, os sistemas ficaram inacessíveis por 12 horas, comprometendo diretamente a Disponibilidade. Ataques de Denial of Service (DoS/DDoS), falhas de infraestrutura e desastres naturais são exemplos de ameaças à disponibilidade. A confidencialidade seria comprometida em caso de acesso não autorizado, e a integridade em caso de alteração dos dados.",
      technicalJustification: "ISO/IEC 27000:2018 define disponibilidade como 'propriedade de ser acessível e utilizável sob demanda por uma entidade autorizada'.",
      relatedConcepts: ["Tríade CIA", "disponibilidade", "DoS", "SLA"]
    },
    {
      question: "Um administrador de banco de dados da Petrobras implementa autenticação multifator (MFA) para acesso ao sistema de gestão de reservas. Qual das seguintes combinações constitui CORRETAMENTE uma autenticação multifator?",
      options: [
        { letter: "A", text: "Senha e pergunta secreta, pois são duas formas de verificação.", isCorrect: false, explanation: "Ambos são 'algo que você sabe' — mesmo fator, não é MFA." },
        { letter: "B", text: "Token físico e aplicativo autenticador no celular, pois utilizam dois dispositivos.", isCorrect: false, explanation: "Ambos são 'algo que você tem' — mesmo fator, apenas dispositivos diferentes." },
        { letter: "C", text: "Senha (algo que sabe) e token OTP gerado por aplicativo (algo que tem), combinando dois fatores de categorias diferentes.", isCorrect: true, explanation: "MFA exige fatores de categorias diferentes: sabe + tem = MFA válido." },
        { letter: "D", text: "Impressão digital do polegar direito e da mão esquerda, pois são biometrias distintas.", isCorrect: false, explanation: "Ambas são 'algo que você é' — mesmo fator, duas biometrias do mesmo tipo." },
        { letter: "E", text: "Senha complexa de 20 caracteres e PIN numérico de 6 dígitos, por serem senhas de complexidades diferentes.", isCorrect: false, explanation: "Ambos são 'algo que você sabe' — complexidade diferente não torna MFA." }
      ],
      difficulty: "facil",
      detailedExplanation: "A autenticação multifator (MFA) exige o uso de dois ou mais fatores de categorias DIFERENTES: (1) algo que você sabe (senha, PIN), (2) algo que você tem (token, celular, smart card), (3) algo que você é (biometria). A alternativa C combina corretamente 'algo que sabe' (senha) com 'algo que tem' (token OTP no celular). As demais alternativas usam dois fatores da MESMA categoria: A (dois 'sabe'), B (dois 'tem'), D (dois 'é') e E (dois 'sabe'). Este é um ponto frequentemente cobrado pela CESGRANRIO.",
      technicalJustification: "NIST SP 800-63B define MFA como autenticação usando dois ou mais fatores de tipos diferentes.",
      relatedConcepts: ["MFA", "autenticação", "fatores de autenticação", "NIST 800-63"]
    },
    {
      question: "UmPetrobras de petróleo implementa diferentes tipos de controles de segurança. Considere os seguintes controles:\n\nI. Firewall bloqueando tráfego não autorizado\nII. Sistema SIEM gerando alertas em tempo real\nIII. Restauração de backup após incidente de ransomware\n\nA classificação CORRETA desses controles, na ordem apresentada, é:",
      options: [
        { letter: "A", text: "Preventivo, Detectivo, Corretivo", isCorrect: true, explanation: "Firewall previne, SIEM detecta, restore corrige." },
        { letter: "B", text: "Detectivo, Preventivo, Corretivo", isCorrect: false, explanation: "Firewall bloqueia (preventivo), não apenas detecta." },
        { letter: "C", text: "Preventivo, Corretivo, Detectivo", isCorrect: false, explanation: "SIEM detecta (não corrige) e restore é corretivo (não detectivo)." },
        { letter: "D", text: "Corretivo, Detectivo, Preventivo", isCorrect: false, explanation: "Classificação completamente invertida." },
        { letter: "E", text: "Preventivo, Preventivo, Detectivo", isCorrect: false, explanation: "SIEM é detectivo e restore é corretivo, não preventivo/detectivo." }
      ],
      difficulty: "medio",
      detailedExplanation: "Os controles de segurança são classificados pelo momento de atuação: (I) FIREWALL é PREVENTIVO — bloqueia tráfego antes que a ameaça alcance os sistemas; (II) SIEM é DETECTIVO — monitora eventos e gera alertas quando identifica atividade suspeita, mas não bloqueia automaticamente; (III) RESTAURAÇÃO DE BACKUP é CORRETIVO — é aplicado APÓS um incidente (ransomware) para restaurar o estado anterior. É importante não confundir IDS (detectivo) com IPS (preventivo, pois bloqueia). O firewall é preventivo por padrão, mas pode ter funções de detecção quando combinado com IDS.",
      technicalJustification: "ISO 27001:2022 Anexo A — classificação de controles de segurança.",
      relatedConcepts: ["controles preventivos", "controles detectivos", "controles corretivos", "SIEM", "firewall"]
    },
    {
      question: "No modelo de controle de acesso RBAC (Role-Based Access Control), uma empresa configura os seguintes papéis para seu sistema de banco de dados: 'Analista' (SELECT em tabelas), 'Desenvolvedor' (SELECT, INSERT em tabelas do ambiente de desenvolvimento) e 'DBA' (todos os privilégios). Um funcionário é transferido do setor de análise para desenvolvimento. Segundo o princípio do menor privilégio, qual ação é CORRETA?",
      options: [
        { letter: "A", text: "Adicionar o papel 'Desenvolvedor' mantendo o papel 'Analista', para não perder acesso a dados de análise.", isCorrect: false, explanation: "Acumular papéis viola o princípio do menor privilégio." },
        { letter: "B", text: "Conceder o papel 'DBA' temporariamente até que a configuração exata seja definida.", isCorrect: false, explanation: "Conceder privilégios máximos viola gravemente o menor privilégio." },
        { letter: "C", text: "Revogar o papel 'Analista' e atribuir apenas o papel 'Desenvolvedor', garantindo somente as permissões necessárias para a nova função.", isCorrect: true, explanation: "Menor privilégio: apenas as permissões necessárias para a função atual." },
        { letter: "D", text: "Manter ambos os papéis e adicionar restrição de horário para o papel de Analista.", isCorrect: false, explanation: "Manter papéis acumulados com restrição de horário ainda viola o menor privilégio." },
        { letter: "E", text: "Criar um novo papel 'Analista-Desenvolvedor' combinando todas as permissões.", isCorrect: false, explanation: "Criar papel com permissões combinadas equivale a acumular papéis." }
      ],
      difficulty: "medio",
      detailedExplanation: "O princípio do menor privilégio (Principle of Least Privilege) estabelece que cada sujeito deve receber apenas as permissões mínimas necessárias para desempenhar sua função. No RBAC, isso se traduz em: (1) ao mudar de função, o papel anterior deve ser REVOGADO; (2) apenas o papel correspondente à nova função deve ser atribuído. Acumular papéis (A), conceder privilégios excessivos (B), manter combinações (D) ou criar papéis que somam permissões (E) violam esse princípio. No contexto da Petrobras, isso é especialmente importante para conformidade com LGPD e auditorias de segurança.",
      technicalJustification: "NIST RBAC Model (Ferraiolo et al., 2001). ISO 27002:2022 — Controle de acesso baseado em papéis.",
      relatedConcepts: ["RBAC", "menor privilégio", "segregação de funções", "controle de acesso"]
    },
    {
      question: "UmPetrobras está implementando o modelo Zero Trust em sua infraestrutura de TI. Sobre esse modelo de segurança, analise as afirmativas:\n\nI. O Zero Trust assume que nenhuma entidade (interna ou externa) é confiável por padrão.\nII. No modelo Zero Trust, usuários dentro da rede corporativa são automaticamente confiáveis.\nIII. A microsegmentação é uma técnica fundamental do Zero Trust para limitar o movimento lateral de atacantes.\nIV. A verificação contínua de identidade e postura do dispositivo é um princípio central.\n\nEstão corretas APENAS as afirmativas:",
      options: [
        { letter: "A", text: "I e II.", isCorrect: false, explanation: "II contradiz o princípio fundamental de Zero Trust." },
        { letter: "B", text: "I, II e III.", isCorrect: false, explanation: "II é incorreta — nenhum usuário é automaticamente confiável." },
        { letter: "C", text: "I, III e IV.", isCorrect: true, explanation: "Zero Trust = nunca confiar + microsegmentação + verificação contínua." },
        { letter: "D", text: "II e IV.", isCorrect: false, explanation: "II é o oposto do que Zero Trust propõe." },
        { letter: "E", text: "I, II, III e IV.", isCorrect: false, explanation: "II é fundamentalmente incorreta no modelo Zero Trust." }
      ],
      difficulty: "dificil",
      detailedExplanation: "O modelo Zero Trust ('Nunca confie, sempre verifique') foi popularizado por Forrester Research e adotado pelo NIST (SP 800-207). Seus princípios incluem: (I) CORRETA — nenhuma entidade é confiável por padrão, independente da localização; (II) INCORRETA — justamente o oposto: no Zero Trust, estar dentro da rede corporativa NÃO confere confiança automática (isso diferencia do modelo tradicional de perímetro); (III) CORRETA — microsegmentação divide a rede em zonas mínimas para limitar blast radius e movimento lateral; (IV) CORRETA — verificação contínua de identidade (autenticação adaptativa) e postura do dispositivo (health check) são essenciais. O Zero Trust é cada vez mais cobrado em concursos por sua relevância moderna.",
      technicalJustification: "NIST SP 800-207: Zero Trust Architecture. Forrester Research: Zero Trust Model.",
      relatedConcepts: ["Zero Trust", "microsegmentação", "movimento lateral", "verificação contínua", "NIST 800-207"]
    }
  ],
  flashcards: [
    { front: "O que é a Tríade CIA na Segurança da Informação?", back: "Modelo fundamental com 3 propriedades:\n• **Confidencialidade**: informação acessível apenas a autorizados\n• **Integridade**: dados exatos e não alterados indevidamente\n• **Disponibilidade**: informação acessível quando necessário", difficulty: "easy" },
    { front: "Qual a diferença entre Autenticação e Autorização?", back: "**Autenticação**: verifica QUEM você é (login/senha, biometria)\n**Autorização**: define O QUE você pode fazer (permissões, papéis)\n\nAutenticação vem PRIMEIRO, autorização vem DEPOIS.", difficulty: "easy" },
    { front: "O que são os 3 fatores de autenticação?", back: "1. **Algo que você SABE**: senha, PIN, frase secreta\n2. **Algo que você TEM**: token, smart card, celular\n3. **Algo que você É**: biometria (digital, íris, face)\n\nMFA = 2+ fatores de categorias DIFERENTES.", difficulty: "easy" },
    { front: "Qual a diferença entre IDS e IPS?", back: "**IDS** (Intrusion Detection System): apenas **detecta** e **alerta** sobre intrusões\n**IPS** (Intrusion Prevention System): **detecta e bloqueia** automaticamente\n\nIDS = passivo (detectivo) | IPS = ativo (preventivo)", difficulty: "easy" },
    { front: "Quais são as 4 estratégias de tratamento de risco?", back: "1. **Aceitar**: conviver com o risco (custo de mitigação > impacto)\n2. **Mitigar**: reduzir probabilidade ou impacto\n3. **Transferir**: passar para terceiro (seguro, outsourcing)\n4. **Evitar**: eliminar a atividade que gera o risco", difficulty: "medium" },
    { front: "O que é o modelo RBAC?", back: "**Role-Based Access Control** — controle de acesso baseado em PAPÉIS.\n\nPermissões são atribuídas a papéis (ex: 'Analista', 'DBA'), não a indivíduos. Usuários recebem papéis conforme sua função.\n\nVantagem: facilita gestão de permissões em larga escala.", difficulty: "medium" },
    { front: "O que é o princípio de Defesa em Profundidade?", back: "Estratégia de usar **múltiplas camadas** de controles de segurança. Se uma camada falha, as outras continuam protegendo.\n\nExemplo: Firewall + IDS + Antivírus + Criptografia + Controle de acesso + Backup.\n\nNenhum controle único é suficiente.", difficulty: "medium" },
    { front: "O que é Zero Trust?", back: "Modelo: **'Nunca confie, sempre verifique'**\n\nPrincípios:\n• Nenhuma entidade é confiável por padrão (nem interna)\n• Verificação contínua de identidade\n• Microsegmentação da rede\n• Princípio do menor privilégio\n\nOposto do modelo tradicional de perímetro.", difficulty: "hard" },
    { front: "V ou F: Criptografia garante integridade dos dados.", back: "**FALSO**. Criptografia garante **CONFIDENCIALIDADE** (sigilo).\n\nPara integridade, usa-se:\n• **Hash** (verifica se dados foram alterados)\n• **Assinatura digital** (hash + criptografia assimétrica)\n• **HMAC** (hash com chave secreta)", difficulty: "hard" },
    { front: "V ou F: Duas senhas diferentes constituem MFA.", back: "**FALSO**. MFA exige fatores de **CATEGORIAS DIFERENTES**.\n\nDuas senhas = dois fatores do tipo 'algo que sabe' = NÃO é MFA.\n\nMFA válido: senha (sabe) + token (tem), ou senha (sabe) + biometria (é).", difficulty: "hard" }
  ]
};

// ═══════════════════════════════════════════════════════════
// b3-iso27002 — ISO 27002 - Controles de Segurança
// ═══════════════════════════════════════════════════════════
const iso27002Config = {
  id: 'b3-iso27002', blocoId: 'bloco-3', title: 'ISO 27002 - Controles de Segurança',
  intro: `## ISO 27002 no Contexto do Concurso Petrobras\n\nA **ISO/IEC 27002:2022** é o guia de referência para implementação de controles de segurança da informação. Ela complementa a **ISO 27001** (que define o SGSI — Sistema de Gestão de Segurança da Informação), detalhando os controles que podem ser selecionados e implementados.\n\n### Relevância para o Concurso\nA CESGRANRIO cobra a **estrutura da norma** (4 categorias de controles), **exemplos de controles específicos** e a **relação entre 27001 e 27002**. Não é necessário memorizar os 93 controles, mas sim entender as categorias e os controles mais importantes.\n\n### Versão 2022\nA versão 2022 reorganizou completamente a estrutura: de 14 domínios e 114 controles (versão 2013) para **4 temas e 93 controles**, além de introduzir **atributos** para classificação.\n\n### Analogia\nSe a ISO 27001 é o **código de trânsito** (regras obrigatórias), a ISO 27002 é o **manual do motorista** (como aplicar as regras na prática, com detalhes e orientações).`,
  fundamentals: `## Fundamentos da ISO 27002:2022\n\n### Estrutura da Norma\n\nA ISO 27002:2022 organiza 93 controles em 4 temas:\n\n| Tema | Quantidade | Descrição |\n|------|-----------|----------|\n| **Organizacionais** | 37 | Políticas, papéis, gestão de ativos, controle de acesso |\n| **Pessoais** | 8 | Seleção, termos de contratação, conscientização, desligamento |\n| **Físicos** | 14 | Perímetros, equipamentos, mídias, monitoramento |\n| **Tecnológicos** | 34 | Autenticação, criptografia, desenvolvimento seguro, logs |\n\n### Atributos dos Controles (Novidade 2022)\nCada controle pode ser classificado por 5 atributos:\n1. **Tipo**: Preventivo, Detectivo, Corretivo\n2. **Propriedade de SI**: Confidencialidade, Integridade, Disponibilidade\n3. **Conceitos de ciberseg**: Identificar, Proteger, Detectar, Responder, Recuperar\n4. **Capacidade operacional**: Governança, Gestão de ativos, Proteção da informação...\n5. **Domínio de segurança**: Governança, Proteção, Defesa, Resiliência\n\n### Relação 27001 × 27002\n- **ISO 27001**: Requisitos do SGSI (certificável, obrigatória)\n- **ISO 27002**: Guia de implementação dos controles (orientativa, não certificável)\n\nA Declaração de Aplicabilidade (SoA) da 27001 seleciona quais controles da 27002 serão implementados.`,
  definitions: `## Glossário de Termos\n\n| Termo | Definição |\n|-------|----------|\n| **SGSI** | Sistema de Gestão de Segurança da Informação — framework gerencial da ISO 27001 |\n| **Controle** | Medida que modifica o risco (política, processo, procedimento, dispositivo) |\n| **SoA** | Statement of Applicability — documento que lista controles selecionados e justificativa |\n| **Política** | Intenções e direções formais de uma organização para segurança da informação |\n| **Gestão de Ativos** | Identificação, classificação e proteção dos ativos informacionais |\n| **Gestão de Identidade** | Processos de criação, manutenção e exclusão de identidades digitais |\n| **DLP** | Data Loss Prevention — tecnologia para prevenir vazamento de dados |\n| **WAF** | Web Application Firewall — proteção específica para aplicações web |\n| **Hardening** | Processo de redução da superfície de ataque de um sistema |\n| **Backup** | Cópia de segurança de dados para recuperação em caso de perda |\n| **Desenvolvimento seguro** | Práticas de segurança integradas ao ciclo de desenvolvimento de software |`,
  technical: `## Detalhamento dos Controles Principais\n\n### Controles Organizacionais (37)\n\n**5.1 Políticas de SI**: Definir e publicar políticas de segurança aprovadas pela direção.\n**5.2 Papéis e responsabilidades**: Segregação de funções, ownership de ativos.\n**5.9 Inventário de ativos**: Todos os ativos identificados e classificados.\n**5.10 Uso aceitável**: Regras para uso adequado de informações e ativos.\n**5.15 Controle de acesso**: Regras de acesso baseadas em necessidade de negócio.\n**5.23 Segurança para serviços em nuvem**: Gestão de riscos de cloud computing.\n\n### Controles Pessoais (8)\n\n**6.1 Seleção (screening)**: Verificação de background de candidatos.\n**6.3 Conscientização**: Programas de treinamento em segurança.\n**6.5 Após encerramento**: Revogar acessos e devolver ativos no desligamento.\n\n### Controles Físicos (14)\n\n**7.1 Perímetros de segurança**: Áreas seguras com controle de acesso físico.\n**7.4 Monitoramento**: CFTV, alarmes, detecção de intrusão física.\n**7.10 Mídias de armazenamento**: Descarte seguro de HDs, pendrives, etc.\n\n### Controles Tecnológicos (34)\n\n**8.1 Dispositivos de usuário**: Políticas para BYOD, MDM, criptografia de endpoint.\n**8.5 Autenticação segura**: MFA, gestão de sessão, políticas de senha.\n**8.9 Gestão de configuração**: Hardening, baselines de segurança.\n**8.16 Monitoramento**: SIEM, correlação de eventos, detecção de anomalias.\n**8.24 Criptografia**: Uso adequado de criptografia e gestão de chaves.\n**8.25 Desenvolvimento seguro**: SSDLC, revisão de código, testes de segurança.`,
  examples: `## Exemplos Práticos\n\n### Exemplo 1: Implementação de controle de acesso (5.15)\n**Cenário**: A Petrobras precisa controlar acesso ao sistema de gestão de reservas.\n\n**Implementação**:\n- Política de acesso baseada em RBAC (papéis)\n- MFA obrigatório para sistemas críticos\n- Revisão trimestral de acessos (access review)\n- Princípio do menor privilégio\n- Log de todos os acessos (auditabilidade)\n\n### Exemplo 2: Programa de conscientização (6.3)\n**Cenário**: Reduzir incidentes de phishing na empresa.\n\n**Programa implementado**:\n- Treinamento obrigatório anual para todos os funcionários\n- Simulações mensais de phishing com métricas de clique\n- Newsletter semanal de segurança com dicas práticas\n- Gamificação: ranking de departamentos mais seguros\n- Resultado: redução de 60% em cliques em phishing\n\n### Exemplo 3: Gestão de mídias (7.10)\n**Cenário**: Descarte de HDs de um datacenter desativado.\n\n**Procedimento (ISO 27002)**:\n1. Inventariar todas as mídias\n2. Classificar o nível de sensibilidade dos dados\n3. Aplicar sanitização adequada (wipe, degaussing ou destruição física)\n4. Emitir certificado de destruição\n5. Registrar no inventário de ativos`,
  comparisons: `## Comparações\n\n### ISO 27001 vs ISO 27002\n\n| Aspecto | ISO 27001 | ISO 27002 |\n|---------|-----------|----------|\n| **Natureza** | Requisitos (shall) | Orientações (should) |\n| **Certificável** | ✅ Sim | ❌ Não |\n| **Foco** | SGSI (sistema de gestão) | Controles de segurança |\n| **Estrutura** | Cláusulas 4-10 + Anexo A | 4 temas, 93 controles |\n| **Uso** | Obrigatória para certificação | Referência para implementação |\n\n### Versão 2013 vs 2022\n\n| Aspecto | ISO 27002:2013 | ISO 27002:2022 |\n|---------|---------------|---------------|\n| **Domínios** | 14 domínios | 4 temas |\n| **Controles** | 114 | 93 |\n| **Novos controles** | — | 11 novos |\n| **Atributos** | Não existiam | 5 atributos por controle |\n| **Temas** | Não existiam | Organizacionais, Pessoais, Físicos, Tecnológicos |`,
  examTips: `## Dicas CESGRANRIO\n\n### O que a banca cobra\n1. **Quantidade de controles**: 93 controles em 4 temas (versão 2022)\n2. **Diferença 27001 vs 27002**: 27001 é certificável, 27002 é orientativa\n3. **Temas dos controles**: Organizacionais (37), Pessoais (8), Físicos (14), Tecnológicos (34)\n4. **Exemplos de controles específicos**: política de SI, controle de acesso, criptografia\n\n### Dicas\n- A CESGRANRIO pode usar a versão 2013 (14 domínios) OU 2022 (4 temas) — leia o enunciado\n- **SoA (Statement of Applicability)** é sempre da ISO 27001, não da 27002\n- Controles são SELECIONADOS com base na análise de riscos, não são todos obrigatórios\n- A norma NÃO é gratuita — isso é um fato, mas não é cobrado em prova`,
  gotchas: `## Pegadinhas\n\n⚠️ **1. ISO 27002 é certificável?** NÃO. Apenas a ISO 27001 é certificável. A 27002 é guia de implementação.\n\n⚠️ **2. Todos os 93 controles são obrigatórios?** NÃO. São selecionados pela análise de riscos. A SoA justifica inclusões e exclusões.\n\n⚠️ **3. A versão 2022 tem mais controles que 2013?** NÃO. Reduziu de 114 para 93 (muitos foram consolidados). Porém, há 11 controles novos.\n\n⚠️ **4. Controles organizacionais = apenas políticas?** NÃO. Incluem gestão de ativos, controle de acesso, gestão de fornecedores, segurança em nuvem.\n\n⚠️ **5. ISO 27002 substitui a ISO 27001?** NÃO. São complementares. 27001 = SGSI (gestão), 27002 = como implementar controles.\n\n⚠️ **6. A norma define ferramentas específicas?** NÃO. Define O QUE fazer, não COM QUE ferramenta.`,
  summary: `## Resumo\n\n### Mnemônico: **OPFT-93** (Organizacionais, Pessoais, Físicos, Tecnológicos = 93 controles)\n\n### 10 Pontos\n1. ISO 27002:2022 = 93 controles em 4 temas\n2. Organizacionais (37), Pessoais (8), Físicos (14), Tecnológicos (34)\n3. 27001 = SGSI certificável; 27002 = guia de controles (não certificável)\n4. Novidade 2022: 5 atributos por controle + 11 controles novos\n5. Controles são SELECIONADOS por análise de riscos (não todos obrigatórios)\n6. SoA = documento da 27001 que lista controles selecionados\n7. Controles: preventivos, detectivos, corretivos\n8. Gestão de ativos, controle de acesso e criptografia são os mais cobrados\n9. Conscientização (6.3) é controle pessoal, não organizacional\n10. Desenvolvimento seguro (8.25) é controle tecnológico`,
  checklist: `## Checklist\n\n- [ ] Sei que ISO 27002:2022 tem 93 controles em 4 temas\n- [ ] Conheço os 4 temas e a quantidade de controles em cada\n- [ ] Sei diferenciar ISO 27001 (certificável) de ISO 27002 (orientativa)\n- [ ] Entendo o que é SoA (Statement of Applicability)\n- [ ] Conheço os 5 atributos de controles da versão 2022\n- [ ] Sei exemplos de controles organizacionais (políticas, acesso, ativos)\n- [ ] Sei exemplos de controles pessoais (screening, conscientização)\n- [ ] Sei exemplos de controles físicos (perímetro, mídias)\n- [ ] Sei exemplos de controles tecnológicos (MFA, criptografia, SIEM)\n- [ ] Entendo que controles são selecionados por análise de riscos\n- [ ] Conheço as mudanças de 2013 para 2022\n- [ ] Sei que 11 controles foram adicionados na versão 2022`,
  exercises: [
    { question: "A ISO/IEC 27002:2022 organiza seus controles de segurança em temas. Sobre a estrutura da norma, assinale a alternativa que apresenta CORRETAMENTE os temas e a relação com a ISO 27001.", options: [{ letter: "A", text: "A norma possui 14 domínios e 114 controles, sendo certificável.", isCorrect: false, explanation: "Essa era a estrutura da versão 2013, e ISO 27002 não é certificável." }, { letter: "B", text: "A norma possui 4 temas (Organizacionais, Pessoais, Físicos e Tecnológicos) com 93 controles, servindo como guia orientativo para implementação dos controles referenciados pelo Anexo A da ISO 27001.", isCorrect: true, explanation: "Estrutura correta da versão 2022 e relação correta com a 27001." }, { letter: "C", text: "A norma possui 93 controles obrigatórios que devem ser todos implementados para conformidade.", isCorrect: false, explanation: "Controles são selecionados pela análise de riscos, não são todos obrigatórios." }, { letter: "D", text: "A norma é certificável e substitui a ISO 27001 como padrão de referência.", isCorrect: false, explanation: "ISO 27002 não é certificável e não substitui a 27001." }, { letter: "E", text: "A norma possui 5 temas: Estratégicos, Organizacionais, Pessoais, Físicos e Tecnológicos.", isCorrect: false, explanation: "São 4 temas, não 5. Não existe tema 'Estratégicos'." }], difficulty: "facil", detailedExplanation: "A ISO 27002:2022 reorganizou completamente sua estrutura em relação à versão 2013. Agora são 4 temas (Organizacionais com 37, Pessoais com 8, Físicos com 14, Tecnológicos com 34 = 93 controles total). A norma é orientativa (guia de boas práticas), enquanto a ISO 27001 é a norma certificável que define o SGSI. O Anexo A da 27001 referencia os controles da 27002.", technicalJustification: "ISO/IEC 27002:2022 — Information security controls.", relatedConcepts: ["ISO 27002", "SGSI", "SoA", "controles de segurança"] },
    { question: "Na versão 2022 da ISO 27002, cada controle possui atributos que permitem diferentes perspectivas de classificação. Qual das alternativas apresenta CORRETAMENTE um dos novos atributos introduzidos?", options: [{ letter: "A", text: "Custo de implementação do controle.", isCorrect: false, explanation: "Custo não é um dos atributos definidos pela norma." }, { letter: "B", text: "Tipo de controle (preventivo, detectivo, corretivo).", isCorrect: true, explanation: "Tipo é um dos 5 atributos da ISO 27002:2022." }, { letter: "C", text: "Nível de maturidade organizacional requerido.", isCorrect: false, explanation: "Maturidade não é um atributo dos controles." }, { letter: "D", text: "Tempo estimado de implementação.", isCorrect: false, explanation: "Tempo de implementação não é um atributo da norma." }, { letter: "E", text: "Certificação necessária do profissional responsável.", isCorrect: false, explanation: "Certificação profissional não é atributo dos controles." }], difficulty: "medio", detailedExplanation: "A ISO 27002:2022 introduziu 5 atributos para cada controle: (1) Tipo (preventivo, detectivo, corretivo), (2) Propriedades de SI (CID), (3) Conceitos de cibersegurança (Identificar, Proteger, Detectar, Responder, Recuperar), (4) Capacidades operacionais, (5) Domínios de segurança. Esses atributos permitem filtrar e visualizar controles sob diferentes perspectivas, facilitando a implementação.", technicalJustification: "ISO/IEC 27002:2022, Seção 4 — Estrutura do documento.", relatedConcepts: ["atributos de controle", "ISO 27002:2022", "classificação de controles"] },
    { question: "UmPetrobras está implementando o controle 5.15 (Controle de Acesso) da ISO 27002:2022. Para tal, decide adotar o modelo RBAC. Qual das seguintes práticas está em CONFORMIDADE com as orientações da norma?", options: [{ letter: "A", text: "Conceder acesso administrativo a todos os funcionários do setor de TI.", isCorrect: false, explanation: "Viola o princípio do menor privilégio." }, { letter: "B", text: "Definir papéis com base nas funções de negócio e atribuir permissões mínimas necessárias.", isCorrect: true, explanation: "Alinha com RBAC e menor privilégio conforme ISO 27002." }, { letter: "C", text: "Permitir que cada usuário defina suas próprias permissões.", isCorrect: false, explanation: "Isso seria DAC, não RBAC, e viola o controle de acesso formal." }, { letter: "D", text: "Manter o mesmo nível de acesso para todos os cargos equivalentes.", isCorrect: false, explanation: "Nem todos os cargos equivalentes necessariamente precisam dos mesmos acessos." }, { letter: "E", text: "Revogar acessos apenas quando solicitado pelo próprio usuário.", isCorrect: false, explanation: "Acessos devem ser revisados periodicamente e revogados proativamente." }], difficulty: "medio", detailedExplanation: "O controle 5.15 da ISO 27002:2022 orienta que o acesso à informação deve ser baseado em necessidade de negócio (need-to-know) e princípio do menor privilégio. O RBAC implementa isso atribuindo permissões a papéis/funções, não a indivíduos. A revisão periódica de acessos também é exigida.", technicalJustification: "ISO 27002:2022, Controle 5.15 — Access control.", relatedConcepts: ["controle de acesso", "RBAC", "menor privilégio", "ISO 27002"] },
    { question: "Sobre os 11 novos controles introduzidos na ISO 27002:2022, qual das alternativas apresenta um controle que NÃO existia na versão 2013?", options: [{ letter: "A", text: "Política de segurança da informação.", isCorrect: false, explanation: "Já existia na versão 2013." }, { letter: "B", text: "Threat Intelligence (Inteligência de Ameaças).", isCorrect: true, explanation: "Threat Intelligence (5.7) é um dos 11 controles novos da versão 2022." }, { letter: "C", text: "Controle de acesso.", isCorrect: false, explanation: "Já existia na versão 2013." }, { letter: "D", text: "Criptografia.", isCorrect: false, explanation: "Já existia na versão 2013." }, { letter: "E", text: "Backup.", isCorrect: false, explanation: "Já existia na versão 2013." }], difficulty: "dificil", detailedExplanation: "A ISO 27002:2022 introduziu 11 controles novos: Threat Intelligence (5.7), Segurança da Informação para uso de serviços em nuvem (5.23), Preparação de ICT para continuidade (5.30), Monitoramento de segurança física (7.4), Gestão de configuração (8.9), Exclusão de informação (8.10), Mascaramento de dados (8.11), DLP (8.12), Monitoramento de atividades (8.16), Filtragem web (8.23), e Codificação segura (8.28). Threat Intelligence reflete a crescente importância de inteligência de ameaças na cibersegurança moderna.", technicalJustification: "ISO/IEC 27002:2022 — Novos controles em relação à versão 2013.", relatedConcepts: ["ISO 27002:2022", "threat intelligence", "novos controles", "DLP"] },
    { question: "A Declaração de Aplicabilidade (SoA — Statement of Applicability) é um documento fundamental no contexto das normas da família ISO 27000. Sobre a SoA, é CORRETO afirmar que:", options: [{ letter: "A", text: "É definida pela ISO 27002 e lista todos os 93 controles de segurança.", isCorrect: false, explanation: "A SoA é exigida pela ISO 27001, não pela 27002." }, { letter: "B", text: "É exigida pela ISO 27001 e deve listar os controles selecionados, a justificativa de inclusão/exclusão e o status de implementação.", isCorrect: true, explanation: "Definição correta da SoA conforme ISO 27001." }, { letter: "C", text: "Deve incluir obrigatoriamente todos os 93 controles da ISO 27002.", isCorrect: false, explanation: "A SoA justifica a inclusão OU exclusão de controles." }, { letter: "D", text: "É gerada automaticamente pela ferramenta de gestão de riscos.", isCorrect: false, explanation: "É um documento gerencial elaborado pela organização." }, { letter: "E", text: "Deve ser publicada externamente para transparência.", isCorrect: false, explanation: "A SoA é um documento interno de uso controlado." }], difficulty: "dificil", detailedExplanation: "A SoA é exigida pela cláusula 6.1.3 da ISO 27001. Ela contém: (1) os controles considerados necessários (selecionados da ISO 27002 ou de outras fontes), (2) justificativa para inclusão de cada controle, (3) justificativa para exclusão de controles não selecionados, (4) status de implementação. É um documento vivo que deve ser atualizado conforme mudanças no contexto de risco da organização.", technicalJustification: "ISO/IEC 27001:2022 — Cláusula 6.1.3 d) Statement of Applicability.", relatedConcepts: ["SoA", "ISO 27001", "análise de riscos", "controles de segurança"] }
  ],
  flashcards: [
    { front: "Quantos controles tem a ISO 27002:2022 e em quantos temas são organizados?", back: "**93 controles** em **4 temas**:\n• Organizacionais: 37\n• Pessoais: 8\n• Físicos: 14\n• Tecnológicos: 34", difficulty: "easy" },
    { front: "Qual a diferença fundamental entre ISO 27001 e ISO 27002?", back: "**ISO 27001**: Requisitos do SGSI — **certificável**, obrigatória ('shall')\n**ISO 27002**: Guia de implementação de controles — **não certificável**, orientativa ('should')", difficulty: "easy" },
    { front: "O que é a SoA (Statement of Applicability)?", back: "Documento exigido pela **ISO 27001** (cláusula 6.1.3) que lista:\n• Controles selecionados e justificativa\n• Controles excluídos e justificativa\n• Status de implementação\n\nBaseado na análise de riscos.", difficulty: "easy" },
    { front: "Quais são os 5 atributos de controle da ISO 27002:2022?", back: "1. **Tipo**: Preventivo, Detectivo, Corretivo\n2. **Propriedade SI**: CID (Confidencialidade, Integridade, Disponibilidade)\n3. **Conceitos ciberseg**: Identificar, Proteger, Detectar, Responder, Recuperar\n4. **Capacidade operacional**\n5. **Domínio de segurança**", difficulty: "medium" },
    { front: "Cite 3 dos 11 novos controles da ISO 27002:2022.", back: "Exemplos de novos controles:\n• **5.7** Threat Intelligence\n• **5.23** Segurança em nuvem\n• **8.9** Gestão de configuração\n• **8.11** Mascaramento de dados\n• **8.12** DLP (Data Loss Prevention)\n• **8.16** Monitoramento de atividades\n• **8.28** Codificação segura", difficulty: "medium" },
    { front: "Qual a mudança principal da versão 2013 para 2022?", back: "**2013**: 14 domínios, 114 controles, sem atributos\n**2022**: 4 temas, 93 controles (consolidados), 5 atributos por controle, 11 novos controles\n\nRedução de controles por consolidação, não por remoção de cobertura.", difficulty: "medium" },
    { front: "V ou F: Todos os 93 controles da ISO 27002 devem ser implementados.", back: "**FALSO**. Os controles são **selecionados** com base na análise de riscos. A SoA da ISO 27001 justifica inclusões e exclusões. Nem todos se aplicam a todas as organizações.", difficulty: "hard" },
    { front: "Qual tema da ISO 27002:2022 contém o controle de conscientização em segurança?", back: "Tema **Pessoal** (controle 6.3 — Conscientização, educação e treinamento).\n\nNÃO é controle organizacional. Os controles pessoais tratam de: screening, termos de trabalho, **conscientização**, processos disciplinares, desligamento, trabalho remoto, reporte de eventos.", difficulty: "hard" },
    { front: "O que é Threat Intelligence na ISO 27002:2022?", back: "**Controle 5.7** (novo na versão 2022):\n\nColeta, análise e uso de informações sobre ameaças para:\n• Identificar ameaças relevantes\n• Avaliar capacidades de atacantes\n• Antecipar ataques\n• Melhorar controles preventivos\n\nRelaciona-se com MITRE ATT&CK e NIST.", difficulty: "hard" },
    { front: "Cite 3 exemplos de controles tecnológicos da ISO 27002:2022.", back: "Controles tecnológicos (tema 8):\n• **8.5** Autenticação segura (MFA)\n• **8.24** Uso de criptografia\n• **8.25** Desenvolvimento seguro (SSDLC)\n• **8.16** Monitoramento (SIEM)\n• **8.1** Dispositivos de endpoint\n• **8.9** Gestão de configuração", difficulty: "easy" }
  ]
};

// ═══════════════════════════════════════════════════════════
// Tópicos restantes — usando função helper
// ═══════════════════════════════════════════════════════════

const remainingTopics = [
  {
    id: 'b3-iso31000', blocoId: 'bloco-3',
    intro: `## ISO 31000 — Gestão de Riscos\n\nA **ISO 31000:2018** é o framework internacional de referência para **gestão de riscos** em qualquer tipo de organização. Para a Petrobras, que opera em um ambiente de alto risco (plataformas offshore, refinarias, oleodutos), a gestão de riscos é absolutamente **crítica**.\n\n### Conexões\n- **ISO 27002** → riscos de segurança da informação\n- **ISO 22301** → riscos de continuidade de negócios\n- **PMBOK** → gestão de riscos em projetos\n\n### Analogia\nA ISO 31000 é como o **sistema de navegação de um navio**: identifica perigos (tempestades, recifes), avalia a probabilidade e impacto de cada um, e define rotas alternativas (tratamento) para chegar ao destino minimizando riscos.`,
    fundamentals: `## Fundamentos da ISO 31000:2018\n\n### Estrutura da Norma\nA norma é composta por 3 elementos interligados:\n\n1. **Princípios** (8 princípios)\n2. **Framework** (estrutura de governança)\n3. **Processo** (etapas operacionais)\n\n### Os 8 Princípios\n1. **Integrada**: Parte integral de todas as atividades\n2. **Estruturada e abrangente**: Resultados consistentes e comparáveis\n3. **Personalizada**: Adaptada ao contexto da organização\n4. **Inclusiva**: Envolvimento das partes interessadas\n5. **Dinâmica**: Responde a mudanças\n6. **Baseada na melhor informação disponível**: Dados, experiência, feedback\n7. **Fatores humanos e culturais**: Comportamento e cultura influenciam riscos\n8. **Melhoria contínua**: Aprendizado e evolução constante\n\n### Framework (Estrutura)\n- **Liderança e comprometimento** (alta direção)\n- **Integração** nos processos organizacionais\n- **Concepção** (design) do framework\n- **Implementação**\n- **Avaliação** da eficácia\n- **Melhoria** contínua\n\n### Processo de Gestão de Riscos\n1. Comunicação e consulta (transversal)\n2. Escopo, contexto e critérios\n3. **Identificação** dos riscos\n4. **Análise** dos riscos (probabilidade × impacto)\n5. **Avaliação** dos riscos (comparar com critérios)\n6. **Tratamento** dos riscos\n7. Monitoramento e análise crítica (transversal)\n8. Registro e relato (transversal)`,
    definitions: `## Glossário\n\n| Termo | Definição (ISO 31000:2018) |\n|-------|---------------------------|\n| **Risco** | Efeito da incerteza nos objetivos; pode ser positivo ou negativo |\n| **Fonte de risco** | Elemento que, isoladamente ou combinado, tem potencial para dar origem ao risco |\n| **Evento** | Ocorrência ou mudança de circunstâncias |\n| **Consequência** | Resultado de um evento que afeta os objetivos |\n| **Probabilidade** | Chance de algo acontecer (qualitativa ou quantitativa) |\n| **Nível de risco** | Magnitude expressa como combinação de consequências e probabilidade |\n| **Controle** | Medida que mantém/modifica o risco |\n| **Critérios de risco** | Termos de referência contra os quais a significância do risco é avaliada |\n| **Apetite ao risco** | Quantidade e tipo de risco que a organização está disposta a buscar ou reter |\n| **Tolerância ao risco** | Disposição para suportar o risco após tratamento para atingir objetivos |`,
    technical: `## Processo Detalhado\n\n### Identificação de Riscos\nTécnicas comuns:\n- **Brainstorming** com stakeholders\n- **Análise SWOT** (forças, fraquezas, oportunidades, ameaças)\n- **Checklist** de riscos conhecidos\n- **Análise de cenários** (what-if)\n- **HAZOP** (Hazard and Operability — muito usado na Petrobras)\n\n### Análise de Riscos\n**Qualitativa**: Escalas como Alto/Médio/Baixo\n**Quantitativa**: Valores numéricos (probabilidade × impacto financeiro)\n\n| Matriz de Risco | Impacto Baixo | Impacto Médio | Impacto Alto |\n|-----------------|---------------|---------------|-------------|\n| **Prob. Alta** | Médio | Alto | Crítico |\n| **Prob. Média** | Baixo | Médio | Alto |\n| **Prob. Baixa** | Baixo | Baixo | Médio |\n\n### Tratamento de Riscos\n| Estratégia | Ação | Quando usar |\n|------------|------|------------|\n| **Evitar** | Eliminar atividade | Risco inaceitável |\n| **Mitigar** | Reduzir probabilidade/impacto | Risco alto mas necessário |\n| **Transferir** | Seguro, terceirização | Impacto financeiro alto |\n| **Aceitar** | Conviver com o risco | Custo tratamento > impacto |\n| **Explorar** | Maximizar (risco positivo) | Oportunidades |`,
    examples: `## Exemplos Práticos\n\n### Exemplo 1: Risco operacional offshore (Petrobras)\n**Identificação**: Risco de vazamento de óleo em plataforma\n**Análise**: Probabilidade = Baixa (0.1%/ano); Impacto = Catastrófico (R$ bilhões + ambiental)\n**Nível**: Crítico (impacto extremo compensa probabilidade baixa)\n**Tratamento**: Mitigar (manutenção preventiva, sensores, treinamento) + Transferir (seguro)\n\n### Exemplo 2: Risco de projeto de TI\n**Identificação**: Atraso na implantação do novo sistema ERP\n**Análise**: Probabilidade = Alta (60%); Impacto = Médio (atraso de 3 meses)\n**Nível**: Alto\n**Tratamento**: Mitigar (marco intermediário, equipe adicional, MVP)\n\n### Exemplo 3: Risco de segurança cibernética\n**Identificação**: Ataque ransomware ao datacenter\n**Análise**: Probabilidade = Média; Impacto = Alto (parada operacional)\n**Tratamento**: Mitigar (backup offline, segmentação, MFA) + Transferir (ciber-seguro)`,
    comparisons: `## Comparações\n\n### ISO 31000 vs PMBOK (Gestão de Riscos em Projetos)\n\n| Aspecto | ISO 31000 | PMBOK (Cap. 11) |\n|---------|-----------|------------------|\n| **Escopo** | Toda organização | Projetos específicos |\n| **Nível** | Estratégico + operacional | Projeto |\n| **Riscos positivos** | ✅ Sim (oportunidades) | ✅ Sim (oportunidades) |\n| **Processos** | 6 etapas | 7 processos |\n| **Certificável** | Não | N/A (guia) |\n\n### Risco Inerente vs Risco Residual\n\n| Conceito | Definição | Exemplo |\n|----------|-----------|---------|\n| **Risco inerente** | Risco antes de qualquer controle | Incêndio sem sprinklers |\n| **Risco residual** | Risco após aplicação de controles | Incêndio com sprinklers + extintor |\n| **Relação** | Risco residual = Risco inerente − Eficácia dos controles | Sempre > 0 |`,
    examTips: `## Dicas CESGRANRIO\n\n- **Risco = Efeito da incerteza nos objetivos** — memorize esta definição\n- Risco pode ser **positivo** (oportunidade) ou negativo (ameaça) — a CESGRANRIO cobra isso!\n- Os **8 princípios** são muito cobrados — memorize que gestão de riscos é INTEGRADA\n- **Tratamentos**: Evitar ≠ Aceitar. Evitar elimina a atividade; aceitar convive com o risco\n- **Transferir ≠ Eliminar risco**: transferir (seguro) transfere o IMPACTO FINANCEIRO, não o risco em si\n- A ISO 31000 NÃO é certificável. É um guia de melhores práticas\n- Processo: IAAТiM — **I**dentificar, **A**nalisar, **A**valiar, **T**ratar, **M**onitorar`,
    gotchas: `## Pegadinhas\n\n⚠️ **1. ISO 31000 é certificável?** NÃO. É guia orientativo, não certificável.\n\n⚠️ **2. Risco é sempre negativo?** NÃO. ISO 31000 define risco como EFEITO DA INCERTEZA — pode ser positivo (oportunidade).\n\n⚠️ **3. Transferir risco elimina o risco?** NÃO. Transfere o impacto financeiro (ex: seguro), mas o risco técnico/operacional permanece.\n\n⚠️ **4. Aceitar risco = ignorar risco?** NÃO. Aceitar é uma decisão CONSCIENTE após análise, com monitoramento contínuo.\n\n⚠️ **5. Análise qualitativa é inferior à quantitativa?** NÃO. Cada uma é adequada para contextos diferentes. Qualitativa é mais rápida e útil quando dados numéricos não estão disponíveis.\n\n⚠️ **6. Risco residual pode ser zero?** NÃO. Sempre há risco residual após tratamento. O objetivo é reduzir ao nível ACEITÁVEL.`,
    summary: `## Resumo\n\n### Mnemônico: **PFP** (Princípios, Framework, Processo)\n\n### 10 Pontos\n1. ISO 31000:2018 — NÃO certificável, aplicável a qualquer organização\n2. Risco = efeito da incerteza nos objetivos (positivo OU negativo)\n3. 8 Princípios: Integrada, Estruturada, Personalizada, Inclusiva, Dinâmica, Melhor informação, Fatores humanos, Melhoria contínua\n4. Framework: Liderança → Integração → Concepção → Implementação → Avaliação → Melhoria\n5. Processo: Identificar → Analisar → Avaliar → Tratar → Monitorar\n6. Tratamentos: Evitar, Mitigar, Transferir, Aceitar, Explorar (positivo)\n7. Matriz de risco: Probabilidade × Impacto\n8. Risco inerente (antes de controles) > Risco residual (após controles)\n9. Comunicação e monitoramento são TRANSVERSAIS a todo o processo\n10. HAZOP é técnica de análise de riscos muito usada no setor de óleo e gás`,
    checklist: `## Checklist\n\n- [ ] Sei definir risco conforme ISO 31000 (efeito da incerteza)\n- [ ] Conheço os 8 princípios da norma\n- [ ] Entendo os 3 componentes: Princípios, Framework, Processo\n- [ ] Domino o processo: Identificar → Analisar → Avaliar → Tratar\n- [ ] Conheço os 5 tratamentos de risco (evitar, mitigar, transferir, aceitar, explorar)\n- [ ] Sei diferenciar risco inerente de risco residual\n- [ ] Entendo matriz de risco (probabilidade × impacto)\n- [ ] Sei que a norma NÃO é certificável\n- [ ] Sei que risco pode ser positivo (oportunidade)\n- [ ] Conheço o conceito de apetite e tolerância ao risco`,
    exercises: [
      { question: "A ISO 31000:2018 define risco como 'efeito da incerteza nos objetivos'. Sobre essa definição, é CORRETO afirmar que:", options: [{ letter: "A", text: "O risco é sempre negativo e deve ser eliminado.", isCorrect: false, explanation: "Risco pode ser positivo (oportunidade) conforme ISO 31000." }, { letter: "B", text: "O risco pode ser positivo (oportunidade) ou negativo (ameaça).", isCorrect: true, explanation: "Definição correta — risco é efeito da incerteza, podendo ser em ambas direções." }, { letter: "C", text: "Incerteza e risco são sinônimos na norma.", isCorrect: false, explanation: "Incerteza é o estado; risco é o efeito dessa incerteza nos objetivos." }, { letter: "D", text: "Apenas riscos quantificáveis são considerados pela norma.", isCorrect: false, explanation: "A norma aceita análise qualitativa e quantitativa." }, { letter: "E", text: "Risco refere-se exclusivamente a eventos futuros.", isCorrect: false, explanation: "O risco pode ser associado a condições existentes, não apenas futuras." }], difficulty: "facil", detailedExplanation: "A ISO 31000:2018 adota uma definição ampla de risco como 'efeito da incerteza nos objetivos'. Pontos-chave: (1) o efeito pode ser positivo (oportunidade) ou negativo (ameaça); (2) objetivos podem ser financeiros, de saúde/segurança, ambientais, etc.; (3) o risco é frequentemente expresso como combinação de consequências e probabilidade; (4) a norma é aplicável a qualquer tipo de risco em qualquer organização.", technicalJustification: "ISO 31000:2018, Seção 3 — Termos e definições.", relatedConcepts: ["risco", "incerteza", "oportunidade", "ISO 31000"] },
      { question: "A ISO 31000 é estruturada em três componentes interligados. Assinale a alternativa que os apresenta CORRETAMENTE.", options: [{ letter: "A", text: "Políticas, Procedimentos e Controles.", isCorrect: false, explanation: "Essa estrutura é mais típica de normas como ISO 27002." }, { letter: "B", text: "Princípios, Framework (estrutura) e Processo.", isCorrect: true, explanation: "Os 3 componentes da ISO 31000." }, { letter: "C", text: "Planejamento, Execução e Monitoramento.", isCorrect: false, explanation: "Essa é uma simplificação do ciclo PDCA." }, { letter: "D", text: "Identificação, Análise e Tratamento.", isCorrect: false, explanation: "Essas são apenas 3 etapas do Processo, não os 3 componentes." }, { letter: "E", text: "Estratégia, Tática e Operação.", isCorrect: false, explanation: "Categorizariam por nível gerencial, não pela estrutura da norma." }], difficulty: "facil", detailedExplanation: "A ISO 31000:2018 é composta por: (1) Princípios — 8 princípios que orientam a gestão de riscos; (2) Framework (Estrutura) — governança e comprometimento da liderança; (3) Processo — etapas operacionais de identificação, análise, avaliação e tratamento. Os três interagem: princípios fundamentam o framework, que viabiliza o processo.", technicalJustification: "ISO 31000:2018, Seções 4 (Princípios), 5 (Framework), 6 (Processo).", relatedConcepts: ["ISO 31000", "princípios", "framework", "processo"] },
      { question: "UmPetrobras de energia realiza análise de riscos e identifica o risco de incêndio em uma unidade de refino. Após implementar sprinklers, detectores de fumaça e treinamento da brigada, decide aceitar o risco residual remanescente. Sobre essa situação, é CORRETO afirmar que:", options: [{ letter: "A", text: "O risco residual foi completamente eliminado pelas medidas.", isCorrect: false, explanation: "Risco residual nunca é zero." }, { letter: "B", text: "Aceitar o risco residual significa ignorar o risco.", isCorrect: false, explanation: "Aceitar é decisão consciente com monitoramento." }, { letter: "C", text: "O risco residual é o risco que permanece após tratamento, e sua aceitação é uma decisão consciente baseada nos critérios de risco da organização.", isCorrect: true, explanation: "Definição correta de risco residual e aceitação consciente." }, { letter: "D", text: "Os controles implementados representam transferência de risco.", isCorrect: false, explanation: "Sprinklers e treinamento são mitigação, não transferência." }, { letter: "E", text: "Petrobras deveria ter evitado o risco em vez de mitigá-lo.", isCorrect: false, explanation: "Evitar significaria parar a atividade de refino, o que não é prático." }], difficulty: "medio", detailedExplanation: "O risco inerente é o risco antes de qualquer controle. Após implementar controles (sprinklers, detectores, treinamento = MITIGAÇÃO), o risco restante é o RISCO RESIDUAL. A ISO 31000 prevê que, se o risco residual está dentro dos critérios de aceitação da organização, ele pode ser conscientemente aceito (com monitoramento). Aceitar ≠ ignorar. A aceitação deve ser documentada e revisada periodicamente.", technicalJustification: "ISO 31000:2018, Seção 6.5 — Tratamento de riscos; 6.6 — Monitoramento e análise crítica.", relatedConcepts: ["risco residual", "risco inerente", "mitigação", "aceitação", "critérios de risco"] },
      { question: "No processo de gestão de riscos da ISO 31000, a etapa de 'Avaliação de Riscos' tem como objetivo principal:", options: [{ letter: "A", text: "Identificar todas as fontes de risco possíveis.", isCorrect: false, explanation: "Isso é objetivo da Identificação, não da Avaliação." }, { letter: "B", text: "Calcular a probabilidade e impacto de cada risco.", isCorrect: false, explanation: "Isso é objetivo da Análise, não da Avaliação." }, { letter: "C", text: "Comparar os resultados da análise com os critérios de risco para determinar se o risco é aceitável ou requer tratamento.", isCorrect: true, explanation: "A Avaliação compara resultados da análise com critérios pré-definidos." }, { letter: "D", text: "Implementar controles para reduzir os riscos.", isCorrect: false, explanation: "Isso é objetivo do Tratamento." }, { letter: "E", text: "Comunicar os riscos às partes interessadas.", isCorrect: false, explanation: "Comunicação é uma atividade transversal, não uma etapa específica." }], difficulty: "medio", detailedExplanation: "O processo de gestão de riscos tem etapas distintas: (1) Identificação = encontrar riscos; (2) Análise = entender natureza, probabilidade e impacto; (3) Avaliação = COMPARAR com critérios de risco para DECIDIR se é aceitável ou precisa de tratamento; (4) Tratamento = implementar ações. A Avaliação é o passo decisório — com base nos critérios de risco da organização, determina se o risco pode ser aceito ou exige tratamento adicional.", technicalJustification: "ISO 31000:2018, Seção 6.4.4 — Avaliação de riscos.", relatedConcepts: ["avaliação de riscos", "critérios de risco", "processo de gestão de riscos"] },
      { question: "Sobre os princípios da gestão de riscos conforme ISO 31000:2018, analise as afirmativas:\n\nI. A gestão de riscos deve ser integrada a todas as atividades organizacionais.\nII. A gestão de riscos deve ser personalizada ao contexto de cada organização.\nIII. A gestão de riscos é estática e deve seguir um modelo fixo.\n\nEstá(ão) correta(s):", options: [{ letter: "A", text: "I, apenas.", isCorrect: false, explanation: "I e II estão corretas." }, { letter: "B", text: "I e II, apenas.", isCorrect: true, explanation: "Integrada e Personalizada são dois dos 8 princípios. III é incorreta (é Dinâmica, não estática)." }, { letter: "C", text: "I, II e III.", isCorrect: false, explanation: "III contradiz o princípio de ser Dinâmica." }, { letter: "D", text: "III, apenas.", isCorrect: false, explanation: "III é incorreta." }, { letter: "E", text: "II e III, apenas.", isCorrect: false, explanation: "III é incorreta." }], difficulty: "dificil", detailedExplanation: "I (CORRETA): 'Integrada' é o 1º princípio — gestão de riscos deve ser parte de todas as atividades, não uma atividade isolada. II (CORRETA): 'Personalizada' é o 3º princípio — deve ser adaptada ao contexto específico da organização. III (INCORRETA): O 5º princípio é 'Dinâmica' — a gestão de riscos deve responder a mudanças no ambiente, não ser estática ou fixa.", technicalJustification: "ISO 31000:2018, Seção 4 — Princípios.", relatedConcepts: ["princípios ISO 31000", "gestão dinâmica", "personalização", "integração"] }
    ],
    flashcards: [
      { front: "O que é risco conforme ISO 31000?", back: "**Efeito da incerteza nos objetivos.**\n\nPode ser:\n• Negativo (ameaça)\n• Positivo (oportunidade)\n\nExpresso como: consequência × probabilidade", difficulty: "easy" },
      { front: "Quais são os 3 componentes da ISO 31000?", back: "1. **Princípios** (8 princípios orientadores)\n2. **Framework** (estrutura de governança)\n3. **Processo** (etapas operacionais)\n\nInterligados e complementares.", difficulty: "easy" },
      { front: "Quais são as etapas do processo de gestão de riscos?", back: "1. Comunicação e consulta (transversal)\n2. Escopo, contexto e critérios\n3. **Identificação** dos riscos\n4. **Análise** dos riscos\n5. **Avaliação** dos riscos\n6. **Tratamento** dos riscos\n7. Monitoramento (transversal)\n8. Registro e relato (transversal)", difficulty: "easy" },
      { front: "Quais são os 4 tratamentos de risco (negativo)?", back: "1. **Evitar**: eliminar a atividade que gera o risco\n2. **Mitigar**: reduzir probabilidade e/ou impacto\n3. **Transferir**: passar impacto para terceiro (seguro)\n4. **Aceitar**: conviver conscientemente com o risco", difficulty: "easy" },
      { front: "Qual a diferença entre risco inerente e risco residual?", back: "**Risco inerente**: risco ANTES de qualquer controle\n**Risco residual**: risco que permanece APÓS tratamento\n\nRisco residual nunca é zero.\nDeve estar dentro dos critérios de aceitação.", difficulty: "medium" },
      { front: "Cite 4 dos 8 princípios da ISO 31000.", back: "1. **Integrada** (em todas as atividades)\n2. **Estruturada e abrangente**\n3. **Personalizada** (ao contexto)\n4. **Inclusiva** (partes interessadas)\n5. Dinâmica\n6. Melhor informação disponível\n7. Fatores humanos e culturais\n8. Melhoria contínua", difficulty: "medium" },
      { front: "A ISO 31000 é certificável?", back: "**NÃO.** A ISO 31000 é um guia de boas práticas (framework orientativo).\n\nNão existe certificação ISO 31000 para organizações.\n\n(Diferente da ISO 27001 que É certificável)", difficulty: "medium" },
      { front: "Qual a diferença entre Análise e Avaliação de riscos?", back: "**Análise**: Entender o risco — calcular probabilidade e impacto\n\n**Avaliação**: Comparar resultado da análise com CRITÉRIOS de risco para DECIDIR se é aceitável ou precisa de tratamento\n\nAnálise = entender | Avaliação = decidir", difficulty: "hard" },
      { front: "V ou F: Transferir risco elimina o risco.", back: "**FALSO.** Transferir (ex: seguro) transfere o IMPACTO FINANCEIRO para terceiro, mas:\n• O risco técnico/operacional permanece\n• A probabilidade não muda\n• A responsabilidade final permanece com a organização", difficulty: "hard" },
      { front: "O que é HAZOP e como se relaciona com ISO 31000?", back: "**HAZOP** = Hazard and Operability Study\n\nTécnica de identificação de riscos muito usada no setor de **óleo e gás** (Petrobras).\n\nAnalisa desvios de processos (pressão alta, fluxo baixo, etc.) para identificar perigos.\n\nÉ uma das técnicas de identificação previstas no processo da ISO 31000.", difficulty: "hard" }
    ]
  }
];

// ═══════════════════════════════════════════════════════════
// Tópicos simplificados (mesma qualidade, formato compacto)
// ═══════════════════════════════════════════════════════════

function makeSimpleTopic(id, blocoId, title, topicContent) {
  const { sections, exercises, flashcards } = topicContent;
  writeJson(id, 'theory.json', makeTheory(id, sections));
  writeJson(id, 'exercises.json', makeExercises(id, blocoId, exercises));
  writeJson(id, 'flashcards.json', makeFlashcards(id, flashcards));
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

console.log('═══ Gerando conteúdo restante (sem API) ═══\n');

// b2-storytelling — apenas exercises
writeJson('b2-storytelling', 'exercises.json', makeExercises('b2-storytelling', 'bloco-2', storytellingExercises));

// b3-dashboards — apenas theory
writeJson('b3-dashboards', 'theory.json', makeTheory('b3-dashboards', dashboardsTheory));

// b3-seguranca-info — completo
generateSecurityTopic(segInfoConfig);

// b3-iso27002 — completo
generateSecurityTopic(iso27002Config);

// b3-iso31000 — completo
for (const topic of remainingTopics) {
  generateSecurityTopic({
    ...topic,
    title: topic.id,
  });
}

console.log('\n✅ Parte 1 concluída. Execute generate-remaining-2.mjs para os demais tópicos.');
console.log('Tópicos gerados: b2-storytelling (E), b3-dashboards (T), b3-seguranca-info, b3-iso27002, b3-iso31000');
