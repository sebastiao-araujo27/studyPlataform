// ===== GEMINI PRO API SERVICE LAYER =====
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiRequest, GeminiResponse, Exercise, TheorySection, Flashcard } from '@/types';
import { getFromCache, setInCache } from './cache';

// Initialize Gemini
function getGenAI() {
  const apiKey = typeof window !== 'undefined' 
    ? localStorage.getItem('gemini_api_key') || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
    : process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  
  if (!apiKey || apiKey === 'SUA_API_KEY_AQUI') {
    throw new Error('API Key do Gemini não configurada. Acesse Configurações para inserir sua chave.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

// ===== THEORY GENERATION =====
const THEORY_PROMPT = (topicTitle: string, description: string, references: string[]) => `
Você é um professor doutor especialista em concursos públicos da banca CESGRANRIO, com foco na área de Tecnologia da Informação.

Gere um conteúdo teórico COMPLETO e PROFUNDO sobre o tópico: "${topicTitle}"

Descrição do tópico: ${description}

Referências base: ${references.join(', ')}

O conteúdo DEVE seguir EXATAMENTE esta estrutura, usando marcadores de seção:

[SECTION:introduction]
# Introdução
Introdução conceitual ao tema, contextualizando sua importância no cenário de TI e sua relevância para concursos públicos.

[SECTION:fundamentals]
# Fundamentação Teórica
Apresentação profunda dos conceitos fundamentais com rigor acadêmico. Inclua definições formais, teoremas quando aplicável, e referências a normas e padrões.

[SECTION:definitions]
# Definições Formais
Lista completa de definições técnicas formais com precisão acadêmica.

[SECTION:technical]
# Explicação Técnica Detalhada
Explicação técnica rigorosa e detalhada de cada aspecto do tópico. Use linguagem técnica precisa.

[SECTION:examples]
# Exemplos Práticos
Exemplos concretos, cenários reais e casos de uso. Quando possível, inclua exemplos do contexto corporativo/empresarial.

[SECTION:comparisons]
# Comparações Técnicas
Tabelas comparativas entre conceitos, tecnologias ou abordagens relacionadas.

[SECTION:exam_tips]
# Aplicação em Prova
Como este tema é cobrado pela CESGRANRIO. Tipos de questão mais comuns. O que a banca costuma cobrar.

[SECTION:gotchas]
# Pegadinhas Comuns
Erros frequentes de candidatos, armadilhas da banca, confusões conceituais que devem ser evitadas.

[SECTION:summary]
# Resumo Estratégico
Síntese dos pontos mais importantes para memorização rápida antes da prova.

[SECTION:checklist]
# Checklist de Revisão
Lista de verificação com todos os pontos que o candidato deve dominar neste tópico.

DIRETRIZES:
- Nível: pós-graduação / concurso de alto nível
- Base em normas ISO, NIST, PMBOK, e literatura acadêmica reconhecida
- Linguagem formal e técnica, mas didática
- Profundidade comparável a livro técnico
- Mínimo 3000 palavras
- Use Markdown para formatação
- Inclua tabelas quando relevante
- Não inclua referências bibliográficas no corpo do texto (serão adicionadas separadamente)
`;

const EXERCISES_PROMPT = (topicTitle: string, description: string) => `
Você é um especialista na elaboração de questões no padrão CESGRANRIO para concursos de alto nível em TI.

Gere EXATAMENTE 5 questões sobre: "${topicTitle}"
Descrição: ${description}

FORMATO OBRIGATÓRIO para cada questão (use JSON):
\`\`\`json
[
  {
    "question": "Texto completo da questão (enunciado elaborado e contextualizado)",
    "options": [
      {"letter": "A", "text": "alternativa A", "isCorrect": false, "explanation": "Por que está incorreta"},
      {"letter": "B", "text": "alternativa B", "isCorrect": false, "explanation": "Por que está incorreta"},
      {"letter": "C", "text": "alternativa C", "isCorrect": true, "explanation": "Por que está correta"},
      {"letter": "D", "text": "alternativa D", "isCorrect": false, "explanation": "Por que está incorreta"},
      {"letter": "E", "text": "alternativa E", "isCorrect": false, "explanation": "Por que está incorreta"}
    ],
    "difficulty": "facil|medio|dificil",
    "source": "autoral",
    "detailedExplanation": "Explicação detalhada e didática da resposta correta",
    "technicalJustification": "Justificativa técnica com referência a normas/padrões quando aplicável",
    "relatedConcepts": ["conceito1", "conceito2"]
  }
]
\`\`\`

REGRAS:
1. Questão 1: fácil, Questão 2: fácil/médio, Questão 3: médio, Questão 4: médio/difícil, Questão 5: difícil
2. Cada questão deve ter EXATAMENTE 5 alternativas (A a E)
3. APENAS UMA alternativa correta por questão
4. Estilo CESGRANRIO: enunciados contextualizados, alternativas plausíveis, pegadinhas técnicas
5. Explicações devem justificar cada alternativa incorreta
6. Retorne APENAS o JSON, sem texto adicional
`;

const FLASHCARDS_PROMPT = (topicTitle: string, description: string) => `
Gere 10 flashcards para revisão rápida sobre: "${topicTitle}"
Descrição: ${description}

Formato JSON:
\`\`\`json
[
  {
    "front": "Pergunta concisa e direta",
    "back": "Resposta objetiva e completa",
    "difficulty": "easy|medium|hard"
  }
]
\`\`\`

REGRAS:
- Mix de dificuldades: 3 easy, 4 medium, 3 hard
- Perguntas devem testar conceitos-chave cobrados em prova
- Respostas devem ser suficientes para relembrar o conceito
- Retorne APENAS o JSON
`;

// ===== CORE API CALL =====
async function callGemini(prompt: string, cacheKey: string): Promise<GeminiResponse> {
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    return {
      content: cached,
      model: 'gemini-pro (cached)',
      tokensUsed: 0,
      timestamp: new Date().toISOString(),
      cached: true
    };
  }

  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Cache the result
  setInCache(cacheKey, text);

  return {
    content: text,
    model: 'gemini-2.0-flash',
    tokensUsed: text.length, // approximation
    timestamp: new Date().toISOString(),
    cached: false
  };
}

// ===== PUBLIC API =====
export async function generateTheory(topicId: string, topicTitle: string, description: string, references: string[]): Promise<TheorySection[]> {
  const cacheKey = `theory_${topicId}_v1`;
  const prompt = THEORY_PROMPT(topicTitle, description, references);
  
  const response = await callGemini(prompt, cacheKey);
  return parseTheorySections(response.content);
}

export async function generateExercises(topicId: string, topicTitle: string, description: string): Promise<Exercise[]> {
  const cacheKey = `exercises_${topicId}_v1`;
  const prompt = EXERCISES_PROMPT(topicTitle, description);
  
  const response = await callGemini(prompt, cacheKey);
  return parseExercises(response.content, topicId);
}

export async function generateFlashcards(topicId: string, topicTitle: string, description: string): Promise<Flashcard[]> {
  const cacheKey = `flashcards_${topicId}_v1`;
  const prompt = FLASHCARDS_PROMPT(topicTitle, description);
  
  const response = await callGemini(prompt, cacheKey);
  return parseFlashcards(response.content, topicId);
}

export async function regenerateContent(type: 'theory' | 'exercises' | 'flashcards', topicId: string, topicTitle: string, description: string, references: string[] = []) {
  // Remove from cache to force regeneration
  const cacheKey = `${type}_${topicId}_v1`;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`cache_${cacheKey}`);
  }
  
  switch (type) {
    case 'theory':
      return generateTheory(topicId, topicTitle, description, references);
    case 'exercises':
      return generateExercises(topicId, topicTitle, description);
    case 'flashcards':
      return generateFlashcards(topicId, topicTitle, description);
  }
}

// ===== PARSERS =====
function parseTheorySections(content: string): TheorySection[] {
  const sectionTypes = [
    'introduction', 'fundamentals', 'definitions', 'technical',
    'examples', 'comparisons', 'exam_tips', 'gotchas', 'summary', 'checklist'
  ] as const;

  const sections: TheorySection[] = [];
  
  for (let i = 0; i < sectionTypes.length; i++) {
    const type = sectionTypes[i];
    const marker = `[SECTION:${type}]`;
    const nextMarker = i < sectionTypes.length - 1 ? `[SECTION:${sectionTypes[i + 1]}]` : null;
    
    const startIdx = content.indexOf(marker);
    if (startIdx === -1) continue;
    
    const contentStart = startIdx + marker.length;
    const endIdx = nextMarker ? content.indexOf(nextMarker) : content.length;
    
    if (endIdx === -1) continue;
    
    const sectionContent = content.substring(contentStart, endIdx).trim();
    
    // Extract title from first markdown heading
    const titleMatch = sectionContent.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1] : type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    sections.push({
      id: `section_${type}_${Date.now()}`,
      type: type as TheorySection['type'],
      title,
      content: sectionContent,
      order: i + 1
    });
  }

  // Fallback: if no markers found, create single section
  if (sections.length === 0) {
    sections.push({
      id: `section_full_${Date.now()}`,
      type: 'fundamentals',
      title: 'Conteúdo Teórico',
      content: content,
      order: 1
    });
  }

  return sections;
}

function parseExercises(content: string, topicId: string): Exercise[] {
  try {
    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found');
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return parsed.map((item: Record<string, unknown>, index: number) => ({
      id: `exercise_${topicId}_${index + 1}_${Date.now()}`,
      topicId,
      blocoId: topicId.split('-')[0] === 'b1' ? 'bloco-1' : topicId.split('-')[0] === 'b2' ? 'bloco-2' : 'bloco-3',
      question: item.question as string,
      options: item.options as Exercise['options'],
      difficulty: (item.difficulty as string) || 'medio',
      source: (item.source as Exercise['source']) || 'autoral',
      year: item.year as number | undefined,
      examName: item.examName as string | undefined,
      detailedExplanation: item.detailedExplanation as string,
      technicalJustification: item.technicalJustification as string,
      relatedConcepts: (item.relatedConcepts as string[]) || [],
      order: index + 1
    }));
  } catch {
    console.error('Failed to parse exercises from Gemini response');
    return [];
  }
}

function parseFlashcards(content: string, topicId: string): Flashcard[] {
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found');
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return parsed.map((item: Record<string, unknown>, index: number) => ({
      id: `flashcard_${topicId}_${index + 1}_${Date.now()}`,
      topicId,
      front: item.front as string,
      back: item.back as string,
      difficulty: (item.difficulty as Flashcard['difficulty']) || 'medium',
      correctCount: 0,
      incorrectCount: 0
    }));
  } catch {
    console.error('Failed to parse flashcards from Gemini response');
    return [];
  }
}

// ===== API KEY MANAGEMENT =====
export function setApiKey(key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gemini_api_key', key);
  }
}

export function getApiKey(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gemini_api_key') || '';
  }
  return '';
}

export function isApiKeyConfigured(): boolean {
  const key = getApiKey();
  return !!key && key !== 'SUA_API_KEY_AQUI';
}
