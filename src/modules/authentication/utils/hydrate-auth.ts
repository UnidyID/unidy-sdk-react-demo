'use client';

import { authStorage } from '@unidy.io/sdk-react';

type AuthPayload = {
	id_token: string;
	refresh_token: string;
};

export const decodeSignInIdFromToken = (token: string) => {
	try {
		const [, payload] = token.split('.');
		if (!payload) return null;

		const decodedPayload = JSON.parse(atob(payload)) as { sid?: unknown };
		return typeof decodedPayload.sid === 'string' ? decodedPayload.sid : null;
	} catch {
		return null;
	}
};

export const hydrateAuthFromPayload = ({
	auth,
	email
}: {
	auth: AuthPayload;
	email?: string | null;
}) => {
	authStorage.setToken(auth.id_token);
	authStorage.setRefreshToken(auth.refresh_token);
	authStorage.setRecoverableStep(null);
	authStorage.setMagicCodeStep(null);

	const signInId = decodeSignInIdFromToken(auth.id_token);
	if (signInId) {
		authStorage.setSignInId(signInId);
	}

	if (email) {
		authStorage.setEmail(email);
	}
};
