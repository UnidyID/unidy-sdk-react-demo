'use client';

import { ThemeProvider } from '@/lib/theme/providers/theme-provider';
import { ViewportSizeProvider } from '@/lib/viewport-size';

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ViewportSizeProvider>
			<ThemeProvider>{children}</ThemeProvider>
		</ViewportSizeProvider>
	);
};
