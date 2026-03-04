import { AuthenticationSection } from '../components/sections/authentication-section';
import { FooterSection } from '../components/sections/footer-section';
import { HeroSection } from '../components/sections/hero-section';
import { NewsletterSection } from '../components/sections/newsletter-section';
import { OptionsSection } from '../components/sections/options-section';
import { ProfileSection } from '../components/sections/profile-section';
import { TicketsSection } from '../components/sections/tickets-section';
import { TopNavigation } from '../components/sections/top-navigation';

export const HomePage = () => {
	return (
		<>
			<TopNavigation />
			<main className="flex flex-col gap-4">
				<HeroSection />
				<OptionsSection />
				<div id="authentication">
					<AuthenticationSection />
				</div>
				<div id="newsletter">
					<NewsletterSection />
				</div>
				<div id="profile">
					<ProfileSection />
				</div>
				<div id="tickets">
					<TicketsSection />
				</div>
				<FooterSection />
			</main>
		</>
	);
};
