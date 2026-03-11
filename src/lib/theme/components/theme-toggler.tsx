'use client';

import { type FC, useEffect, useState } from 'react';

import { Button, type ButtonProps } from '@/components/shadcn/ui/button';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../providers/theme-provider';

const cycle = { system: 'light', light: 'dark', dark: 'system' } as const;

export const ThemeToggler: FC<ButtonProps> = ({ ...props }) => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const icon =
		theme === 'system' ? <Monitor /> : theme === 'light' ? <Sun /> : <Moon />;

	return (
		<Button
			variant="solid-weak"
			iconOnly
			onClick={() => setTheme(cycle[theme])}
			title={`Theme: ${theme}`}
			{...props}
		>
			{icon}
		</Button>
	);
};
