// import { within } from '@testing-library/dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as yup from 'yup';
import useForm from '../../useForm';
import UnitTestForm from './UnitTestForm';
// import {fireEvent, render, screen, waitFor} from '@testing-library/react';
// import Accordion from './Accordion';
// import "@testing-library/jest-dom";

// test('composed of non-numbers to throw error', () => {
// 	expect(() => numberToCurrency('abc')).toThrow()
//   })

// expect(invoice).toHaveProperty('items[0].type', 'apples')
//   expect(invoice).toHaveProperty(['P.O'], '12345')

// expect(() => getFruitStock('pineapples')).toThrowError(
//     /^Pineapples is not good for people with diabetes$/,
//   )

// const mockFn = vi.fn(apples => apples + 1);
// mockFn.mock.calls[0][0] === 0 // true

fireEvent.clickSubmit = () => fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

const hasErrorSummary = () => screen.getByRole('errors-summary');
// screen.getByRole('heading', {
// 	name: /your form has some errors:/i,
// });

// const targetValue = value => ({ target: { value } });

// let formData = null;
// const onSubmit = vi.fn(data => {
// 	formData = data;
// });

const schema = yup.object().shape({
	albums: yup
		.array()
		.ensure()
		.min(1, 'Please enter at least 1 album')
		.max(2, 'Max 2 albums')
		.of(
			yup.object().shape({
				name: yup.string().required('Please enter album name'),
				releaseDate: yup.date().nullable().required("Album's release date is required").typeError('Invalid format'),
			}),
		),
});

const defaultValues = {
	albums: [],
};

describe('useForm array validations', () => {
	// beforeEach(() => {
	// 	render(<TestForm onFormSubmit={onSubmit} />);
	// });

	// afterEach(() => {
	// 	formData = null;
	// 	onSubmit.mockReset();
	// 	document.body.innerHTML = '';
	// 	cleanup();
	// });
	it('cannot submit empty albums array', () => {
		const onSubmit = vi.fn();
		render(<UnitTestForm onFormSubmit={onSubmit} defaultValues={defaultValues} schema={schema} />);
		fireEvent.clickSubmit();
		expect(onSubmit).toBeCalledTimes(0);
		expect(screen.getByText('Please enter at least 1 album')).toBeTruthy();
		expect(hasErrorSummary()).toBeTruthy();
	});

	it('cannot submit more than 2 albums', () => {
		const onSubmit = vi.fn();
		render(<UnitTestForm onFormSubmit={onSubmit} defaultValues={defaultValues} schema={schema} />);
		fireEvent.click(screen.getByTestId('button-prepend_new_album'));
		fireEvent.click(screen.getByTestId('button-prepend_new_album'));
		fireEvent.click(screen.getByTestId('button-prepend_new_album'));

		fireEvent.clickSubmit();
		expect(onSubmit).toBeCalledTimes(0);
		expect(screen.getByText('Max 2 albums')).toBeTruthy();
		expect(hasErrorSummary()).toBeTruthy();
	});
});

describe('useForm: array operations', () => {
	const defaultValues = {
		name: 'John Doe',
		age: 30,
		isMarried: false,
		occupations: ['actor', 'singer'],
	};

	it('should insert an item to the array', () => {
		const { result } = renderHook(() => useForm({ defaultValues }));
		const { array } = result.current;

		act(() => {
			array.insert('occupations', 0, 'dancer');
		});

		const { formState, getValue } = result.current;
		expect(getValue('occupations')).toEqual(['dancer', 'actor', 'singer']);
	});

	it('should append an item to the array', () => {
		const { result } = renderHook(() => useForm({ defaultValues }));
		const { array } = result.current;

		act(() => {
			array.append('occupations', 'dancer');
		});

		const { formState, getValue } = result.current;
		expect(getValue('occupations')).toEqual(['actor', 'singer', 'dancer']);
	});

	it('should prepend an item to the array', () => {
		const { result } = renderHook(() => useForm({ defaultValues }));
		const { array } = result.current;

		act(() => {
			array.prepend('occupations', 'dancer');
		});

		const { formState, getValue } = result.current;
		expect(getValue('occupations')).toEqual(['dancer', 'actor', 'singer']);
	});

	it('should remove an item from the array', () => {
		const { result } = renderHook(() => useForm({ defaultValues }));
		const { array } = result.current;

		act(() => {
			array.remove('occupations', 1);
		});

		const { formState, getValue } = result.current;
		expect(getValue('occupations')).toEqual(['actor']);
	});

	it('should swap items in the array', () => {
		const { result } = renderHook(() => useForm({ defaultValues }));
		const { array } = result.current;

		act(() => {
			array.swap('occupations', 0, 1);
		});

		const { formState, getValue } = result.current;
		expect(getValue('occupations')).toEqual(['singer', 'actor']);
	});

	it('should update an item in the array', () => {
		const { result } = renderHook(() => useForm({ defaultValues }));
		const { setValue } = result.current;

		act(() => {
			setValue('occupations[0]', 'comedian');
		});

		const { formState, getValue } = result.current;
		expect(getValue('occupations')).toEqual(['comedian', 'singer']);
	});

	it('should reset the array to its initial value', () => {
		const { result } = renderHook(() => useForm({ defaultValues }));
		const { setValue, formState } = result.current;

		act(() => {
			setValue('occupations', ['actor', 'dancer']);
			formState.reset();
		});

		const { getValue } = result.current;
		expect(getValue('occupations')).toEqual(defaultValues.occupations);
	});
});
