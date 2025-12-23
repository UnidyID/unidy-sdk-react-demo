import '@/styles/index.css';

import { GeistSans } from 'geist/font/sans';

import { BodyOverlays } from './body-overlays';
import { Providers } from './providers';

export default function RootLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<Providers>
			<html lang="hr-HR" className={GeistSans.variable}>
				<body className="bg-background min-h-screen flex flex-col">
					<BodyOverlays>{children}</BodyOverlays>
				</body>
			</html>
		</Providers>
	);
}
