import type {
	NewsletterCategory,
	NewsletterOption
} from '../components/newsletter-picker';

export const newsletterCategories: NewsletterCategory[] = [
	{
		id: 'main',
		name: 'Main Newsletter',
		description:
			'Manage your email subscriptions and choose what content you want to receive.',
		options: [
			{
				id: 'main',
				title: 'News & Updates',
				description: 'All the latest news, events, tickets, and partner offers',
				icon: 'trophy',
				category: 'main'
			}
		]
	},
	{
		id: 'weather',
		name: 'Weather Forecast',
		description: 'Stay up to date with the latest weather forecasts.',
		options: [
			{
				id: 'weather',
				title: 'Weather Forecast',
				description: 'Temperature, wind, and precipitation updates',
				icon: 'bell',
				category: 'weather'
			}
		]
	}
];

export const newsletterOptions: NewsletterOption[] =
	newsletterCategories.flatMap((category) => category.options);

export const newsletterFeatureList = [
	{
		title: 'Multiple Lists',
		description:
			'Organize subscribers into different lists for targeted campaigns'
	},
	{
		title: 'Easy Management',
		description: 'Simple API to add, remove, and update subscriber preferences'
	},
	{
		title: 'Customizable',
		description:
			'Fully customizable subscription forms and preference management'
	}
];

export const newsletterSectionCopy = {
	title: 'Newsletter Subscription',
	description:
		'Flexible newsletter management with multiple list options. Keep your fans engaged with personalized content.'
};

export const newsletterIntegrationCode = `import { useNewsletterSubscribe } from '@unidy.io/sdk-react';

function SubscribeForm() {
  const { subscribe, isLoading, fieldErrors } = useNewsletterSubscribe({
    callbacks: {
      onSuccess: (msg) => toast.success(msg),
      onError: (err) => toast.error(err),
    },
  });

  const handleSubmit = async () => {
    const result = await subscribe({
      email: 'user@example.com',
      newsletters: [{ internalName: 'sports' }],
      additionalFields: { first_name: 'John' },
    });
  };
}`;
