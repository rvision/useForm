// import { within } from '@testing-library/dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useEvent from '../useEvent';

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

/*
describe('useEvent', () => {
	// beforeEach(() => {
	//     render(<Accordion title='Testing'><h4>Content</h4></Accordion>);
	// });
	it('returns hook', () => {
		const { result } = renderHook(() => useEvent());
		expect(typeof result.current).toBe('function');
	});

	it('throws error if not used in event', () => {
		const { result } = renderHook(() => useEvent(() => null));
		try {
			render(<div onLoad={result.current} />);
		} catch (e) {
			expect(e.message).toBe('Callback was called directly while rendering, pass it as a callback prop instead.');
		}
	});

	it('calls handler function', () => {
		let mutableVariable = 0;
		const clickHandler = vi.fn(() => mutableVariable++);
		const { result } = renderHook(() => useEvent(clickHandler));

		render(
			<button type="button" name="test" onClick={result.current}>
				test
			</button>,
		);
		fireEvent.click(screen.getByText(/test/i));

		expect(clickHandler).toBeCalledTimes(1);
		expect(mutableVariable).toEqual(1);
	});

	/*
	it('returns same keys for same object', () => {
		const { result } = renderHook(() => useEvent());
		const object = {
			test: 'test',
		};

		const key1 = result.current(object);
		const key2 = result.current(object);

		expect(key1).toBe(key2);
	});

	it('returns same keys for same function', () => {
		const { result } = renderHook(() => useEvent());
		const func = () => {};

		const key1 = result.current(func);
		const key2 = result.current(func);

		expect(key1).toBe(key2);
	});

	it('returns different keys for different objects', () => {
		const { result } = renderHook(() => useEvent());
		const object1 = {
			test: 'test1',
		};
		const object2 = {
			test: 'test2',
		};

		const key1 = result.current(object1);
		const key2 = result.current(object2);

		expect(key1).not.toBe(key2);
	});

});
*/
