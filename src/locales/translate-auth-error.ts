import en from '@/locales/en.json';

export const translateAuthError = (error?: string) => {
	if (!error) return error;

	const translatedError = en.errors[error as keyof typeof en.errors];

	if (typeof translatedError === 'string') {
		return translatedError;
	}

	const translatedValidationError =
		en.errors.validation[error as keyof typeof en.errors.validation];

	if (translatedValidationError) {
		return translatedValidationError;
	}

	return error;
};
