// ===== TYPES - STUDY PLATFORM =====

// ===== SYLLABUS STRUCTURE =====
export interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  blocoId: string;
  order: number;
  estimatedHours: number;
  keywords: string[];
  references: string[];
}

export interface Bloco {
  id: string;
  number: number; // I, II, III
  title: string;
  description: string;
  color: string;
  icon: string;
  topics: Topic[];
}

export interface Syllabus {
  blocos: Bloco[];
  totalTopics: number;
  totalEstimatedHours: number;
}

// ===== THEORY MODULE =====
export interface TheorySection {
  id: string;
  type: 'introduction' | 'fundamentals' | 'definitions' | 'technical' | 'examples' | 'diagrams' | 'comparisons' | 'exam_tips' | 'gotchas' | 'summary' | 'checklist' | 'flashcards';
  title: string;
  content: string;
  order: number;
}

export interface TheoryContent {
  id: string;
  topicId: string;
  version: number;
  sections: TheorySection[];
  generatedAt: string;
  lastUpdated: string;
  source: 'gemini' | 'manual' | 'cached';
  status: 'generating' | 'ready' | 'error';
}

export interface Flashcard {
  id: string;
  topicId: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  nextReview?: string;
  correctCount: number;
  incorrectCount: number;
}

// ===== EXERCISE MODULE =====
export type Difficulty = 'facil' | 'medio' | 'dificil';

export interface ExerciseOption {
  letter: string; // A, B, C, D, E
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Exercise {
  id: string;
  topicId: string;
  blocoId: string;
  question: string;
  options: ExerciseOption[];
  difficulty: Difficulty;
  source: 'cesgranrio' | 'autoral' | 'adapted';
  year?: number;
  examName?: string;
  detailedExplanation: string;
  technicalJustification: string;
  relatedConcepts: string[];
  order: number;
}

export interface ExerciseAttempt {
  id: string;
  exerciseId: string;
  topicId: string;
  selectedOption: string;
  isCorrect: boolean;
  timeSpent: number; // seconds
  timestamp: string;
}

// ===== PROGRESS TRACKING =====
export type MasteryLevel = 'not_started' | 'beginner' | 'intermediate' | 'advanced' | 'mastered';

export interface TopicProgress {
  topicId: string;
  theoryCompleted: boolean;
  theoryReadTime: number; // seconds
  exercisesCompleted: number;
  exercisesCorrect: number;
  exercisesTotal: number;
  masteryLevel: MasteryLevel;
  lastStudied?: string;
  nextReview?: string;
  studySessions: number;
  flashcardsReviewed: number;
  isFavorite: boolean;
}

export interface BlocoProgress {
  blocoId: string;
  completedTopics: number;
  totalTopics: number;
  averageScore: number;
  totalStudyTime: number;
}

export interface OverallProgress {
  totalTopicsCompleted: number;
  totalTopics: number;
  totalExercisesCompleted: number;
  totalExercisesCorrect: number;
  totalStudyTime: number; // seconds
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: string;
  blocoProgress: BlocoProgress[];
  weakestTopics: string[];
  strongestTopics: string[];
}

export interface StudySession {
  id: string;
  date: string;
  duration: number; // seconds
  topicId: string;
  type: 'theory' | 'exercise' | 'review' | 'flashcard';
  exercisesCompleted?: number;
  exercisesCorrect?: number;
}

// ===== SPACED REPETITION =====
export interface ReviewSchedule {
  topicId: string;
  exerciseId?: string;
  scheduledDate: string;
  intervalDays: number; // 1, 7, 30
  type: 'topic_review' | 'exercise_retry' | 'flashcard';
  completed: boolean;
}

// ===== GEMINI API =====
export interface GeminiRequest {
  type: 'theory' | 'exercises' | 'flashcards' | 'research';
  topicId: string;
  topicTitle: string;
  context?: string;
  additionalInstructions?: string;
}

export interface GeminiResponse {
  content: string;
  model: string;
  tokensUsed: number;
  timestamp: string;
  cached: boolean;
}

export interface CacheEntry {
  key: string;
  data: string;
  timestamp: string;
  ttl: number;
  version: number;
}

// ===== UI STATE =====
export interface SearchFilters {
  query: string;
  blocoId?: string;
  difficulty?: Difficulty;
  masteryLevel?: MasteryLevel;
  onlyFavorites?: boolean;
  onlyPendingReview?: boolean;
}

export interface UIState {
  sidebarOpen: boolean;
  currentBlocoId?: string;
  currentTopicId?: string;
  searchFilters: SearchFilters;
  isGenerating: boolean;
  activeTab: 'theory' | 'exercises' | 'flashcards' | 'progress';
}
