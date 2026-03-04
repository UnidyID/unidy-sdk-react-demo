import { type Metadata } from 'next';

export const createMetadata = (
	subpage?: string,
	overrides?: Partial<Metadata>
): Metadata => ({
	title: `${subpage ? `${subpage} | ` : ''}Unidy SDK Demo`,
	description: `${subpage ? `${subpage} | ` : ''}Unidy SDK Demo`,
	icons: [{ rel: 'icon', url: '/favicon.png' }],
	openGraph: {
		title: `${subpage ? `${subpage} | ` : ''}Unidy SDK Demo`,
		description: `${subpage ? `${subpage} | ` : ''}Unidy SDK Demo`,
		url: 'https://soccer-fan-club-showcase.vercel.app',
		type: 'website',
		siteName: `${subpage ? `${subpage} | ` : ''}Unidy SDK Demo`,
		images: [
			{
				url: 'https://soccer-fan-club-showcase.vercel.app/cover.png',
				width: 1200,
				height: 630
			}
		],
		locale: 'en-US'
	},
	...overrides
});
