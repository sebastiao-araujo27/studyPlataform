// ===== COMPLETE SYLLABUS - ÊNFASE 6 =====
import { Bloco, Syllabus } from '@/types';

export const syllabus: Syllabus = {
  totalTopics: 40,
  totalEstimatedHours: 320,
  blocos: [
    {
      id: 'bloco-1',
      number: 1,
      title: 'Arquitetura de Dados e Projetos',
      description: 'Modelagem de dados, bancos de dados, Big Data, metodologias ágeis e gestão de projetos',
      color: '#3b82f6',
      icon: 'Database',
      topics: [
        {
          id: 'b1-modelagem-conceitual',
          title: 'Modelagem Conceitual de Dados',
          slug: 'modelagem-conceitual',
          description: 'Modelo Entidade-Relacionamento (MER), atributos, cardinalidade, entidades fortes e fracas, generalização e especialização',
          blocoId: 'bloco-1',
          order: 1,
          estimatedHours: 10,
          keywords: ['MER', 'entidade-relacionamento', 'cardinalidade', 'atributos', 'generalização', 'especialização'],
          references: ['Navathe & Elmasri - Sistemas de Banco de Dados', 'Date - Introdução a Sistemas de Bancos de Dados']
        },
        {
          id: 'b1-modelagem-logica',
          title: 'Modelagem Lógica e Física de Dados',
          slug: 'modelagem-logica-fisica',
          description: 'Modelo relacional, mapeamento MER para relacional, esquema físico, índices, particionamento, tablespaces',
          blocoId: 'bloco-1',
          order: 2,
          estimatedHours: 10,
          keywords: ['modelo relacional', 'mapeamento', 'índices', 'particionamento', 'esquema físico'],
          references: ['Navathe & Elmasri', 'Silberschatz - Database System Concepts']
        },
        {
          id: 'b1-normalizacao',
          title: 'Normalização de Dados',
          slug: 'normalizacao',
          description: '1FN, 2FN, 3FN, BCNF, 4FN, 5FN, dependências funcionais, multivaloradas, anomalias de inserção, exclusão e atualização',
          blocoId: 'bloco-1',
          order: 3,
          estimatedHours: 8,
          keywords: ['1FN', '2FN', '3FN', 'BCNF', 'dependência funcional', 'anomalias', 'normalização'],
          references: ['Navathe & Elmasri', 'Date - Introdução a Sistemas de Bancos de Dados']
        },
        {
          id: 'b1-integridade-referencial',
          title: 'Integridade Referencial',
          slug: 'integridade-referencial',
          description: 'Restrições de integridade, chaves primárias e estrangeiras, integridade de entidade e referencial, triggers e constraints',
          blocoId: 'bloco-1',
          order: 4,
          estimatedHours: 6,
          keywords: ['chave primária', 'chave estrangeira', 'constraint', 'trigger', 'integridade'],
          references: ['Navathe & Elmasri', 'Silberschatz']
        },
        {
          id: 'b1-sql',
          title: 'SQL: DDL e DML',
          slug: 'sql-ddl-dml',
          description: 'CREATE, ALTER, DROP, SELECT, INSERT, UPDATE, DELETE, JOINs, subconsultas, funções de agregação, views, stored procedures',
          blocoId: 'bloco-1',
          order: 5,
          estimatedHours: 12,
          keywords: ['SELECT', 'JOIN', 'DDL', 'DML', 'subconsulta', 'agregação', 'VIEW', 'stored procedure'],
          references: ['Ben Forta - SQL em 10 Minutos', 'Oracle SQL Reference']
        },
        {
          id: 'b1-acid',
          title: 'Propriedades ACID e Transações',
          slug: 'acid-transacoes',
          description: 'Atomicidade, Consistência, Isolamento, Durabilidade, controle de concorrência, locks, deadlocks, níveis de isolamento',
          blocoId: 'bloco-1',
          order: 6,
          estimatedHours: 6,
          keywords: ['ACID', 'transação', 'concorrência', 'lock', 'deadlock', 'isolamento'],
          references: ['Silberschatz - Database System Concepts', 'Navathe & Elmasri']
        },
        {
          id: 'b1-sgbd',
          title: 'Sistemas Gerenciadores de Banco de Dados (SGBD)',
          slug: 'sgbd',
          description: 'Arquitetura ANSI/SPARC, instâncias, esquemas, linguagens de banco, otimização de consultas, planos de execução',
          blocoId: 'bloco-1',
          order: 7,
          estimatedHours: 8,
          keywords: ['SGBD', 'ANSI/SPARC', 'otimização', 'plano de execução', 'catálogo'],
          references: ['Navathe & Elmasri', 'Ramakrishnan - Database Management Systems']
        },
        {
          id: 'b1-nosql',
          title: 'Bancos de Dados NoSQL',
          slug: 'nosql',
          description: 'Modelos documento, chave-valor, colunar, grafo, teorema CAP, BASE, MongoDB, Cassandra, Neo4j, Redis',
          blocoId: 'bloco-1',
          order: 8,
          estimatedHours: 8,
          keywords: ['NoSQL', 'CAP', 'BASE', 'MongoDB', 'documento', 'chave-valor', 'colunar', 'grafo'],
          references: ['Sadalage & Fowler - NoSQL Distilled', 'MongoDB Documentation']
        },
        {
          id: 'b1-etl',
          title: 'ETL - Extract, Transform, Load',
          slug: 'etl',
          description: 'Processos de extração, transformação e carga, staging area, data quality, ferramentas ETL, ELT, pipeline de dados',
          blocoId: 'bloco-1',
          order: 9,
          estimatedHours: 8,
          keywords: ['ETL', 'ELT', 'extração', 'transformação', 'carga', 'staging', 'pipeline'],
          references: ['Kimball - The Data Warehouse Toolkit', 'Inmon - Building the Data Warehouse']
        },
        {
          id: 'b1-datalake',
          title: 'Data Lake e Data Lakehouse',
          slug: 'datalake',
          description: 'Conceitos de Data Lake, zonas (raw, trusted, refined), Data Lakehouse, Delta Lake, governança de Data Lake',
          blocoId: 'bloco-1',
          order: 10,
          estimatedHours: 6,
          keywords: ['Data Lake', 'Data Lakehouse', 'zonas', 'governança', 'Delta Lake'],
          references: ['Databricks Documentation', 'AWS Data Lake Architecture']
        },
        {
          id: 'b1-bigdata',
          title: 'Big Data: Conceitos e Tecnologias',
          slug: 'bigdata',
          description: '5Vs do Big Data, Hadoop, MapReduce, Spark, HDFS, processamento batch e stream, arquiteturas Lambda e Kappa',
          blocoId: 'bloco-1',
          order: 11,
          estimatedHours: 10,
          keywords: ['Big Data', '5Vs', 'Hadoop', 'Spark', 'MapReduce', 'Lambda', 'Kappa', 'streaming'],
          references: ['White - Hadoop: The Definitive Guide', 'Marz - Big Data']
        },
        {
          id: 'b1-performance',
          title: 'Performance e Otimização de Banco de Dados',
          slug: 'performance-bd',
          description: 'Tuning de consultas, índices B-tree e hash, explain plan, estatísticas, cache, particionamento, sharding',
          blocoId: 'bloco-1',
          order: 12,
          estimatedHours: 8,
          keywords: ['performance', 'tuning', 'B-tree', 'hash', 'explain', 'índice', 'sharding'],
          references: ['Silberschatz', 'Oracle Performance Tuning Guide']
        },
        {
          id: 'b1-scrum',
          title: 'Scrum',
          slug: 'scrum',
          description: 'Papéis, eventos, artefatos, Sprint, Product Backlog, Sprint Backlog, Daily, Review, Retrospective, Definition of Done',
          blocoId: 'bloco-1',
          order: 13,
          estimatedHours: 8,
          keywords: ['Scrum', 'Sprint', 'Product Owner', 'Scrum Master', 'Backlog', 'Daily', 'Review'],
          references: ['Scrum Guide 2020', 'Schwaber & Sutherland']
        },
        {
          id: 'b1-kanban',
          title: 'Kanban',
          slug: 'kanban',
          description: 'Princípios do Kanban, WIP limits, fluxo contínuo, métricas (lead time, cycle time, throughput), quadro Kanban',
          blocoId: 'bloco-1',
          order: 14,
          estimatedHours: 5,
          keywords: ['Kanban', 'WIP', 'lead time', 'cycle time', 'throughput', 'fluxo contínuo'],
          references: ['Anderson - Kanban: Successful Evolutionary Change']
        },
        {
          id: 'b1-safe',
          title: 'SAFe - Scaled Agile Framework',
          slug: 'safe',
          description: 'Níveis do SAFe, ART, PI Planning, Release Train Engineer, Portfolio, Solution, Large Solution, Essential SAFe',
          blocoId: 'bloco-1',
          order: 15,
          estimatedHours: 8,
          keywords: ['SAFe', 'ART', 'PI Planning', 'Portfolio', 'Scaled Agile'],
          references: ['SAFe Framework - scaledagileframework.com', 'Leffingwell - SAFe Reference Guide']
        },
        {
          id: 'b1-pmbok',
          title: 'PMBOK 6ª Edição',
          slug: 'pmbok',
          description: 'Áreas de conhecimento, grupos de processos, EAP, cronograma, riscos, custos, qualidade, comunicação, stakeholders',
          blocoId: 'bloco-1',
          order: 16,
          estimatedHours: 12,
          keywords: ['PMBOK', 'EAP', 'cronograma', 'riscos', 'custos', 'escopo', 'stakeholders', 'qualidade'],
          references: ['PMI - PMBOK Guide 6th Edition']
        },
        {
          id: 'b1-escritorio-projetos',
          title: 'Escritório de Projetos (PMO)',
          slug: 'escritorio-projetos',
          description: 'Tipos de PMO (suporte, controle, diretivo), funções, maturidade em gestão de projetos, portfólio, programa',
          blocoId: 'bloco-1',
          order: 17,
          estimatedHours: 5,
          keywords: ['PMO', 'escritório de projetos', 'portfólio', 'programa', 'maturidade'],
          references: ['PMI - PMBOK Guide 6th Edition', 'Kerzner - Project Management']
        }
      ]
    },
    {
      id: 'bloco-2',
      number: 2,
      title: 'Governança, Engenharia e UX',
      description: 'Governança de TI, LGPD, Engenharia de Software, UX/UI, prototipação e design thinking',
      color: '#06b6d4',
      icon: 'Shield',
      topics: [
        {
          id: 'b2-governanca-ti',
          title: 'Governança de TI',
          slug: 'governanca-ti',
          description: 'COBIT, ITIL, governança corporativa de TI, alinhamento estratégico, frameworks de governança',
          blocoId: 'bloco-2',
          order: 1,
          estimatedHours: 10,
          keywords: ['COBIT', 'ITIL', 'governança', 'alinhamento estratégico'],
          references: ['COBIT 2019', 'ITIL 4 Foundation']
        },
        {
          id: 'b2-lgpd',
          title: 'LGPD - Lei Geral de Proteção de Dados',
          slug: 'lgpd',
          description: 'Princípios, bases legais, direitos dos titulares, controlador, operador, DPO, ANPD, sanções, RIPD, transferência internacional',
          blocoId: 'bloco-2',
          order: 2,
          estimatedHours: 10,
          keywords: ['LGPD', 'dados pessoais', 'controlador', 'operador', 'DPO', 'ANPD', 'RIPD', 'consentimento'],
          references: ['Lei 13.709/2018', 'GDPR para comparação']
        },
        {
          id: 'b2-engenharia-software',
          title: 'Engenharia de Software',
          slug: 'engenharia-software',
          description: 'Processos de software, requisitos, análise, projeto, implementação, modelos de processo, qualidade de software',
          blocoId: 'bloco-2',
          order: 3,
          estimatedHours: 10,
          keywords: ['engenharia de software', 'requisitos', 'processos', 'qualidade', 'arquitetura'],
          references: ['Sommerville - Engenharia de Software', 'Pressman - Engenharia de Software']
        },
        {
          id: 'b2-ciclo-vida',
          title: 'Ciclo de Vida de Software',
          slug: 'ciclo-vida',
          description: 'Modelos cascata, incremental, espiral, prototipação, RUP, ágil, DevOps, CI/CD, entrega contínua',
          blocoId: 'bloco-2',
          order: 4,
          estimatedHours: 8,
          keywords: ['cascata', 'espiral', 'incremental', 'RUP', 'DevOps', 'CI/CD'],
          references: ['Sommerville', 'Pressman']
        },
        {
          id: 'b2-testes',
          title: 'Testes de Software',
          slug: 'testes-software',
          description: 'Testes unitários, integração, sistema, aceitação, caixa branca, caixa preta, TDD, BDD, automação de testes',
          blocoId: 'bloco-2',
          order: 5,
          estimatedHours: 10,
          keywords: ['teste unitário', 'integração', 'caixa branca', 'caixa preta', 'TDD', 'BDD', 'automação'],
          references: ['Myers - Art of Software Testing', 'ISTQB Syllabus']
        },
        {
          id: 'b2-ux',
          title: 'UX - User Experience',
          slug: 'ux',
          description: 'Princípios de UX, heurísticas de Nielsen, usabilidade, acessibilidade, pesquisa com usuário, jornada do usuário',
          blocoId: 'bloco-2',
          order: 6,
          estimatedHours: 8,
          keywords: ['UX', 'usabilidade', 'heurísticas', 'Nielsen', 'acessibilidade', 'jornada do usuário'],
          references: ['Nielsen - Usability Engineering', 'Norman - Design of Everyday Things']
        },
        {
          id: 'b2-mvp',
          title: 'MVP - Minimum Viable Product',
          slug: 'mvp',
          description: 'Conceito de MVP, Lean Startup, validação de hipóteses, build-measure-learn, pivotamento, métricas de validação',
          blocoId: 'bloco-2',
          order: 7,
          estimatedHours: 5,
          keywords: ['MVP', 'Lean Startup', 'validação', 'build-measure-learn', 'pivô'],
          references: ['Ries - The Lean Startup']
        },
        {
          id: 'b2-storytelling',
          title: 'Storytelling com Dados',
          slug: 'storytelling-dados',
          description: 'Narrativa com dados, visualização efetiva, princípios de Tufte, gráficos, dashboards narrativos, persuasão com dados',
          blocoId: 'bloco-2',
          order: 8,
          estimatedHours: 6,
          keywords: ['storytelling', 'visualização', 'narrativa', 'dashboard', 'Tufte'],
          references: ['Knaflic - Storytelling with Data', 'Tufte - The Visual Display']
        },
        {
          id: 'b2-prototipacao',
          title: 'Prototipação',
          slug: 'prototipacao',
          description: 'Protótipos de baixa e alta fidelidade, wireframes, mockups, ferramentas (Figma, Adobe XD), teste de protótipo',
          blocoId: 'bloco-2',
          order: 9,
          estimatedHours: 6,
          keywords: ['protótipo', 'wireframe', 'mockup', 'Figma', 'baixa fidelidade', 'alta fidelidade'],
          references: ['Preece - Interaction Design']
        },
        {
          id: 'b2-design-thinking',
          title: 'Design Thinking',
          slug: 'design-thinking',
          description: 'Empatia, definição, ideação, prototipação, teste, double diamond, HCD, service design, sprint de design',
          blocoId: 'bloco-2',
          order: 10,
          estimatedHours: 6,
          keywords: ['Design Thinking', 'empatia', 'ideação', 'double diamond', 'HCD'],
          references: ['Brown - Change by Design', 'IDEO - Human Centered Design']
        }
      ]
    },
    {
      id: 'bloco-3',
      number: 3,
      title: 'Dados, Lógica e Segurança',
      description: 'Business Intelligence, lógica matemática, segurança da informação e normas ISO',
      color: '#8b5cf6',
      icon: 'Lock',
      topics: [
        {
          id: 'b3-bi',
          title: 'Business Intelligence (BI)',
          slug: 'bi',
          description: 'Conceitos de BI, processo de BI, ferramentas, KPIs, relatórios, análise multidimensional, self-service BI',
          blocoId: 'bloco-3',
          order: 1,
          estimatedHours: 8,
          keywords: ['BI', 'KPI', 'análise', 'relatórios', 'self-service'],
          references: ['Turban - Business Intelligence', 'Kimball - The Data Warehouse Toolkit']
        },
        {
          id: 'b3-olap',
          title: 'OLAP e Modelagem Dimensional',
          slug: 'olap',
          description: 'OLAP (MOLAP, ROLAP, HOLAP), cubos, dimensões, fatos, medidas, star schema, snowflake, drill-down, roll-up, slice, dice',
          blocoId: 'bloco-3',
          order: 2,
          estimatedHours: 10,
          keywords: ['OLAP', 'cubo', 'star schema', 'snowflake', 'drill-down', 'dimensão', 'fato'],
          references: ['Kimball - The Data Warehouse Toolkit', 'Inmon - Building the Data Warehouse']
        },
        {
          id: 'b3-datawarehouse',
          title: 'Data Warehouse',
          slug: 'datawarehouse',
          description: 'Arquitetura DW, Kimball vs Inmon, data mart, metadados, slowly changing dimensions, surrogate keys, staging',
          blocoId: 'bloco-3',
          order: 3,
          estimatedHours: 10,
          keywords: ['Data Warehouse', 'Kimball', 'Inmon', 'data mart', 'SCD', 'surrogate key'],
          references: ['Kimball - The Data Warehouse Toolkit', 'Inmon - Building the Data Warehouse']
        },
        {
          id: 'b3-dashboards',
          title: 'Dashboards e Visualização de Dados',
          slug: 'dashboards',
          description: 'Princípios de design de dashboards, métricas, indicadores, ferramentas (Power BI, Tableau), boas práticas visuais',
          blocoId: 'bloco-3',
          order: 4,
          estimatedHours: 6,
          keywords: ['dashboard', 'visualização', 'Power BI', 'Tableau', 'KPI', 'métricas'],
          references: ['Few - Information Dashboard Design', 'Knaflic - Storytelling with Data']
        },
        {
          id: 'b3-logica',
          title: 'Lógica Matemática',
          slug: 'logica-matematica',
          description: 'Lógica proposicional, predicados, quantificadores, tabelas verdade, equivalências, inferência, álgebra booleana, lógica de primeira ordem',
          blocoId: 'bloco-3',
          order: 5,
          estimatedHours: 12,
          keywords: ['lógica proposicional', 'predicados', 'quantificadores', 'tabela verdade', 'equivalência', 'inferência'],
          references: ['Souza - Lógica para Computação', 'Mortari - Introdução à Lógica']
        },
        {
          id: 'b3-seguranca-info',
          title: 'Segurança da Informação - Fundamentos',
          slug: 'seguranca-informacao',
          description: 'Confidencialidade, integridade, disponibilidade (CIA triad), autenticação, autorização, não-repúdio, gestão de riscos',
          blocoId: 'bloco-3',
          order: 6,
          estimatedHours: 8,
          keywords: ['CIA', 'confidencialidade', 'integridade', 'disponibilidade', 'autenticação', 'autorização'],
          references: ['Stallings - Segurança de Computadores', 'ISO 27001']
        },
        {
          id: 'b3-iso27002',
          title: 'ISO 27002 - Controles de Segurança',
          slug: 'iso-27002',
          description: 'Estrutura da norma, controles organizacionais, controles de pessoas, controles físicos, controles tecnológicos',
          blocoId: 'bloco-3',
          order: 7,
          estimatedHours: 10,
          keywords: ['ISO 27002', 'controles', 'segurança', 'políticas', 'gestão de ativos'],
          references: ['ABNT NBR ISO/IEC 27002:2022']
        },
        {
          id: 'b3-iso31000',
          title: 'ISO 31000 - Gestão de Riscos',
          slug: 'iso-31000',
          description: 'Princípios, framework, processo de gestão de riscos, identificação, análise, avaliação, tratamento, comunicação',
          blocoId: 'bloco-3',
          order: 8,
          estimatedHours: 6,
          keywords: ['ISO 31000', 'gestão de riscos', 'identificação', 'análise', 'tratamento'],
          references: ['ABNT NBR ISO 31000:2018']
        },
        {
          id: 'b3-iso22301',
          title: 'ISO 22301 - Continuidade de Negócios',
          slug: 'iso-22301',
          description: 'SGCN, BIA, estratégias de continuidade, planos de contingência, RPO, RTO, exercícios e testes',
          blocoId: 'bloco-3',
          order: 9,
          estimatedHours: 6,
          keywords: ['ISO 22301', 'continuidade', 'BIA', 'RPO', 'RTO', 'contingência', 'SGCN'],
          references: ['ABNT NBR ISO 22301:2020']
        },
        {
          id: 'b3-nist',
          title: 'NIST SP 800-61 - Tratamento de Incidentes',
          slug: 'nist-800-61',
          description: 'Ciclo de tratamento de incidentes, preparação, detecção, contenção, erradicação, recuperação, lições aprendidas',
          blocoId: 'bloco-3',
          order: 10,
          estimatedHours: 8,
          keywords: ['NIST', 'incidentes', 'detecção', 'contenção', 'erradicação', 'recuperação'],
          references: ['NIST SP 800-61 Rev. 2']
        },
        {
          id: 'b3-mitre',
          title: 'MITRE ATT&CK',
          slug: 'mitre-attack',
          description: 'Táticas, técnicas e procedimentos (TTPs), matriz Enterprise, modelo de ameaças, threat intelligence',
          blocoId: 'bloco-3',
          order: 11,
          estimatedHours: 8,
          keywords: ['MITRE ATT&CK', 'TTPs', 'táticas', 'técnicas', 'threat intelligence', 'kill chain'],
          references: ['MITRE ATT&CK Framework - attack.mitre.org']
        },
        {
          id: 'b3-criptografia',
          title: 'Criptografia',
          slug: 'criptografia',
          description: 'Criptografia simétrica e assimétrica, hash, certificados digitais, PKI, SSL/TLS, assinatura digital, blockchain',
          blocoId: 'bloco-3',
          order: 12,
          estimatedHours: 10,
          keywords: ['criptografia', 'simétrica', 'assimétrica', 'hash', 'PKI', 'SSL/TLS', 'certificado digital'],
          references: ['Stallings - Criptografia e Segurança de Redes']
        },
        {
          id: 'b3-seguranca-nuvem',
          title: 'Segurança em Nuvem',
          slug: 'seguranca-nuvem',
          description: 'Modelos de serviço (IaaS, PaaS, SaaS), responsabilidade compartilhada, CSA, CASB, zero trust em nuvem',
          blocoId: 'bloco-3',
          order: 13,
          estimatedHours: 8,
          keywords: ['nuvem', 'IaaS', 'PaaS', 'SaaS', 'responsabilidade compartilhada', 'CSA', 'CASB', 'zero trust'],
          references: ['CSA - Cloud Security Guidance', 'NIST SP 800-144']
        },
        {
          id: 'b3-seguranca-iot',
          title: 'Segurança em IoT',
          slug: 'seguranca-iot',
          description: 'Desafios de segurança IoT, protocolos, autenticação, firmware, edge computing, ataques IoT, mitigações',
          blocoId: 'bloco-3',
          order: 14,
          estimatedHours: 6,
          keywords: ['IoT', 'firmware', 'edge computing', 'protocolos', 'autenticação IoT'],
          references: ['OWASP IoT Top 10', 'NIST SP 800-183']
        }
      ]
    }
  ]
};

// Helper: Get all topics flat
export function getAllTopics() {
  return syllabus.blocos.flatMap(b => b.topics);
}

// Helper: Get bloco by ID
export function getBlocoById(id: string) {
  return syllabus.blocos.find(b => b.id === id);
}

// Helper: Get topic by ID
export function getTopicById(id: string) {
  return getAllTopics().find(t => t.id === id);
}

// Helper: Get bloco for topic
export function getBlocoForTopic(topicId: string) {
  return syllabus.blocos.find(b => b.topics.some(t => t.id === topicId));
}

// Helper: Get topic by slug within bloco
export function getTopicBySlug(blocoId: string, slug: string) {
  const bloco = getBlocoById(blocoId);
  return bloco?.topics.find(t => t.slug === slug);
}

// Roman numeral helper
export function blocoNumeral(num: number): string {
  const numerals: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III' };
  return numerals[num] || String(num);
}
