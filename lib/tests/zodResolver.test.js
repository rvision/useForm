/* eslint-disable no-underscore-dangle */
import { describe, expect, it } from 'vitest';
import zodResolver from "../zodResolver";

describe('zodResolver', () => {
	it('should return an empty object when the form values are valid', () => {
		const schema = {
			safeParse: () => ({ success: true }),
		};
		const formValues = {};
		const errors = zodResolver(schema)(formValues);
		expect(errors).to.deep.equal({});
	});

	it('should return an object with the error message and type when the form values are invalid', () => {
		const schema = {
			safeParse: () => ({
				success: false,
				error: {
					errors: [
						{
							path: ['name'],
							message: 'Name is required',
							type: 'required',
						},
					],
				},
			}),
		};
		const formValues = {};
		const errors = zodResolver(schema)(formValues);
		expect(errors).to.deep.equal({
			name: {
				message: 'Name is required',
				type: 'required',
			},
		});
	});
});
