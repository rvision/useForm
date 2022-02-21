import * as React from 'react';
import useForm, { yupResolver } from '../useForm';

const options = [
	{ id: '1', name: '1' },
	{ id: '2', name: '2' },
	{ id: '3', name: '3' },
];

const FormAllTypes = ({ schema, model, onSubmit }) => {
	const {
		getValue,
		setValue,
		// getRef,
		setRef,
		// onBlur,
		onChange,
		register,
		// trigger,
		handleSubmit,
		key,
		// prepend,
		append,
		swap,
		remove,
		hasError,
		setErrors,
		// clearError,
		Error,
		Errors,
		reset,
		formState: { isDirty, isValid, isTouched, errors },
	} = useForm({
		defaultValues: model,
		resolver: yupResolver(schema),

		mode: 'onSubmit',
		// mode: 'onBlur',
		// mode: 'onChange',
		classNameError: 'is-danger',
		shouldFocusError: false,
	});

	return (
		<div>
			<label>
				Enter first name:
				<input type="text" {...register('firstName')} />
			</label>
			<label>
				Enter last name:
				<input type="text" {...register('lastName')} />
			</label>
			<label>
				Enter email:
				<input type="email" {...register('email')} />
			</label>
			<label>
				<input type="checkbox" {...register('agree')} />I agree to terms and conditions
			</label>
			<button type="submit" onClick={handleSubmit(onSubmit)}>
				Register
			</button>

			<div>
				<div>
					<h3>Form values</h3>
					<pre style={{ fontSize: '12px' }}>{JSON.stringify(getValue(), null, 4)}</pre>
				</div>
				<div>
					<h3>Validation errors</h3>
					<pre style={{ fontSize: '12px' }}>{JSON.stringify(errors, null, 4)}</pre>
				</div>
			</div>
		</div>
	);
};

export default FormAllTypes;
