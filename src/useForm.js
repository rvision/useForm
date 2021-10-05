import React, { useCallback, useEffect, useRef, useState } from 'react';
import useKey from './useKey';

const ParseInt = int => parseInt(int, 10);
const isNumber = num => !Number.isNaN(num);
const toJSONString = JSON.stringify;
const IsArray = Array.isArray;

let splitCache = {};

const extractPath = string => {
	if (!string) {
		return [];
	}
	if (splitCache[string]) {
		return splitCache[string];
	}
	const split = string.replace(/\[([^\]]+)\]/g, '.$1').split('.');
	splitCache[string] = split;
	return split;
};

const clone = obj => {
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}

	if (obj instanceof Date) {
		return new Date(obj.getTime());
	}

	if (obj instanceof Array) {
		return obj.reduce((arr, item, i) => {
			arr[i] = clone(item);
			return arr;
		}, []);
	}

	if (obj instanceof Object) {
		return Object.keys(obj).reduce((newObj, key) => {
			newObj[key] = clone(obj[key]);
			return newObj;
		}, {});
	}

	return obj;
};

const getDeep = (fullPath, source) => {
	if (!IsArray(fullPath)) {
		return getDeep(extractPath(fullPath), source);
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
	const idx = ParseInt(next);
	if (isNumber(idx)) {
		if (fullPath.length === 2) {
			return source[path][idx];
		}
		return getDeep(fullPath.slice(2), source[path][idx]);
	}

	return getDeep(fullPath.slice(1), source[path]);
};

const setDeep = (fullPath, target, value) => {
	if (!IsArray(fullPath)) {
		setDeep(extractPath(fullPath), target, value);
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
	const idx = ParseInt(next);
	if (isNumber(idx)) {
		// NOTE: this makes entries undefined instead of empty
		// target[path] = target[path] === undefined ? [] : [...target[path]];
		target[path] = target[path] === undefined ? [] : target[path];

		// NOTE: this line causes inputs to loose focus in .map
		// target[path][idx] = target[path][idx] === undefined ? {} : { ...target[path][idx] };
		target[path][idx] = target[path][idx] === undefined ? {} : target[path][idx];
		if (fullPath.length === 2) {
			target[path][idx] = value;
		} else {
			setDeep(fullPath.slice(2), target[path][idx], value);
		}
	} else {
		target[path] = target[path] === undefined ? {} : { ...target[path] };
		setDeep(fullPath.slice(1), target[path], value);
	}
};

const deleteDeepEntry = (fullPath, target) => {
	if (!IsArray(fullPath)) {
		deleteDeepEntry(extractPath(fullPath), target);
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
	const idx = ParseInt(next);
	if (isNumber(idx)) {
		if (fullPath.length === 2) {
			delete target[path][idx];
		} else {
			deleteDeepEntry(fullPath.slice(2), target[path][idx]);
		}
	} else {
		deleteDeepEntry(fullPath.slice(1), target[path][idx]);
	}
};

// removes all entries to the root of the object
const deleteDeepToRoot = (fullPath, target) => {
	if (!IsArray(fullPath)) {
		deleteDeepToRoot(extractPath(fullPath), target);
		return;
	}

	deleteDeepEntry(fullPath, target);

	// make array of paths to the root of the object, starting from deepest one
	const pathsToRoot = fullPath.map((part, idx) => {
		return idx === 0 ? [...fullPath] : [...fullPath].slice(0, -1 * idx);
	});

	// delete paths from deepest to shallowest
	pathsToRoot.forEach(path => {
		const value = getDeep(path, target);
		if (value !== undefined) {
			if (IsArray(value)) {
				if (value.length === 0 || value.every(item => Object.keys(item || {}).length === 0)) {
					deleteDeepEntry(path, target);
				}
			} else if (Object.keys(value || {}).length === 0) {
				deleteDeepEntry(path, target);
			}
		}
	});
};

const useForm = ({ defaultValues = {}, mode = 'onSubmit', shouldFocusError = false, resolver = () => {} }) => {
	const [values, setValues] = useState(defaultValues);
	const [errors, setErrors] = useState({});
	const [isTouched, setIsTouched] = useState(false);
	const defaultValuesJSON = useRef('');
	const refsMap = useRef(new Map());
	const isDirty = useRef(false);
	const key = useKey();

	useEffect(() => {
		defaultValuesJSON.current = toJSONString(defaultValues);
		isDirty.current = false;
		setValues(clone(defaultValues));
	}, [defaultValues]);

	useEffect(() => {
		return () => {
			splitCache = {};
		};
	}, []);

	const hasError = (fullPath = null) => {
		if (fullPath === null) {
			return Object.keys(errors).length > 0;
		}
		return getDeep(fullPath, errors) !== undefined;
	};

	const clearError = fullPath => {
		if (hasError(fullPath)) {
			const newErrors = { ...errors };
			deleteDeepToRoot(fullPath, newErrors);
			setErrors(newErrors);
		}
	};

	const trigger = (fullPath = null, newValues = values) => {
		const newValidation = resolver(newValues);
		const error = getDeep(fullPath, newValidation);
		const newErrors = { ...errors };
		deleteDeepToRoot(fullPath, newErrors);
		if (error !== undefined) {
			setDeep(fullPath, newErrors, error);
		}
		setErrors(newErrors);
		return newErrors;
	};

	const getValue = fullPath => {
		return getDeep(fullPath, values);
	};

	const setValue = (fullPath, value, reValidate = true) => {
		setValues(values => {
			const newValues = { ...values };
			setDeep(fullPath, newValues, value);
			isDirty.current = defaultValuesJSON.current !== toJSONString(newValues);

			if (reValidate) {
				if (mode === 'onSubmit') {
					if (hasError(fullPath)) {
						trigger(fullPath, newValues);
					}
				}
				if (mode === 'onChange' || mode === 'onBlur') {
					trigger(fullPath, newValues);
				}
			}

			return newValues;
		});

		if (isTouched === false) {
			setIsTouched(true);
		}
	};

	const clearArrayObjectError = fullPath => {
		const arrError = getDeep(fullPath, errors);
		if (arrError && !IsArray(arrError)) {
			const newErrors = { ...errors };
			deleteDeepToRoot(fullPath, newErrors);
			setErrors(newErrors);
		}
	};

	const append = (fullPath, object) => {
		clearArrayObjectError(fullPath);
		const newArr = [...getDeep(fullPath, values), object];
		setValue(fullPath, newArr, false);
	};

	const prepend = (fullPath, object) => {
		clearArrayObjectError(fullPath);
		const newArr = [object, ...getDeep(fullPath, values)];
		setValue(fullPath, newArr, false);
	};

	const remove = (fullPath, idx) => {
		clearArrayObjectError(fullPath);
		const newArr = [...getDeep(fullPath, values)];
		newArr.splice(idx, 1);
		setValue(fullPath, newArr);
	};

	const reset = () => {
		const newValues = clone(defaultValues);
		setValues(newValues);
		setErrors(resolver(newValues));
		setIsTouched(false);
		isDirty.current = defaultValuesJSON === toJSONString(newValues);
	};

	// basic html form inputs
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
				value = ParseInt(value);
				break;
			case 'file':
				[value] = files;
				break;
			case 'select-multiple':
				value = [...options].filter(o => o.selected).map(o => o.value);
				break;
		}
		setValue(name, value);
	};

	const handleSubmit = onSubmitHandler => {
		return e => {
			e.preventDefault();
			const errors = resolver(values);
			setErrors(errors);
			if (Object.keys(errors).length === 0) {
				onSubmitHandler(values);
			}
		};
	};

	const onBlur = name => {
		return () => {
			if (getDeep(name, trigger(name))) {
				if (shouldFocusError) {
					refsMap.current.get(name).focus();
				}
			}
		};
	};

	const register = name => {
		const props = {
			name,
			value: getValue(name),
			checked: getValue(name),
			onChange,
		};

		if (mode === 'onBlur') {
			props.onBlur = onBlur(name);
			props.ref = element => {
				refsMap.current.set(name, element);
			};
		}

		return props;
	};

	return {
		getValue,
		values,
		setValue,
		register,
		trigger,
		handleSubmit,
		hasError,
		clearError,
		append,
		prepend,
		remove,
		key,
		reset,
		formState: {
			errors,
			isValid: hasError(),
			isTouched,
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
			validationError.inner.forEach(error => {
				const err = {
					message: error.message,
					type: error.type,
				};
				setDeep(error.path, errors, err);
			});
		}
		return errors;
	};
};
