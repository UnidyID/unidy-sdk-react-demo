'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type FC,
	type PropsWithChildren
} from 'react';
import { brands, type BrandConfig } from './brands';

const BrandContext = createContext<BrandConfig | null>(null);

export const useBrand = () => useContext(BrandContext);

export const BrandProvider: FC<PropsWithChildren> = ({ children }) => {
	const [brand, setBrand] = useState<BrandConfig | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const brandId = params.get('brand');
		const config = brandId ? (brands[brandId] ?? null) : null;
		setBrand(config);

		if (!config) return;

		const root = document.documentElement;
		root.style.setProperty('--color-accent', config.accentColor);
		root.style.setProperty('--color-accent-contrast', config.accentContrast);

		return () => {
			root.style.removeProperty('--color-accent');
			root.style.removeProperty('--color-accent-contrast');
		};
	}, []);

	return (
		<BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
	);
};
