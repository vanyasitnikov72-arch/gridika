/**
 * Safe helper for sending Yandex Metrika goal conversions.
 * Counter ID: 114261124
 */
export function trackGoal(goal: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    const ym = (window as any).ym;
    if (typeof ym === 'function') {
      if (params) {
        ym(114261124, 'reachGoal', goal, params);
      } else {
        ym(114261124, 'reachGoal', goal);
      }
      console.log(`[metrika] reachGoal: ${goal}`, params);
    }
  } catch (err) {
    // Fail silently in development/blocked ad environments
    console.debug('[Metrika] Goal tracking error:', err);
  }
}

if (typeof window !== 'undefined') {
  (window as any).trackGoal = trackGoal;
}
