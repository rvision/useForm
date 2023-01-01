/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useKey from './useKey';

// NOTE: inline useStableRef for better minification
const useStableRef = callback => {
	const handlerRef = useRef(callback);
	handlerRef.current = callback;
	return useCallback((...args) => handlerRef.current(...args), []);
	// return useRef((...args) => handlerRef.current(...args)).current;
};

// NOTE: make aliases for better minification
const isNumber = num => !Number.isNaN(num);
const parseI = num => parseInt(num, 10);
const isFunction = obj => typeof obj === 'function';
const { isArray } = Array;
const toJSON = JSON.stringify;
const objectKeys = Object.keys;
const EMPTY = {};
const noOp = () => EMPTY;

const registerProps = {
	key: '',
	name: '',
	'aria-invalid': false,
	className: '',
	onChange: noOp,
	onBlur: noOp,
	ref: noOp,
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
	if (!obj || typeof obj !== 'object') {
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

	if (obj instanceof Set) {
		return new Set(_clone([...obj]));
	}

	return obj;
};

const _getNested = (fullPath, source) => {
	if (source === undefined) {
		return undefined;
	}

	if (!isArray(fullPath)) {
		return _getNested(_extractPath(fullPath), source);
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

	const idx = parseI(fullPath[1]);
	if (isNumber(idx)) {
		if (fullPath.length === 2) {
			delete target[path][idx];
		} else {
			_deleteNested(fullPath.slice(2), target[path][idx]);
		}
	} else {
		_deleteNested(fullPath.slice(1), target[path]);
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

const useForm = ({ defaultValues, mode = 'onSubmit', classNameError = null, shouldFocusError = false, resolver = noOp }) => {
	const [values, setValues] = useState(defaultValues || EMPTY);
	const [errors, setErrors] = useState({});
	const isTouched = useRef(false);
	const isDirty = useRef(false);
	const refsMap = useRef(new Map());
	const defaultValuesJSON = useRef('');
	const key = useKey();

	const isOnBlurMode = mode === 'onBlur';
	const isOnChangeMode = mode === 'onChange';

	const init = useStableRef(initValues => {
		const vals = initValues || EMPTY;
		defaultValuesJSON.current = toJSON(vals);
		setValues(_clone(vals));
	});

	useEffect(() => {
		init(defaultValues);
		return () => {
			splitCache = {}; // cleanup, ALWAYS
		};
	}, [defaultValues, init]);

	const focus = useStableRef(fullPath => {
		const element = refsMap.current.get(fullPath);
		if (element && element.focus) {
			element.focus();
			return true;
		}
		return false;
	});

	const getValue = useStableRef((fullPath = '') => _getNested(fullPath, values));
	const getError = useStableRef((fullPath = '', targetErrors = errors) => _getNested(fullPath, targetErrors));

	const hasError = useStableRef((fullPath = '', targetErrors = errors) => {
		if (fullPath === '') {
			return objectKeys(targetErrors).length > 0;
		}
		return _getNested(fullPath, targetErrors) !== undefined;
	});

	const clearError = useStableRef((fullPath, targetErrors = errors) => {
		if (hasError(fullPath, targetErrors)) {
			const newErrors = { ...targetErrors };
			_deleteNestedToRoot(fullPath, newErrors);
			setErrors(newErrors);
			return newErrors;
		}
		return targetErrors;
	});

	const setCustomErrors = useStableRef(customErrors => {
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

	const trigger = useStableRef(
		(fullPath = '', newValues = values) =>
			new Promise((resolve = noOp) => {
				const newErrors = resolver(newValues);
				if (fullPath === '') {
					setErrors(newErrors);
					resolve(newErrors);
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
				resolve(updatedErrors);
			}),
	);

	const setValue = useStableRef(
		(fullPath, value, validate = true) =>
			new Promise((resolve = noOp) => {
				setValues(values => {
					isTouched.current = true;
					const newValues = { ...(fullPath === '' ? value : values) };
					_setNested(fullPath, newValues, value);
					isDirty.current = defaultValuesJSON.current !== toJSON(newValues);
					let newErrors = errors;
					if (validate && (hasError(fullPath) || isOnChangeMode)) {
						newErrors = clearError(fullPath);
						const newError = _getNested(fullPath, resolver(newValues));
						if (newError) {
							_setNested(fullPath, newErrors, newError);
							setErrors(newErrors);
						}
					}
					resolve({
						values: newValues,
						errors: newErrors,
					});
					return newValues;
				});
			}),
	);

	const _updateArray = (fullPath, newArr, transformErrorsCallback) => {
		return new Promise((resolve = noOp) => {
			Promise.resolve(setValue(fullPath, newArr, false)).then(({ values }) => {
				const newErrors = transformErrorsCallback(_clearObjectError(fullPath, errors));
				setErrors(newErrors);
				resolve({
					values,
					errors: newErrors,
				});
			});
		});
	};

	const append = useStableRef((fullPath, object) => _updateArray(fullPath, [..._getNested(fullPath, values), object], newErrors => newErrors));

	const prepend = useStableRef((fullPath, object) =>
		_updateArray(fullPath, [object, ..._getNested(fullPath, values)], newErrors => _shiftErrors(fullPath, newErrors, arrErrors => [undefined, ...arrErrors])),
	);

	const remove = useStableRef((fullPath, idx) =>
		_updateArray(
			fullPath,
			_getNested(fullPath, values).filter((item, i) => idx !== i),
			newErrors => {
				newErrors = clearError(`${fullPath}.${idx}`, newErrors);
				return _shiftErrors(fullPath, newErrors, arrErrors => {
					arrErrors.splice(idx, 1);
					return arrErrors;
				});
			},
		),
	);

	const swap = useStableRef((fullPath, index1, index2) =>
		_updateArray(fullPath, _swap(values, fullPath, index1, index2), newErrors => {
			const newErr = _swap(newErrors, fullPath, index1, index2);
			const swappedErrors = { ...errors };
			_setNested(fullPath, swappedErrors, newErr);
			return swappedErrors;
		}),
	);

	const getRef = useStableRef(fullPath => refsMap.current.get(fullPath));

	const setRef = useStableRef((fullPath, element) => {
		if (element) {
			refsMap.current.set(fullPath, element);
		}
	});

	const ref = useStableRef(element => element && setRef(element.name, element));

	const onChange = useStableRef(e => {
		setValue(e.target.name, _getInputValue(e));
	});

	const onBlur = useStableRef(e => {
		const { name } = e.target;
		const newError = _getNested(name, resolver(values));
		if (newError) {
			const newErrors = { ...errors };
			_setNested(name, newErrors, newError);
			setErrors(newErrors);
			if (shouldFocusError) {
				focus(name);
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

	const handleSubmit = handler => e => {
		// eslint-disable-next-line no-unused-expressions
		e && e?.preventDefault();

		const newErrors = resolver(values);
		setErrors(newErrors);
		if (hasError('', newErrors)) {
			if (shouldFocusError) {
				let isFocused = false;
				refsMap.current.forEach((element, fullPath) => {
					if (!isFocused && hasError(fullPath, newErrors)) {
						isFocused = focus(fullPath);
					}
				});
			}
			return false;
		}
		handler(values);
		return true;
	};

	const reset = useStableRef((values = defaultValues, validate = true) => {
		init(values);
		isTouched.current = false;
		isDirty.current = false;
		validate && trigger('', values);
	});

	const Error = useStableRef(({ for: fullPath, children }) => {
		const error = _getNested(fullPath, errors);
		if (!error || isArray(error)) {
			return false;
		}
		return isFunction(children) ? children(error) : <span className={_errClassName(error, classNameError)}>{error.message}</span>;
	});

	const isValid = !hasError();
	const Errors = useStableRef(({ children, focusable = false }) => {
		if (isValid) {
			return false;
		}

		// entry[0] = fullPath, entry[1] = element
		const errorPaths = Array.from(refsMap.current)
			.map(entry => entry[0])
			.filter(entry => hasError(entry))
			.sort();

		const result = errorPaths.map(fullPath => {
			const error = _getNested(fullPath, errors);
			return (
				<li key={key(error)} className={_errClassName(error, classNameError)}>
					{focusable ? <a onClick={() => focus(fullPath)}>{error.message}</a> : error.message}
				</li>
			);
		});

		return isFunction(children) ? children(result) : result;
	});

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
		getError,
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
			isValid,
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
			_setNested(error.path, errors, {
				message: error.message,
				type: error.type,
			});
		}
	}
	return errors;
};

export default useForm;
