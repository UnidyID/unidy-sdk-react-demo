import 'server-only';

const SDK_USER_PATH = '/api/sdk/v1/user';
const OAUTH_TOKEN_PATH = '/oauth/token';
const USER_TICKETS_PATH = (userId: string) => `/api/v1/users/${userId}/tickets`;
const USER_SUBSCRIPTIONS_PATH = (userId: string) =>
	`/api/v1/users/${userId}/subscriptions`;

type UnidySdkUser = {
	id: string;
	email?: string | null;
	first_name?: string | null;
	last_name?: string | null;
};

type UnidyTicket = {
	id: string;
	title: string;
	reference: string;
	user_id: string;
};

type UnidySubscription = {
	id: string;
	title: string;
	reference: string;
	user_id: string;
};

type CreateTicketPayload = {
	ticket_category_id: string;
	title: string;
	text: string;
	reference: string;
	starts_at: string;
	ends_at?: string;
	state: 'active' | 'passive' | 'inactive';
	payment_state?: 'payed' | 'not_payed';
	price?: number;
	currency?: string;
	venue?: string;
	seating?: string;
	wallet_export?: {
		qr_code: string;
	};
};

type CreateSubscriptionPayload = {
	subscription_category_id: string;
	title: string;
	text: string;
	reference: string;
	starts_at?: string;
	ends_at?: string;
	next_payment_at?: string;
	state: 'active' | 'passive' | 'inactive';
	payment_state?: 'payed' | 'not_payed';
	payment_frequency?:
		| 'daily'
		| 'weekly'
		| 'monthly'
		| 'quarterly'
		| 'six_monthly'
		| 'yearly'
		| 'onetime';
	price?: number;
	currency?: string;
	wallet_export?: {
		qr_code: string;
	};
};

type RequestFailure = {
	status: number;
	message: string;
	data?: unknown;
};

type DummyTicketablesResult = {
	user: Pick<UnidySdkUser, 'id' | 'email'>;
	tickets: UnidyTicket[];
	subscriptions: UnidySubscription[];
	errors: RequestFailure[];
};

class UnidyRequestError extends Error {
	status: number;
	data?: unknown;

	constructor({ status, message, data }: RequestFailure) {
		super(message);
		this.name = 'UnidyRequestError';
		this.status = status;
		this.data = data;
	}
}

function getRequiredEnv(name: string) {
	const value = process.env[name]?.trim();

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

function getConfig() {
	return {
		baseUrl: getRequiredEnv('NEXT_PUBLIC_UNIDY_API_URL').replace(/\/+$/, ''),
		publicApiKey: getRequiredEnv('NEXT_PUBLIC_UNIDY_API_KEY'),
		adminClientId: getRequiredEnv('UNIDY_ADMIN_CLIENT_ID'),
		adminClientSecret: getRequiredEnv('UNIDY_ADMIN_CLIENT_SECRET'),
		ticketCategoryId: getRequiredEnv('UNIDY_DUMMY_TICKET_CATEGORY_ID'),
		subscriptionCategoryId: getRequiredEnv('UNIDY_DUMMY_SUBSCRIPTION_CATEGORY_ID')
	};
}

function buildUrl(baseUrl: string, path: string) {
	return new URL(path, `${baseUrl}/`).toString();
}

async function parseJson(response: Response) {
	try {
		return (await response.json()) as unknown;
	} catch {
		return undefined;
	}
}

function extractErrorMessage(data: unknown, fallback: string) {
	if (!data || typeof data !== 'object') {
		return fallback;
	}

	if (
		'errors' in data &&
		Array.isArray(data.errors) &&
		data.errors.every((error) => typeof error === 'string')
	) {
		return data.errors.join(', ');
	}

	if (
		'error_description' in data &&
		typeof data.error_description === 'string' &&
		data.error_description
	) {
		return data.error_description;
	}

	if (
		'error_identifier' in data &&
		typeof data.error_identifier === 'string' &&
		data.error_identifier
	) {
		return data.error_identifier;
	}

	if ('error' in data && typeof data.error === 'string' && data.error) {
		return data.error;
	}

	return fallback;
}

function isSdkUser(data: unknown): data is UnidySdkUser {
	return !!data && typeof data === 'object' && 'id' in data && typeof data.id === 'string';
}

function isRequestFailure(error: unknown): error is RequestFailure {
	return (
		!!error &&
		typeof error === 'object' &&
		'status' in error &&
		typeof error.status === 'number' &&
		'message' in error &&
		typeof error.message === 'string'
	);
}

async function requestJson<T>({
	baseUrl,
	path,
	method,
	body,
	headers
}: {
	baseUrl: string;
	path: string;
	method: 'GET' | 'POST';
	body?: unknown;
	headers: HeadersInit;
}) {
	const response = await fetch(buildUrl(baseUrl, path), {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
		cache: 'no-store'
	});

	const data = await parseJson(response);

	if (!response.ok) {
		throw new UnidyRequestError({
			status: response.status,
			message: extractErrorMessage(
				data,
				`Unidy request failed with status ${response.status}`
			),
			data
		});
	}

	return data as T;
}

async function validateUserIdToken(idToken: string) {
	const { baseUrl, publicApiKey } = getConfig();

	const user = await requestJson<UnidySdkUser>({
		baseUrl,
		path: SDK_USER_PATH,
		method: 'GET',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${publicApiKey}`,
			'Content-Type': 'application/json',
			'X-ID-Token': idToken
		}
	});

	if (!isSdkUser(user)) {
		throw new UnidyRequestError({
			status: 502,
			message: 'Unidy SDK validation returned an invalid user payload.',
			data: user
		});
	}

	return user;
}

async function createAdminAccessToken() {
	const { baseUrl, adminClientId, adminClientSecret } = getConfig();

	const response = await requestJson<{
		access_token: string;
	}>({
		baseUrl,
		path: OAUTH_TOKEN_PATH,
		method: 'POST',
		body: {
			client_id: adminClientId,
			client_secret: adminClientSecret,
			grant_type: 'client_credentials',
			scope: 'tickets:write subscriptions:write'
		},
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});

	if (!response.access_token) {
		throw new UnidyRequestError({
			status: 502,
			message: 'Unidy admin token response did not include an access token.',
			data: response
		});
	}

	return response.access_token;
}

function addDays(date: Date, days: number) {
	const nextDate = new Date(date);
	nextDate.setUTCDate(nextDate.getUTCDate() + days);
	return nextDate;
}

function buildDummyTickets(user: UnidySdkUser, ticketCategoryId: string) {
	const seed = crypto.randomUUID().split('-')[0] ?? Date.now().toString();
	const name =
		[user.first_name, user.last_name].filter(Boolean).join(' ').trim() ||
		user.email ||
		'Unidy demo user';
	const now = new Date();

	return [
		{
			ticket_category_id: ticketCategoryId,
			title: 'Demo Match Ticket',
			text: `Automatically created for ${name}.`,
			reference: `demo-ticket-${seed}-1`,
			starts_at: addDays(now, 7).toISOString(),
			ends_at: addDays(now, 7).toISOString(),
			state: 'active',
			payment_state: 'payed',
			price: 19.9,
			currency: 'EUR',
			venue: 'Demo Arena',
			seating: 'A1',
			wallet_export: {
				qr_code: 'https://google.com'
			}
		},
		{
			ticket_category_id: ticketCategoryId,
			title: 'Demo VIP Ticket',
			text: `Automatically created for ${name}.`,
			reference: `demo-ticket-${seed}-2`,
			starts_at: addDays(now, 14).toISOString(),
			ends_at: addDays(now, 14).toISOString(),
			state: 'active',
			payment_state: 'payed',
			price: 39.9,
			currency: 'EUR',
			venue: 'Demo Arena',
			seating: 'B4'
		}
	] satisfies CreateTicketPayload[];
}

function buildDummySubscriptions(
	user: UnidySdkUser,
	subscriptionCategoryId: string
) {
	const seed = crypto.randomUUID().split('-')[0] ?? Date.now().toString();
	const name =
		[user.first_name, user.last_name].filter(Boolean).join(' ').trim() ||
		user.email ||
		'Unidy demo user';
	const now = new Date();

	return [
		{
			subscription_category_id: subscriptionCategoryId,
			title: 'Demo Monthly Membership',
			text: `Automatically created for ${name}.`,
			reference: `demo-subscription-${seed}-1`,
			starts_at: now.toISOString(),
			ends_at: addDays(now, 30).toISOString(),
			next_payment_at: addDays(now, 30).toISOString(),
			state: 'active',
			payment_state: 'payed',
			payment_frequency: 'monthly',
			price: 9.9,
			currency: 'EUR',
			wallet_export: {
				qr_code: 'https://google.com'
			}
		},
		{
			subscription_category_id: subscriptionCategoryId,
			title: 'Demo Season Pass',
			text: `Automatically created for ${name}.`,
			reference: `demo-subscription-${seed}-2`,
			starts_at: now.toISOString(),
			ends_at: addDays(now, 365).toISOString(),
			next_payment_at: addDays(now, 365).toISOString(),
			state: 'active',
			payment_state: 'payed',
			payment_frequency: 'yearly',
			price: 99.9,
			currency: 'EUR'
		}
	] satisfies CreateSubscriptionPayload[];
}

async function createUserTicket(
	userId: string,
	adminAccessToken: string,
	payload: CreateTicketPayload
) {
	const { baseUrl } = getConfig();

	return requestJson<UnidyTicket>({
		baseUrl,
		path: USER_TICKETS_PATH(userId),
		method: 'POST',
		body: {
			ticket: payload
		},
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${adminAccessToken}`,
			'Content-Type': 'application/json'
		}
	});
}

async function createUserSubscription(
	userId: string,
	adminAccessToken: string,
	payload: CreateSubscriptionPayload
) {
	const { baseUrl } = getConfig();

	return requestJson<UnidySubscription>({
		baseUrl,
		path: USER_SUBSCRIPTIONS_PATH(userId),
		method: 'POST',
		body: {
			subscription: payload
		},
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${adminAccessToken}`,
			'Content-Type': 'application/json'
		}
	});
}

export async function createDummyTicketablesForIdToken(
	idToken: string
): Promise<DummyTicketablesResult> {
	const user = await validateUserIdToken(idToken);
	const adminAccessToken = await createAdminAccessToken();
	const { ticketCategoryId, subscriptionCategoryId } = getConfig();
	const tickets: UnidyTicket[] = [];
	const subscriptions: UnidySubscription[] = [];
	const errors: RequestFailure[] = [];

	for (const payload of buildDummyTickets(user, ticketCategoryId)) {
		try {
			const ticket = await createUserTicket(user.id, adminAccessToken, payload);
			tickets.push(ticket);
		} catch (error) {
			errors.push(
				isRequestFailure(error)
					? error
					: {
							status: 500,
							message: 'Unknown error while creating a dummy ticket.'
						}
			);
		}
	}

	for (const payload of buildDummySubscriptions(user, subscriptionCategoryId)) {
		try {
			const subscription = await createUserSubscription(
				user.id,
				adminAccessToken,
				payload
			);
			subscriptions.push(subscription);
		} catch (error) {
			errors.push(
				isRequestFailure(error)
					? error
					: {
							status: 500,
							message: 'Unknown error while creating a dummy subscription.'
						}
			);
		}
	}

	return {
		user: {
			id: user.id,
			email: user.email ?? null
		},
		tickets,
		subscriptions,
		errors
	};
}
