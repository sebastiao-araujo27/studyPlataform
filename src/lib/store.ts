// ===== ZUSTAND STORE - STATE MANAGEMENT =====
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TopicProgress, OverallProgress, ExerciseAttempt, StudySession, ReviewSchedule, MasteryLevel } from '@/types';
import { syllabus, getAllTopics } from '@/data/syllabus';
import { saveProgressToCloud, loadProgressFromCloud } from '@/lib/sync';

// Current authenticated user id (set by AuthProvider)
let _currentUserId: string | null = null;
export function setCurrentUserId(id: string | null) { _currentUserId = id; }

// ===== PROGRESS STORE =====
interface ProgressState {
  topicProgress: Record<string, TopicProgress>;
  exerciseAttempts: ExerciseAttempt[];
  studySessions: StudySession[];
  reviewSchedule: ReviewSchedule[];
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  
  // Actions
  initializeProgress: () => void;
  markTheoryComplete: (topicId: string) => void;
  addTheoryReadTime: (topicId: string, seconds: number) => void;
  recordExerciseAttempt: (attempt: ExerciseAttempt) => void;
  addStudySession: (session: StudySession) => void;
  toggleFavorite: (topicId: string) => void;
  updateStreak: () => void;
  scheduleReview: (review: ReviewSchedule) => void;
  completeReview: (topicId: string) => void;
  getOverallProgress: () => OverallProgress;
  getTopicMastery: (topicId: string) => MasteryLevel;
  getWeakTopics: () => string[];
  resetProgress: () => void;
  loadFromCloud: (userId: string) => Promise<void>;
}

function calculateMastery(progress: TopicProgress): MasteryLevel {
  if (!progress.theoryCompleted && progress.exercisesCompleted === 0) return 'not_started';
  
  const score = progress.exercisesTotal > 0 
    ? (progress.exercisesCorrect / progress.exercisesTotal) * 100 
    : 0;
  
  if (!progress.theoryCompleted) return 'beginner';
  if (score >= 90 && progress.exercisesCompleted >= 5) return 'mastered';
  if (score >= 70 && progress.exercisesCompleted >= 3) return 'advanced';
  if (score >= 50 || progress.exercisesCompleted >= 1) return 'intermediate';
  return 'beginner';
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      topicProgress: {},
      exerciseAttempts: [],
      studySessions: [],
      reviewSchedule: [],
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,

      initializeProgress: () => {
        const topics = getAllTopics();
        const existing = get().topicProgress;
        const updated = { ...existing };
        
        topics.forEach(t => {
          if (!updated[t.id]) {
            updated[t.id] = {
              topicId: t.id,
              theoryCompleted: false,
              theoryReadTime: 0,
              exercisesCompleted: 0,
              exercisesCorrect: 0,
              exercisesTotal: 0,
              masteryLevel: 'not_started',
              studySessions: 0,
              flashcardsReviewed: 0,
              isFavorite: false
            };
          }
        });
        
        set({ topicProgress: updated });
      },

      markTheoryComplete: (topicId) => {
        set(state => {
          const progress = { ...state.topicProgress };
          if (progress[topicId]) {
            progress[topicId] = {
              ...progress[topicId],
              theoryCompleted: true,
              lastStudied: new Date().toISOString(),
              masteryLevel: calculateMastery({ ...progress[topicId], theoryCompleted: true })
            };
          }
          return { topicProgress: progress };
        });
      },

      addTheoryReadTime: (topicId, seconds) => {
        set(state => {
          const progress = { ...state.topicProgress };
          if (progress[topicId]) {
            progress[topicId] = {
              ...progress[topicId],
              theoryReadTime: (progress[topicId].theoryReadTime || 0) + seconds,
              lastStudied: new Date().toISOString()
            };
          }
          return { topicProgress: progress };
        });
      },

      recordExerciseAttempt: (attempt) => {
        set(state => {
          const progress = { ...state.topicProgress };
          const tp = progress[attempt.topicId];
          if (tp) {
            progress[attempt.topicId] = {
              ...tp,
              exercisesCompleted: tp.exercisesCompleted + 1,
              exercisesCorrect: tp.exercisesCorrect + (attempt.isCorrect ? 1 : 0),
              exercisesTotal: tp.exercisesTotal + 1,
              lastStudied: new Date().toISOString(),
              masteryLevel: calculateMastery({
                ...tp,
                exercisesCompleted: tp.exercisesCompleted + 1,
                exercisesCorrect: tp.exercisesCorrect + (attempt.isCorrect ? 1 : 0),
                exercisesTotal: tp.exercisesTotal + 1
              })
            };
          }
          return {
            topicProgress: progress,
            exerciseAttempts: [...state.exerciseAttempts, attempt]
          };
        });
      },

      addStudySession: (session) => {
        set(state => ({
          studySessions: [...state.studySessions, session]
        }));
        get().updateStreak();
      },

      toggleFavorite: (topicId) => {
        set(state => {
          const progress = { ...state.topicProgress };
          if (progress[topicId]) {
            progress[topicId] = {
              ...progress[topicId],
              isFavorite: !progress[topicId].isFavorite
            };
          }
          return { topicProgress: progress };
        });
      },

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = get().lastStudyDate;
        
        if (lastDate === today) return; // Already studied today
        
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        set(state => {
          const newStreak = lastDate === yesterday ? state.currentStreak + 1 : 1;
          return {
            currentStreak: newStreak,
            longestStreak: Math.max(state.longestStreak, newStreak),
            lastStudyDate: today
          };
        });
      },

      scheduleReview: (review) => {
        set(state => ({
          reviewSchedule: [...state.reviewSchedule, review]
        }));
      },

      completeReview: (topicId) => {
        set(state => ({
          reviewSchedule: state.reviewSchedule.map(r =>
            r.topicId === topicId && !r.completed
              ? { ...r, completed: true }
              : r
          )
        }));
      },

      getOverallProgress: () => {
        const state = get();
        const allProgress = Object.values(state.topicProgress);
        const totalTopics = getAllTopics().length;
        
        const completedTopics = allProgress.filter(p => p.theoryCompleted && p.exercisesCompleted >= 5).length;
        const totalExercises = allProgress.reduce((sum, p) => sum + p.exercisesCompleted, 0);
        const correctExercises = allProgress.reduce((sum, p) => sum + p.exercisesCorrect, 0);
        const totalTime = allProgress.reduce((sum, p) => sum + p.theoryReadTime, 0) +
          state.exerciseAttempts.reduce((sum, a) => sum + a.timeSpent, 0);
        
        const blocoProgress = syllabus.blocos.map(bloco => {
          const blocoTopics = allProgress.filter(p => 
            bloco.topics.some(t => t.id === p.topicId)
          );
          const completed = blocoTopics.filter(p => p.theoryCompleted && p.exercisesCompleted >= 5).length;
          const total = bloco.topics.length;
          const avgScore = blocoTopics.length > 0
            ? blocoTopics.reduce((sum, p) => sum + (p.exercisesTotal > 0 ? (p.exercisesCorrect / p.exercisesTotal) * 100 : 0), 0) / blocoTopics.length
            : 0;
          const studyTime = blocoTopics.reduce((sum, p) => sum + p.theoryReadTime, 0);
          
          return {
            blocoId: bloco.id,
            completedTopics: completed,
            totalTopics: total,
            averageScore: Math.round(avgScore),
            totalStudyTime: studyTime
          };
        });
        
        return {
          totalTopicsCompleted: completedTopics,
          totalTopics,
          totalExercisesCompleted: totalExercises,
          totalExercisesCorrect: correctExercises,
          totalStudyTime: totalTime,
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          lastStudyDate: state.lastStudyDate || undefined,
          blocoProgress,
          weakestTopics: get().getWeakTopics(),
          strongestTopics: allProgress
            .filter(p => p.masteryLevel === 'mastered' || p.masteryLevel === 'advanced')
            .map(p => p.topicId)
        };
      },

      getTopicMastery: (topicId) => {
        const tp = get().topicProgress[topicId];
        if (!tp) return 'not_started';
        return calculateMastery(tp);
      },

      getWeakTopics: () => {
        const progress = get().topicProgress;
        return Object.values(progress)
          .filter(p => {
            if (p.exercisesTotal === 0) return false;
            const score = (p.exercisesCorrect / p.exercisesTotal) * 100;
            return score < 60;
          })
          .sort((a, b) => {
            const scoreA = a.exercisesTotal > 0 ? (a.exercisesCorrect / a.exercisesTotal) : 0;
            const scoreB = b.exercisesTotal > 0 ? (b.exercisesCorrect / b.exercisesTotal) : 0;
            return scoreA - scoreB;
          })
          .slice(0, 5)
          .map(p => p.topicId);
      },

      resetProgress: () => {
        set({
          topicProgress: {},
          exerciseAttempts: [],
          studySessions: [],
          reviewSchedule: [],
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: null
        });
        get().initializeProgress();
      },

      loadFromCloud: async (userId: string) => {
        const cloudData = await loadProgressFromCloud(userId);
        if (cloudData) {
          // Cloud data found — use it (cloud wins)
          set({
            topicProgress: (cloudData.topicProgress as Record<string, TopicProgress>) || {},
            exerciseAttempts: (cloudData.exerciseAttempts as ExerciseAttempt[]) || [],
            studySessions: (cloudData.studySessions as StudySession[]) || [],
            reviewSchedule: (cloudData.reviewSchedule as ReviewSchedule[]) || [],
            currentStreak: (cloudData.currentStreak as number) || 0,
            longestStreak: (cloudData.longestStreak as number) || 0,
            lastStudyDate: (cloudData.lastStudyDate as string) || null,
          });
          get().initializeProgress();
        }
      }
    }),
    {
      name: 'study-platform-progress',
    }
  )
);

// Subscribe to store changes → sync to cloud
useProgressStore.subscribe((state) => {
  if (_currentUserId) {
    const { topicProgress, exerciseAttempts, studySessions, reviewSchedule, currentStreak, longestStreak, lastStudyDate } = state;
    saveProgressToCloud(_currentUserId, {
      topicProgress,
      exerciseAttempts,
      studySessions,
      reviewSchedule,
      currentStreak,
      longestStreak,
      lastStudyDate,
    });
  }
});

// ===== UI STORE =====
interface UIStoreState {
  sidebarOpen: boolean;
  searchQuery: string;
  selectedBloco: string | null;
  selectedDifficulty: string | null;
  activeTab: 'theory' | 'exercises' | 'flashcards' | 'progress';
  isGenerating: boolean;
  
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedBloco: (blocoId: string | null) => void;
  setSelectedDifficulty: (difficulty: string | null) => void;
  setActiveTab: (tab: 'theory' | 'exercises' | 'flashcards' | 'progress') => void;
  setIsGenerating: (generating: boolean) => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  sidebarOpen: true,
  searchQuery: '',
  selectedBloco: null,
  selectedDifficulty: null,
  activeTab: 'theory',
  isGenerating: false,
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedBloco: (blocoId) => set({ selectedBloco: blocoId }),
  setSelectedDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsGenerating: (generating) => set({ isGenerating: generating })
}));
