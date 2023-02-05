/* eslint-disable no-underscore-dangle */

// make aliases for better minification
/// /----------------------------------------------------------------------------------------
const isNumber = num => !Number.isNaN(num);
const parseI = num => parseInt(num, 10);
export const isFunction = obj => typeof obj === 'function';
export const { isArray } = Array;
export const toJSON = obj => JSON.stringify(obj, (key, value) => (value instanceof Set ? [...value] : value));
export const objectKeys = Object.keys;
export const EMPTY_OBJECT = {};
export const noOp = () => EMPTY_OBJECT;

// object keys
/// /----------------------------------------------------------------------------------------
let keySeed = 9999;
const keysMap = new WeakMap();
export const key = object => {
	let result = keysMap.get(object);
	if (!result) {
		result = (++keySeed)
			.toString(36)
			.split('')
			.reduce((reversed, character) => character + reversed, '');
		keysMap.set(object, result);
	}
	return result;
};
export const backTrackKey = object => {
	let clone;
	if (object instanceof Set) {
		clone = new Set([...object]);
	} else {
		clone = isArray(object) ? [...object] : { ...object };
	}

	if (keysMap.has(object)) {
		keysMap.set(clone, keysMap.get(object));
		keysMap.delete(object);
	}
	return clone;
};

// cache fullpath strings to arrays
/// /----------------------------------------------------------------------------------------
const _splitRegEx = /\[([^\]]+)\]/g;
let _splitCache = new Map();
export const extractPath = string => {
	if (!string) {
		return [];
	}

	let cached = _splitCache.get(string);
	if (cached) {
		return cached;
	}

	cached = string.replace(_splitRegEx, '.$1').split('.');
	_splitCache.set(string, cached);
	return cached;
};
export const resetSplitCache = () => {
	_splitCache = new Map();
};
// helper functions
/// /----------------------------------------------------------------------------------------
const __getNested = (fullPath, source) => {
	if (source === undefined) {
		return undefined;
	}

	if (fullPath.length === 0) {
		return source;
	}

	return __getNested(fullPath.slice(1), source[fullPath[0]]);
};

export const getNested = (fullPath, source) => __getNested(extractPath(fullPath), source);

const __setNested = (fullPath, target, value) => {
	const { length } = fullPath;
	if (length > 0) {
		// reached end of the tree
		const path = fullPath[0];
		if (length === 1) {
			target[path] = value;
			return;
		}

		const hasTargetProperty = target[path] === undefined;
		const idx = parseI(fullPath[1]);

		if (isNumber(idx)) {
			target[path] = hasTargetProperty ? [] : backTrackKey(target[path]);
			target[path][idx] = target[path][idx] === undefined ? {} : backTrackKey(target[path][idx]);
			return __setNested(fullPath.slice(2), target[path][idx], value);
		}

		target[path] = hasTargetProperty ? {} : backTrackKey(target[path]);
		__setNested(fullPath.slice(1), target[path], value);
	}
};

export const setNested = (fullPath, target, value) => {
	const clonedTarget = { ...target };
	__setNested(extractPath(fullPath), clonedTarget, value);
	return clonedTarget;
};

const __deleteNested = (fullPath, target) => {
	const { length } = fullPath;
	if (length === 0 || target === undefined) {
		return;
	}

	const path = fullPath[0];
	if (length === 1) {
		delete target[path];
		return;
	}

	__deleteNested(fullPath.slice(1), target[path]);
};

const _isEmptyObjectOrFalsy = item => objectKeys(item || EMPTY_OBJECT).length === 0;

// removes all entries to the root of the object
const __deleteNestedToRoot = (fullPath, target) => {
	__deleteNested(fullPath, target);
	// make array of paths to the root of the object, starting from deepest one
	const pathsToRoot = fullPath.map((part, idx) => (idx === 0 ? [...fullPath] : [...fullPath].slice(0, -1 * idx)));
	// delete paths from deepest to shallowest
	pathsToRoot.forEach(path => {
		const value = __getNested(path, target);
		if (value !== undefined) {
			if (isArray(value)) {
				// check if array is empty (no items) or each of them is undefined/empty
				if (value.length === 0 || value.every(_isEmptyObjectOrFalsy)) {
					// keep the array if it has combined error, e.g. message prop
					if (!value.message) {
						__deleteNested(path, target);
					}
				}
			} // check if object is empty, delete it
			else if (_isEmptyObjectOrFalsy(value)) {
				__deleteNested(path, target);
			}
		}
	});
};

export const deleteNestedToRoot = (fullPath, target) => {
	const clonedTarget = { ...target };
	__deleteNestedToRoot(extractPath(fullPath), clonedTarget);
	return clonedTarget;
};

export const getInputValue = e => {
	const { value, type, checked, options, files, multiple, valueAsNumber, valueAsDate } = e.target;
	switch (type) {
		case 'checkbox':
			return checked;
		case 'range':
			return valueAsNumber;
		case 'date':
			return valueAsDate;
		case 'number': {
			// return valueAsNumber === Number.NaN ? null : valueAsNumber;
			if (value === '') {
				return null;
			}
			const parsed = Number.parseFloat(value);
			if (!isNumber(parsed)) {
				return undefined;
			}
			return parsed;
		}

		case 'file':
			return multiple ? files : files.item(0);
		case 'select-multiple':
			return [...options].filter(o => o.selected).map(o => o.value);
		default:
			return value;
	}
};

// shifts errors in array for prepend/remove operations
export const shiftErrors = (fullPath, targetErrors, callback) => {
	const errorsArray = getNested(fullPath, targetErrors);
	if (errorsArray && isArray(errorsArray)) {
		return setNested(fullPath, targetErrors, callback(errorsArray));
	}
	return targetErrors;
};

// swaps 2 elements in array and returns new awway
export const swap = (arr, idx1, idx2) => {
	if (isArray(arr)) {
		const newArr = [...arr];
		[newArr[idx1], newArr[idx2]] = [newArr[idx2], newArr[idx1]];
		return newArr;
	}
	return arr;
};

export const getErrorClassName = (errorObject, classNameError, className) =>
	`${className || ''} ${classNameError || ''} ${errorObject.type ? `error-${errorObject.type}` : ''}`.trim();