import { Toaster } from '@/components/shadcn/ui/sonner';
import NextTopLoader from 'nextjs-toploader';

export const BodyOverlays = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<NextTopLoader color="#3461ff" shadow={false} showSpinner={false} />
			{children}
			<div className="fixed inset-0 bg-black/20 z-50 pointer-events-none group-has-[.sdk-label[data-active=true]]/sdklabels:opacity-100 opacity-0 transition-opacity duration-300"></div>
			<Toaster />
		</>
	);
};
