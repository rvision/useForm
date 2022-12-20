import { fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { describe, expect, it, vi } from 'vitest';
import useEvent from '../useEvent';

describe('useEvent', () => {
	it('returns hook', () => {
		const { result } = renderHook(() => useEvent());
		expect(typeof result.current).toBe('function');
	});

	it('throws error if not used in event', () => {
		const { result } = renderHook(() => useEvent(() => null));

		// TODO: fixme
		expect(!result).toBeTruthy();
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

		fireEvent.click(screen.getByText(/test/i));

		expect(clickHandler).toBeCalledTimes(2);
		expect(mutableVariable).toEqual(2);
	});
});
