import * as React from 'react';
import useForm, { yupResolver } from '../useForm';

const FormAllTypes = ({ schema, model, onSubmit }) => {
	const { register, handleSubmit } = useForm({
		defaultValues: model,
		resolver: yupResolver(schema),
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
		</div>
	);
};

export default FormAllTypes;
