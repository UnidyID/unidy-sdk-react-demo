'use client';

import { Button } from '@/components/shadcn/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/shadcn/ui/dialog';
import { LogIn } from 'lucide-react';
import { LoginModalExample } from './login-modal-example';

export const LoggedOutPlaceholder = ({
	message = 'Please log in to see the form.'
}: {
	message?: string;
}) => {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-8">
			<p className="body-1 text-neutral-strong">{message}</p>
			<Dialog>
				<DialogTrigger asChild>
					<Button theme="neutral" variant="solid" size="md">
						<LogIn className="size-4" />
						Log in
					</Button>
				</DialogTrigger>
				<DialogContent className="p-0 border-none">
					<DialogHeader className="hidden">
						<DialogTitle>Log in to FC Unidy</DialogTitle>
						<DialogDescription>
							Welcome back! Please enter your details.
						</DialogDescription>
					</DialogHeader>
					<LoginModalExample />
				</DialogContent>
			</Dialog>
		</div>
	);
};
