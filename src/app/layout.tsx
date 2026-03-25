import '@/styles/index.css';

import { GeistSans } from 'geist/font/sans';

import { BodyOverlays } from './body-overlays';
import { Providers } from './providers';
import { BrandProvider } from '@/lib/brand/brand-provider';

const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='system'?window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light':t;if(d==='dark')document.body.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<Providers>
			<html lang="en" className={GeistSans.variable}>
				<body
					suppressHydrationWarning
					className="bg-background min-h-screen flex flex-col group/sdklabels"
				>
					<script dangerouslySetInnerHTML={{ __html: themeScript }} />
					<BrandProvider>
					<BodyOverlays>{children}</BodyOverlays>
				</BrandProvider>
				</body>
			</html>
		</Providers>
	);
}
