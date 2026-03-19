'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export const DEFAULT_AUTH_RETURN_TO = '/profile';

type SearchParamsReader = {
	get(name: string): string | null;
};

type SearchParamsStringifier = {
	toString(): string;
};

export const sanitizeReturnTo = (
	returnTo: string | null | undefined,
	fallback = DEFAULT_AUTH_RETURN_TO
) => {
	if (!returnTo) return fallback;
	if (!returnTo.startsWith('/') || returnTo.startsWith('//')) return fallback;
	return returnTo;
};

export const getReturnToFromSearchParams = (
	searchParams: SearchParamsReader | null | undefined,
	fallback = DEFAULT_AUTH_RETURN_TO
) =>
	sanitizeReturnTo(
		searchParams?.get('return_to') ?? searchParams?.get('redirect'),
		fallback
	);

export const buildCurrentReturnTo = ({
	pathname,
	searchParams,
	fallback = '/'
}: {
	pathname: string | null | undefined;
	searchParams?: SearchParamsStringifier | null;
	fallback?: string;
}) => {
	const safePathname = sanitizeReturnTo(pathname, fallback);
	const queryString = searchParams?.toString();

	return queryString ? `${safePathname}?${queryString}` : safePathname;
};

export const buildLoginHref = (
	returnTo: string | null | undefined,
	fallback = DEFAULT_AUTH_RETURN_TO
) => {
	const safeReturnTo = sanitizeReturnTo(returnTo, fallback);
	const params = new URLSearchParams({ return_to: safeReturnTo });

	return `/login?${params.toString()}`;
};

export const buildAbsoluteLoginHref = (
	origin: string,
	returnTo: string | null | undefined,
	fallback = DEFAULT_AUTH_RETURN_TO
) => `${origin}${buildLoginHref(returnTo, fallback)}`;

export const useCurrentReturnTo = (fallback = '/') => {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	return useMemo(
		() => buildCurrentReturnTo({ pathname, searchParams, fallback }),
		[pathname, searchParams, fallback]
	);
};
