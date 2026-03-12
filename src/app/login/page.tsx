import { Suspense } from 'react';
import { createMetadata } from '@/lib/metadata';
import { LoginPage } from '@/modules/authentication/pages/login-page';

export default function Page() {
	return (
		<Suspense>
			<LoginPage />
		</Suspense>
	);
}
export const metadata = createMetadata('Login');
