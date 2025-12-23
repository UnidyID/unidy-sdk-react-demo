'use client';

import { Button } from '@/components/shadcn/ui/button';
import { type FC } from 'react';

export interface ConnectedAccount {
	id: string;
	provider: 'google' | 'facebook' | 'github';
	email: string;
}

export interface ConnectedAccountsProps {
	accounts?: ConnectedAccount[];
	onDisconnect?: (id: string) => void;
	className?: string;
}

const providerNames = {
	google: 'Google',
	facebook: 'Facebook',
	github: 'GitHub'
};

export const ConnectedAccounts: FC<ConnectedAccountsProps> = ({
	accounts = [
		{
			id: '1',
			provider: 'google',
			email: 'john.doe@gmail.com'
		}
	],
	onDisconnect,
	className
}) => {
	return (
		<div
			className={`bg-section border border-neutral-weak rounded-[12px] p-[33px] flex flex-col gap-6 ${className || ''}`}
		>
			<h2 className="title-1 text-neutral">Connected Accounts</h2>
			<div className="flex flex-col gap-0">
				{accounts.map((account) => {
					const providerName = providerNames[account.provider];

					return (
						<div
							key={account.id}
							className="flex items-center justify-between px-[17px] py-1 rounded-[10px] border border-section"
						>
							<div className="flex gap-3 items-center">
								<div className="bg-info-weak rounded-full size-10 flex items-center justify-center">
									<svg href="/icons/google.svg" className="size-5 text-info" />
								</div>
								<div className="flex flex-col">
									<p className="body-2 text-neutral">{providerName}</p>
									<p className="body-3 text-neutral-strong">{account.email}</p>
								</div>
							</div>
							<Button
								theme="accent"
								variant="ghost"
								size="md"
								onClick={() => onDisconnect?.(account.id)}
							>
								Disconnect
							</Button>
						</div>
					);
				})}
			</div>
		</div>
	);
};
