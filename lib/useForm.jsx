/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEvent from './useEvent';
import useKey from './useKey';

// NOTE: make aliases for better minification
const isNumber = num => !Number.isNaN(num);
const parseI = num => parseInt(num, 10);
const isFunction = obj => typeof obj === 'function';
const { isArray } = Array;
const toJSON = JSON.stringify;
const objectKeys = Object.keys;
const EMPTY = {};

const registerProps = {
	key: '',
	name: '',
	'aria-invalid': false,
	className: '',
	onChange: () => EMPTY,
	onBlur: () => EMPTY,
	ref: () => EMPTY,
	value: '',
	checked: false,
};

const splitRegEx = /\[([^\]]+)\]/g;
let splitCache = {};
const _extractPath = string => {
	if (!string) {
		return [];
	}
	if (splitCache[string]) {
		return splitCache[string];
	}
	const split = string.replace(splitRegEx, '.$1').split('.');
	splitCache[string] = split;
	return split;
};

const _clone = obj => {
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}

	if (obj instanceof Date) {
		return new Date(obj.getTime());
	}

	if (isArray(obj)) {
		return obj.reduce((arr, item, i) => {
			arr[i] = _clone(item);
			return arr;
		}, []);
	}

	if (obj instanceof Object) {
		return objectKeys(obj).reduce((newObj, key) => {
			newObj[key] = _clone(obj[key]);
			return newObj;
		}, {});
	}

	return obj;
};

const _getNested = (fullPath, source) => {
	if (!isArray(fullPath)) {
		return _getNested(_extractPath(fullPath), source);
	}

	if (source === undefined) {
		return undefined;
	}

	switch (fullPath.length) {
		case 0:
			return source;
		default:
			return _getNested(fullPath.slice(1), source[fullPath[0]]);
	}
};

const _setNested = (fullPath, target, value) => {
	if (!isArray(fullPath)) {
		_setNested(_extractPath(fullPath), target, value);
		return;
	}

	if (fullPath.length === 0) {
		return;
	}

	const path = fullPath[0];
	if (fullPath.length === 1) {
		target[path] = value;
		return;
	}
	const idx = parseI(fullPath[1]);
	if (isNumber(idx)) {
		// NOTE: this makes entries undefined instead of empty
		// target[path] = target[path] === undefined ? [] : [...target[path]];
		target[path] = target[path] === undefined ? [] : target[path];
		// NOTE: this line causes inputs to loose focus in .map, because key is recreated each time, it will work with stable key
		// target[path][idx] = target[path][idx] === undefined ? {} : { ...target[path][idx] };
		target[path][idx] = target[path][idx] === undefined ? {} : target[path][idx];
		if (fullPath.length === 2) {
			target[path][idx] = value;
		} else {
			_setNested(fullPath.slice(2), target[path][idx], value);
		}
	} else {
		target[path] = target[path] === undefined ? {} : { ...target[path] };
		_setNested(fullPath.slice(1), target[path], value);
	}
};

const _deleteNested = (fullPath, target) => {
	if (!isArray(fullPath)) {
		_deleteNested(_extractPath(fullPath), target);
		return;
	}

	if (fullPath.length === 0 || target === undefined) {
		return;
	}

	const path = fullPath[0];
	if (fullPath.length === 1) {
		delete target[path];
		return;
	}

	if (target[path] === undefined) {
		return;
	}

	const next = fullPath[1];
	const idx = parseI(next);
	if (isNumber(idx)) {
		if (fullPath.length === 2) {
			delete target[path][idx];
		} else {
			_deleteNested(fullPath.slice(2), target[path][idx]);
		}
	} else {
		_deleteNested(fullPath.slice(1), target[path][idx]);
	}
};

// removes all entries to the root of the object
const _deleteNestedToRoot = (fullPath, target) => {
	if (!isArray(fullPath)) {
		_deleteNestedToRoot(_extractPath(fullPath), target);
		return;
	}

	_deleteNested(fullPath, target);

	// make array of paths to the root of the object, starting from deepest one
	const pathsToRoot = fullPath.map((part, idx) => (idx === 0 ? [...fullPath] : [...fullPath].slice(0, -1 * idx)));

	// delete paths from deepest to shallowest
	// eslint-disable-next-line no-restricted-syntax
	for (const path of pathsToRoot) {
		const value = _getNested(path, target);
		if (value !== undefined) {
			if (isArray(value)) {
				// check if array is empty (no items) or each of them is undefined/empty
				if (value.length === 0 || value.every(item => objectKeys(item || EMPTY).length === 0)) {
					_deleteNested(path, target);
				}
			} // check if object is empty
			else if (objectKeys(value || EMPTY).length === 0) {
				_deleteNested(path, target);
			}
		}
	}
};

const _getInputValue = e => {
	const { value, type, checked, options, files, multiple, valueAsNumber } = e.target;
	switch (type) {
		case 'checkbox':
			return checked;
		case 'range':
			return valueAsNumber;
		case 'number':
			if (value === '') {
				return null;
			}
			// eslint-disable-next-line no-case-declarations
			const parsed = Number.parseFloat(value);
			if (!isNumber(parsed)) {
				return undefined;
			}
			return parsed;
		case 'file':
			return multiple ? files : files.item(0);
		case 'select-multiple':
			return [...options].filter(o => o.selected).map(o => o.value);
		default:
			return value;
	}
};

// clears error if exists and not array of errors (root array arror, e.g. min items)
const _clearObjectError = (fullPath, targetErrors) => {
	const arrError = _getNested(fullPath, targetErrors);
	if (arrError && !isArray(arrError)) {
		const newErrors = { ...targetErrors };
		_deleteNestedToRoot(fullPath, newErrors);
		return newErrors;
	}
	return targetErrors;
};

// shifts errors in array for prepend/remove operations
const _shiftErrors = (fullPath, targetErrors, callback) => {
	const arrError = _getNested(fullPath, targetErrors);
	if (arrError && isArray(arrError)) {
		const newErrors = { ...targetErrors };
		const newArrErrrors = callback([...arrError]);
		_setNested(fullPath, newErrors, newArrErrrors);
		return newErrors;
	}
	return targetErrors;
};

// swaps 2 elements in array and returns new awway
const _swap = (target, fullPath, idx1, idx2) => {
	const arr = _getNested(fullPath, target);
	if (isArray(arr)) {
		const newArr = [...arr];
		const el = newArr[idx1];
		newArr[idx1] = newArr[idx2];
		newArr[idx2] = el;
		return newArr;
	}
	return arr;
};

const _errClassName = (error, classNameError, className) => `${className || ''} ${classNameError || ''} ${error.type ? `error-${error.type}` : ''}`.trim();

const _focus = element => {
	if (element && element.focus) {
		element.focus();
		return true;
	}
	return false;
};

const useForm = ({ defaultValues, mode = 'onSubmit', classNameError = null, shouldFocusError = false, resolver = () => EMPTY }) => {
	const [values, setValues] = useState(defaultValues || EMPTY);
	const [errors, setErrors] = useState({});
	const isTouched = useRef(false);
	const isDirty = useRef(false);
	const refsMap = useRef(new Map());
	const defaultValuesJSON = useRef('');
	const key = useKey();

	const isOnBlurMode = mode === 'onBlur';
	const isOnChangeMode = mode === 'onChange';

	const init = useCallback(initValues => {
		defaultValuesJSON.current = toJSON(initValues);
		setValues(_clone(initValues));
	}, []);

	useEffect(() => {
		init(defaultValues || EMPTY);
		return () => {
			splitCache = {}; // cleanup, ALWAYS
		};
	}, [defaultValues, init]);

	const hasError = useCallback(
		(fullPath = null, targetErrors = errors) => {
			if (fullPath === null) {
				return objectKeys(targetErrors || EMPTY).length > 0;
			}
			return _getNested(fullPath, targetErrors) !== undefined;
		},
		[errors],
	);

	const clearError = useEvent((fullPath, targetErrors = errors) => {
		if (hasError(fullPath, targetErrors)) {
			const newErrors = { ...targetErrors };
			_deleteNestedToRoot(fullPath, newErrors);
			setErrors(newErrors);
			return newErrors;
		}
		return targetErrors;
	});

	const setCustomErrors = useEvent(customErrors => {
		const newErrors = { ...errors };
		// eslint-disable-next-line no-restricted-syntax
		for (const fullPath of objectKeys(customErrors)) {
			if (hasError(fullPath)) {
				_deleteNestedToRoot(fullPath, newErrors);
			}
			_setNested(fullPath, newErrors, customErrors[fullPath]);
		}
		setErrors(newErrors);
		return newErrors;
	});

	const trigger = useEvent((fullPath = '', newValues = values) => {
		const newErrors = resolver(newValues);
		if (fullPath === '') {
			setErrors(newErrors);
			return newErrors;
		}
		const paths = isArray(fullPath) ? fullPath : [fullPath];
		const updatedErrors = { ...errors };
		paths.forEach(fullPath => {
			const error = _getNested(fullPath, newErrors);
			_deleteNestedToRoot(fullPath, updatedErrors);
			if (error !== undefined) {
				_setNested(fullPath, updatedErrors, error);
			}
		});
		setErrors(updatedErrors);
		return updatedErrors;
	});

	const getValue = (fullPath = '') => _getNested(fullPath, values);

	const setValue = useEvent((fullPath, value, validate = true) => {
		const newValues = { ...(fullPath === '' ? value : values) };
		_setNested(fullPath, newValues, value);
		isDirty.current = defaultValuesJSON.current !== toJSON(newValues);
		if (validate && (hasError(fullPath) || isOnChangeMode)) {
			const newErrors = clearError(fullPath);
			const newError = _getNested(fullPath, resolver(newValues));
			if (newError) {
				_setNested(fullPath, newErrors, newError);
				setErrors(newErrors);
			}
		}
		setValues(newValues);
		isTouched.current = true;
		return newValues;
	});

	const append = useEvent((fullPath, object) => {
		const newArr = [..._getNested(fullPath, values), object];
		setValue(fullPath, newArr, false);

		const newErrors = _clearObjectError(fullPath, errors);
		setErrors(newErrors);

		return newArr;
	});

	const prepend = useEvent((fullPath, object) => {
		const newArr = [object, ..._getNested(fullPath, values)];
		setValue(fullPath, newArr, false);

		let newErrors = _clearObjectError(fullPath, errors);
		newErrors = _shiftErrors(fullPath, newErrors, arrErrors => [undefined, ...arrErrors]);
		setErrors(newErrors);

		return newArr;
	});

	const remove = useEvent((fullPath, idx) => {
		const newArr = _getNested(fullPath, values).filter((item, i) => idx !== i);
		setValue(fullPath, newArr, false);

		let newErrors = _clearObjectError(fullPath, errors);
		newErrors = clearError(`${fullPath}.${idx}`, newErrors);
		newErrors = _shiftErrors(fullPath, newErrors, arrErrors => {
			arrErrors.splice(idx, 1);
			return arrErrors;
		});
		setErrors(newErrors);

		return newArr;
	});

	const swap = useEvent((fullPath, index1, index2) => {
		const newArr = _swap(values, fullPath, index1, index2);
		setValue(fullPath, newArr);

		const newErr = _swap(errors, fullPath, index1, index2);
		const newErrors = { ...errors };
		_setNested(fullPath, newErrors, newErr);
		setErrors(newErrors);

		return newArr;
	});

	const ref = useCallback(element => {
		if (element) {
			refsMap.current.set(element.name, element);
		}
	}, []);

	const getRef = useCallback(fullPath => refsMap.current.get(fullPath), []);

	const setRef = useCallback((fullPath, element) => {
		if (element) {
			refsMap.current.set(fullPath, element);
		}
	}, []);

	const onChange = useEvent(e => {
		setValue(e.target.name, _getInputValue(e));
	});

	const onBlur = useEvent(e => {
		const { name } = e.target;
		const newError = _getNested(name, resolver(values));
		if (newError) {
			const newErrors = { ...errors };
			_setNested(name, newErrors, newError);
			setErrors(newErrors);
			if (shouldFocusError) {
				_focus(refsMap.current.get(name));
			}
		} else {
			clearError(name);
		}
	});

	const register = (fullPath, className = '') => {
		const value = getValue(fullPath);
		const hasFieldError = hasError(fullPath);

		// eslint-disable-next-line no-multi-assign
		registerProps.key = registerProps.name = fullPath;
		registerProps['aria-invalid'] = hasFieldError;
		registerProps.className = _errClassName(EMPTY, hasFieldError ? classNameError : false, className);
		registerProps.onChange = onChange;
		registerProps.onBlur = isOnBlurMode ? onBlur : undefined;
		registerProps.ref = ref;

		if (value === true || value === false) {
			registerProps.checked = value;
			registerProps.value = undefined;
		} else {
			registerProps.value = `${value}` === '0' ? value : value || '';
			registerProps.checked = undefined;
		}

		return registerProps;
	};

	const handleSubmit = handler =>
		useEvent(e => {
			// eslint-disable-next-line no-unused-expressions
			e && e.preventDefault && e.preventDefault();

			const newErrors = resolver(values);
			setErrors(newErrors);
			if (hasError(null, newErrors)) {
				if (shouldFocusError) {
					let isFocused = false;
					refsMap.current.forEach((value, key) => {
						if (!isFocused && hasError(key, newErrors)) {
							isFocused = _focus(value);
						}
					});
				}
				return false;
			}
			handler(values);
			return true;
		});

	const reset = useEvent((values = defaultValues, validate = true) => {
		init(values || EMPTY);
		isTouched.current = false;
		isDirty.current = false;
		if (validate) {
			setErrors(resolver(values));
		}
	});

	const Error = useCallback(
		({ for: fullPath, children }) => {
			const error = _getNested(fullPath, errors);
			if (!error || isArray(error)) {
				return false;
			}
			return isFunction(children) ? children(error) : <span className={_errClassName(error, classNameError)}>{error.message}</span>;
		},
		[errors, classNameError],
	);

	const Errors = useCallback(
		({ children, focusable = false }) => {
			if (!hasError()) {
				return false;
			}

			const errorElements = Array.from(refsMap.current)
				.filter(entry => hasError(entry[0]))
				.map(entry => {
					const [fullPath, element] = entry;
					return {
						error: _getNested(fullPath, errors),
						element,
					};
				});

			if (errorElements.length === 0) {
				return false;
			}

			const result = errorElements.map(({ error, element }) => (
				<li key={key(error)} className={_errClassName(error, classNameError)}>
					{focusable ? <a onClick={() => _focus(element)}>{error.message}</a> : error.message}
				</li>
			));

			return isFunction(children) ? children(result) : result;
		},
		[errors, hasError, classNameError, key],
	);

	return {
		getValue,
		setValue,
		register,
		onChange,
		onBlur,
		getRef,
		setRef,
		trigger,
		handleSubmit,
		hasError,
		clearError,
		setErrors: setCustomErrors,
		append,
		prepend,
		remove,
		swap,
		key,
		reset,
		Error,
		Errors,
		formState: {
			errors,
			isValid: !hasError(),
			isTouched: isTouched.current,
			isDirty: isDirty.current,
		},
	};
};

export const yupResolver = schema => fields => {
	const errors = {};
	try {
		schema.validateSync(fields, { abortEarly: false });
	} catch (validationError) {
		// eslint-disable-next-line no-restricted-syntax
		for (const error of validationError.inner) {
			const err = {
				message: error.message,
				type: error.type,
			};
			_setNested(error.path, errors, err);
		}
	}
	return errors;
};

export default useForm;
