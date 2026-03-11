import type {
	NewsletterCategory,
	NewsletterOption
} from '../components/newsletter-picker';

export const newsletterCategories: NewsletterCategory[] = [
	{
		id: 'main',
		name: 'Main Newsletter',
		description:
			'Stay informed with the latest news, events, and partner updates.',
		selectablePreferences: true,
		options: [
			{
				id: 'news-updates',
				title: 'News & Updates',
				description:
					'All the latest news, announcements, and important updates',
				icon: 'trophy',
				category: 'main'
			},
			{
				id: 'tips-tricks',
				title: 'Events & Tickets',
				description:
					'Upcoming events, ticket releases, and exclusive presale access',
				icon: 'users',
				category: 'main'
			},
			{
				id: 'success-stories',
				title: 'Partner News',
				description: 'Offers and news from our trusted partners',
				icon: 'bell',
				category: 'main'
			}
		]
	},
	{
		id: 'weather',
		name: 'Weather Forecast',
		description:
			'Get match-day weather updates including temperature, wind, and precipitation.',
		selectablePreferences: false,
		options: [
			{
				id: 'temperature',
				title: 'Temperature',
				description: 'Current and forecasted temperature readings',
				icon: 'trophy',
				category: 'weather'
			},
			{
				id: 'wind',
				title: 'Wind',
				description: 'Wind speed and direction forecasts',
				icon: 'users',
				category: 'weather'
			},
			{
				id: 'snow-rain',
				title: 'Snow & Rain',
				description: 'Precipitation and snowfall predictions',
				icon: 'bell',
				category: 'weather'
			}
		]
	}
];

/** Flattened list of selectable items for the subscribe form.
 *  - For categories with selectablePreferences=true: individual preference options
 *  - For categories with selectablePreferences=false: a single item representing the whole newsletter */
export const subscribableOptions: NewsletterOption[] =
	newsletterCategories.flatMap((category) =>
		category.selectablePreferences
			? category.options
			: [
					{
						id: category.id,
						title: category.name,
						description: category.description,
						icon: category.options[0]?.icon ?? 'bell',
						category: category.id
					}
				]
	);

/** Full flat list of all individual preferences (used in preference center) */
export const newsletterOptions: NewsletterOption[] =
	newsletterCategories.flatMap((category) => category.options);

/** Converts selected subscribable option IDs into the newsletters payload
 *  format expected by the subscribe SDK call.
 *
 *  - For selectablePreferences categories (e.g. main): selected option IDs become
 *    preferenceIdentifiers under the category's internalName.
 *  - For non-selectable categories (e.g. weather): the category ID is the internalName,
 *    no preferenceIdentifiers needed. */
export function buildNewslettersPayload(
	selectedIds: string[]
): { internalName: string; preferenceIdentifiers?: string[] }[] {
	const result: { internalName: string; preferenceIdentifiers?: string[] }[] =
		[];

	for (const category of newsletterCategories) {
		if (category.selectablePreferences) {
			const selectedPrefs = category.options
				.filter((opt) => selectedIds.includes(opt.id))
				.map((opt) => opt.id);
			if (selectedPrefs.length > 0) {
				result.push({
					internalName: category.id,
					preferenceIdentifiers: selectedPrefs
				});
			}
		} else {
			if (selectedIds.includes(category.id)) {
				result.push({ internalName: category.id });
			}
		}
	}

	return result;
}

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
