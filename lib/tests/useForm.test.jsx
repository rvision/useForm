// import { within } from '@testing-library/dom';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TestForm from './components/TestForm';

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

const targetValue = value => ({ target: { value } });

let formData = null;
const onSubmit = vi.fn(data => {
	formData = data;
});

describe('useForm', () => {
	// beforeEach(() => {
	// 	render(<TestForm onFormSubmit={onSubmit} />);
	// });

	// afterEach(() => {
	// 	formData = null;
	// 	onSubmit.mockReset();
	// 	document.body.innerHTML = '';
	// 	cleanup();
	// });
	// it('select change value', () => {
	// 	let formData = null;
	// 	const onSubmit = vi.fn(data => {
	// 		formData = data;
	// 	});
	// 	render(<TestForm onFormSubmit={onSubmit} />);

	// 	const title = screen.getByRole('combobox', {
	// 		name: /title/i,
	// 	});
	// 	fireEvent.click(title);
	// 	fireEvent.clickSubmit();
	// 	expect(onSubmit).toBeCalledTimes(1);
	// 	expect(formData).toHaveProperty('firstName', 'first name test');
	// });

	it('type="text" change value', () => {
		let formData = null;
		const onSubmit = vi.fn(data => {
			formData = data;
		});
		render(<TestForm onFormSubmit={onSubmit} />);

		const input = screen.getByRole('textbox', { name: /first name/i });
		fireEvent.change(input, targetValue('first name test'));
		fireEvent.clickSubmit();
		expect(onSubmit).toBeCalledTimes(1);
		expect(formData).toHaveProperty('firstName', 'first name test');
	});

	it('type="text" validation error', () => {
		let formData = null;
		const onSubmit = vi.fn(data => {
			formData = data;
		});
		render(<TestForm onFormSubmit={onSubmit} />);

		const input = screen.getByRole('textbox', { name: /first name/i });
		fireEvent.change(input, targetValue(''));
		fireEvent.clickSubmit();
		expect(onSubmit).toBeCalledTimes(0);
		expect(screen.getByText(/⚠ please enter first name/i)).toBeTruthy();
		expect(screen.getByText('Please enter first name')).toBeTruthy();
		expect(hasErrorSummary()).toBeTruthy();
	});

	it('type="text" validation error then changed to valid', () => {
		let formData = null;
		const onSubmit = vi.fn(data => {
			formData = data;
		});
		render(<TestForm onFormSubmit={onSubmit} />);

		const input = screen.getByRole('textbox', { name: /first name/i });
		fireEvent.change(input, targetValue(''));
		fireEvent.clickSubmit();
		expect(onSubmit).toBeCalledTimes(0);
		expect(screen.getByText(/⚠ please enter first name/i)).toBeTruthy();
		expect(screen.getByText('Please enter first name')).toBeTruthy();
		expect(hasErrorSummary()).toBeTruthy();

		fireEvent.change(input, targetValue('first name test'));
		fireEvent.clickSubmit();
		expect(onSubmit).toBeCalledTimes(1);
		expect(formData).toHaveProperty('firstName', 'first name test');
	});
});
