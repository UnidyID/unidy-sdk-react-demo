'use client';

import Link from 'next/link';
import type { FC, PropsWithChildren } from 'react';

import { BrandLogo } from '@/lib/brand/brand-logo';
import { ThemeToggler } from '@/lib/theme/components/theme-toggler';

export const ProfileNavigation: FC<
	PropsWithChildren & { backHref?: string }
> = ({ backHref = '/', children }) => {
	return (
		<div className="bg-section border-b border-neutral-weak sticky top-0 z-10">
			<div className="max-w-[1200px] mx-auto h-16 flex items-center justify-between px-4">
				<Link href={backHref}>
					<BrandLogo />
				</Link>

				<div className="flex gap-3 items-center relative">
					<ThemeToggler />

					{children && children}
				</div>
			</div>
		</div>
	);
};
