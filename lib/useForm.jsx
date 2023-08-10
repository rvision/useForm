/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as core from './core';
const ARIA_INVALID = 'aria-invalid';
export const toJSON = obj => JSON.stringify(obj, (key, value) => (value instanceof Set ? [...value].sort() : value));
// inline useStableRef for better minification
//----------------------------------------------------------------------------------------
const functions = new Map();
const useStableReference = (hash, callback) => {
	functions.set(hash, callback);
	useEffect(() => {
		return () => functions.delete(hash);
	}, [hash]);

	return useCallback((...args) => functions.get(hash)(...args), [hash]);
};

// reuse single object for register props
//----------------------------------------------------------------------------------------
const registerProps = {
	name: '',
	[ARIA_INVALID]: false,
	className: '',
	onChange: core.noOp,
	onBlur: core.noOp,
	ref: core.noOp,
	value: '',
	checked: false,
};

const useForm = ({ id = '', defaultValues, mode, classNameError, shouldFocusError = false, resolver = core.noOp }) => {
	const [state, setState] = useState({
		values: defaultValues || core.EMPTY_OBJECT,
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

	// callback identifier, incremented for each stable function
	let callbackId = 1;
	const useStable = handler => useStableReference(id + callbackId++, handler);

	const setErrors = newErrors =>
		setState(prev => ({
			...prev,
			errors: newErrors,
		}));

	const init = useCallback(initValues => {
		const vals = initValues || core.EMPTY_OBJECT;
		defaultValuesJSON.current = toJSON(vals);
		setState(prev => ({
			...prev,
			values: { ...vals },
		}));
	}, []);

	useEffect(() => {
		init(defaultValues);
		return () => {
			// cleanup, ALWAYS
			core.resetSplitCache();
		};
	}, [defaultValues, init]);

	const focus = useCallback(fullPath => {
		const element = refsMap.current.get(fullPath);
		if (element && element.focus) {
			element.focus();
			return true;
		}
		return false;
	}, []);

	const getValue = useStable((fullPath = '') => {
		// NOTE: for <Errors /> to work properly
		if (!refsMap.current.has(fullPath)) {
			refsMap.current.set(fullPath, null);
		}
		return core.getNested(fullPath, values);
	});

	const getError = useStable((fullPath = '', targetErrors = errors) => core.getNested(fullPath, targetErrors));

	const hasError = useStable((fullPath = '', targetErrors = errors) =>
		fullPath === '' ? !core.isEmptyObjectOrFalsy(targetErrors) : core.getNested(fullPath, targetErrors) !== undefined,
	);

	const clearError = useStable((fullPath, targetErrors = errors) => {
		let newErrors = targetErrors;
		if (hasError(fullPath, targetErrors)) {
			newErrors = core.deleteNestedToRoot(fullPath, targetErrors);
		}
		return newErrors;
	});

	const trigger = useStable(
		(fullPath = '') =>
			new Promise((resolve = core.noOp) => {
				setState(prevState => {
					let newErrors = resolver(prevState.values);
					if (fullPath !== '') {
						const paths = Array.isArray(fullPath) ? fullPath : [fullPath];
						let pathsErrors = { ...prevState.errors };
						paths.forEach(fullPath => {
							// get error from new errors
							const error = core.getNested(fullPath, newErrors);
							// delete existing
							pathsErrors = core.deleteNestedToRoot(fullPath, pathsErrors);
							if (error !== undefined) {
								// set new error if exist
								pathsErrors = core.setNested(fullPath, pathsErrors, error);
							}
						});
						newErrors = pathsErrors;
					}
					const newState = {
						...prevState,
						errors: newErrors,
					};
					resolve(newState);
					return newState;
				});
			}),
	);

	const shouldRevalidate = isOnChangeMode || (formHadError.current && isDefaultMode);

	const setValue = useStable((fullPath, value) =>
		setState(prevState => {
			const newValues = core.setNested(fullPath, prevState.values, value);

			// set flags
			isTouched.current = true;
			isDirty.current = defaultValuesJSON.current !== toJSON(newValues);

			// resolve errors if needed
			let newErrors = errors;
			if (shouldRevalidate || hasError(fullPath)) {
				// clear existing error
				newErrors = core.deleteNestedToRoot(fullPath, newErrors);
				// revalidate only if it isn't onSubmit mode
				if (!isOnSubmitMode) {
					const newError = core.getNested(fullPath, resolver(newValues));
					if (newError) {
						newErrors = core.setNested(fullPath, newErrors, newError);
					}
				}
			}

			return {
				values: newValues,
				errors: newErrors,
			};
		}),
	);

	const _setArrayValue = useStable((fullPath, getArray, getArrayErrors) => {
		setState(prevState => {
			// calculate new form values
			const newValues = core.setNested(fullPath, prevState.values, getArray(core.getNested(fullPath, prevState.values)));

			// set flags
			isTouched.current = true;
			isDirty.current = defaultValuesJSON.current !== toJSON(newValues);

			// calculate new errors
			let newErrors = prevState.errors;
			const existingArrayErrors = core.getNested(fullPath, newErrors);

			// if errors exist in array form, get shifted errors from specific operation
			let newArrayErrors = [];
			if (Array.isArray(existingArrayErrors)) {
				newArrayErrors = getArrayErrors(existingArrayErrors);
			}

			// shouldRevalidateArray
			if (shouldRevalidate) {
				const resolved = core.getNested(fullPath, resolver(newValues));
				if (resolved && resolved.message) {
					const target = newArrayErrors.length > 0 ? newArrayErrors : {};
					target.message = resolved.message;
					target.type = resolved.type;
					newArrayErrors = target;
				}
			}
			// first, remove all array errors
			newErrors = core.deleteNestedToRoot(fullPath, newErrors);
			// if any errors exist in shifted array, set them
			if (newArrayErrors.length > 0 || newArrayErrors.message) {
				newErrors = core.setNested(fullPath, newErrors, newArrayErrors);
			}
			return {
				values: newValues,
				errors: newErrors,
			};
		});
	});

	const insert = useStable((fullPath, index, item) => {
		const insertItem = arr => core.insert(arr, index, item);
		const insertError = arr => core.insert(arr, index, undefined);
		_setArrayValue(fullPath, insertItem, insertError);
	});
	const append = useStable((fullPath, item) => insert(fullPath, getValue(fullPath).length, item));
	const prepend = (fullPath, item) => insert(fullPath, 0, item);
	const clear = useStable(fullPath => {
		const clearArr = () => [];
		_setArrayValue(fullPath, clearArr, clearArr);
	});
	const remove = useStable((fullPath, idx) => {
		// NOTE: clone array because .filter doesn't work properly with sparse arrays (errors)
		const removeByIdx = arr => [...arr].filter((_, i) => i !== idx);
		_setArrayValue(fullPath, removeByIdx, removeByIdx);
	});
	const swap = useStable((fullPath, index1, index2) => {
		const swapByIdx = arr => core.swap(arr, index1, index2);
		_setArrayValue(fullPath, swapByIdx, swapByIdx);
	});

	const getRef = useStable(fullPath => refsMap.current.get(fullPath));

	const setRef = useStable((fullPath, element) => {
		if (element) {
			refsMap.current.set(fullPath, element);
		}
	});

	const ref = element => element && setRef(element.name, element);

	const onChange = useStable(e => setValue(e.target.name, core.getInputValue(e)));

	const onBlur = useStable(e => {
		const { name } = e.target;
		const newError = core.getNested(name, resolver(values));
		if (newError) {
			setErrors(core.setNested(name, errors, newError));
			if (shouldFocusError) {
				focus(name);
			}
		} else {
			setErrors(clearError(name));
		}
	});

	const register = useStable((fullPath, className = '') => {
		const value = getValue(fullPath);
		const hasFieldError = hasError(fullPath);

		registerProps.name = fullPath;
		registerProps[ARIA_INVALID] = hasFieldError;
		registerProps.className = core.getErrorClassName(false, hasFieldError ? classNameError : '', className);
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

	const reset = useStable((values = defaultValues, reValidate = true) => {
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

	const Error = useStable(({ for: fullPath, children }) => {
		const error = getError(fullPath, errors);
		if (error?.message) {
			return core.isFunction(children) ? children(error) : <span className={core.getErrorClassName(error, classNameError)}>{error.message}</span>;
		}
		return false;
	});

	const isValid = !hasError();

	const Errors = useStable(({ children, focusable = false }) => {
		if (isValid) {
			return false;
		}

		// entry[0] = fullPath, entry[1] = element
		const errorPaths = Array.from(refsMap.current)
			.map(entry => entry[0])
			.filter(fullPath => fullPath !== '')
			.filter(fullPath => hasError(fullPath, errors))
			.sort();

		const result = errorPaths.map(fullPath => {
			const error = getError(fullPath);
			return (
				<li key={fullPath} className={core.getErrorClassName(error, classNameError)}>
					{focusable ? <a onClick={() => focus(fullPath)}>{error.message}</a> : error.message}
				</li>
			);
		});

		return core.isFunction(children) ? children(result) : result;
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
			swap,
			insert,
		},
		key: core.key,
		Error,
		Errors,
		formState: {
			errors,
			isValid,
			isTouched: isTouched.current,
			isDirty: isDirty.current,
			hadError: formHadError.current,
			reset,
		},
	};
};

export default useForm;
