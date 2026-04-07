/* eslint-disable no-underscore-dangle */

export const isFunction = obj => typeof obj === 'function';
export const EMPTY_OBJECT = {};
export const noOp = () => EMPTY_OBJECT;

// object keys
/// /----------------------------------------------------------------------------------------
let keySeed = 2e9;
const keysMap = new WeakMap();
export const key = object => {
	let result = keysMap.get(object);
	if (!result) {
		result = (keySeed++).toString(36);
		keysMap.set(object, result);
	}
	return result;
};
export const backTrackKey = object => {
	let clone;
	if (object instanceof Set) {
		clone = new Set([...object]);
	} else {
		const objIsArray = Array.isArray(object);
		clone = objIsArray ? [...object] : { ...object };
		if (objIsArray && object.message) {
			clone.message = object.message;
			clone.type = object.type;
		}
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
export const extractPath = path => {
	if (!path) {
		return [];
	}

	let cached = _splitCache.get(path);
	if (!cached) {
		cached = path
			.replace(_splitRegEx, '.$1')
			.split('.')
			// detect possible numbers, parse and store in cached array
			.map(pathPart => (+pathPart - +pathPart < 1 ? +pathPart : pathPart));
		_splitCache.set(path, cached);
	}
	return cached;
};
export const resetSplitCache = () => {
	_splitCache = new Map();
};
// helper functions
/// /----------------------------------------------------------------------------------------
export const getNested = (fullPath, source) => {
	let current = source;
	const pathArray = Array.isArray(fullPath) ? fullPath : extractPath(fullPath);
	for (let i = 0; i < pathArray.length; i += 1) {
		if (current === undefined) {
			return undefined;
		}
		current = current[pathArray[i]];
	}
	return current;
};

export const setNested = (fullPath, target, value) => {
	const pathArray = extractPath(fullPath);
	const { length } = pathArray;
	if (length === 0) {
		return target;
	}
	const clonedTarget = { ...target };
	let current = clonedTarget;
	for (let i = 0; i < length - 1; i += 1) {
		const path = pathArray[i];
		const idx = pathArray[i + 1];
		const hasNextProperty = current[path] !== undefined;
		const isIndexANumber = +idx - +idx < 1;
		// motivation for nested-ternary: not to create empty array/object if not needed
		// eslint-disable-next-line no-nested-ternary
		current[path] = hasNextProperty ? backTrackKey(current[path]) : isIndexANumber ? [] : {};
		if (isIndexANumber) {
			current[path][idx] = current[path][idx] === undefined ? {} : backTrackKey(current[path][idx]);
		}
		current = current[path];
	}
	current[pathArray[length - 1]] = value;
	return clonedTarget;
};

const _deleteNested = (fullPath, target) => {
	const { length } = fullPath;
	if (length === 0 || target === undefined) {
		return;
	}
	let current = target;
	for (let i = 0; i < length - 1; i += 1) {
		current = current[fullPath[i]];
		if (current === undefined) {
			return;
		}
	}
	delete current[fullPath[length - 1]];
};

export const isEmptyObjectOrFalsy = item => Object.keys(item || EMPTY_OBJECT).length === 0;

// removes all entries to the root of the object
export const deleteNestedToRoot = (fullPath, target) => {
	const clonedTarget = { ...target };
	const pathArray = extractPath(fullPath);
	_deleteNested(pathArray, clonedTarget);
	// make array of paths to the root of the object, starting from deepest one
	const pathsToRoot = pathArray.map((part, idx) => (idx === 0 ? [...pathArray] : [...pathArray].slice(0, -1 * idx)));
	// delete paths from deepest to shallowest
	pathsToRoot.forEach(path => {
		const value = getNested(path, clonedTarget);
		if (value !== undefined) {
			if (Array.isArray(value)) {
				// check if array is empty (no items) or each of them is undefined/empty
				// and if it has combined error, e.g. message prop
				if ((value.length === 0 || value.every(isEmptyObjectOrFalsy)) && !value.message) {
					_deleteNested(path, clonedTarget);
				}
			} // check if object is empty, delete it
			else if (isEmptyObjectOrFalsy(value)) {
				_deleteNested(path, clonedTarget);
			}
		}
	});
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
			return +parsed - +parsed < 1 ? +parsed : undefined;
		}
		case 'file':
			return multiple ? files : files.item(0);
		case 'select-multiple':
			return [...options].filter(o => o.selected).map(o => o.value);
		default:
			return value;
	}
};

// swaps 2 elements in array and returns new awway
export const swap = (arr, idx1, idx2) => {
	const newArr = [...arr];
	[newArr[idx1], newArr[idx2]] = [newArr[idx2], newArr[idx1]];
	return newArr;
};

// inserts item at index and returns new array
export const insert = (arr, index, item) => {
	const newArr = [...arr];
	newArr.splice(index, 0, item);
	return newArr;
};

// call this based on specificity: className of element, general classNameError, error
// (className, classNameError, error)
export const getErrorClassName = (...args) => {
	return args
		.filter(x => !!x)
		.map(error => `${error.type ? `error-${error.type}` : error}`)
		.join(' ');
};
