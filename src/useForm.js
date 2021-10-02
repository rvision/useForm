import React, { useCallback, useEffect, useRef, useState } from 'react';
import useKey from './useKey';

const extractPath = string => {
	return string.replace(/\[|\]\.?/g, '.').split(/[\.\[\]\'\"]/);
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
	const idx = Number(next);
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
	const idx = Number(next);
	if (!Number.isNaN(idx)) {
		target[path] = target[path] || [];
		// NOTE: this makes entries undefined instead of empty
		// target[path] = [...target[path]];
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
	const idx = Number(next);
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
	const key = useKey();

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
			return newValues;
		});

		if (isTouched === false) {
			setIsTouched(true);
		}

		if (hasError(fullPath)) {
			const newValues = { ...values };
			setDeep(pathArray, newValues, value);
			const newValidation = validate(newValues);
			const error = getDeep(pathArray, newValidation);
			const newErrors = { ...errors };
			setDeep(pathArray, newErrors, error);
			setErrors(newErrors);
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
		setValues(defaultValues);
		setErrors(validate(defaultValues));
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
		},
	};
};

export default useForm;

export const yupResolver = schema => {
	return fields => {
		try {
			schema.validateSync(fields, { abortEarly: false });
		} catch (validationError) {
			const errors = {};
			validationError.inner.forEach(error => {
				const err = {
					message: error.message,
					type: error.type,
				};
				setDeep(extractPath(error.path), errors, err);
			});
			return errors;
		}
		return {};
	};
};
