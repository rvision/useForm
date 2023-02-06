/* eslint-disable no-underscore-dangle */
import { describe, expect, it } from 'vitest';
import { yupResolver } from '../useForm';

describe('yupResolver', () => {
	it('should return an empty object when the form values are valid', () => {
		const schema = {
			validateSync: () => {},
		};
		const formValues = {};
		const errors = yupResolver(schema)(formValues);
		expect(errors).to.deep.equal({});
	});

	it('should return an object with the error message and type when the form values are invalid', () => {
		const schema = {
			validateSync: () => {
				// eslint-disable-next-line no-throw-literal
				throw {
					inner: [
						{
							path: 'name',
							message: 'Name is required',
							type: 'required',
						},
					],
				};
			},
		};
		const formValues = {};
		const errors = yupResolver(schema)(formValues);
		expect(errors).to.deep.equal({
			name: {
				message: 'Name is required',
				type: 'required',
			},
		});
	});
});
