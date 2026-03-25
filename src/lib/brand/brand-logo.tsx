'use client';

import { Logo } from '@/components/logo';
import { useBrand } from './brand-provider';

export const BrandLogo = () => {
	const brand = useBrand();

	if (!brand) return <Logo />;

	if (brand.logoSrc) {
		return (
			<img
				src={brand.logoSrc}
				alt={brand.name}
				className="h-10 w-auto object-contain"
			/>
		);
	}

	return <Logo text={brand.name} />;
};
