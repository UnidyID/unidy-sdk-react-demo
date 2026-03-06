'use client';

import { Button } from '@/components/shadcn/ui/button';
import { useSession } from '@unidy.io/sdk-react';
import { LogOut } from 'lucide-react';

export const LoggedInPlaceholder = () => {
	const session = useSession();

	const handleLogout = async () => {
		await session.logout();
	};

	return (
		<div className="flex flex-col items-center justify-center gap-4 py-8">
			<p className="body-1 text-neutral-strong">You&apos;re already logged in.</p>
			<Button
				theme="neutral"
				variant="solid"
				size="md"
				onClick={handleLogout}
				disabled={session.isLoading}
			>
				<LogOut className="size-4" />
				Log out
			</Button>
		</div>
	);
};
