/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
	backTrackKey,
	deleteNestedToRoot,
	EMPTY_OBJECT,
	extractPath,
	getErrorClassName,
	getInputValue,
	getNested,
	isFunction,
	key,
	noOp,
	objectKeys,
	resetSplitCache,
	setNested,
	shiftErrors,
	swap,
	toJSON,
} from './core';

// inline useStableRef for better minification
////----------------------------------------------------------------------------------------
const useStableRef = callback => {
	const handlerRef = useRef(callback);
	handlerRef.current = callback;
	return useCallback((...args) => handlerRef.current(...args), []);
	// return useRef((...args) => handlerRef.current(...args)).current;
};
// reuse single object for register props
////----------------------------------------------------------------------------------------
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

const useForm = ({ defaultValues, mode, classNameError, shouldFocusError = false, resolver = noOp }) => {
	const [state, setState] = useState({
		values: defaultValues || EMPTY_OBJECT,
		errors: {},
	});

	const { values, errors } = state;

	const isTouched = useRef(false);
	const isDirty = useRef(false);
	const formHadError = useRef(false);
	const refsMap = useRef(new Map());
	const defaultValuesJSON = useRef();

	// validates when submitting; any change in error field will remove error for that field (no matter if field is valid or not)
	const isOnSubmitMode = mode === 'onSubmit';
	// validates when field is blurred; be careful with shouldFocusError, it will trap the user to field
	const isOnBlurMode = mode === 'onBlur';
	// validates on any change
	const isOnChangeMode = mode === 'onChange';

	// default mode: no validations until submit, if any errors - validate onChange
	const isDefaultMode = !isOnSubmitMode && !isOnBlurMode && !isOnChangeMode;

	const setErrors = newErrors =>
		setState(prev => ({
			...prev,
			errors: newErrors,
		}));

	const init = useCallback(initValues => {
		const vals = initValues || EMPTY_OBJECT;
		defaultValuesJSON.current = toJSON(vals);
		setState(prev => ({
			...prev,
			values: { ...vals },
		}));
	}, []);

	useEffect(() => {
		init(defaultValues);
		// cleanup, ALWAYS
		return resetSplitCache;
	}, [defaultValues, init]);

	const focus = fullPath => {
		const element = refsMap.current.get(fullPath);
		if (element && element.focus) {
			element.focus();
			return true;
		}
		return false;
	};

	const getValue = useStableRef((fullPath = '') => {
		// NOTE: for <Errors /> to work properly
		if (!refsMap.current.has(fullPath)) {
			refsMap.current.set(fullPath, null);
		}
		return getNested(fullPath, values);
	});

	const getError = useStableRef((fullPath = '', targetErrors = errors) => getNested(fullPath, targetErrors));

	const hasError = useStableRef((fullPath = '', targetErrors = errors) => {
		return fullPath === '' ? objectKeys(targetErrors).length > 0 : getNested(fullPath, targetErrors) !== undefined;
	});

	const clearError = useStableRef((fullPath, targetErrors = errors) => {
		let newErrors = targetErrors;
		if (hasError(fullPath, targetErrors)) {
			newErrors = deleteNestedToRoot(fullPath, targetErrors);
		}
		return newErrors;
	});

	const trigger = useStableRef(
		(fullPath = '', newValues = values) =>
			new Promise((resolve = noOp) => {
				const newErrors = resolver(newValues);
				if (fullPath === '') {
					setErrors(newErrors);
					resolve(newErrors);
					return;
				}
				const paths = isArray(fullPath) ? fullPath : [fullPath];
				let updatedErrors = { ...errors };
				paths.forEach(fullPath => {
					const error = getNested(fullPath, newErrors);
					updatedErrors = deleteNestedToRoot(fullPath, updatedErrors);
					if (error !== undefined) {
						updatedErrors = setNested(fullPath, updatedErrors, error);
					}
				});
				setErrors(updatedErrors);
				resolve(updatedErrors);
			}),
	);

	// used in setValue
	const shouldRevalidate = isOnChangeMode || (formHadError.current && isDefaultMode);
	const shouldRevalidateArray = shouldRevalidate && !isOnSubmitMode;

	const _resolveErrors = useStableRef((fullPath, newValues) => {
		let newErrors = errors;
		if (shouldRevalidate || hasError(fullPath)) {
			// clear existing error
			newErrors = deleteNestedToRoot(fullPath, newErrors);
			// revalidate only if it isn't onSubmit mode
			if (!isOnSubmitMode) {
				const newError = getNested(fullPath, resolver(newValues));
				if (newError) {
					newErrors = setNested(fullPath, newErrors, newError);
				}
			}
		}
		return newErrors;
	});

	const _remapArrayErrors = useStableRef((fullPath, newErrors, newValues) => {
		const newError = getNested(fullPath, resolver(newValues));
		const existing = getNested(fullPath, newErrors);
		if (existing) {
			delete existing.message;
			delete existing.type;
			if (newError?.message) {
				existing.message = newError.message;
				existing.type = newError.type;
			}
		}
		return newErrors;
	});

	const setValue = useStableRef(
		(fullPath, value, resolveErrors = _resolveErrors) =>
			new Promise((resolve = noOp) => {
				setState(prevState => {
					const newValues = setNested(fullPath, values, value);

					isTouched.current = true;
					isDirty.current = defaultValuesJSON.current !== toJSON(newValues);

					// resolve errors elsewhere
					const newErrors = resolveErrors(fullPath, newValues);

					const newState = {
						values: newValues,
						errors: newErrors,
					};

					// console.log(`newErrors`);
					// console.log(newState.errors);

					resolve(newState);
					return newState;
				});
			}),
	);

	const clear = useStableRef(fullPath => setValue(fullPath, [], shouldRevalidateArray ? _resolveErrors : () => []));

	const append = useStableRef((fullPath, object) => {
		const resolve = shouldRevalidateArray ? _resolveErrors : () => errors;
		return setValue(fullPath, [...getNested(fullPath, values), object], resolve);
	});

	const prepend = useStableRef((fullPath, object) => {
		const resolve = shouldRevalidateArray
			? _resolveErrors
			: (_, newValues) => {
					let newErrors = shiftErrors(fullPath, errors, arrErrors => [undefined, ...arrErrors]);
					return _remapArrayErrors(fullPath, newErrors, newValues);
			  };
		return setValue(fullPath, [object, ...getNested(fullPath, values)], resolve);
	});

	const remove = useStableRef((fullPath, idx) => {
		const resolve = shouldRevalidateArray // && !isArray(getError(fullPath))
			? _resolveErrors
			: (_, newValues) => {
					let newErrors = clearError(`${fullPath}.${idx}`, { ...errors });
					newErrors = shiftErrors(fullPath, newErrors, arrErrors => {
						arrErrors.splice(idx, 1);
						return arrErrors;
					});
					return _remapArrayErrors(fullPath, newErrors, newValues);
			  };
		return setValue(
			fullPath,
			getNested(fullPath, values).filter((item, i) => i !== idx),
			resolve,
		);
	});

	const _swap = useStableRef((fullPath, index1, index2) => {
		const resolve = shouldRevalidateArray // && !isArray(getError(fullPath))
			? _resolveErrors
			: (_, newValues) => {
					let newErrors = swap(getNested(fullPath, errors), index1, index2);
					newErrors = newErrors ? setNested(fullPath, errors, newErrors) : errors;
					return _remapArrayErrors(fullPath, newErrors, newValues);
			  };
		return setValue(fullPath, swap(getValue(fullPath), index1, index2), resolve);
	});

	const getRef = useStableRef(fullPath => refsMap.current.get(fullPath));

	const setRef = useStableRef((fullPath, element) => {
		if (element) {
			refsMap.current.set(fullPath, element);
		}
	});

	const ref = useStableRef(element => element && setRef(element.name, element));

	const onChange = useStableRef(e => setValue(e.target.name, getInputValue(e)));

	const onBlur = useStableRef(e => {
		const { name } = e.target;
		const newError = getNested(name, resolver(values));
		if (newError) {
			setErrors(setNested(name, errors, newError));
			if (shouldFocusError) {
				focus(name);
			}
		} else {
			setErrors(clearError(name));
		}
	});

	const register = useStableRef((fullPath, className = '') => {
		const value = getValue(fullPath);
		const hasFieldError = hasError(fullPath);

		registerProps.name = fullPath;
		registerProps['aria-invalid'] = hasFieldError;
		registerProps.className = getErrorClassName(EMPTY_OBJECT, hasFieldError ? classNameError : '', className);
		registerProps.onChange = onChange;
		registerProps.ref = ref;
		registerProps.onBlur = isOnBlurMode ? onBlur : undefined;

		if (value === true || value === false) {
			registerProps.checked = value;
			registerProps.value = undefined;
		} else {
			registerProps.value = `${value}` === '0' ? value : value || '';
			registerProps.checked = undefined;
		}

		return registerProps;
	});

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
			formHadError.current = true;
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
		const error = getError(fullPath, errors);

		if (!error?.message) {
			return false;
		}

		return isFunction(children) ? children(error) : <span className={getErrorClassName(error, classNameError)}>{error.message}</span>;
	});

	const isValid = !hasError();

	const Errors = useStableRef(({ children, focusable = false }) => {
		if (isValid) {
			return false;
		}

		// entry[0] = fullPath, entry[1] = element
		const errorPaths = Array.from(refsMap.current)
			.filter(entry => !!entry[1])
			.map(entry => entry[0])
			.filter(entry => hasError(entry, errors))
			.sort();

		const result = errorPaths.map(fullPath => {
			const error = getNested(fullPath, errors);
			return (
				<li key={fullPath} className={getErrorClassName(error, classNameError)}>
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
		clearError: fullPath => setErrors(clearError(fullPath)),
		setErrors: newErrors => {
			formHadError.current = true;
			setErrors(newErrors);
		},
		array: {
			append,
			prepend,
			remove,
			swap: _swap,
			clear,
		},
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

export const yupResolver = schema => formValues => {
	let errors = {};
	try {
		schema.validateSync(formValues, { abortEarly: false });
	} catch (validationError) {
		// eslint-disable-next-line no-restricted-syntax
		for (const error of validationError.inner) {
			const errorToEdit = getNested(error.path, errors) || {};
			errorToEdit.message = error.message;
			errorToEdit.type = error.type;
			errors = setNested(error.path, errors, errorToEdit);
		}
	}
	return errors;
};

export const zodResolver = schema => formValues => {
	let errors = {};
	const parsed = schema.safeParse(formValues);
	if (!parsed.success) {
		parsed.error.errors.forEach(error => {
			const path = error.path.join('.');
			const existingError = getNested(path, errors) || {};
			existingError.message = error.message;
			existingError.type = error.type;
			errors = setNested(path, errors, existingError);
		});
	}
	return errors;
};

export default useForm;
