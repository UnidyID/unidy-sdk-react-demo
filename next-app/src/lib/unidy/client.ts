import { createStandaloneClient } from '@unidy.io/sdk-react';

export const unidyClient = createStandaloneClient({
	baseUrl: process.env.NEXT_PUBLIC_UNIDY_API_URL!,
	apiKey: process.env.NEXT_PUBLIC_UNIDY_API_KEY!,
});
