'use client';

import { UnidyProviderWrapper } from '@/deps/unidy/unidy-provider';
import { ThemeProvider } from '@/lib/theme/providers/theme-provider';
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
