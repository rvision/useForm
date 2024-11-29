import * as core from './core';

const zodResolver = schema => formValues => {
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
export default zodResolver;