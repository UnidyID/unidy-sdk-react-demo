import { Suspense } from 'react';
import { createMetadata } from '@/lib/metadata';
import { HomePage } from '@/modules/homepage/pages/home-page';

export default function Page() {
	return (
		<Suspense>
			<HomePage />
		</Suspense>
	);
}
export const metadata = createMetadata('Home');
