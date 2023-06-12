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
	if (cached) {
		return cached;
	}

	cached = path
		.replace(_splitRegEx, '.$1')
		.split('.')
		// detect possible numbers, parse and store in cached array
		.map(pathPart => (!isNaN(parseInt(pathPart, 10)) ? +pathPart : pathPart));

	_splitCache.set(path, cached);
	return cached;
};
export const resetSplitCache = () => {
	_splitCache = new Map();
};
// helper functions
/// /----------------------------------------------------------------------------------------
const _getNested = (fullPath, source) => {
	if (source === undefined) {
		return undefined;
	}
	if (fullPath.length === 0) {
		return source;
	}
	return _getNested(fullPath.slice(1), source[fullPath[0]]);
};

export const getNested = (fullPath, source) => _getNested(extractPath(fullPath), source);

const _setNested = (fullPath, target, value) => {
	const { length } = fullPath;
	if (length === 0) {
		return;
	}
	const path = fullPath[0];
	if (length === 1) {
		target[path] = value;
		return;
	}
	const hasNextProperty = target[path] !== undefined;
	const idx = fullPath[1];
	const isIndexANumber = !isNaN(idx);
	// motivation for nested-ternary: not to create empty array/object if not needed
	// eslint-disable-next-line no-nested-ternary
	target[path] = hasNextProperty ? backTrackKey(target[path]) : isIndexANumber ? [] : {};
	if (isIndexANumber) {
		target[path][idx] = target[path][idx] === undefined ? {} : backTrackKey(target[path][idx]);
	}
	_setNested(fullPath.slice(1), target[path], value);
};

export const setNested = (fullPath, target, value) => {
	const clonedTarget = { ...target };
	_setNested(extractPath(fullPath), clonedTarget, value);
	return clonedTarget;
};

const _deleteNested = (fullPath, target) => {
	const { length } = fullPath;
	if (length === 0 || target === undefined) {
		return;
	}
	const path = fullPath[0];
	if (length === 1) {
		delete target[path];
		return;
	}
	_deleteNested(fullPath.slice(1), target[path]);
};

export const isEmptyObjectOrFalsy = item => Object.keys(item || EMPTY_OBJECT).length === 0;

// removes all entries to the root of the object
const _deleteNestedToRoot = (fullPath, target) => {
	_deleteNested(fullPath, target);
	// make array of paths to the root of the object, starting from deepest one
	const pathsToRoot = fullPath.map((part, idx) => (idx === 0 ? [...fullPath] : [...fullPath].slice(0, -1 * idx)));
	// delete paths from deepest to shallowest
	pathsToRoot.forEach(path => {
		const value = _getNested(path, target);
		if (value !== undefined) {
			if (Array.isArray(value)) {
				// check if array is empty (no items) or each of them is undefined/empty
				// and if it has combined error, e.g. message prop
				if ((value.length === 0 || value.every(isEmptyObjectOrFalsy)) && !value.message) {
					_deleteNested(path, target);
				}
			} // check if object is empty, delete it
			else if (isEmptyObjectOrFalsy(value)) {
				_deleteNested(path, target);
			}
		}
	});
};

export const deleteNestedToRoot = (fullPath, target) => {
	const clonedTarget = { ...target };
	_deleteNestedToRoot(extractPath(fullPath), clonedTarget);
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
			return !isNaN(parsed) ? +parsed : undefined;
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
	if (Array.isArray(arr)) {
		const newArr = [...arr];
		while (newArr.length < idx1 || newArr.length < idx2) {
			newArr.length++;
		}
		[newArr[idx1], newArr[idx2]] = [newArr[idx2], newArr[idx1]];
		return newArr;
	}
	return arr;
};

export const getErrorClassName = (errorObject, classNameError, className) =>
	`${className || ''} ${classNameError || ''} ${errorObject.type ? `error-${errorObject.type}` : ''}`.trim();
