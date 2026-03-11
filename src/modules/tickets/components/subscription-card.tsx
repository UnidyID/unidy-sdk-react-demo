import { Calendar, Check, Clock, Download, WalletCards } from 'lucide-react';
import type { FC } from 'react';
import { Button } from '@/components/shadcn/ui/button';
import { cn } from '@/components/shadcn/utils';

export interface SubscriptionCardProps {
	title: string;
	subtitle: string;
	status?: 'active' | 'passive' | 'inactive';
	validUntil: string;
	remainingMatches: string;
	benefits: string[];
	annualPrice: string;
	exportable?: boolean;
	onDownloadPdf?: () => void;
	onDownloadPkpass?: () => void;
	className?: string;
}

export const SubscriptionCard: FC<SubscriptionCardProps> = ({
	title,
	subtitle,
	status = 'active',
	validUntil,
	remainingMatches,
	benefits,
	annualPrice,
	exportable = true,
	onDownloadPdf,
	onDownloadPkpass,
	className
}) => {
	return (
		<div
			className={cn(
				'bg-section border-2 border-accent rounded-[10px] overflow-hidden flex flex-col',
				className
			)}
		>
			{/* Header */}
			<div className="bg-accent-weak border-b border-accent px-6 py-3 flex items-center justify-between">
				<div className="flex flex-col gap-2">
					<h3 className="title-2 text-neutral tracking-[-0.54px]">{title}</h3>
					<p className="body-2 text-accent-strong">{subtitle}</p>
				</div>
				{status === 'active' && (
					<div className="bg-success h-6 rounded-full shrink-0 flex items-center gap-1 px-3">
						<Check className="size-3 text-success-contrast" />
						<span className="caption text-success-contrast">Active</span>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-6 flex flex-col gap-6">
				{/* Valid Until and Remaining Matches */}
				<div className="grid grid-cols-2 gap-6">
					<div className="flex flex-col gap-2">
						<div className="flex gap-2 items-center">
							<Calendar className="size-4 text-neutral-strong shrink-0" />
							<p className="caption text-neutral-strong">Valid Until</p>
						</div>
						<p className="body-1 text-neutral">{validUntil}</p>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex gap-2 items-center">
							<Clock className="size-4 text-neutral-strong shrink-0" />
							<p className="caption text-neutral-strong">Remaining Matches</p>
						</div>
						<p className="body-1 text-neutral">{remainingMatches}</p>
					</div>
				</div>

				{/* Membership Benefits */}
				<div className="flex flex-col gap-3">
					<h4 className="title-2 text-neutral tracking-[-0.54px]">
						Membership Benefits
					</h4>
					<ul className="flex flex-col gap-2">
						{benefits.map((benefit, index) => (
							<li key={index} className="flex gap-2 items-center">
								<Check className="size-4 text-neutral-strong shrink-0" />
								<p className="caption text-neutral-strong">{benefit}</p>
							</li>
						))}
					</ul>
				</div>

				{/* Divider */}
				<div className="h-px bg-neutral-weak" />

				<div className="flex items-center justify-between gap-4">
					<div className="flex flex-col gap-1">
						<p className="caption text-neutral-strong">Annual Price</p>
						<p className="body-1 text-neutral">{annualPrice}</p>
					</div>
					<div className="flex flex-wrap justify-end gap-3">
						<Button theme="accent" onClick={onDownloadPdf}>
							<Download className="size-4" />
							Download PDF
						</Button>
						{exportable && (
							<Button
								theme="accent"
								variant="outline"
								onClick={onDownloadPkpass}
							>
								<WalletCards className="size-4" />
								Add to Apple Wallet
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
