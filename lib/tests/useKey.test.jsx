import { renderHook } from '@testing-library/react-hooks';
import { describe, expect, it } from 'vitest';
import useKey from '../useKey';

describe('useKey', () => {
	it('returns hook', () => {
		const { result } = renderHook(() => useKey());
		expect(typeof result.current).toBe('function');
	});

	it('returns simple keys for value types', () => {
		const { result } = renderHook(() => useKey());
		const keyString = result.current('test');
		expect(keyString).toBe('key-test');
		const keyBool = result.current(true);
		expect(keyBool).toBe('key-true');
		const keyNumber = result.current(1);
		expect(keyNumber).toBe('key-1');
	});

	it('returns same keys for same object', () => {
		const { result } = renderHook(() => useKey());
		const object = {
			test: 'test',
		};

		const key1 = result.current(object);
		const key2 = result.current(object);

		expect(key1).toBe(key2);
	});

	it('returns same keys for same function', () => {
		const { result } = renderHook(() => useKey());
		const func = () => {};

		const key1 = result.current(func);
		const key2 = result.current(func);

		expect(key1).toBe(key2);
	});

	it('returns different keys for different objects', () => {
		const { result } = renderHook(() => useKey());
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
