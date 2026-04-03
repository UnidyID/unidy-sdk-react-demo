export interface BrandConfig {
	id: string;
	name: string;
	logoSrc?: string;
	logoDarkSrc?: string;
	logoBgColor?: string;
	accentColor: string;
	accentContrast: string;
}

export const brands: Record<string, BrandConfig> = {
	mff: {
		id: 'mff',
		name: 'Malmö FF',
		logoSrc: '/brands/mff.svg',
		accentColor: 'oklch(85.93% 0.075 243.95)',
		accentContrast: '#0d2b4e'
	},
	fffa: {
		id: 'fffa',
		name: 'FFFA',
		logoSrc: '/brands/fffa-light.png',
		logoDarkSrc: '/brands/fffa.svg',
		accentColor: '#003ea2',
		accentContrast: '#ffffff'
	}
};
