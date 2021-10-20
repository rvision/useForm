/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useKey from './useKey';

const isNumber = num => !Number.isNaN(num);

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

	if (Array.isArray(obj)) {
		return obj.reduce((arr, item, i) => {
			arr[i] = _clone(item);
			return arr;
		}, []);
	}

	if (obj instanceof Object) {
		return Object.keys(obj).reduce((newObj, key) => {
			newObj[key] = _clone(obj[key]);
			return newObj;
		}, {});
	}

	return obj;
};

const _getNested = (fullPath, source) => {
	if (!Array.isArray(fullPath)) {
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

	const next = fullPath[1];
	const idx = parseInt(next, 10);
	if (isNumber(idx)) {
		if (fullPath.length === 2) {
			return source[path][idx];
		}
		return _getNested(fullPath.slice(2), source[path][idx]);
	}

	return _getNested(fullPath.slice(1), source[path]);
};

const _setNested = (fullPath, target, value) => {
	if (!Array.isArray(fullPath)) {
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
	const next = fullPath[1];
	const idx = parseInt(next, 10);
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
	if (!Array.isArray(fullPath)) {
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
	const idx = parseInt(next, 10);
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
	if (!Array.isArray(fullPath)) {
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
			if (Array.isArray(value)) {
				// check if array is empty (no items) or each of them is undefined/empty
				if (value.length === 0 || value.every(item => Object.keys(item || {}).length === 0)) {
					_deleteNested(path, target);
				}
			} // check if object is empty
			else if (Object.keys(value || {}).length === 0) {
				_deleteNested(path, target);
			}
		}
	}
};

// clears error if exists and not array of errors (root array arror, e.g. min items)
const _clearObjectError = (fullPath, targetErrors) => {
	const arrError = _getNested(fullPath, targetErrors);
	if (arrError && !Array.isArray(arrError)) {
		const newErrors = { ...targetErrors };
		_deleteNestedToRoot(fullPath, newErrors);
		return newErrors;
	}
	return targetErrors;
};

// shifts errors in array for prepend/remove operations
const _shiftErrors = (fullPath, targetErrors, callback) => {
	const arrError = _getNested(fullPath, targetErrors);
	if (arrError && Array.isArray(arrError)) {
		const newErrors = { ...targetErrors };
		const newArrErrrors = callback([...arrError]);
		_setNested(fullPath, newErrors, newArrErrrors);
		return newErrors;
	}
	return targetErrors;
};

const useForm = ({ defaultValues = {}, mode = 'onSubmit', classNameError = null, shouldFocusError = false, resolver = () => {} }) => {
	const [values, setValues] = useState(defaultValues);
	const [errors, setErrors] = useState({});
	const isTouched = useRef(false);
	const isDirty = useRef(false);
	const refsMap = useRef(new Map());
	const defaultValuesJSON = useRef('');
	const key = useKey();

	useEffect(() => {
		defaultValuesJSON.current = JSON.stringify(defaultValues);
		setValues(_clone(defaultValues));
	}, [defaultValues]);

	useEffect(() => {
		return () => {
			splitCache = {}; // cleanup
		};
	}, []);

	const hasError = (fullPath = null, targetErrors = errors) => {
		if (fullPath === null) {
			return Object.keys(targetErrors || {}).length > 0;
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

	const setErrorsExternal = errorsObj => {
		const newErrors = { ...errors };
		// eslint-disable-next-line no-restricted-syntax
		for (const fullPath of Object.keys(errorsObj)) {
			if (hasError(fullPath)) {
				_deleteNestedToRoot(fullPath, newErrors);
			}
			_setNested(fullPath, newErrors, errorsObj[fullPath]);
		}
		setErrors(newErrors);
		return newErrors;
	};

	const trigger = (fullPath = [], newValues = values) => {
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

	const getValue = (fullPath = []) => {
		return _getNested(fullPath, values);
	};

	const setValue = (fullPath, value, validate = true) => {
		setValues(values => {
			const newValues = { ...values };
			_setNested(fullPath, newValues, value);
			isDirty.current = defaultValuesJSON.current !== JSON.stringify(newValues);

			if (validate && (hasError(fullPath) || mode === 'onChange')) {
				const newErrors = clearError(fullPath);
				const newValidation = resolver(newValues);
				const newError = _getNested(fullPath, newValidation);
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
		const newArr = [..._getNested(fullPath, values)];
		newArr.splice(idx, 1);
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

	const onChange = e => {
		const { name, type, checked, options, files } = e.target;
		let { value } = e.target;
		switch (type) {
			default:
				break;
			case 'checkbox':
				value = checked;
				break;
			case 'range':
				value = parseInt(value, 10);
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
				[value] = files; // TODO: test this
				break;
			case 'select-multiple':
				value = [...options].filter(o => o.selected).map(o => o.value);
				break;
		}
		setValue(name, value);
	};

	const onBlur = e => {
		const { name } = e.target;
		const newValidation = resolver(values) || {};
		const newError = _getNested(name, newValidation);
		if (newError) {
			const newErrors = { ...errors };
			_setNested(name, newErrors, newError);
			setErrors(newErrors);
			if (shouldFocusError === true) {
				refsMap.current.get(name).focus();
			}
		} else {
			clearError(name);
		}
	};

	const register = (name, { className = false } = {}) => {
		const props = {
			key: name,
			name,
			onChange,
			onBlur: mode === 'onBlur' ? onBlur : undefined,
			ref: element => {
				refsMap.current.set(name, element);
			},
		};

		const value = getValue(name);
		if (value === true || value === false) {
			props.checked = value;
		} else {
			props.value = `${value}` === '0' ? value : value || '';
		}

		if (classNameError !== null || !!className) {
			let classNameGenerated = className || '';
			if (hasError(name)) {
				classNameGenerated = `${classNameGenerated} ${classNameError}`;
			}
			if (classNameGenerated) {
				props.className = classNameGenerated;
			}
		}

		return props;
	};

	const handleSubmit = handler => {
		return e => {
			if (e && e.preventDefault) {
				e.preventDefault();
			}

			const newErrors = resolver(values) || {};
			setErrors(newErrors);
			if (hasError(null, newErrors)) {
				if (shouldFocusError === true) {
					let focused = false;
					refsMap.current.forEach((value, key) => {
						if (!focused && value && value.focus && hasError(key, newErrors)) {
							value.focus();
							focused = true;
						}
					});
				}
			} else {
				handler(values);
			}
		};
	};

	const reset = (model = defaultValues, validate = true) => {
		const newValues = _clone(model);
		setValues(newValues);
		isTouched.current = false;
		isDirty.current = false;
		if (validate) {
			setErrors(resolver(newValues));
		}
	};

	const getRef = name => {
		return refsMap.current.get(name);
	};

	const setRef = (name, element) => {
		if (element) {
			refsMap.current.set(name, element);
		}
	};

	const Error = ({ for: path, children }) => {
		const err = _getNested(path, errors);
		if (!err || Array.isArray(err)) {
			return false;
		}
		return <>{typeof children === 'function' ? children(err) : <span className="validation-error">{err.message}</span>}</>;
	};

	const Errors = ({ children }) => {
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

		const result = (
			<>
				{errorElements.map(({ error, element }) => {
					return (
						<li key={key(element)}>
							<a onClick={() => element && element.focus && element.focus()}>{error.message}</a>
						</li>
					);
				})}
			</>
		);

		if (typeof children === 'function') {
			return children(result);
		}
		return result;
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
		setErrors: setErrorsExternal,
		append,
		prepend,
		remove,
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

export default useForm;

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
