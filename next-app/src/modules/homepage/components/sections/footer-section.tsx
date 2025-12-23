import { LinkSmooth } from '@/components/link-smooth';
import { cn } from '@/components/shadcn/utils';
import { Shield } from 'lucide-react';
import { type FC } from 'react';

interface FooterLinkProps {
	href?: string;
	children: React.ReactNode;
	className?: string;
}

const FooterLink: FC<FooterLinkProps> = ({
	href = '#',
	children,
	className
}) => {
	return (
		<LinkSmooth
			href={href}
			className={cn(
				'button-md text-shade-contrast/40 hover:text-shade-contrast transition-colors',
				className
			)}
		>
			{children}
		</LinkSmooth>
	);
};

interface FooterColumnProps {
	title: string;
	links: Array<{ label: string; href?: string }>;
}

const FooterColumn: FC<FooterColumnProps> = ({ title, links }) => {
	return (
		<div className="flex flex-col gap-4 flex-1 min-w-0 w-full items-center md:items-start">
			<h4 className="title-3 text-shade-contrast tracking-[-0.42px]">
				{title}
			</h4>
			<ul className="flex flex-col gap-2">
				{links.map((link, index) => (
					<li key={index}>
						<FooterLink href={link.href}>{link.label}</FooterLink>
					</li>
				))}
			</ul>
		</div>
	);
};

export const FooterSection: FC = () => {
	const productLinks = [
		{ label: 'Auth SDK', href: '#authentication' },
		{ label: 'Newsletter SDK', href: '#newsletter' },
		{ label: 'API SDK', href: '#api' },
		{ label: 'Documentation', href: '#documentation' }
	];

	const companyLinks = [
		{ label: 'About', href: 'https://unidy.de' },
		{ label: 'Blog', href: 'https://unidy.de/blog' },
		{ label: 'Careers', href: 'https://unidy.de/careers' },
		{ label: 'Contact', href: 'https://unidy.de/contact' }
	];

	const legalLinks = [
		{ label: 'Privacy', href: 'https://unidy.de/privacy' },
		{ label: 'Terms', href: 'https://unidy.de/terms' },
		{ label: 'Security', href: 'https://unidy.de/security' }
	];

	return (
		<footer className="bg-shade flex flex-col items-center px-0 py-12 w-full">
			<div className="flex flex-col gap-8 max-w-[1024px] w-full px-6">
				{/* Main Footer Content */}
				<div className="flex flex-col md:flex-row gap-12 items-center md:items-start flex-1 shrink-0">
					{/* Logo and Description */}
					<div className="flex flex-col items-center md:items-start gap-4 flex-1 min-w-0">
						<div className="flex gap-2 items-center h-8">
							<div className="bg-accent rounded-full size-8 flex items-center justify-center shrink-0">
								<Shield className="size-5 text-accent-contrast" />
							</div>
							<span className="text-base font-normal leading-6 text-shade-contrast tracking-[-0.3125px]">
								FC Unidy
							</span>
						</div>
						<p className="body-2 text-shade-contrast/60 max-w-[233px]">
							Easy to integrate authentication and newsletter management for
							modern applications.
						</p>
					</div>

					{/* Links */}
					<div className="grid grid-cols-3 gap-4 items-start flex-3 shrink-0 w-full max-w-[480px]">
						{/* Product Column */}
						<FooterColumn title="SDK Showcase" links={productLinks} />

						{/* Company Column */}
						<FooterColumn title="Unidy" links={companyLinks} />

						{/* Legal Column */}
						<FooterColumn title="Legal" links={legalLinks} />
					</div>
				</div>

				{/* Divider */}
				<div className="h-px bg-shade-contrast/10" />

				{/* Copyright */}
				<div className="flex items-center justify-center">
					<p className="body-3 text-shade-contrast/40">
						© 2025 Unidy. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};
