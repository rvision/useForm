import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import useStableRef from '../useStableRef';

// TODO: not sure if tests are correct
describe('useStableRef', () => {
	it('should return a stable ref', () => {
		const callback = vi.fn();
		const hook = renderHook(() => useStableRef(callback), {
			initialProps: false,
		});
		const { result } = hook;
		expect(result.current).toBeInstanceOf(Function);
		result.current();
		hook.rerender(true);
		result.current();
		hook.rerender(true);
		result.current();
		hook.rerender(true);
		expect(callback).toBeCalledTimes(3);
	});

	it('should keep same reference to a function between renders', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useStableRef(callback));

		const ref = result.current;
		expect(ref).toBeInstanceOf(Function);

		act(() => {
			ref();
			ref();
			ref();
		});
		expect(callback).toHaveBeenCalledTimes(3);
	});
});
