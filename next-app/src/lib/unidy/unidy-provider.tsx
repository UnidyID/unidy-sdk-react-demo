'use client';

import { UnidyProvider } from '@unidy.io/sdk-react';
import { unidyClient } from './client';

export function UnidyProviderWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return <UnidyProvider client={unidyClient}>{children}</UnidyProvider>;
}
