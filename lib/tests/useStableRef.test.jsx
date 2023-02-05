import { renderHook } from '@testing-library/react-hooks';
import { describe, expect, it, vi } from 'vitest';
import useStableRef from '../useStableRef';

describe('useStableRef', () => {
	// TODO: not sure if this test is correct
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
});
