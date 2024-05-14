// import { within } from '@testing-library/dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TestForm from './components/TestForm';
import defaultValues from './components/defaultValues';

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
	it('select: change value', () => {
		let formData = null;
		const onSubmit = vi.fn(data => {
			formData = data;
		});
		render(<TestForm onFormSubmit={onSubmit} />);

		// NOTE: userEvent does not work
		fireEvent.change(screen.getByTestId('title'), { target: { value: 'Mr' } });
		fireEvent.clickSubmit();
		expect(onSubmit).toBeCalledTimes(1);

		expect(formData).toHaveProperty('title', 'Mr');
	});

	it('type="text": change value', () => {
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

	it('type="text": validation error', () => {
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

	it('type="text": validation error then changed to valid', () => {
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

	it('type="checkbox": change value', () => {
		let formData = null;
		const onSubmit = vi.fn(data => {
			formData = data;
		});
		render(<TestForm onFormSubmit={onSubmit} />);

		const input = screen.getByText(/yes i would recommend this artist/i);
		fireEvent.click(input);
		fireEvent.clickSubmit();
		expect(onSubmit).toBeCalledTimes(1);
		expect(formData).toHaveProperty('checkbox', true);
	});

	it('type="radio": change value', () => {
		let formData = null;
		const onSubmit = vi.fn(data => {
			formData = data;
		});
		render(<TestForm onFormSubmit={onSubmit} />);

		fireEvent.click(screen.getByTestId('radio-1'));
		fireEvent.clickSubmit();
		expect(onSubmit).toBeCalledTimes(1);
		expect(formData).toHaveProperty('radio', '1');
	});

	it('textarea: change value', () => {
		let formData = null;
		const onSubmit = vi.fn(data => {
			formData = data;
		});
		render(<TestForm onFormSubmit={onSubmit} />);

		fireEvent.change(
			screen.getByRole('textbox', {
				name: /notes/i,
			}),
			targetValue('this is a note'),
		);
		fireEvent.clickSubmit();
		expect(onSubmit).toBeCalledTimes(1);
		expect(formData).toHaveProperty('notes', 'this is a note');
	});

	it('checkboxes array: change value', () => {
		let formData = null;
		const onSubmit = vi.fn(data => {
			formData = data;
		});
		render(<TestForm onFormSubmit={onSubmit} />);

		fireEvent.click(screen.getByTestId('occupation-nutcase'));
		fireEvent.click(screen.getByTestId('occupation-hedonist'));
		fireEvent.clickSubmit();
		expect(onSubmit).toBeCalledTimes(1);
		expect(formData.occupation).toEqual(['actress', 'singer', 'nutcase', 'hedonist']);
	});

	// TODO:
	// https://www.google.com/search?q=testing-library+set+date+in+%22ReactDatePicker%22&rlz=1C1GCEU_enRS929RS929&ei=ZWkIZOqyEMCkptQPxNGE2AI&ved=0ahUKEwiq-dXRlcz9AhVAkokEHcQoASsQ4dUDCBE&uact=5&oq=testing-library+set+date+in+%22ReactDatePicker%22&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIFCCEQqwI6CggAEEcQ1gQQsANKBAhBGABQ6wlY6wxgyg5oAXABeACAAeYBiAHmAZIBAzItMZgBAKABAcgBCMABAQ&sclient=gws-wiz-serp
	// https://stackoverflow.com/questions/67659781/react-testing-unable-to-detect-datepicker-field-to-initiate-change
	// it('array: add new album', () => {
	// 	let formData = null;
	// 	const onSubmit = vi.fn(data => {
	// 		formData = data;
	// 	});
	// 	render(<TestForm onFormSubmit={onSubmit} />);

	// 	fireEvent.click(screen.getByTestId('button-add_new_album'));

	// 	fireEvent.change(screen.getByTestId('albums.1.name'), targetValue('new album name'));
	// 	fireEvent.change(screen.getByTestId('albums.1.releaseDate'), targetValue(new Date('1980-05-09')));

	// 	fireEvent.clickSubmit();
	// 	expect(onSubmit).toBeCalledTimes(1);
	// 	expect(formData.albums).toEqual([{ name: 'Warm Leatherette', releaseDate: new Date('1980-05-09') }]);
	// });

	it('slider: change value', () => {
		let formData = null;
		const onSubmit = vi.fn(data => {
			formData = data;
		});
		render(<TestForm onFormSubmit={onSubmit} />);

		fireEvent.change(screen.getByTestId('movies[0].metaCritic'), targetValue(66));
		fireEvent.clickSubmit();
		expect(onSubmit).toBeCalledTimes(1);

		const movie = {
			...defaultValues.movies[0],
			metaCritic: 66,
		};

		expect(formData.movies[0]).toEqual(movie);
	});

	it('form: reset', () => {
		let formData = null;
		const onSubmit = vi.fn(data => {
			formData = data;
		});
		render(<TestForm onFormSubmit={onSubmit} />);

		const { firstName } = defaultValues;

		const input = screen.getByRole('textbox', { name: /first name/i });
		fireEvent.change(input, targetValue('other name'));
		fireEvent.clickSubmit();

		expect(defaultValues.firstName).toEqual(firstName);

		fireEvent.click(
			screen.getByRole('button', {
				name: /reset/i,
			}),
		);
		fireEvent.clickSubmit();
		expect(formData).toHaveProperty('firstName', firstName);
	});
});
