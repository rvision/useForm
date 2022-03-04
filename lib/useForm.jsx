/* eslint-disable no-underscore-dangle */
import React, { useEffect, useRef, useState } from 'react';
import useKey from './useKey';

// NOTE: make aliases for better minification
const isNumber = num => !Number.isNaN(num);
const parseI = num => parseInt(num, 10);
const isFunction = obj => typeof obj === 'function';
const { isArray } = Array;
const toJSON = JSON.stringify;
const objectKeys = Object.keys;

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

	if (fullPath.length === 0) {
		return source;
	}

	const path = fullPath[0];
	if (fullPath.length === 1) {
		return source[path];
	}

	if (source[path] === undefined) {
		return undefined;
	}

	const idx = parseI(fullPath[1]);
	if (isNumber(idx)) {
		if (fullPath.length === 2) {
			return source[path][idx];
		}
		return _getNested(fullPath.slice(2), source[path][idx]);
	}

	return _getNested(fullPath.slice(1), source[path]);
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
	const pathsToRoot = fullPath.map((part, idx) => {
		return idx === 0 ? [...fullPath] : [...fullPath].slice(0, -1 * idx);
	});

	// delete paths from deepest to shallowest
	// eslint-disable-next-line no-restricted-syntax
	for (const path of pathsToRoot) {
		const value = _getNested(path, target);
		if (value !== undefined) {
			if (isArray(value)) {
				// check if array is empty (no items) or each of them is undefined/empty
				if (value.length === 0 || value.every(item => objectKeys(item || {}).length === 0)) {
					_deleteNested(path, target);
				}
			} // check if object is empty
			else if (objectKeys(value || {}).length === 0) {
				_deleteNested(path, target);
			}
		}
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

const _errClassName = (error, classNameError, className) => `${className || ''} ${classNameError || ''} ${error.type ? `error-${error.type}` : ''}`.trim();

const _focus = element => {
	if (element && element.focus) {
		element.focus();
		return true;
	}
	return false;
};

const useForm = ({ defaultValues = {}, mode = 'onSubmit', classNameError = null, shouldFocusError = false, resolver = foo => ({}) }) => {
	const [values, setValues] = useState(defaultValues);
	const [errors, setErrors] = useState({});
	const isTouched = useRef(false);
	const isDirty = useRef(false);
	const refsMap = useRef(new Map());
	const defaultValuesJSON = useRef('');
	const key = useKey();

	const cachedRegisters = useRef(new Map());
	const prevCachedRegistersKeys = useRef(new Map());

	const isOnBlurMode = mode === 'onBlur';
	const isOnChangeMode = mode === 'onChange';

	const init = initValues => {
		defaultValuesJSON.current = toJSON(initValues);
		setValues(_clone(initValues));
	};

	useEffect(() => {
		init(defaultValues);
		return () => {
			splitCache = {}; // cleanup, ALWAYS
		};
	}, [defaultValues]);

	const hasError = (fullPath = null, targetErrors = errors) => {
		if (fullPath === null) {
			return objectKeys(targetErrors || {}).length > 0;
		}
		return _getNested(fullPath, targetErrors) !== undefined;
	};

	const clearError = (fullPath, targetErrors = errors) => {
		if (hasError(fullPath)) {
			const newErrors = { ...targetErrors };
			_deleteNestedToRoot(fullPath, newErrors);
			setErrors(newErrors);
			return newErrors;
		}
		return targetErrors;
	};

	const setCustomErrors = errorsObj => {
		const newErrors = { ...errors };
		// eslint-disable-next-line no-restricted-syntax
		for (const fullPath of objectKeys(errorsObj)) {
			if (hasError(fullPath)) {
				_deleteNestedToRoot(fullPath, newErrors);
			}
			_setNested(fullPath, newErrors, errorsObj[fullPath]);
		}
		setErrors(newErrors);
		return newErrors;
	};

	const trigger = (fullPath = '', newValues = values) => {
		const newValidation = resolver(newValues);
		const error = _getNested(fullPath, newValidation);
		const newErrors = { ...newValidation };
		_deleteNestedToRoot(fullPath, newErrors);
		if (error !== undefined) {
			_setNested(fullPath, newErrors, error);
		}
		setErrors(newErrors);
		return newErrors;
	};

	const getValue = (fullPath = '') => {
		return _getNested(fullPath, values);
	};

	const setValue = (fullPath, value, validate = true) => {
		setValues(values => {
			const newProps = fullPath === '' ? value : values;
			const newValues = { ...values };

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

			return newValues;
		});

		isTouched.current = true;
	};

	const append = (fullPath, object) => {
		const newArr = [..._getNested(fullPath, values), object];
		setValue(fullPath, newArr, false);

		const newErrors = _clearObjectError(fullPath, errors);
		setErrors(newErrors);

		return newArr;
	};

	const prepend = (fullPath, object) => {
		const newArr = [object, ..._getNested(fullPath, values)];
		setValue(fullPath, newArr, false);

		let newErrors = _clearObjectError(fullPath, errors);
		newErrors = _shiftErrors(fullPath, newErrors, arrErrors => [undefined, ...arrErrors]);
		setErrors(newErrors);

		return newArr;
	};

	const remove = (fullPath, idx) => {
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
	};

	const swap = (fullPath, index1, index2) => {
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
		const newArr = _swap(values, fullPath, index1, index2);
		setValue(fullPath, newArr);

		const newErr = _swap(errors, fullPath, index1, index2);
		const newErrors = { ...errors };
		_setNested(fullPath, newErrors, newErr);
		setErrors(newErrors);

		return newArr;
	};

	const onChange = e => {
		const { name, type, checked, options, files, multiple } = e.target;
		let { value, valueAsNumber } = e.target;
		switch (type) {
			default:
				break;
			case 'checkbox':
				value = checked;
				break;
			case 'range':
				value = valueAsNumber;
				break;
			case 'number':
				if (value === '') {
					value = null;
				} else {
					value = Number.parseFloat(value);
					if (!isNumber(value)) {
						value = undefined;
					}
				}
				break;
			case 'file':
				value = multiple ? files : files.item(0);
				break;
			case 'select-multiple':
				value = [...options].filter(o => o.selected).map(o => o.value);
				break;
		}
		setValue(name, value);
	};

	const onBlur = e => {
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
	};

	const ref = element => {
		if (element) {
			refsMap.current.set(element.name, element);
		}
	};

	const register = (fullPath, { className = '' } = {}) => {
		const value = getValue(fullPath);
		const hasFieldError = hasError(fullPath);
		const cacheKey = `${fullPath}*${value}*${hasFieldError}*${className}`;
		const onBlurHandler = isOnBlurMode ? onBlur : undefined;
		// return the cached version
		if (cachedRegisters.current.has(cacheKey)) {
			const props = cachedRegisters.current.get(cacheKey);
			// NOTE: update handlers each time because of stale closures
			props.onChange = onChange;
			props.onBlur = onBlurHandler;
			return props;
		}

		const props = {
			key: fullPath,
			name: fullPath,
			'aria-invalid': `${hasFieldError}`,
			className: _errClassName({}, hasFieldError ? classNameError : false, className),
			onChange,
			onBlur: onBlurHandler,
			ref,
		};

		if (value === true || value === false) {
			props.checked = value;
		} else {
			props.value = `${value}` === '0' ? value : value || '';
		}

		// remove old cached version (different key)
		const oldKey = prevCachedRegistersKeys.current.get(fullPath);
		cachedRegisters.current.delete(oldKey);

		// set cached version and new key
		cachedRegisters.current.set(cacheKey, props);
		prevCachedRegistersKeys.current.set(fullPath, cacheKey);

		return props;
	};

	const handleSubmit = handler => {
		return e => {
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
		};
	};

	const reset = (values = defaultValues, validate = true) => {
		init(values);
		isTouched.current = false;
		isDirty.current = false;
		if (validate) {
			setErrors(resolver(values));
		}
	};

	const getRef = fullPath => {
		return refsMap.current.get(fullPath);
	};

	const setRef = (fullPath, element) => {
		if (element) {
			refsMap.current.set(fullPath, element);
		}
	};

	const Error = ({ for: fullPath, children }) => {
		const error = _getNested(fullPath, errors);
		if (!error || isArray(error)) {
			return false;
		}
		return isFunction(children) ? children(error) : <span className={_errClassName(error, classNameError)}>{error.message}</span>;
	};

	const Errors = ({ children, focusable = false }) => {
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
	};

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

export const yupResolver = schema => {
	return fields => {
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
};

export default useForm;
