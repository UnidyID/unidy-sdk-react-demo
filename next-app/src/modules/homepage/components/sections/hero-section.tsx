'use client';

import { LinkSmooth } from '@/components/link-smooth';
import { Button } from '@/components/shadcn/ui/button';
import { ArrowRight, Shield } from 'lucide-react';

export const HeroSection = () => {
	return (
		<section
			className="relative flex flex-col items-center px-6 py-[120px] gap-[10px] w-full"
			style={{
				backgroundImage:
					'linear-gradient(163.08198714792195deg, rgba(216, 106, 96, 1) 0%, rgba(199, 42, 28, 1) 50%, rgba(216, 106, 96, 1) 100%)'
			}}
			id="hero"
		>
			{/* Background overlay image */}
			<div className="absolute inset-0 opacity-20 pointer-events-none">
				<img
					alt=""
					className="absolute inset-0 max-w-none object-cover size-full object-[50%_50%]"
					src="/assets/images/hero-cover.png"
				/>
			</div>

			{/* Content container */}
			<div className="relative flex flex-col gap-8 items-start max-w-[1024px] w-full shrink-0">
				{/* Text content */}
				<div className="flex flex-col gap-6 items-start w-full">
					{/* Powered by Unidy SDK badge */}
					<div className="bg-white/10 rounded-full shrink-0 flex items-center gap-2 px-4 h-10 text-white">
						<Shield className="size-5" />
						<p className="title-3 whitespace-nowrap">Powered by Unidy SDK</p>
					</div>

					{/* Main heading */}
					<h1 className="display-1 text-white max-w-[768px] w-full min-w-full">
						One Login. Infinite Possibilities.
					</h1>

					{/* Description */}
					<p className="title-2 text-white/90 max-w-[768px] w-full min-w-full">
						Experience seamless authentication, newsletter management, and user
						profile features. All integrated with the Unidy SDK - easy to
						implement, fully customizable.
					</p>
				</div>

				{/* CTA Buttons */}
				<div className="relative h-[52px] w-full flex gap-4">
					<LinkSmooth href="#options">
						<Button theme="accent-contrast" variant="solid" size="lg">
							Try Demo
							<ArrowRight />
						</Button>
					</LinkSmooth>

					<Button theme="accent-contrast" variant="outline" size="lg">
						View Documentation
					</Button>
				</div>
			</div>
		</section>
	);
};
