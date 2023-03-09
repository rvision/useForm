/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
	deleteNestedToRoot,
	EMPTY_OBJECT,
	getErrorClassName,
	getInputValue,
	getNested,
	isArray,
	isFunction,
	key,
	noOp,
	objectKeys,
	resetSplitCache,
	setNested,
	swap,
	toJSON,
} from './core';

// inline useStableRef for better minification
//----------------------------------------------------------------------------------------
const useStableRef = callback => {
	const handlerRef = useRef(callback);
	handlerRef.current = callback;
	return useCallback((...args) => handlerRef.current(...args), []);
	// return useRef((...args) => handlerRef.current(...args)).current;
};

// reuse single object for register props
//----------------------------------------------------------------------------------------
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

	const hasError = useStableRef((fullPath = '', targetErrors = errors) =>
		fullPath === '' ? objectKeys(targetErrors).length > 0 : getNested(fullPath, targetErrors) !== undefined,
	);

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

	const shouldRevalidate = isOnChangeMode || (formHadError.current && isDefaultMode);
	const shouldRevalidateArray = shouldRevalidate && !isOnSubmitMode;

	// default errors revalidation when changing form values
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

	const setValue = useStableRef(
		(fullPath, value, resolveErrors = _resolveErrors) =>
			new Promise((resolve = noOp) => {
				setState(prevState => {
					const newValues = setNested(fullPath, prevState.values, value);

					isTouched.current = true;
					isDirty.current = defaultValuesJSON.current !== toJSON(newValues);

					// resolve errors elsewhere
					const newErrors = resolveErrors(fullPath, newValues);

					const newState = {
						values: newValues,
						errors: newErrors,
					};

					resolve(newState);
					return newState;
				});
			}),
	);

	// tracks positions or array errors when doing array operations
	const _backTrackArrayErrors = useStableRef((fullPath, reValidate, getNewArrayErrors) =>
		shouldRevalidateArray && reValidate
			? _resolveErrors
			: () => {
					let newErrors = errors;
					const errorsArray = getError(fullPath);
					if (isArray(errorsArray)) {
						const newErrorsArray = getNewArrayErrors(errorsArray);
						// if null returned, that means no errors exist (empty array, or no errors on array object)
						// then remove it from the errors tree to root
						if (newErrorsArray === null) {
							newErrors = deleteNestedToRoot(fullPath, newErrors);
						} else {
							if (errorsArray.message) {
								newErrorsArray.message = errorsArray.message;
								newErrorsArray.type = errorsArray.type;
							}
							newErrors = setNested(fullPath, errors, newErrorsArray);
						}

						// console.log(`newErrors`);
						// console.log(newErrorsArray);
					}
					return newErrors;
			  },
	);

	const clear = useStableRef((fullPath, reValidate = false) =>
		setValue(
			fullPath,
			[],
			// if there is no error on array object itself, return null to clear all errors
			_backTrackArrayErrors(fullPath, reValidate, errorsArray => (!errorsArray.message ? null : [])),
		),
	);

	const append = useStableRef((fullPath, object, reValidate = false) =>
		setValue(
			fullPath,
			[...getValue(fullPath), object],
			_backTrackArrayErrors(fullPath, reValidate, errorsArray => errorsArray),
		),
	);

	const prepend = useStableRef((fullPath, object, reValidate = false) =>
		setValue(
			fullPath,
			[object, ...getValue(fullPath)],
			_backTrackArrayErrors(fullPath, reValidate, errorsArray => [undefined, ...errorsArray]),
		),
	);

	const remove = useStableRef((fullPath, idx, reValidate = false) =>
		setValue(
			fullPath,
			getValue(fullPath).filter((_, i) => i !== idx),
			_backTrackArrayErrors(fullPath, reValidate, errorsArray => {
				const newErrors = errorsArray.filter((_, i) => i !== idx);
				// if array is empty and no error on array object itself, return null to clear all errors
				return newErrors.length === 0 && !errorsArray.message ? null : newErrors;
			}),
		),
	);

	const _swap = useStableRef((fullPath, index1, index2, reValidate = false) =>
		setValue(
			fullPath,
			swap(getValue(fullPath), index1, index2),
			_backTrackArrayErrors(fullPath, reValidate, errorsArray => swap(errorsArray, index1, index2)),
		),
	);

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

	const reset = useStableRef((values = defaultValues, reValidate = true) => {
		init(values);
		isTouched.current = false;
		isDirty.current = false;
		if (reValidate) {
			trigger('', values);
		}
	});

	const handleSubmit = handler => e => {
		// eslint-disable-next-line no-unused-expressions
		e && e.preventDefault();
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

	const Error = useStableRef(({ for: fullPath, children }) => {
		const error = getError(fullPath, errors);

		if (!error || !error.message) {
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
			const error = getError(fullPath);
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
			clear,
			append,
			prepend,
			remove,
			swap: _swap,
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
			hadError: formHadError.current,
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
