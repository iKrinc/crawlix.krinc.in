/**
 * Session storage wrapper with error handling
 */

/**
 * Save data to sessionStorage
 */
export function saveToSession<T>(key: string, data: T): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const serialized = JSON.stringify(data);
    window.sessionStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save to sessionStorage:', error);
    return false;
  }
}

/**
 * Load data from sessionStorage
 */
export function loadFromSession<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const serialized = window.sessionStorage.getItem(key);
    if (!serialized) return null;

    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Failed to load from sessionStorage:', error);
    return null;
  }
}

/**
 * Remove data from sessionStorage
 */
export function removeFromSession(key: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove from sessionStorage:', error);
    return false;
  }
}

/**
 * Clear all sessionStorage
 */
export function clearSession(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.sessionStorage.clear();
    return true;
  } catch (error) {
    console.error('Failed to clear sessionStorage:', error);
    return false;
  }
}

/**
 * Check if sessionStorage is available and working
 */
export function isSessionStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const testKey = '__storage_test__';
    window.sessionStorage.setItem(testKey, 'test');
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the size of sessionStorage data in bytes (approximate)
 */
export function getSessionStorageSize(): number {
  if (typeof window === 'undefined') return 0;

  try {
    let total = 0;
    for (const key in window.sessionStorage) {
      if (window.sessionStorage.hasOwnProperty(key)) {
        const value = window.sessionStorage.getItem(key) || '';
        total += key.length + value.length;
      }
    }
    return total * 2; // Each character is 2 bytes in UTF-16
  } catch {
    return 0;
  }
}
