/**
 * Theme management utility for TaskBoard Pro
 * This allows for programmatic access to theme variables
 */

export const lightTheme = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  primaryDark: '#1d4ed8',
  secondary: '#0ea5e9',
  secondaryLight: '#38bdf8',
  secondaryDark: '#0284c7',
  
  background: '#f5f7f9',
  surface: '#ffffff',
  text: '#1e293b',
  textMuted: '#64748b',
  border: '#e2e8f0',
  
  error: '#dc2626',
  success: '#16a34a',
  warning: '#ca8a04',
  info: '#2563eb',
  
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

export const darkTheme = {
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#2563eb',
  secondary: '#38bdf8',
  secondaryLight: '#7dd3fc',
  secondaryDark: '#0284c7',
  
  background: '#242424',
  surface: '#1c1c1c',
  text: 'rgba(255, 255, 255, 0.87)',
  textMuted: '#94a3b8',
  border: '#333333',
  
  error: '#ef4444',
  success: '#22c55e',
  warning: '#eab308',
  info: '#3b82f6',
  
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
};

/**
 * Get current theme based on system preference
 */
export const getCurrentTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return darkTheme;
  }
  return lightTheme;
};

/**
 * Apply theme to CSS variables
 */
export const applyTheme = (theme = getCurrentTheme()) => {
  const root = document.documentElement;
  
  Object.entries(theme).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--color-${cssKey}`, value);
  });
};

/**
 * Listen for system theme changes
 */
export const initThemeListener = () => {
  if (window.matchMedia) {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        applyTheme(event.matches ? darkTheme : lightTheme);
      });
  }
};
