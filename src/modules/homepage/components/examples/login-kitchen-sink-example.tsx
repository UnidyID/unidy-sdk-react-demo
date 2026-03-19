'use client';

import { LoginForm } from '@/modules/authentication/components/login-form';
import { useCurrentReturnTo } from '@/modules/authentication/utils/return-to';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface LoginKitchenSinkExampleProps {
	onRegisterInstead?: (email: string) => void;
}

export const LoginKitchenSinkExample = ({
	onRegisterInstead
}: LoginKitchenSinkExampleProps) => {
	const router = useRouter();
	const returnTo = useCurrentReturnTo('/');
	const handleAccountNotFound = useCallback(
		async () => 'registration-flow-not-found' as const,
		[]
	);

	return (
		<div className="flex flex-col gap-6 w-full">
			<LoginForm
				returnTo={returnTo}
				onAccountNotFound={
					onRegisterInstead ? handleAccountNotFound : undefined
				}
				onRegisterInstead={onRegisterInstead}
				onAuthenticated={() => {
					router.refresh();
				}}
			/>
		</div>
	);
};
