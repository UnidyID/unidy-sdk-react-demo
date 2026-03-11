import {
	Calendar,
	Check,
	Download,
	MapPin,
	Ticket,
	WalletCards
} from 'lucide-react';
import type { FC } from 'react';
import { Button } from '@/components/shadcn/ui/button';
import { cn } from '@/components/shadcn/utils';

export interface TicketCardProps {
	title: string;
	ticketId: string;
	price: string;
	status?: 'active' | 'passive' | 'inactive';
	date: string;
	time: string;
	venue: string;
	venueDetails?: string;
	seat?: string;
	exportable?: boolean;
	onDownloadPdf?: () => void;
	onDownloadPkpass?: () => void;
	className?: string;
}

export const TicketCard: FC<TicketCardProps> = ({
	title,
	ticketId,
	price,
	status = 'active',
	date,
	time,
	venue,
	venueDetails,
	seat,
	exportable = true,
	onDownloadPdf,
	onDownloadPkpass,
	className
}) => {
	return (
		<div
			className={cn(
				'bg-section border-2 border-neutral-medium rounded-[10px] p-6 flex flex-col gap-4 items-end',
				className
			)}
		>
			{/* Header */}
			<div className="flex h-14 items-start justify-between w-full">
				<div className="flex flex-col gap-2 flex-1 min-w-0">
					<div className="flex gap-3 h-7 items-center">
						<h3 className="title-2 text-neutral tracking-[-0.54px] truncate">
							{title}
						</h3>
						{status === 'active' && (
							<div className="bg-success-weak h-6 rounded-full shrink-0 flex items-center gap-1 px-3">
								<Check className="size-3 text-success" />
								<span className="caption text-success">Active</span>
							</div>
						)}
					</div>
					<p className="body-2 text-neutral-strong">Ticket ID: {ticketId}</p>
				</div>
				<p className="title-2 text-neutral text-right tracking-[-0.54px] shrink-0">
					{price}
				</p>
			</div>

			{/* Details */}
			<div className="flex gap-4 items-start w-full">
				{/* Date & Time */}
				<div className="flex gap-3 flex-1 min-w-0">
					<Calendar className="size-5 text-accent shrink-0 mt-0.5" />
					<div className="flex flex-col gap-1 flex-1 min-w-0">
						<p className="caption text-neutral-strong">Date & Time</p>
						<p className="title-2 text-neutral tracking-[-0.54px]">{date}</p>
						<p className="body-2 text-neutral-strong">{time}</p>
					</div>
				</div>

				{/* Venue */}
				<div className="flex gap-3 flex-1 min-w-0">
					<MapPin className="size-5 text-accent shrink-0 mt-0.5" />
					<div className="flex flex-col gap-1 flex-1 min-w-0">
						<p className="caption text-neutral-strong">Venue</p>
						<p className="title-2 text-neutral tracking-[-0.54px]">{venue}</p>
						{venueDetails && (
							<p className="body-2 text-neutral-strong">{venueDetails}</p>
						)}
					</div>
				</div>

				{/* Seat */}
				{seat && (
					<div className="flex gap-3 flex-1 min-w-0">
						<Ticket className="size-5 text-accent shrink-0 mt-0.5" />
						<div className="flex flex-col gap-1 flex-1 min-w-0">
							<p className="caption text-neutral-strong">Seat</p>
							<p className="title-2 text-neutral tracking-[-0.54px]">{seat}</p>
						</div>
					</div>
				)}
			</div>

			<div className="flex flex-wrap gap-3">
				<Button theme="accent" onClick={onDownloadPdf}>
					<Download className="size-4" />
					Download PDF
				</Button>
				{exportable && (
					<Button theme="accent" variant="outline" onClick={onDownloadPkpass}>
						<WalletCards className="size-4" />
						Add to Apple Wallet
					</Button>
				)}
			</div>
		</div>
	);
};
