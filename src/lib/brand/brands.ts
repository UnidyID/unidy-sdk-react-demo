export interface BrandConfig {
	id: string;
	name: string;
	logoSrc?: string;
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
		logoSrc: '/brands/fffa.svg',
		logoBgColor: '#003ea2',
		accentColor: '#003ea2',
		accentContrast: '#ffffff'
	}
};
