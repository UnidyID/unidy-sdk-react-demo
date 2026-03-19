import { NextResponse } from 'next/server';
import { createDummyTicketablesForIdToken } from '@/lib/unidy/dummy-ticketables';

type DummyTicketablesRequest = {
	idToken?: unknown;
	id_token?: unknown;
};

function getIdTokenFromBody(body: DummyTicketablesRequest | null) {
	if (!body || typeof body !== 'object') {
		return null;
	}

	if (typeof body.id_token === 'string' && body.id_token.trim()) {
		return body.id_token.trim();
	}

	if (typeof body.idToken === 'string' && body.idToken.trim()) {
		return body.idToken.trim();
	}

	return null;
}

export async function POST(request: Request) {
	let body: DummyTicketablesRequest | null = null;

	try {
		body = (await request.json()) as DummyTicketablesRequest;
	} catch {
		return NextResponse.json(
			{
				message: 'Request body must be valid JSON.'
			},
			{ status: 400 }
		);
	}

	const idToken = getIdTokenFromBody(body);

	if (!idToken) {
		return NextResponse.json(
			{
				message: 'Missing id_token in request body.'
			},
			{ status: 400 }
		);
	}

	try {
		const result = await createDummyTicketablesForIdToken(idToken);
		const status = result.errors.length === 0 ? 201 : 502;

		return NextResponse.json(
			{
				message:
					result.errors.length === 0
						? 'Created 2 dummy tickets and 2 dummy subscriptions.'
						: 'Some dummy resources were created, but one or more Unidy API requests failed.',
				user: result.user,
				created: {
					tickets: result.tickets,
					subscriptions: result.subscriptions
				},
				errors: result.errors
			},
			{ status }
		);
	} catch (error) {
		if (error instanceof Error) {
			const status =
				'status' in error && typeof error.status === 'number'
					? error.status === 401
						? 401
						: 502
					: 500;

			return NextResponse.json(
				{
					message: error.message
				},
				{ status }
			);
		}

		return NextResponse.json(
			{
				message: 'Unexpected error while creating dummy ticketables.'
			},
			{ status: 500 }
		);
	}
}
