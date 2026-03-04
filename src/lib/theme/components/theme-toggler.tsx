'use client';

import { type FC, useEffect, useState } from 'react';

import { Button, type ButtonProps } from '@/components/shadcn/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../providers/theme-provider';

export const ThemeToggler: FC<ButtonProps> = ({ ...props }) => {
	const { theme, toggleTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Button variant="solid-weak" iconOnly onClick={toggleTheme} {...props}>
			{theme === 'light' ? <Moon /> : <Sun />}
		</Button>
	);
};
