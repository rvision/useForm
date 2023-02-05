/* eslint-disable no-underscore-dangle */
import { describe, expect, it } from 'vitest';
import {
	backTrackKey,
	deleteNestedToRoot,
	EMPTY_OBJECT,
	extractPath,
	getErrorClassName,
	getInputValue,
	getNested,
	isFunction,
	key,
	noOp,
	objectKeys,
	resetSplitCache,
	setNested,
	shiftErrors,
	swap,
	toJSON,
} from '../core';

describe('deleteNested', () => {
	it('should delete a nested property but leave sibling property', () => {
		const obj = {
			a: {
				b: {
					c: 'foo',
					baz: 'bar',
				},
			},
		};
		const expected = {
			a: {
				b: {
					baz: 'bar',
				},
			},
		};
		deleteNestedToRoot('a.b.c', obj);
		expect(obj).toEqual(expected);
	});

	it('should delete a nested array property to root', () => {
		const obj = {
			a: {
				b: [
					{
						c: 'foo',
					},
				],
			},
		};
		const expected = {};
		const result = deleteNestedToRoot('a.b.0.c', obj);
		expect(result).toEqual(expected);
	});

	it('should delete a nested array property but leave sibling property', () => {
		const obj = {
			a: {
				b: [
					{
						c: 'foo',
						d: 'baz',
					},
				],
			},
		};
		const expected = {
			a: {
				b: [
					{
						d: 'baz',
					},
				],
			},
		};
		const result = deleteNestedToRoot('a.b.0.c', obj);
		expect(result).toEqual(expected);
	});
});

describe('extractPath', () => {
	it('should return an empty array when given an empty string or falsy value', () => {
		expect(extractPath('')).toEqual([]);
		expect(extractPath()).toEqual([]);
		expect(extractPath(null)).toEqual([]);
		expect(extractPath(false)).toEqual([]);
		expect(extractPath(undefined)).toEqual([]);
	});

	it('should return an array of strings when given a dot notation string', () => {
		expect(extractPath('property[index].property2')).toEqual(['property', 'index', 'property2']);
	});

	it('should return an array of strings when given a dot notation string (without brackets)', () => {
		expect(extractPath('property.index.property2')).toEqual(['property', 'index', 'property2']);
	});
});

describe('getNested', () => {
	it('should return undefined if source is undefined', () => {
		expect(getNested('foo', undefined)).toBe(undefined);
	});

	it('should return source if fullPath is empty', () => {
		const source = { foo: 'bar' };
		expect(getNested('', source)).toBe(source);
	});

	it('should return the correct value for a given path', () => {
		const source = { foo: { bar: 'baz' } };
		expect(getNested('foo.bar', source)).toBe('baz');
	});

	it('should return the array value for a given path', () => {
		const source = { foo: { bar: [0, 1, 2, 3] } };
		expect(getNested('foo.bar[3]', source)).toBe(3);
	});
});

describe('key', () => {
	it('should generate a unique key for an object', () => {
		const obj1 = {};
		const obj2 = {};
		const key1 = key(obj1);
		const key2 = key(obj2);
		expect(key1).not.toBe(key2);
	});

	it('returns same keys for same object', () => {
		const obj1 = {};
		const key1 = key(obj1);
		const key2 = key(obj1);
		expect(key1).toBe(key2);
	});
});

describe('backTrackKey', () => {
	it('should generate a clone of the object with the same key', () => {
		const obj1 = { a: 1 };
		const key1 = key(obj1);
		const clone = backTrackKey(obj1);
		const key2 = key(clone);
		expect(key1).toEqual(key2);
		expect(obj1).not.toBe(clone);
	});
});

describe('setNested', () => {
	it('should set a nested property of an object', () => {
		const obj = { a: { b: { c: 1 } } };
		const expected = { a: { b: { c: 2 } } };
		const result = setNested('a.b.c', obj, 2);
		expect(result).toEqual(expected);
	});

	it('should set a nested property of an array', () => {
		const obj = { a: { b: [1, 2, 3] } };
		const expected = { a: { b: [1, { foo: 'test' }, 3] } };
		const result = setNested('a.b[1].foo', obj, 'test');
		expect(result).toEqual(expected);
	});
});

describe('swap', () => {
	it('should swap two elements in an array (edges)', () => {
		const arr = [1, 2, 3, 4];
		const idx1 = 0;
		const idx2 = 3;
		const expected = [4, 2, 3, 1];
		const result = swap(arr, idx1, idx2);
		expect(result).toEqual(expected);
	});

	it('should swap two elements in an array (middle)', () => {
		const arr = [1, 2, 3, 4];
		const idx1 = 1;
		const idx2 = 2;
		const expected = [1, 3, 2, 4];
		const result = swap(arr, idx1, idx2);
		expect(result).toEqual(expected);
	});
});

describe('getErrorClassName', () => {
	it('should return a string with the classNameError and the error type', () => {
		const errorObject = { type: 'required' };
		const classNameError = 'error';
		const className = 'input';
		const expected = 'input error error-required';
		const result = getErrorClassName(errorObject, classNameError, className);
		expect(result).toBe(expected);
	});

	it('should return the correct class name when no type is provided', () => {
		const errorObject = {};
		const classNameError = 'error';
		const className = 'input';
		const expected = 'input error';
		const result = getErrorClassName(errorObject, classNameError, className);
		expect(result).toBe(expected);
	});

	it('should return the correct className when classNameError is empty', () => {
		const errorObject = { type: 'required' };
		const classNameError = undefined;
		const className = 'input';
		const expected = 'input  error-required';
		const result = getErrorClassName(errorObject, classNameError, className);
		expect(result).toBe(expected);
	});
});

describe('getInputValue', () => {
	it('should return value for checkbox type', () => {
		const e = {
			target: {
				type: 'checkbox',
				checked: true,
			},
		};
		expect(getInputValue(e)).toBe(true);
	});

	it('should return value for range type', () => {
		const e = {
			target: {
				type: 'range',
				valueAsNumber: 10,
			},
		};
		expect(getInputValue(e)).toBe(10);
	});

	it('should return value for date type', () => {
		const e = {
			target: {
				type: 'date',
				valueAsDate: new Date(),
			},
		};
		expect(getInputValue(e)).toBeInstanceOf(Date);
	});

	it('should return value for number type', () => {
		const e = {
			target: {
				type: 'number',
				value: '10',
			},
		};
		expect(getInputValue(e)).toBe(10);
	});

	it('should return undefined for invalid string and null for empty string for type number', () => {
		expect(getInputValue({ target: { type: 'number', value: '' } })).toBe(null);
		expect(getInputValue({ target: { type: 'number', value: 'invalid' } })).toBe(undefined);
	});

	it('should return value for file type', () => {
		const e = {
			target: {
				type: 'file',
				multiple: false,
				files: {
					item: () => 'file',
				},
			},
		};
		expect(getInputValue(e)).toBe('file');
	});

	it('should return value for select-multiple type', () => {
		const e = {
			target: {
				type: 'select-multiple',
				options: [
					{
						selected: true,
						value: 'value1',
					},
					{
						selected: false,
						value: 'value2',
					},
					{
						selected: true,
						value: 'value3',
					},
				],
			},
		};
		expect(getInputValue(e)).toEqual(['value1', 'value3']);
	});

	it('should return value for other types', () => {
		const e = {
			target: {
				type: 'text',
				value: 'value',
			},
		};
		expect(getInputValue(e)).toBe('value');
	});
});