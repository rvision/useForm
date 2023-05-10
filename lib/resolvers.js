import * as core from './core';

export const yupResolver = schema => formValues => {
	let errors = {};
	try {
		schema.validateSync(formValues, { abortEarly: false });
	} catch (validationError) {
		// eslint-disable-next-line no-restricted-syntax
		for (const error of validationError.inner) {
			const newOrExistingError = core.getNested(error.path, errors) || {};
			newOrExistingError.message = error.message;
			newOrExistingError.type = error.type;
			errors = core.setNested(error.path, errors, newOrExistingError);
		}
	}
	return errors;
};

export const zodResolver = schema => formValues => {
	let errors = {};
	const parsed = schema.safeParse(formValues);
	if (!parsed.success) {
		parsed.error.errors.forEach(error => {
			const path = error.path.join('.');
			const newOrExistingError = core.getNested(path, errors) || {};
			newOrExistingError.message = error.message;
			newOrExistingError.type = error.type;
			errors = core.setNested(path, errors, newOrExistingError);
		});
	}
	return errors;
};
