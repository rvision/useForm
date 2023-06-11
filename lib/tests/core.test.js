/* eslint-disable no-underscore-dangle */
import { describe, expect, it } from 'vitest';
import {
	EMPTY_OBJECT,
	backTrackKey,
	deleteNestedToRoot,
	extractPath,
	getErrorClassName,
	getInputValue,
	getNested,
	isFunction,
	key,
	noOp,
	setNested,
	swap,
} from '../core';
import { toJSON } from '../useForm';

// clone here because it is not exported
// eslint-disable-next-line no-restricted-globals
const isNumber = num => !isNaN(num);

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

	it('should return an array with number as array index (with brackets)', () => {
		expect(extractPath('property[4].property2')).toEqual(['property', 4, 'property2']);
	});

	// TODO: what to do with invalid fullPaths?
	it('should return an invalid array of strings when given a invalid dot notation (with brackets)', () => {
		expect(extractPath('property[4.property2')).toEqual(['property[4', 'property2']);
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
		expect(clone === obj1).toBe(false);
		expect(typeof obj1).toBe(typeof clone);
	});

	it('should generate a clone of the array with the same key', () => {
		const array = [1, 2, 3];
		const key1 = key(array);
		const clone = backTrackKey(array);
		const key2 = key(clone);
		expect(key1).toEqual(key2);
		expect(clone === array).toBe(false);
		expect(typeof array).toBe(typeof clone);
	});

	it('should generate a clone of the Set with the same key', () => {
		const set = new Set([1, 2, 3]);
		const key1 = key(set);
		const clone = backTrackKey(set);
		const key2 = key(clone);
		expect(key1).toEqual(key2);
		expect(clone === set).toBe(false);
		expect(typeof set).toBe(typeof clone);
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

	it('should return undefined for a given invalid path of any length', () => {
		const source = { foo: { bar: [0, 1, 2, 3] } };
		expect(getNested('foo[3].baz.bar[1]', source)).toBe(undefined);
		expect(getNested('bla.bla.bla[3].baz.bar[1]', source)).toBe(undefined);
	});
});

describe('setNested', () => {
	it('should set a nested property of an object', () => {
		const obj = { a: { b: { c: 1 } } };
		const expected = { a: { b: { c: 2 } } };
		const result = setNested('a.b.c', obj, 2);
		expect(result).toEqual(expected);
	});

	it('should return a new object when setting a property', () => {
		const obj = { a: { b: { c: 1 } } };
		const expected = { a: { b: { c: 2 } } };
		const result = setNested('a.b.c', obj, 2);
		expect(result).toEqual(expected);
		expect(result === obj).toBe(false);
	});

	it('should set a nested property of an array', () => {
		const obj = { a: { b: [1, 2, 3] } };
		const expected = { a: { b: [1, { foo: 'test' }, 3] } };
		const result = setNested('a.b[1].foo', obj, 'test');
		expect(result).toEqual(expected);
	});

	it('should return a new array and new object when setting a property in array', () => {
		const obj = { a: { b: [1, 2, 3] } };
		const expected = { a: { b: [1, { foo: 'test' }, 3] } };
		const result = setNested('a.b[1].foo', obj, 'test');
		expect(result).toEqual(expected);
		expect(result === obj).toBe(false);
		expect(getNested('a.b[1]', obj)).not.toEqual(getNested('a.b[1]', result));
	});

	it('should not set value if path is empty', () => {
		const obj = { a: { b: { c: 1 } } };
		const result = setNested('', obj, 'whatever');
		expect(result).toEqual(obj);
	});

	it('should return same object structure if value already set', () => {
		const obj = {
			a: {
				b: {
					someText1: 'Some text 1',
					someNumber1: 1,
				},
				c: [
					{ someText: 'Some text 2', someNumber: 2 },
					{ someText: 'Some text 3', someNumber: 3 },
				],
			},
			d: {
				someText4: 'Some text 4',
				someNumber4: 4,
			},
			e: [1, 2],
		};
		const result = setNested('a.b', obj, obj.a.b);
		expect(result).to.deep.equal(obj);
	});

	it('should create new objects only for modified tree branch', () => {
		const obj = {
			a: {
				b: {
					someText1: 'Some text 1',
					someNumber1: 1,
				},
				c: [
					{ someText: 'Some text 2', someNumber: 2 },
					{ someText: 'Some text 3', someNumber: 3 },
				],
			},
			d: {
				someText4: 'Some text 4',
				someNumber4: 4,
			},
		};

		const result = setNested('a.b.someNumber1', obj, 2);

		expect(result.a.b.someNumber1).to.be.equal(2);
		expect(result).to.not.equal(obj);
		expect(result.d).toEqual(obj.d);
		expect(result.a).to.not.equal(obj.a);
		expect(result.a.b).to.not.equal(obj.a.b);
		expect(result.a.c).toEqual(obj.a.c);
		expect(result.a.b.someText1).toEqual(obj.a.b.someText1);
	});

	it('should create new object if property is new', () => {
		const obj = {
			a: {
				b: {
					someText1: 'Some text 1',
					someNumber1: 1,
				},
				c: [
					{ someText: 'Some text 2', someNumber: 2 },
					{ someText: 'Some text 3', someNumber: 3 },
				],
			},
		};

		const testValue = 'booo';
		const result = setNested('a.j.k', obj, testValue);

		expect(result.a.j.k).to.be.equal(testValue);
	});

	it('should create new array if it does not exist and add object as element', () => {
		const obj = {
			a: {
				b: {
					someText1: 'Some text 1',
					someNumber1: 1,
				},
			},
		};

		const testValue = {
			foo: 'bar',
		};

		const result = setNested('a.b.array.3.foo', obj, testValue);
		expect(result.a.b.array[3].foo).toEqual(testValue);
	});

	it('should create new instance of the array if array item is modified', () => {
		const obj = {
			a: {
				b: {
					someText1: 'Some text 1',
					foo: 1,
				},
				c: [],
			},
		};
		const result = setNested('a.c.1.someNumber', obj, 10);

		expect(result.a.c).to.not.equal(obj.a.c);
		expect(result.a.c[1].someNumber).to.be.equal(10);
	});

	it('should set array object properly at any index', () => {
		const obj = {
			criterias: [
				{
					status: 'old',
					select1: 3,
					select2: 3,
				},
			],
		};
		const result = setNested('criterias.0', obj, {
			status: 'new',
			select1: 1,
			select2: 1,
		});

		expect(result.criterias[0].status).to.be.equal('new');
	});

	it('should set nested array object properly at any index', () => {
		const obj = {
			criterias: [
				{
					status: 'old',
					select1: 3,
					select2: 3,
					array: [
						{
							status: 'old',
							select1: 2,
							select2: 2,
						},
					],
				},
			],
		};
		const result = setNested('criterias.0.array.0', obj, {
			status: 'new',
			select1: 1,
			select2: 1,
		});

		expect(result.criterias[0].array[0].status).to.be.equal('new');
	});

	// NOTE: bad test, it cannot be discovered what object should be created, so instead of array, it will create new object
	// it('should set array field properly', () => {
	// 	const obj = [];
	// 	const result = setNested('0', obj, {
	// 		status: 'new',
	// 		select1: 1,
	// 		select2: 1,
	// 	});

	// 	expect(result[0].status).to.be.equal('new');
	// });
});

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

	it('should delete a nested array item to root', () => {
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
		const result = deleteNestedToRoot('a.b.0', obj);
		expect(result).toEqual(expected);
	});

	it('should not delete anything for negative invalid index given', () => {
		const obj = {
			a: {
				b: [
					{
						c: 'foo',
					},
				],
			},
		};
		const result = deleteNestedToRoot('a.b.-1', obj);
		expect(result).toEqual(obj);
	});

	it('should not delete anything for invalid index given', () => {
		const obj = {
			a: {
				b: [
					{
						c: 'foo',
					},
				],
			},
		};
		const result = deleteNestedToRoot('a.b.57', obj);
		expect(result).toEqual(obj);
	});

	it('should not delete anything for invalid path', () => {
		const obj = {
			a: {
				b: [
					{
						c: 'foo',
					},
				],
			},
		};
		const result = deleteNestedToRoot('foo.bar.whatever.a.b.57', obj);
		expect(result).toEqual(obj);
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

	it('should swap two elements in an array with invalid index', () => {
		const arr = [1];
		const idx1 = 0;
		const idx2 = 1;
		const expected = [undefined, 1];
		const result = swap(arr, idx1, idx2);
		expect(result).toEqual(expected);
	});

	it('should swap two elements in an array with invalid index (more than 1 element difference)', () => {
		const arr = [1];
		const idx1 = 0;
		const idx2 = 3;
		const expected = [undefined, undefined, undefined, 1];
		const result = swap(arr, idx1, idx2);
		expect(result).toEqual(expected);
	});
});

describe('getErrorClassName', () => {
	it('should return a string with the classNameError and the error type', () => {
		const errorObject = { type: 'required' };
		const classNameError = 'custom-error';
		const className = 'input';
		const result = getErrorClassName(errorObject, classNameError, className);
		expect(result).toBe('input custom-error error-required');
	});

	it('should return the correct class name when no type is provided', () => {
		const errorObject = {};
		const classNameError = 'error';
		const className = 'input';
		const result = getErrorClassName(errorObject, classNameError, className);
		expect(result).toBe('input error');
	});

	it('should return the correct className when classNameError is empty', () => {
		const errorObject = { type: 'required' };
		const classNameError = undefined;
		const className = 'input';
		const result = getErrorClassName(errorObject, classNameError, className);
		expect(result).toBe('input  error-required');
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

	describe('toJSON', () => {
		it('should serialize a Set correctly', () => {
			const set = new Set([1, 2, 3]);
			const serializedSet = toJSON(set);
			const classicJson = JSON.stringify(set);
			expect(serializedSet).to.equal('[1,2,3]');
			expect(classicJson).not.equal(serializedSet);
		});
	});

	describe('EMPTY_OBJECT', () => {
		it('should be empty object', () => {
			const obj = {};
			expect(EMPTY_OBJECT).toEqual(obj);
		});
	});

	describe('alias functions', () => {
		it('should detect function', () => {
			const func = () => {};
			expect(isFunction(func)).toEqual(true);
		});
	});

	describe('noOp', () => {
		it('should return empty object', () => {
			const obj = {};
			expect(noOp()).toEqual(obj);
		});
	});

	describe('isNumber', () => {
		it('valid number', () => {
			expect(isNumber(2)).toEqual(true);
		});
		it('invalid number', () => {
			expect(isNumber('test')).toEqual(false);
			expect(isNumber('warning')).toEqual(false);
		});
		it('valid float number', () => {
			const parsed = Number.parseFloat('5.6234');
			const value = isNumber(parsed) ? +parsed : undefined;
			expect(parsed).toEqual(5.6234);
			expect(value).toEqual(5.6234);
		});
		it('Number.isNaN != isNaN', () => {
			const v1 = isNaN(3.14) === Number.isNaN(3.14);
			expect(v1).toEqual(true);

			const v2 = isNaN('test') === Number.isNaN('test');
			expect(v2).toEqual(false);
		});
	});
});
