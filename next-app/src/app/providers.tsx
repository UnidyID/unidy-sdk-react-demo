'use client';

import { ThemeProvider } from '@/lib/theme/providers/theme-provider';
import { UnidyProviderWrapper } from '@/lib/unidy/unidy-provider';
import { ViewportSizeProvider } from '@/lib/viewport-size';

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ViewportSizeProvider>
			<ThemeProvider>
				<UnidyProviderWrapper>{children}</UnidyProviderWrapper>
			</ThemeProvider>
		</ViewportSizeProvider>
	);
};
