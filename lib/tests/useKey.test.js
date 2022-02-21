import { within } from '@testing-library/dom';
import { renderHook } from '@testing-library/react-hooks';
import useKey from '../useKey';

describe('useKey', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('it returns function', () => {
		const { result } = renderHook(() => useKey());
		expect(typeof result.current).toBe('function');
	});

	test('it returns simple keys for value types', () => {
		const { result } = renderHook(() => useKey());
		const keyString = result.current('test');
		expect(keyString).toBe('key-test');
		const keyBool = result.current(true);
		expect(keyBool).toBe('key-true');
		const keyNumber = result.current(1);
		expect(keyNumber).toBe('key-1');
	});

	test('it returns stable keys for objects', () => {
		const { result } = renderHook(() => useKey());
		const object = {
			test: 'test'
		};

		const key1 = result.current(object);
		const key2 = result.current(object);

		expect(key1).toBe(key2);
	});

	test('it returns stable keys for functions', () => {
		const { result } = renderHook(() => useKey());
		const func = () => {};

		const key1 = result.current(func);
		const key2 = result.current(func);

		expect(key1).toBe(key2);
	});

	test('it returns different keys for different objects', () => {
		const { result } = renderHook(() => useKey());
		const object1 = {
			test: 'test'
		};
		const object2 = {
			test: 'test'
		};

		const key1 = result.current(object1);
		const key2 = result.current(object2);

		expect(key1).not.toBe(key2);
	});
});
