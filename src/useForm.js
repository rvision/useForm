import React, { useCallback, useEffect, useRef, useState } from 'react';
import useKey from './useKey';

const useForm = ({ defaultValues = {}, validate }) => {
	const [values, setValues] = useState(defaultValues);
	const [errors, setErrors] = useState({});
	const [isTouched, setIsTouched] = useState(false);
	const key = useKey();

	const hasError = (propName = null) => {
		if (propName === null) {
			return Object.keys(errors).length > 0;
		}
		return !!errors[propName];
	};

	const getValue = (propName = null) => {
		if (propName.indexOf('.') >= 0) {
			const split = propName.split('.');
			const arr = split[0];
			const prop = split[2];
			const index = Number(split[1]);
			return values[arr][index][prop];
		}
		return values[propName];
	};

	const setValue = (propName, value) => {
		if (propName.indexOf('.') >= 0) {
			const split = propName.split('.');
			const newArr = [...values[split[0]]];
			const index = Number(split[1]);
			const prop = split[2];
			newArr[index][prop] = value;
			setValue(split[0], newArr);
			return;
		}

		setValues(values => ({
			...values,
			[propName]: value,
		}));

		if (isTouched === false) {
			setIsTouched(true);
		}

		if (hasError(propName)) {
			const newValues = { ...values };
			newValues[propName] = value;
			const newErrors = { ...errors };
			const newValidation = validate(newValues);
			if (newValidation[propName]) {
				newErrors[propName] = { ...newValidation[propName] };
				// todo: focus on field
			} else {
				delete newErrors[propName];
			}
			setErrors(newErrors);
		}
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

	const append = (propName, object) => {
		const newArr = [...values[propName], object];
		setValue(propName, newArr);
	};

	const prepend = (propName, object) => {
		const newArr = [object, ...values[propName]];
		setValue(propName, newArr);
	};

	const remove = fullName => {
		const split = fullName.split('.');
		const propName = split[0];
		const index = Number(split[1]);
		const newArr = [...values[propName]];
		newArr.splice(index, 1);
		setValue(propName, newArr);
	};

	const reset = () => {
		setValues(defaultValues);
	};

	const trigger = () => {
		setErrors(validate(values));
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
			if (Object.keys(errors).length === 0) {
				onSubmitHandler(values);
			} else {
				setErrors(errors);
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
			isValid: true,
			isTouched,
		},
	};
};

export default useForm;
