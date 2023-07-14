// import { within } from '@testing-library/dom';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as yup from 'yup';
import UnitTestForm from './UnitTestForm';

// import {fireEvent, render, screen, waitFor} from '@testing-library/react';
// import Accordion from './Accordion';
// import "@testing-library/jest-dom";
// import { act } from 'react-dom/test-utils';

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

describe('useForm array operations', () => {
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

	/*
	doesn't work
	it('test', () => {
		let formData = null;
		const onSubmit = vi.fn(data => {
			formData = data;
		});

		render(<UnitTestForm onFormSubmit={onSubmit} defaultValues={defaultValues} schema={schema} />);

		act(() => {
			fireEvent.click(screen.getByTestId('button-prepend_new_album'));
			fireEvent.clickSubmit();

			// fireEvent.click(screen.getByTestId('button-prepend_new_album'));
			// fireEvent.click(screen.getByTestId('button-prepend_new_album'));

			// fireEvent.click(screen.getByTestId('button-swap_albums'));
		});

		act(() => {
			fireEvent.click(screen.getByTestId('button-prepend_new_album'));
			fireEvent.click(screen.getByTestId('button-prepend_new_album'));

			fireEvent.click(screen.getByTestId('button-swap_albums'));
		});

		// fireEvent.clickSubmit();

		// });
		// fireEvent.change(screen.getByTestId('title'), { target: { value: 'Mr' } });

		// const input = screen.getByRole('textbox', { name: /first name/i });
		// fireEvent.change(input, targetValue(''));

		expect(onSubmit).toBeCalledTimes(0);
		// expect(screen.getByText(/⚠ please enter first name/i)).toBeTruthy();
		// expect(screen.getByText('Max 2 albums')).toBeTruthy();
		expect(screen.getByText("Album's release date is required")).toBeTruthy();
		expect(hasErrorSummary()).toBeTruthy();

		// fireEvent.change(input, targetValue('first name test'));
		// fireEvent.clickSubmit();
		// expect(onSubmit).toBeCalledTimes(1);
		// expect(formData).toHaveProperty('firstName', 'first name test');
	}); */
});
