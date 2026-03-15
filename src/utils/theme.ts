import { Preferences } from '@capacitor/preferences';

const THEME_KEY = 'app-theme-dark';

export const isDarkTheme = async (): Promise<boolean> => {
    const { value } = await Preferences.get({ key: THEME_KEY });
    if (value === null) {
        // If not set, check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return value === 'true';
};

export const setDarkTheme = async (isDark: boolean): Promise<void> => {
    await Preferences.set({ key: THEME_KEY, value: valueToString(isDark) });
    applyTheme(isDark);
};

export const applyTheme = (isDark: boolean) => {
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

const valueToString = (value: boolean) => (value ? 'true' : 'false');

export const initializeTheme = async () => {
    const isDark = await isDarkTheme();
    applyTheme(isDark);
};
