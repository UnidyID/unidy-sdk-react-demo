'use client';

import type React from 'react';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react';

type ThemeSetting = 'system' | 'light' | 'dark';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
	theme: ThemeSetting;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: ThemeSetting) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

function getInitialTheme(): ThemeSetting {
	if (typeof window === 'undefined') return 'system';
	return (localStorage.getItem('theme') as ThemeSetting | null) ?? 'system';
}

function getInitialResolved(): ResolvedTheme {
	if (typeof window === 'undefined') return 'light';
	// Read what the blocking script already applied
	return document.body.classList.contains('dark') ? 'dark' : 'light';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [theme, setThemeState] = useState<ThemeSetting>(getInitialTheme);
	const [resolvedTheme, setResolvedTheme] =
		useState<ResolvedTheme>(getInitialResolved);

	// Resolve theme and listen for system changes
	useEffect(() => {
		const resolve = () => {
			const resolved = theme === 'system' ? getSystemTheme() : theme;
			setResolvedTheme(resolved);
			if (resolved === 'dark') {
				document.body.classList.add('dark');
			} else {
				document.body.classList.remove('dark');
			}
		};
		resolve();

		if (theme === 'system') {
			const mq = window.matchMedia('(prefers-color-scheme: dark)');
			const handler = () => resolve();
			mq.addEventListener('change', handler);
			return () => mq.removeEventListener('change', handler);
		}
	}, [theme]);

	const setTheme = useCallback((newTheme: ThemeSetting) => {
		setThemeState(newTheme);
		localStorage.setItem('theme', newTheme);
	}, []);

	return (
		<ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
