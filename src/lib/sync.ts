import { supabase } from '@/lib/supabase';

// Debounce timer reference
let saveTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Load progress from Supabase for the current user
 */
export async function loadProgressFromCloud(userId: string): Promise<Record<string, unknown> | null> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('progress_data')
      .eq('user_id', userId)
      .single();

    if (error) {
      // PGRST116 = no rows found, not an actual error
      if (error.code === 'PGRST116') return null;
      console.error('Error loading progress:', error);
      return null;
    }

    return data?.progress_data ?? null;
  } catch (err) {
    console.error('Error loading progress from cloud:', err);
    return null;
  }
}

/**
 * Save progress to Supabase (upsert) with debounce
 */
export function saveProgressToCloud(userId: string, progressData: Record<string, unknown>) {
  // Debounce: wait 2 seconds after last change before saving
  if (saveTimer) clearTimeout(saveTimer);

  saveTimer = setTimeout(async () => {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: userId,
            progress_data: progressData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('Error saving progress to cloud:', error);
      }
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  }, 2000);
}

/**
 * Merge cloud data with local data (cloud wins if newer, but keeps local data for new topics)
 */
export function mergeProgressData(
  localData: Record<string, unknown>,
  cloudData: Record<string, unknown>
): Record<string, unknown> {
  // Use cloud as the base, overlay any local-only keys
  return {
    ...localData,
    ...cloudData,
  };
}
