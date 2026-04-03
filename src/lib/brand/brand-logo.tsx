'use client';

import { Logo } from '@/components/logo';
import { useBrand } from './brand-provider';

export const BrandLogo = () => {
	const brand = useBrand();

	if (!brand) return <Logo />;

	if (brand.logoSrc) {
		const img = (
			<img
				src={brand.logoSrc}
				alt={brand.name}
				className="h-10 w-auto object-contain"
			/>
		);

		if (brand.logoBgColor) {
			return (
				<div
					style={{ backgroundColor: brand.logoBgColor }}
					className="h-10 px-3 rounded flex items-center"
				>
					{img}
				</div>
			);
		}

		return img;
	}

	return <Logo text={brand.name} />;
};
