'use client';

import { useViewportSize } from '@/lib/viewport-size';
import Link from 'next/link';
import { useCallback, type FC } from 'react';

export const LinkSmooth: FC<{
	href: string;
	className?: string;
	children: React.ReactNode;
}> = ({ href, ...props }) => {
	const { isMobile } = useViewportSize();

	const hrefIsAnchor = href.startsWith('#');

	const Comp = hrefIsAnchor ? 'a' : Link;

	const smoothScroll = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>) => {
			const target = document.getElementById(href.slice(1));

			if (!target) return;
			e.preventDefault();

			const targetPosition =
				target.getBoundingClientRect().top + window.pageYOffset;
			const targetHeight = target.clientHeight;
			const scrollTo = targetPosition - targetHeight / 2;

			if (isMobile) {
				target.scrollIntoView({ behavior: 'smooth' });
			} else {
				window.scrollTo({ top: scrollTo, behavior: 'smooth' });
			}
		},
		[hrefIsAnchor, href, isMobile]
	);

	return (
		<Comp
			href={href}
			className="smooth-link"
			onClick={hrefIsAnchor ? smoothScroll : undefined}
			{...props}
		/>
	);
};
