// import { within } from '@testing-library/dom';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useForm from '../useForm';
import TestForm from './components/TestForm';
import defaultValues from './components/defaultValues';

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

const targetValue = value => ({ target: { value } });

let formData = null;
const onSubmit = vi.fn(data => {
	formData = data;
});

describe('useForm: inputs', () => {
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
});

describe('useForm: init, update, validate, reset', () => {
	const defaultValues = {
		name: 'John Doe',
		age: 30,
		isMarried: false,
	};

	it('init form with default values', () => {
		const { result } = renderHook(() => useForm({ defaultValues }));
		const { formState, getValue } = result.current;

		expect(getValue('name')).toBe('John Doe');
		expect(getValue('age')).toBe(30);
		expect(getValue('isMarried')).toBe(false);
	});

	it('update form values', () => {
		const { result } = renderHook(() => useForm({ defaultValues }));
		const { setValue } = result.current;

		act(() => {
			setValue('name', 'Jane Doe');
			setValue('age', 35);
			setValue('isMarried', true);
		});

		const { formState, getValue } = result.current;
		expect(getValue('name')).toBe('Jane Doe');
		expect(getValue('age')).toBe(35);
		expect(getValue('isMarried')).toBe(true);
	});

	it('validate form on submit', () => {
		const validate = values => {
			const errors = {};
			if (!values.name) {
				errors.name = 'Name is required';
			}
			if (values.age < 18) {
				errors.age = 'Age must be at least 18';
			}
			return errors;
		};

		const testValues = { name: '', age: 8 };
		const { result } = renderHook(() => useForm({ defaultValues: testValues, resolver: validate }));
		const { handleSubmit, getValue } = result.current;

		act(() => {
			handleSubmit(() => {})();
		});

		const { formState } = result.current;
		expect(formState.errors).toEqual({
			name: 'Name is required',
			age: 'Age must be at least 18',
		});
	});

	it('clear form error', () => {
		const validate = values => {
			const errors = {};
			if (!values.name) {
				errors.name = 'Name is required';
			}
			if (values.age < 18) {
				errors.age = 'Age must be at least 18';
			}
			return errors;
		};

		const testValues = { name: '', age: 8 };
		const { result } = renderHook(() => useForm({ defaultValues: testValues, resolver: validate }));
		const { handleSubmit, clearError } = result.current;

		act(() => {
			handleSubmit(() => {})();
		});

		act(() => {
			clearError('name');
		});

		const { formState } = result.current;
		expect(formState.errors).toEqual({
			age: 'Age must be at least 18',
		});
	});

	it('reset form values', () => {
		const { result } = renderHook(() => useForm({ defaultValues }));
		const { setValue } = result.current;

		act(() => {
			setValue('name', 'Jane Doe');
			setValue('age', 35);
			setValue('isMarried', true);
		});

		const { formState, getValue } = result.current;

		act(() => {
			formState.reset();
		});

		expect(getValue('name')).toBe(defaultValues.name);
		expect(getValue('age')).toBe(defaultValues.age);
		expect(getValue('isMarried')).toBe(defaultValues.isMarried);
	});
});

/*
describe('Error component', () => {
	const defaultValues = {
		name: 'John Doe',
		age: 30,
		isMarried: false,
	};

	it('renders error message when error exists', () => {
		const { Error } = useForm({
			defaultValues,
			resolver: () => ({ name: 'Required field' }),
		});

		const { getByText } = render(<Error for="name" />);

		expect(getByText('Required field')).toBeInTheDocument();
	});

	it('renders children function when error exists', () => {
		const { Error } = useForm({
			defaultValues,
			resolver: () => ({ name: 'Required field' }),
		});

		const childrenFn = jest.fn(error => <span>{error.message}</span>);
		const { getByText } = render(<Error for="name">{childrenFn}</Error>);

		expect(getByText('Required field')).toBeInTheDocument();
		expect(childrenFn).toHaveBeenCalledTimes(1);
	});

	it('does not render error message when no error exists', () => {
		const { Error } = useForm({
			defaultValues,
			resolver: () => ({}),
		});

		const { queryByText } = render(<Error for="name" />);

		expect(queryByText('Required field')).not.toBeInTheDocument();
	});
});*/
