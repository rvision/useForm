import { renderHook } from '@testing-library/react-hooks';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';

const functions = new Map();
const useStableRef = (callback) => {
  const [stableCallback] = useState(() => (...args) => functions.get(stableCallback)(...args));
  functions.set(stableCallback, callback);
  return stableCallback;
};

describe('useStableRef', () => {
	it('should return a function', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useStableRef(callback));
		expect(result.current).toBeInstanceOf(Function);
	});

	it('should return the same reference across re-renders', () => {
		const callback = vi.fn();
		const { result, rerender } = renderHook(() => useStableRef(callback));

		const firstRef = result.current;
		rerender();
		rerender();
		rerender();
		expect(result.current).toBe(firstRef);
	});

	it('should return the same reference when callback identity changes', () => {
		let cb = vi.fn();
		const { result, rerender } = renderHook(({ fn }) => useStableRef(fn), {
			initialProps: { fn: cb },
		});

		const firstRef = result.current;
		cb = vi.fn();
		rerender({ fn: cb });
		expect(result.current).toBe(firstRef);
	});

	it('should invoke the current callback, not the initial one', () => {
		const first = vi.fn();
		const second = vi.fn();
		const { result, rerender } = renderHook(({ fn }) => useStableRef(fn), {
			initialProps: { fn: first },
		});

		result.current();
		expect(first).toHaveBeenCalledTimes(1);
		first.mockReset();

		rerender({ fn: second });
		result.current();

		expect(first).toHaveBeenCalledTimes(0);
		expect(second).toHaveBeenCalledTimes(1);
	});

	it('should forward arguments to the callback', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useStableRef(callback));

		result.current('a', 2, { key: 'value' });
		expect(callback).toHaveBeenCalledWith('a', 2, { key: 'value' });
	});

	it('should forward the return value from the callback', () => {
		const callback = vi.fn(() => 42);
		const { result } = renderHook(() => useStableRef(callback));

		expect(result.current()).toBe(42);
	});

	it('should call the latest callback after multiple rapid re-renders', () => {
		const callbacks = Array.from({ length: 5 }, () => vi.fn());
		const { result, rerender } = renderHook(({ fn }) => useStableRef(fn), {
			initialProps: { fn: callbacks[0] },
		});

		for (let i = 1; i < callbacks.length; i++) {
			rerender({ fn: callbacks[i] });
		}

		result.current();
		for (let i = 0; i < callbacks.length - 1; i++) {
			expect(callbacks[i]).not.toHaveBeenCalled();
		}
		expect(callbacks[callbacks.length - 1]).toHaveBeenCalledTimes(1);
	});

	it('should propagate errors thrown by the callback', () => {
		const error = new Error('test error');
		const callback = vi.fn(() => { throw error; });
		const { result } = renderHook(() => useStableRef(callback));

		expect(() => result.current()).toThrow(error);
	});

	it('should work when callback is called with no arguments', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useStableRef(callback));

		result.current();
		expect(callback).toHaveBeenCalledWith();
	});

	it('should handle async callbacks', async () => {
		const callback = vi.fn(async (x) => x * 2);
		const { result } = renderHook(() => useStableRef(callback));

		const val = await result.current(5);
		expect(val).toBe(10);
		expect(callback).toHaveBeenCalledWith(5);
	});

	it('should maintain stable reference when used as a dependency in effects', () => {
		const effectRuns = vi.fn();
		const callback = vi.fn();

		const { rerender } = renderHook(({ fn }) => {
			const stable = useStableRef(fn);
			effectRuns(stable);
			return stable;
		}, { initialProps: { fn: callback } });

		rerender({ fn: vi.fn() });
		rerender({ fn: vi.fn() });

		// All calls should receive the same stable reference
		const refs = effectRuns.mock.calls.map(c => c[0]);
		expect(new Set(refs).size).toBe(1);
	});
});
