import { useCallback, useEffect, useRef, useState } from 'react';
import useKey from './useKey';

const extractPath = string => {
	if (!string) {
		return [];
	}
	return string.replace(/\[|\]\.?/g, '.').split(/[\.\[\]\'\"]/);
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
	if (!Number.isNaN(idx)) {
		if (fullPath.length === 2) {
			return source[path][idx];
		}
		return getDeep(fullPath.slice(2), source[path][idx]);
	}

	return getDeep(fullPath.slice(1), source[path]);
};

const setDeep = (fullPath, target, value) => {
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
	if (!Number.isNaN(idx)) {
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

const deleteDeep = (fullPath, target) => {
	if (fullPath.length === 0) {
		return;
	}

	const path = fullPath[0];
	if (fullPath.length === 1) {
		delete target[path];
		return;
	}
	const next = fullPath[1];
	const idx = parseInt(next, 10);
	if (!Number.isNaN(idx)) {
		if (fullPath.length === 2) {
			delete target[path][idx];
		} else {
			deleteDeep(fullPath.slice(2), target[path][idx]);
		}
	} else {
		deleteDeep(fullPath.slice(1), target[path][idx]);
	}
};

const useForm = ({ defaultValues = {}, validate }) => {
	const [values, setValues] = useState(defaultValues);
	const [errors, setErrors] = useState({});
	const [isTouched, setIsTouched] = useState(false);
	const defaultValuesJSON = useRef('');
	const isDirty = useRef(false);
	const key = useKey();

	useEffect(() => {
		defaultValuesJSON.current = JSON.stringify(defaultValues);
		isDirty.current = false;
		setValues(clone(defaultValues));
	}, [defaultValues]);

	const hasError = (fullPath = null) => {
		if (fullPath === null) {
			return Object.keys(errors).length > 0;
		}
		return getDeep(extractPath(fullPath), errors) !== undefined;
	};

	const getValue = fullPath => {
		return getDeep(extractPath(fullPath), values);
	};

	const setValue = (fullPath, value) => {
		const pathArray = extractPath(fullPath);

		setValues(values => {
			const newValues = { ...values };
			setDeep(pathArray, newValues, value);

			isDirty.current = defaultValuesJSON.current !== JSON.stringify(newValues);

			// TODO: revalidateMode, etc
			if (hasError(fullPath)) {
				const newValidation = validate(newValues);
				const error = getDeep(pathArray, newValidation);
				const newErrors = { ...errors };
				deleteDeep(pathArray, newErrors);
				if (error) {
					setDeep(pathArray, newErrors, error);
				}
				setErrors(newErrors);
			}

			return newValues;
		});

		if (isTouched === false) {
			setIsTouched(true);
		}
	};

	const clearError = fullPath => {
		if (hasError(fullPath)) {
			const newErrors = { ...errors };
			deleteDeep(extractPath(fullPath), newErrors);
			setErrors(newErrors);
		}
	};

	const append = (fullPath, object) => {
		const newArr = [...getDeep(extractPath(fullPath), values), object];
		setValue(fullPath, newArr);
		clearError(fullPath);
		clearError(`${fullPath}[0]`);
	};

	const prepend = (fullPath, object) => {
		const newArr = [object, ...getDeep(extractPath(fullPath), values)];
		setValue(fullPath, newArr);
		clearError(fullPath);
		clearError(`${fullPath}[${newArr.length - 1}]`);
	};

	const remove = (fullPath, idx) => {
		const newArr = [...getDeep(extractPath(fullPath), values)];
		newArr.splice(idx, 1);
		setValue(fullPath, newArr);
	};

	const reset = () => {
		const newValues = clone(defaultValues);
		setValues(newValues);
		setErrors(validate(newValues));
		isDirty.current = defaultValuesJSON === JSON.stringify(newValues);
	};

	const trigger = () => {
		setErrors(validate(values));
	};

	// basic html form inputs
	const onChangeNative = e => {
		// if (e.target instanceof HTMLInputElement)
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
			case 'file':
				[value] = files;
				break;
			case 'select-multiple':
				value = [...options].filter(o => o.selected).map(o => o.value);
				break;
		}
		setValue(name, value);
	};

	const register = name => {
		const props = {
			name,
			value: getValue(name),
			checked: getValue(name),
			onChange: onChangeNative,
			// TODO: onBlur
		};
		return props;
	};

	const handleSubmit = onSubmitHandler => {
		return e => {
			e.preventDefault();
			const errors = validate(values);
			setErrors(errors);
			if (Object.keys(errors).length === 0) {
				onSubmitHandler(values);
			}
		};
	};

	return {
		getValue,
		values,
		setValue,
		register,
		trigger,
		handleSubmit,
		hasError,
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
				setDeep(extractPath(error.path), errors, err);
			});
		}
		return errors;
	};
};
