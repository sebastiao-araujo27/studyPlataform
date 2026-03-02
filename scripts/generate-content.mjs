/**
 * ============================================================
 *  GERADOR DE CONTEÚDO ESTÁTICO — ÊNFASE 6
 *  Usa Gemini Pro para gerar teoria, exercícios e flashcards
 *  para todos os 41 tópicos do edital.
 * ============================================================
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── CONFIG ─────────────────────────────────────────────────
const API_KEY = 'AIzaSyBodaTUkYz66yGgbjE422iPvqYje6YQ6gY';
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data', 'generated');

const DELAY_BETWEEN_CALLS_MS = 2000; // 2s entre chamadas
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 10000; // 10s retry para rate limit por minuto

// ── MODEL ROTATION ─────────────────────────────────────────
// Cada modelo free tier tem ~20 RPD. Rotacionar entre eles maximiza a cota.
const MODEL_POOL = [
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
];

const genAI = new GoogleGenerativeAI(API_KEY);
const deadModels = new Set(); // Modelos com cota diária esgotada
let currentModelIndex = 0;

function getActiveModelName() {
  // Procura o próximo modelo que não esteja morto
  for (let i = 0; i < MODEL_POOL.length; i++) {
    const idx = (currentModelIndex + i) % MODEL_POOL.length;
    if (!deadModels.has(MODEL_POOL[idx])) {
      currentModelIndex = idx;
      return MODEL_POOL[idx];
    }
  }
  return null; // Todos mortos
}

function getModel(useJson = false) {
  const name = getActiveModelName();
  if (!name) return null;
  const config = {
    temperature: 0.7,
    topP: 0.95,
    maxOutputTokens: 32768,
  };
  if (useJson) config.responseMimeType = 'application/json';
  return { instance: genAI.getGenerativeModel({ model: name, generationConfig: config }), name };
}

function markModelDead(modelName) {
  deadModels.add(modelName);
  console.log(`  🚫 Modelo ${modelName} esgotou cota diária. Modelos restantes: ${MODEL_POOL.filter(m => !deadModels.has(m)).join(', ') || 'NENHUM'}`);
  // Avança para o próximo
  currentModelIndex = (currentModelIndex + 1) % MODEL_POOL.length;
}

function allModelsDead() {
  return deadModels.size >= MODEL_POOL.length;
}

// ── ALL 41 TOPICS ──────────────────────────────────────────
const TOPICS = [
  // BLOCO 1 — Arquitetura de Dados e Projetos
  { id: 'b1-modelagem-conceitual', blocoId: 'bloco-1', title: 'Modelagem Conceitual de Dados', description: 'Modelo Entidade-Relacionamento (MER), atributos, cardinalidade, entidades fortes e fracas, generalização e especialização', keywords: ['MER', 'entidade-relacionamento', 'cardinalidade', 'atributos', 'generalização', 'especialização'], references: ['Navathe & Elmasri - Sistemas de Banco de Dados', 'Date - Introdução a Sistemas de Bancos de Dados'] },
  { id: 'b1-modelagem-logica', blocoId: 'bloco-1', title: 'Modelagem Lógica e Física de Dados', description: 'Modelo relacional, mapeamento MER para relacional, esquema físico, índices, particionamento, tablespaces', keywords: ['modelo relacional', 'mapeamento', 'índices', 'particionamento', 'esquema físico'], references: ['Navathe & Elmasri', 'Silberschatz - Database System Concepts'] },
  { id: 'b1-normalizacao', blocoId: 'bloco-1', title: 'Normalização de Dados', description: '1FN, 2FN, 3FN, BCNF, 4FN, 5FN, dependências funcionais, multivaloradas, anomalias de inserção, exclusão e atualização', keywords: ['1FN', '2FN', '3FN', 'BCNF', 'dependência funcional', 'anomalias', 'normalização'], references: ['Navathe & Elmasri', 'Date - Introdução a Sistemas de Bancos de Dados'] },
  { id: 'b1-integridade-referencial', blocoId: 'bloco-1', title: 'Integridade Referencial', description: 'Restrições de integridade, chaves primárias e estrangeiras, integridade de entidade e referencial, triggers e constraints', keywords: ['chave primária', 'chave estrangeira', 'constraint', 'trigger', 'integridade'], references: ['Navathe & Elmasri', 'Silberschatz'] },
  { id: 'b1-sql', blocoId: 'bloco-1', title: 'SQL: DDL e DML', description: 'CREATE, ALTER, DROP, SELECT, INSERT, UPDATE, DELETE, JOINs, subconsultas, funções de agregação, views, stored procedures', keywords: ['SELECT', 'JOIN', 'DDL', 'DML', 'subconsulta', 'agregação', 'VIEW', 'stored procedure'], references: ['Ben Forta - SQL em 10 Minutos', 'Oracle SQL Reference'] },
  { id: 'b1-acid', blocoId: 'bloco-1', title: 'Propriedades ACID e Transações', description: 'Atomicidade, Consistência, Isolamento, Durabilidade, controle de concorrência, locks, deadlocks, níveis de isolamento', keywords: ['ACID', 'transação', 'concorrência', 'lock', 'deadlock', 'isolamento'], references: ['Silberschatz - Database System Concepts', 'Navathe & Elmasri'] },
  { id: 'b1-sgbd', blocoId: 'bloco-1', title: 'Sistemas Gerenciadores de Banco de Dados (SGBD)', description: 'Arquitetura ANSI/SPARC, instâncias, esquemas, linguagens de banco, otimização de consultas, planos de execução', keywords: ['SGBD', 'ANSI/SPARC', 'otimização', 'plano de execução', 'catálogo'], references: ['Navathe & Elmasri', 'Ramakrishnan - Database Management Systems'] },
  { id: 'b1-nosql', blocoId: 'bloco-1', title: 'Bancos de Dados NoSQL', description: 'Modelos documento, chave-valor, colunar, grafo, teorema CAP, BASE, MongoDB, Cassandra, Neo4j, Redis', keywords: ['NoSQL', 'CAP', 'BASE', 'MongoDB', 'documento', 'chave-valor', 'colunar', 'grafo'], references: ['Sadalage & Fowler - NoSQL Distilled', 'MongoDB Documentation'] },
  { id: 'b1-etl', blocoId: 'bloco-1', title: 'ETL - Extract, Transform, Load', description: 'Processos de extração, transformação e carga, staging area, data quality, ferramentas ETL, ELT, pipeline de dados', keywords: ['ETL', 'ELT', 'extração', 'transformação', 'carga', 'staging', 'pipeline'], references: ['Kimball - The Data Warehouse Toolkit', 'Inmon - Building the Data Warehouse'] },
  { id: 'b1-datalake', blocoId: 'bloco-1', title: 'Data Lake e Data Lakehouse', description: 'Conceitos de Data Lake, zonas (raw, trusted, refined), Data Lakehouse, Delta Lake, governança de Data Lake', keywords: ['Data Lake', 'Data Lakehouse', 'zonas', 'governança', 'Delta Lake'], references: ['Databricks Documentation', 'AWS Data Lake Architecture'] },
  { id: 'b1-bigdata', blocoId: 'bloco-1', title: 'Big Data: Conceitos e Tecnologias', description: '5Vs do Big Data, Hadoop, MapReduce, Spark, HDFS, processamento batch e stream, arquiteturas Lambda e Kappa', keywords: ['Big Data', '5Vs', 'Hadoop', 'Spark', 'MapReduce', 'Lambda', 'Kappa', 'streaming'], references: ['White - Hadoop: The Definitive Guide', 'Marz - Big Data'] },
  { id: 'b1-performance', blocoId: 'bloco-1', title: 'Performance e Otimização de Banco de Dados', description: 'Tuning de consultas, índices B-tree e hash, explain plan, estatísticas, cache, particionamento, sharding', keywords: ['performance', 'tuning', 'B-tree', 'hash', 'explain', 'índice', 'sharding'], references: ['Silberschatz', 'Oracle Performance Tuning Guide'] },
  { id: 'b1-scrum', blocoId: 'bloco-1', title: 'Scrum', description: 'Papéis, eventos, artefatos, Sprint, Product Backlog, Sprint Backlog, Daily, Review, Retrospective, Definition of Done', keywords: ['Scrum', 'Sprint', 'Product Owner', 'Scrum Master', 'Backlog', 'Daily', 'Review'], references: ['Scrum Guide 2020', 'Schwaber & Sutherland'] },
  { id: 'b1-kanban', blocoId: 'bloco-1', title: 'Kanban', description: 'Princípios do Kanban, WIP limits, fluxo contínuo, métricas (lead time, cycle time, throughput), quadro Kanban', keywords: ['Kanban', 'WIP', 'lead time', 'cycle time', 'throughput', 'fluxo contínuo'], references: ['Anderson - Kanban: Successful Evolutionary Change'] },
  { id: 'b1-safe', blocoId: 'bloco-1', title: 'SAFe - Scaled Agile Framework', description: 'Níveis do SAFe, ART, PI Planning, Release Train Engineer, Portfolio, Solution, Large Solution, Essential SAFe', keywords: ['SAFe', 'ART', 'PI Planning', 'Portfolio', 'Scaled Agile'], references: ['SAFe Framework - scaledagileframework.com', 'Leffingwell - SAFe Reference Guide'] },
  { id: 'b1-pmbok', blocoId: 'bloco-1', title: 'PMBOK 6ª Edição', description: 'Áreas de conhecimento, grupos de processos, EAP, cronograma, riscos, custos, qualidade, comunicação, stakeholders', keywords: ['PMBOK', 'EAP', 'cronograma', 'riscos', 'custos', 'escopo', 'stakeholders', 'qualidade'], references: ['PMI - PMBOK Guide 6th Edition'] },
  { id: 'b1-escritorio-projetos', blocoId: 'bloco-1', title: 'Escritório de Projetos (PMO)', description: 'Tipos de PMO (suporte, controle, diretivo), funções, maturidade em gestão de projetos, portfólio, programa', keywords: ['PMO', 'escritório de projetos', 'portfólio', 'programa', 'maturidade'], references: ['PMI - PMBOK Guide 6th Edition', 'Kerzner - Project Management'] },

  // BLOCO 2 — Governança, Engenharia e UX
  { id: 'b2-governanca-ti', blocoId: 'bloco-2', title: 'Governança de TI', description: 'COBIT, ITIL, governança corporativa de TI, alinhamento estratégico, frameworks de governança', keywords: ['COBIT', 'ITIL', 'governança', 'alinhamento estratégico'], references: ['COBIT 2019', 'ITIL 4 Foundation'] },
  { id: 'b2-lgpd', blocoId: 'bloco-2', title: 'LGPD - Lei Geral de Proteção de Dados', description: 'Princípios, bases legais, direitos dos titulares, controlador, operador, DPO, ANPD, sanções, RIPD, transferência internacional', keywords: ['LGPD', 'dados pessoais', 'controlador', 'operador', 'DPO', 'ANPD', 'RIPD', 'consentimento'], references: ['Lei 13.709/2018', 'GDPR para comparação'] },
  { id: 'b2-engenharia-software', blocoId: 'bloco-2', title: 'Engenharia de Software', description: 'Processos de software, requisitos, análise, projeto, implementação, modelos de processo, qualidade de software', keywords: ['engenharia de software', 'requisitos', 'processos', 'qualidade', 'arquitetura'], references: ['Sommerville - Engenharia de Software', 'Pressman - Engenharia de Software'] },
  { id: 'b2-ciclo-vida', blocoId: 'bloco-2', title: 'Ciclo de Vida de Software', description: 'Modelos cascata, incremental, espiral, prototipação, RUP, ágil, DevOps, CI/CD, entrega contínua', keywords: ['cascata', 'espiral', 'incremental', 'RUP', 'DevOps', 'CI/CD'], references: ['Sommerville', 'Pressman'] },
  { id: 'b2-testes', blocoId: 'bloco-2', title: 'Testes de Software', description: 'Testes unitários, integração, sistema, aceitação, caixa branca, caixa preta, TDD, BDD, automação de testes', keywords: ['teste unitário', 'integração', 'caixa branca', 'caixa preta', 'TDD', 'BDD', 'automação'], references: ['Myers - Art of Software Testing', 'ISTQB Syllabus'] },
  { id: 'b2-ux', blocoId: 'bloco-2', title: 'UX - User Experience', description: 'Princípios de UX, heurísticas de Nielsen, usabilidade, acessibilidade, pesquisa com usuário, jornada do usuário', keywords: ['UX', 'usabilidade', 'heurísticas', 'Nielsen', 'acessibilidade', 'jornada do usuário'], references: ['Nielsen - Usability Engineering', 'Norman - Design of Everyday Things'] },
  { id: 'b2-mvp', blocoId: 'bloco-2', title: 'MVP - Minimum Viable Product', description: 'Conceito de MVP, Lean Startup, validação de hipóteses, build-measure-learn, pivotamento, métricas de validação', keywords: ['MVP', 'Lean Startup', 'validação', 'build-measure-learn', 'pivô'], references: ['Ries - The Lean Startup'] },
  { id: 'b2-storytelling', blocoId: 'bloco-2', title: 'Storytelling com Dados', description: 'Narrativa com dados, visualização efetiva, princípios de Tufte, gráficos, dashboards narrativos, persuasão com dados', keywords: ['storytelling', 'visualização', 'narrativa', 'dashboard', 'Tufte'], references: ['Knaflic - Storytelling with Data', 'Tufte - The Visual Display'] },
  { id: 'b2-prototipacao', blocoId: 'bloco-2', title: 'Prototipação', description: 'Protótipos de baixa e alta fidelidade, wireframes, mockups, ferramentas (Figma, Adobe XD), teste de protótipo', keywords: ['protótipo', 'wireframe', 'mockup', 'Figma', 'baixa fidelidade', 'alta fidelidade'], references: ['Preece - Interaction Design'] },
  { id: 'b2-design-thinking', blocoId: 'bloco-2', title: 'Design Thinking', description: 'Empatia, definição, ideação, prototipação, teste, double diamond, HCD, service design, sprint de design', keywords: ['Design Thinking', 'empatia', 'ideação', 'double diamond', 'HCD'], references: ['Brown - Change by Design', 'IDEO - Human Centered Design'] },

  // BLOCO 3 — Dados, Lógica e Segurança
  { id: 'b3-bi', blocoId: 'bloco-3', title: 'Business Intelligence (BI)', description: 'Conceitos de BI, processo de BI, ferramentas, KPIs, relatórios, análise multidimensional, self-service BI', keywords: ['BI', 'KPI', 'análise', 'relatórios', 'self-service'], references: ['Turban - Business Intelligence', 'Kimball - The Data Warehouse Toolkit'] },
  { id: 'b3-olap', blocoId: 'bloco-3', title: 'OLAP e Modelagem Dimensional', description: 'OLAP (MOLAP, ROLAP, HOLAP), cubos, dimensões, fatos, medidas, star schema, snowflake, drill-down, roll-up, slice, dice', keywords: ['OLAP', 'cubo', 'star schema', 'snowflake', 'drill-down', 'dimensão', 'fato'], references: ['Kimball - The Data Warehouse Toolkit', 'Inmon - Building the Data Warehouse'] },
  { id: 'b3-datawarehouse', blocoId: 'bloco-3', title: 'Data Warehouse', description: 'Arquitetura DW, Kimball vs Inmon, data mart, metadados, slowly changing dimensions, surrogate keys, staging', keywords: ['Data Warehouse', 'Kimball', 'Inmon', 'data mart', 'SCD', 'surrogate key'], references: ['Kimball - The Data Warehouse Toolkit', 'Inmon - Building the Data Warehouse'] },
  { id: 'b3-dashboards', blocoId: 'bloco-3', title: 'Dashboards e Visualização de Dados', description: 'Princípios de design de dashboards, métricas, indicadores, ferramentas (Power BI, Tableau), boas práticas visuais', keywords: ['dashboard', 'visualização', 'Power BI', 'Tableau', 'KPI', 'métricas'], references: ['Few - Information Dashboard Design', 'Knaflic - Storytelling with Data'] },
  { id: 'b3-logica', blocoId: 'bloco-3', title: 'Lógica Matemática', description: 'Lógica proposicional, predicados, quantificadores, tabelas verdade, equivalências, inferência, álgebra booleana, lógica de primeira ordem', keywords: ['lógica proposicional', 'predicados', 'quantificadores', 'tabela verdade', 'equivalência', 'inferência'], references: ['Souza - Lógica para Computação', 'Mortari - Introdução à Lógica'] },
  { id: 'b3-seguranca-info', blocoId: 'bloco-3', title: 'Segurança da Informação - Fundamentos', description: 'Confidencialidade, integridade, disponibilidade (CIA triad), autenticação, autorização, não-repúdio, gestão de riscos', keywords: ['CIA', 'confidencialidade', 'integridade', 'disponibilidade', 'autenticação', 'autorização'], references: ['Stallings - Segurança de Computadores', 'ISO 27001'] },
  { id: 'b3-iso27002', blocoId: 'bloco-3', title: 'ISO 27002 - Controles de Segurança', description: 'Estrutura da norma, controles organizacionais, controles de pessoas, controles físicos, controles tecnológicos', keywords: ['ISO 27002', 'controles', 'segurança', 'políticas', 'gestão de ativos'], references: ['ABNT NBR ISO/IEC 27002:2022'] },
  { id: 'b3-iso31000', blocoId: 'bloco-3', title: 'ISO 31000 - Gestão de Riscos', description: 'Princípios, framework, processo de gestão de riscos, identificação, análise, avaliação, tratamento, comunicação', keywords: ['ISO 31000', 'gestão de riscos', 'identificação', 'análise', 'tratamento'], references: ['ABNT NBR ISO 31000:2018'] },
  { id: 'b3-iso22301', blocoId: 'bloco-3', title: 'ISO 22301 - Continuidade de Negócios', description: 'SGCN, BIA, estratégias de continuidade, planos de contingência, RPO, RTO, exercícios e testes', keywords: ['ISO 22301', 'continuidade', 'BIA', 'RPO', 'RTO', 'contingência', 'SGCN'], references: ['ABNT NBR ISO 22301:2020'] },
  { id: 'b3-nist', blocoId: 'bloco-3', title: 'NIST SP 800-61 - Tratamento de Incidentes', description: 'Ciclo de tratamento de incidentes, preparação, detecção, contenção, erradicação, recuperação, lições aprendidas', keywords: ['NIST', 'incidentes', 'detecção', 'contenção', 'erradicação', 'recuperação'], references: ['NIST SP 800-61 Rev. 2'] },
  { id: 'b3-mitre', blocoId: 'bloco-3', title: 'MITRE ATT&CK', description: 'Táticas, técnicas e procedimentos (TTPs), matriz Enterprise, modelo de ameaças, threat intelligence', keywords: ['MITRE ATT&CK', 'TTPs', 'táticas', 'técnicas', 'threat intelligence', 'kill chain'], references: ['MITRE ATT&CK Framework - attack.mitre.org'] },
  { id: 'b3-criptografia', blocoId: 'bloco-3', title: 'Criptografia', description: 'Criptografia simétrica e assimétrica, hash, certificados digitais, PKI, SSL/TLS, assinatura digital, blockchain', keywords: ['criptografia', 'simétrica', 'assimétrica', 'hash', 'PKI', 'SSL/TLS', 'certificado digital'], references: ['Stallings - Criptografia e Segurança de Redes'] },
  { id: 'b3-seguranca-nuvem', blocoId: 'bloco-3', title: 'Segurança em Nuvem', description: 'Modelos de serviço (IaaS, PaaS, SaaS), responsabilidade compartilhada, CSA, CASB, zero trust em nuvem', keywords: ['nuvem', 'IaaS', 'PaaS', 'SaaS', 'responsabilidade compartilhada', 'CSA', 'CASB', 'zero trust'], references: ['CSA - Cloud Security Guidance', 'NIST SP 800-144'] },
  { id: 'b3-seguranca-iot', blocoId: 'bloco-3', title: 'Segurança em IoT', description: 'Desafios de segurança IoT, protocolos, autenticação, firmware, edge computing, ataques IoT, mitigações', keywords: ['IoT', 'firmware', 'edge computing', 'protocolos', 'autenticação IoT'], references: ['OWASP IoT Top 10', 'NIST SP 800-183'] },
];

// ── PROMPTS MESTRES ────────────────────────────────────────

// ── THEORY SECTION DEFINITIONS ─────────────────────────────

const THEORY_SECTIONS = [
  { type: 'introduction', title: 'Introdução e Contextualização' },
  { type: 'fundamentals', title: 'Fundamentos Teóricos' },
  { type: 'definitions', title: 'Definições e Terminologia' },
  { type: 'technical', title: 'Aprofundamento Técnico' },
  { type: 'examples', title: 'Exemplos Práticos Resolvidos' },
  { type: 'comparisons', title: 'Comparações e Tabelas' },
  { type: 'exam_tips', title: 'Dicas para a Prova CESGRANRIO' },
  { type: 'gotchas', title: 'Pegadinhas e Armadilhas' },
  { type: 'summary', title: 'Resumo Estratégico' },
  { type: 'checklist', title: 'Checklist de Auto-Avaliação' },
];

function buildTheoryPrompt(topic) {
  return `Você é um PROFESSOR ESPECIALISTA de nível doutoral, com 20 anos de experiência preparando candidatos para concursos de alto nível da banca CESGRANRIO. Você é conhecido por explicações cristalinas, analogias memoráveis e profundidade técnica.

═══════════════════════════════════════════════
MISSÃO: Gere o MATERIAL TEÓRICO COMPLETO para o tópico abaixo.
═══════════════════════════════════════════════

📌 TÓPICO: ${topic.title}
📝 DESCRIÇÃO DO EDITAL: ${topic.description}
🏷️ PALAVRAS-CHAVE: ${topic.keywords.join(', ')}
📚 REFERÊNCIAS BASE: ${topic.references.join('; ')}
🎯 CONCURSO: Ênfase 6 – Analista de Sistemas (Processos de Negócio)
📋 BANCA: CESGRANRIO

═══════════════════════════════════════════════
FORMATO DE SAÍDA — OBRIGATÓRIO:
═══════════════════════════════════════════════

Use EXATAMENTE este formato com delimitadores. Cada seção começa com ===SECTION:tipo=== e todo o conteúdo até o próximo delimitador pertence a essa seção.

===SECTION:introduction===
(Contextualização: cenário real, por que é CRÍTICO para o concurso, mapa mental de conexões com outros tópicos, padrões da CESGRANRIO, analogia forte)

===SECTION:fundamentals===
(Base teórica completa do zero, progressão lógica, definições formais com autores, diagramas textuais, exemplos concretos)

===SECTION:definitions===
(Definições formais/técnicas para prova, classificações, terminologia oficial vs variações, tabela de termos-chave)

===SECTION:technical===
(Explicação técnica aprofundada — nível livro-texto, mecanismos internos, passo-a-passo, código/SQL/pseudocódigo quando aplicável, aplicação em cenário corporativo)

===SECTION:examples===
(Mínimo 3 exemplos práticos resolvidos, 1 contextualizado óleo/gás, progressão de dificuldade, enunciado + resolução + comentário)

===SECTION:comparisons===
(Tabelas comparativas entre conceitos confundidos, quadros "X vs Y", quando usar um vs outro, mínimo 2 tabelas markdown)

===SECTION:exam_tips===
(Como a CESGRANRIO cobra, tipos de questão, o que a banca considera correto/incorreto, estratégias de resolução, pegadinhas semânticas)

===SECTION:gotchas===
(TOP 7-10 pegadinhas perigosas, erro comum + por que está errado + resposta correta, armadilhas de termos, exceções, cada uma com ⚠️)

===SECTION:summary===
(Resumo estratégico do que cai em prova, mnemônicos, 10 pontos para memorizar, mapa de palavras-chave com definição de 1 linha)

===SECTION:checklist===
(Checklist "[ ]" para auto-avaliação, por subtema, conceitos E habilidades práticas, mínimo 20 itens)

═══════════════════════════════════════════════
QUALIDADE — REGRAS INEGOCIÁVEIS:
═══════════════════════════════════════════════
- ZERO superficialidade. Cada seção deve ter SUBSTÂNCIA real.
- Cada seção: MÍNIMO 400-600 palavras (exceto checklist)
- Use MARKDOWN rico: ##/###, listas, tabelas, **negrito**, etc.
- Use analogias para conceitos difíceis
- NUNCA diga "consulte a referência X" — dê os detalhes AQUI
- Tabelas markdown para QUALQUER comparação
- Português brasileiro formal mas acessível
- Inclua dados, números, versões atualizadas

IMPORTANTE: Escreva TODAS as 10 seções. Não pule nenhuma.`;
}

function buildExercisesPrompt(topic) {
  return `Você é um ESPECIALISTA EM ELABORAÇÃO DE QUESTÕES para concursos públicos, com profundo conhecimento do padrão da banca CESGRANRIO. Você já elaborou mais de 10.000 questões e conhece cada nuance da banca.

═══════════════════════════════════════════════
MISSÃO: Elabore 5 QUESTÕES de múltipla escolha estilo CESGRANRIO.
═══════════════════════════════════════════════

📌 TÓPICO: ${topic.title}
📝 DESCRIÇÃO: ${topic.description}
🏷️ PALAVRAS-CHAVE: ${topic.keywords.join(', ')}
📚 REFERÊNCIAS: ${topic.references.join('; ')}
🎯 CONCURSO: Ênfase 6 (Analista de Sistemas – Processos de Negócio)

═══════════════════════════════════════════════
PADRÃO CESGRANRIO OBRIGATÓRIO:
═══════════════════════════════════════════════

1. FORMATO: 5 alternativas (A, B, C, D, E) — apenas UMA correta
2. ENUNCIADOS: Longos e contextualizados (não telegráficos). CESGRANRIO adora cenários.
3. DISTRATORES: As alternativas erradas devem ser PLAUSÍVEIS e representar erros reais que candidatos cometem. Nada absurdo ou eliminável por bom senso.
4. DISTRIBUIÇÃO DE DIFICULDADE:
   - Questão 1: FÁCIL (conceito direto, definição)
   - Questão 2: FÁCIL-MÉDIO (aplicação simples)
   - Questão 3: MÉDIO (análise, cenário prático)
   - Questão 4: MÉDIO-DIFÍCIL (comparação de conceitos, armadilha)
   - Questão 5: DIFÍCIL (integração de múltiplos conceitos, raciocínio encadeado)

═══════════════════════════════════════════════
ESTRUTURA DE CADA QUESTÃO:
═══════════════════════════════════════════════

Para cada questão, forneça:
- question: O enunciado completo (contextualizado, mínimo 3-4 linhas)
- options: Array de 5 opções (A-E), cada uma com:
  - letter: "A", "B", "C", "D" ou "E"
  - text: Texto da alternativa
  - isCorrect: true apenas para a correta
  - explanation: Por que esta alternativa está correta/incorreta (1-2 frases)
- difficulty: "facil", "medio" ou "dificil"
- detailedExplanation: Explicação DETALHADA da resolução (mínimo 150 palavras). Explique o raciocínio, cite a teoria, mostre por que a correta é correta E por que cada errada está errada.
- technicalJustification: Justificativa técnica com referência bibliográfica
- relatedConcepts: Array de conceitos relacionados

═══════════════════════════════════════════════
TIPOS DE QUESTÃO A INCLUIR (varie entre estes):
═══════════════════════════════════════════════
- Definição conceitual ("De acordo com [autor]...")
- Cenário prático ("Uma equipe de desenvolvimento...")
- Análise de afirmativas ("Considere as afirmativas I, II, III...")
- Completar lacuna ("____________ é o processo pelo qual...")
- Negativa ("NÃO é característica de...")

═══════════════════════════════════════════════
QUALIDADE DO CONTEÚDO:
═══════════════════════════════════════════════
- As questões devem testar COMPREENSÃO, não memorização pura
- Distratores baseados em ERROS REAIS (troca de conceitos, inversão de propriedades)
- A explicação detalhada deve ENSINAR — quem erra deve aprender lendo a explicação
- Linguagem formal igual a provas CESGRANRIO reais
- Contextualize pelo menos 2 questões em cenários empresariais (preferencialmente cenário corporativo)

═══════════════════════════════════════════════
FORMATO: JSON válido (array de questões)
═══════════════════════════════════════════════

Retorne APENAS JSON no formato:
[
  {
    "question": "...",
    "options": [
      { "letter": "A", "text": "...", "isCorrect": false, "explanation": "..." },
      { "letter": "B", "text": "...", "isCorrect": true, "explanation": "..." },
      { "letter": "C", "text": "...", "isCorrect": false, "explanation": "..." },
      { "letter": "D", "text": "...", "isCorrect": false, "explanation": "..." },
      { "letter": "E", "text": "...", "isCorrect": false, "explanation": "..." }
    ],
    "difficulty": "facil",
    "detailedExplanation": "...",
    "technicalJustification": "...",
    "relatedConcepts": ["conceito1", "conceito2"]
  },
  ...
]

Não inclua markdown code fences ao redor do JSON. Retorne apenas o JSON puro.`;
}

function buildFlashcardsPrompt(topic) {
  return `Você é um ESPECIALISTA EM TÉCNICAS DE MEMORIZAÇÃO e aprendizado ativo, especialmente aplicado a concursos públicos. Você domina o método de repetição espaçada (Anki-style) e sabe criar flashcards que maximizam retenção.

═══════════════════════════════════════════════
MISSÃO: Crie 10 FLASHCARDS de alta qualidade.
═══════════════════════════════════════════════

📌 TÓPICO: ${topic.title}
📝 DESCRIÇÃO: ${topic.description}
🏷️ PALAVRAS-CHAVE: ${topic.keywords.join(', ')}
🎯 CONCURSO: Ênfase 6 (Analista de Sistemas – Processos de Negócio)

═══════════════════════════════════════════════
PRINCÍPIOS DE FLASHCARDS EFICAZES:
═══════════════════════════════════════════════

1. FRENTE (pergunta): Deve ser atômica — testa UM conceito por vez
2. VERSO (resposta): Concisa mas COMPLETA — tudo que precisa saber, sem fluff
3. Variedade: Misture tipos de cards:
   - Definição ("O que é X?")
   - Diferenciação ("Qual a diferença entre X e Y?")
   - Aplicação ("Quando usar X?")
   - Propriedade/Característica ("Quais as 3 propriedades de X?")
   - Armadilha ("V ou F: [afirmativa traiçoeira]")
   - Conexão ("Qual a relação entre X e Y?")

4. DIFICULDADE:
   - 4 flashcards "easy" (definições, conceitos básicos)
   - 3 flashcards "medium" (relações, aplicações)
   - 3 flashcards "hard" (pegadinhas, exceções, detalhes sutis)

═══════════════════════════════════════════════
QUALIDADE:
═══════════════════════════════════════════════
- Foque no que CAI EM PROVA (conceitos que a CESGRANRIO cobra)
- Respostas precisas e memorizáveis (sem parágrafos longos)
- Use listas com bullet points quando houver múltiplos itens na resposta
- A resposta deve ser auto-contida (entendível sem contexto externo)
- Português brasileiro formal

═══════════════════════════════════════════════
FORMATO: JSON válido (array de flashcards)
═══════════════════════════════════════════════

Retorne APENAS JSON no formato:
[
  {
    "front": "Pergunta do flashcard",
    "back": "Resposta do flashcard",
    "difficulty": "easy"
  },
  ...
]

Dificuldades possíveis: "easy", "medium", "hard"
Não inclua markdown code fences ao redor do JSON. Retorne apenas o JSON puro.`;
}


// ── HELPERS ────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanJsonResponse(text) {
  // Remove markdown code fences if Gemini adds them
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();
  
  // Remove control characters that break JSON parsing (except \n, \r, \t)
  // eslint-disable-next-line no-control-regex
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  
  return cleaned;
}

function fixBadEscapes(text) {
  // Fix invalid JSON escape sequences: \x where x is not one of: " \ / b f n r t u
  return text.replace(/\\([^"\\\/bfnrtu])/g, (match, char) => {
    if (char === 'u') return match;
    return char;
  });
}

/**
 * Walk through the JSON text character-by-character and escape raw control
 * characters (newline, tab, carriage-return, etc.) that appear inside string
 * values. Gemini often puts literal newlines inside markdown content strings.
 */
function escapeControlCharsInStrings(text) {
  let result = '';
  let inString = false;
  let escaped = false;
  
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = text.charCodeAt(i);
    
    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }
    
    if (ch === '\\' && inString) {
      escaped = true;
      result += ch;
      continue;
    }
    
    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }
    
    if (inString && code < 0x20) {
      // Control character inside a string — must be escaped
      switch (code) {
        case 0x0A: result += '\\n'; break;   // newline
        case 0x0D: result += '\\r'; break;   // carriage return
        case 0x09: result += '\\t'; break;   // tab
        case 0x08: result += '\\b'; break;   // backspace
        case 0x0C: result += '\\f'; break;   // form feed
        default:   result += ''; break;       // strip other control chars
      }
    } else {
      result += ch;
    }
  }
  return result;
}

function safeJsonParse(text) {
  const cleaned = cleanJsonResponse(text);
  
  // Strategy 1: Direct parse
  try {
    return JSON.parse(cleaned);
  } catch (e1) {
    // Strategy 2: Escape control chars in string values (char-by-char parser)
    try {
      const fixed = escapeControlCharsInStrings(cleaned);
      return JSON.parse(fixed);
    } catch (e2) {
      // Strategy 3: Fix control chars + bad escape sequences
      try {
        let fixed = escapeControlCharsInStrings(cleaned);
        fixed = fixBadEscapes(fixed);
        return JSON.parse(fixed);
      } catch (e3) {
        // Strategy 4: Extract JSON array with regex and fix
        try {
          const match = cleaned.match(/\[[\s\S]*\]/);
          if (match) {
            let arrText = escapeControlCharsInStrings(match[0]);
            arrText = fixBadEscapes(arrText);
            return JSON.parse(arrText);
          }
        } catch (e4) {
          // nothing
        }
        // Strategy 5: Nuclear — remove all control chars + bad escapes
        try {
          let nuclear = cleaned.replace(/[\x00-\x1F]/g, ' ');
          nuclear = fixBadEscapes(nuclear);
          return JSON.parse(nuclear);
        } catch (e5) {
          // nothing
        }
        console.error(`    All JSON parse strategies failed. First error: ${e1.message}`);
        throw e1;
      }
    }
  }
}

/**
 * Parse theory response that uses ===SECTION:type=== delimiters.
 * Returns array of {type, title, content} objects — no JSON parsing needed!
 */
function parseTheoryDelimiters(text, topicId) {
  const sectionTypeToTitle = {};
  for (const s of THEORY_SECTIONS) {
    sectionTypeToTitle[s.type] = s.title;
  }
  
  const sections = [];
  const regex = /===SECTION:(\w+)===/g;
  const matches = [...text.matchAll(regex)];
  
  for (let i = 0; i < matches.length; i++) {
    const type = matches[i][1];
    const startIdx = matches[i].index + matches[i][0].length;
    const endIdx = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const content = text.slice(startIdx, endIdx).trim();
    
    if (content.length > 0) {
      sections.push({
        id: `section_${type}_${topicId}`,
        type: type,
        title: sectionTypeToTitle[type] || type,
        content: content,
        order: sections.length + 1
      });
    }
  }
  
  return sections;
}


async function callGeminiWithRetry(prompt, label, useJsonModel = false, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    if (allModelsDead()) {
      throw new Error('ALL_MODELS_EXHAUSTED');
    }
    const modelInfo = getModel(useJsonModel);
    if (!modelInfo) {
      throw new Error('ALL_MODELS_EXHAUSTED');
    }
    try {
      const result = await modelInfo.instance.generateContent(prompt);
      const text = result.response.text();
      return text;
    } catch (err) {
      const isRateLimit = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('quota');
      const isDailyQuota = err.message?.includes('PerDay') || err.message?.includes('limit: 0');
      if (isDailyQuota) {
        markModelDead(modelInfo.name);
        if (allModelsDead()) {
          throw new Error('ALL_MODELS_EXHAUSTED');
        }
        // Retry with next model (doesn't count as retry)
        attempt--;
        await sleep(2000);
        continue;
      }
      if (isRateLimit && attempt < retries) {
        const waitTime = RETRY_DELAY_MS * attempt;
        console.log(`  ⏳ Rate limit (${modelInfo.name}) for ${label}. Waiting ${waitTime / 1000}s (attempt ${attempt}/${retries})...`);
        await sleep(waitTime);
      } else {
        throw err;
      }
    }
  }
}


// ── MAIN GENERATION ────────────────────────────────────────

async function generateForTopic(topic, index) {
  const topicDir = path.join(OUTPUT_DIR, topic.id);
  
  // Check if already generated (resumable)
  const theoryPath = path.join(topicDir, 'theory.json');
  const exercisesPath = path.join(topicDir, 'exercises.json');
  const flashcardsPath = path.join(topicDir, 'flashcards.json');

  if (fs.existsSync(theoryPath) && fs.existsSync(exercisesPath) && fs.existsSync(flashcardsPath)) {
    console.log(`  ✅ [${index + 1}/41] ${topic.title} — já gerado, pulando...`);
    return { success: true, skipped: true };
  }

  fs.mkdirSync(topicDir, { recursive: true });

  const results = { theory: null, exercises: null, flashcards: null };

  // 1. THEORY — single call with delimiter-based format (no JSON parsing needed)
  if (!fs.existsSync(theoryPath)) {
    console.log(`  📖 [${index + 1}/41] Gerando TEORIA: ${topic.title}...`);
    try {
      const raw = await callGeminiWithRetry(buildTheoryPrompt(topic), `theory-${topic.id}`, false);
      const sections = parseTheoryDelimiters(raw, topic.id);
      
      if (sections.length < 5) {
        throw new Error(`Apenas ${sections.length} seções encontradas (esperado 10). Delimitadores não encontrados.`);
      }
      
      fs.writeFileSync(theoryPath, JSON.stringify(sections, null, 2), 'utf-8');
      results.theory = sections;
      console.log(`    ✅ Teoria gerada (${sections.length} seções)`);
    } catch (err) {
      if (err.message === 'ALL_MODELS_EXHAUSTED') throw err;
      console.error(`    ❌ Erro na teoria: ${err.message}`);
      fs.writeFileSync(path.join(topicDir, 'theory_error.txt'), err.message, 'utf-8');
    }
    await sleep(DELAY_BETWEEN_CALLS_MS);
  } else {
    console.log(`  📖 [${index + 1}/41] Teoria já existe: ${topic.title}`);
  }

  // 2. EXERCISES
  if (!fs.existsSync(exercisesPath)) {
    console.log(`  📝 Gerando EXERCÍCIOS: ${topic.title}...`);
    try {
      const raw = await callGeminiWithRetry(buildExercisesPrompt(topic), `exercises-${topic.id}`, true);
      const parsed = safeJsonParse(raw);
      const exercises = parsed.map((ex, i) => ({
        id: `ex_${topic.id}_${i + 1}`,
        topicId: topic.id,
        blocoId: topic.blocoId,
        question: ex.question,
        options: ex.options,
        difficulty: ex.difficulty,
        source: 'autoral',
        detailedExplanation: ex.detailedExplanation,
        technicalJustification: ex.technicalJustification,
        relatedConcepts: ex.relatedConcepts,
        order: i + 1
      }));
      fs.writeFileSync(exercisesPath, JSON.stringify(exercises, null, 2), 'utf-8');
      results.exercises = exercises;
      console.log(`    ✅ Exercícios gerados (${exercises.length} questões)`);
    } catch (err) {
      if (err.message === 'ALL_MODELS_EXHAUSTED') throw err;
      console.error(`    ❌ Erro nos exercícios: ${err.message}`);
      fs.writeFileSync(path.join(topicDir, 'exercises_error.txt'), err.message, 'utf-8');
    }
    await sleep(DELAY_BETWEEN_CALLS_MS);
  } else {
    console.log(`  📝 Exercícios já existem: ${topic.title}`);
  }

  // 3. FLASHCARDS
  if (!fs.existsSync(flashcardsPath)) {
    console.log(`  🧠 Gerando FLASHCARDS: ${topic.title}...`);
    try {
      const raw = await callGeminiWithRetry(buildFlashcardsPrompt(topic), `flashcards-${topic.id}`, true);
      const parsed = safeJsonParse(raw);
      const flashcards = parsed.map((fc, i) => ({
        id: `fc_${topic.id}_${i + 1}`,
        topicId: topic.id,
        front: fc.front,
        back: fc.back,
        difficulty: fc.difficulty,
        correctCount: 0,
        incorrectCount: 0
      }));
      fs.writeFileSync(flashcardsPath, JSON.stringify(flashcards, null, 2), 'utf-8');
      results.flashcards = flashcards;
      console.log(`    ✅ Flashcards gerados (${flashcards.length} cards)`);
    } catch (err) {
      if (err.message === 'ALL_MODELS_EXHAUSTED') throw err;
      console.error(`    ❌ Erro nos flashcards: ${err.message}`);
      fs.writeFileSync(path.join(topicDir, 'flashcards_error.txt'), err.message, 'utf-8');
    }
    await sleep(DELAY_BETWEEN_CALLS_MS);
  } else {
    console.log(`  🧠 Flashcards já existem: ${topic.title}`);
  }

  return { success: true, skipped: false, results };
}


async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  STUDY PLATFORM — GERADOR DE CONTEÚDO v2.0     ║');
  console.log('║  41 tópicos × (teoria + 5 exercícios + 10 cards)║');
  console.log('║  Modelos: Rotação entre Flash/Flash-Lite        ║');
  console.log('║  Resumível: execute novamente para continuar    ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`  Modelos disponíveis: ${MODEL_POOL.join(', ')}`);
  console.log('');

  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Check for --start flag to resume from specific topic
  const startArg = process.argv.find(a => a.startsWith('--start='));
  const startIndex = startArg ? parseInt(startArg.split('=')[1]) - 1 : 0;

  const stats = { total: 0, generated: 0, skipped: 0, errors: 0 };
  const startTime = Date.now();

  for (let i = startIndex; i < TOPICS.length; i++) {
    const topic = TOPICS[i];
    stats.total++;

    try {
      const result = await generateForTopic(topic, i);
      if (result.skipped) {
        stats.skipped++;
      } else {
        stats.generated++;
      }
    } catch (err) {
      if (err.message === 'ALL_MODELS_EXHAUSTED') {
        console.log('');
        console.log('  ⚠️  COTA DIÁRIA ESGOTADA EM TODOS OS MODELOS!');
        console.log('  O script salvou o progresso. Execute novamente amanhã para continuar.');
        console.log('  Os tópicos já gerados serão mantidos (resumível).');
        break;
      }
      stats.errors++;
      console.error(`  ❌ FALHA TOTAL em ${topic.title}: ${err.message}`);
    }

    // Progress report every 5 topics
    if ((i + 1) % 5 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
      console.log('');
      console.log(`  📊 PROGRESSO: ${i + 1}/41 tópicos | ${elapsed}min | Gerados: ${stats.generated} | Pulados: ${stats.skipped} | Erros: ${stats.errors}`);
      console.log('');
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  GERAÇÃO CONCLUÍDA                              ║');
  console.log(`║  Tempo: ${totalTime} minutos                         ║`);
  console.log(`║  Gerados: ${stats.generated} | Pulados: ${stats.skipped} | Erros: ${stats.errors}    ║`);
  console.log('╚══════════════════════════════════════════════════╝');

  // Generate index file for easy import
  await generateIndexFile();
}

async function generateIndexFile() {
  console.log('');
  console.log('📦 Gerando arquivo de índice para importação...');

  const imports = [];
  const theoryMap = [];
  const exercisesMap = [];
  const flashcardsMap = [];

  for (const topic of TOPICS) {
    const topicDir = path.join(OUTPUT_DIR, topic.id);
    const hasTheory = fs.existsSync(path.join(topicDir, 'theory.json'));
    const hasExercises = fs.existsSync(path.join(topicDir, 'exercises.json'));
    const hasFlashcards = fs.existsSync(path.join(topicDir, 'flashcards.json'));

    const safeName = topic.id.replace(/-/g, '_');

    if (hasTheory) {
      imports.push(`import ${safeName}_theory from './generated/${topic.id}/theory.json';`);
      theoryMap.push(`  '${topic.id}': ${safeName}_theory as TheorySection[],`);
    }
    if (hasExercises) {
      imports.push(`import ${safeName}_exercises from './generated/${topic.id}/exercises.json';`);
      exercisesMap.push(`  '${topic.id}': ${safeName}_exercises as Exercise[],`);
    }
    if (hasFlashcards) {
      imports.push(`import ${safeName}_flashcards from './generated/${topic.id}/flashcards.json';`);
      flashcardsMap.push(`  '${topic.id}': ${safeName}_flashcards as Flashcard[],`);
    }
  }

  const indexContent = `// ===== AUTO-GENERATED — DO NOT EDIT =====
// Generated at: ${new Date().toISOString()}
// Topics: ${TOPICS.length}

import { TheorySection, Exercise, Flashcard } from '@/types';

${imports.join('\n')}

export const allTheory: Record<string, TheorySection[]> = {
${theoryMap.join('\n')}
};

export const allExercises: Record<string, Exercise[]> = {
${exercisesMap.join('\n')}
};

export const allFlashcards: Record<string, Flashcard[]> = {
${flashcardsMap.join('\n')}
};
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, '..', 'content-index.ts'), indexContent, 'utf-8');
  console.log('✅ Arquivo de índice gerado: src/data/content-index.ts');
}

main().catch(err => {
  console.error('ERRO FATAL:', err);
  process.exit(1);
});
