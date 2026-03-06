'use client';

import { Button } from '@/components/shadcn/ui/button';
import { LogIn } from 'lucide-react';

export const LoggedOutPlaceholder = ({ message = 'Please log in to see the form.' }: { message?: string }) => {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-8">
			<p className="body-1 text-neutral-strong">{message}</p>
			<Button
				theme="neutral"
				variant="solid"
				size="md"
				onClick={() => {
					document.getElementById('authentication')?.scrollIntoView({ behavior: 'smooth' });
				}}
			>
				<LogIn className="size-4" />
				Log in
			</Button>
		</div>
	);
};
