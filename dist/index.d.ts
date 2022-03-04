export interface UseFormOptions {
	/**
   * Object with initial values of form fields
   */
	defaultValues?: {}
	/**
   * Validation mode
   *
   * "onSubmit" - first validation is triggered when form is submitted, then on every input change if there are field errors;
   * "onBlur" - when field is blurred;
   * "onChange" - on every field change
   */
    mode?: "onSubmit" | "onBlur" | "onChange"
	/**
	 * If registered field has validation error, this className is added when re-rendering the field (e.g. css class to add red border)
	 */
    classNameError?: string
	/**
	 * When form is submitted or when "onBlur" validation mode is set, it focuses to the first field with validation error
	 */
    shouldFocusError?: boolean;
	/**
	 * Validation errors resolver: object with validation errors, same shape as defaultValues property object.
	 * Eeach error entry should be object with type/message properties. Empty object ({}) means there are no validation errors.
	 * Currently only yupResolver is supported out-of-the-box
	 */
    resolver?: (values: any) => {};
}

declare function useForm(options: UseFormOptions): {
	/**
	 * Gets the current value of the field
	 */
    getValue: (fullPath?: string) => any;
	/**
	 * Sets the current value of the field. Triggering validation afterwards is optional
	 */
    setValue: (fullPath: string, value: any, validate?: boolean = true) => void;
	/**
	 * Registers input to get/set form value automatically. "fullPath" is set to the name property of the input field. Returns spreadable properties for input field
	 */
    register: (fullPath: string, { className }?: {
		/**
		 * Adds this className to the input field. If field has validation errors, classNameError will be appended to this value
		 */
        className?: string;
    }) => any;
	/**
	 * Handles onChange event from registered fields
	 */
    onChange: (e: any) => void;
	/**
	 * Handles onBlur event from registered fields
	 */
    onBlur: (e: any) => void;
	/**
	 * Returns ref of the registered field
	 */
    getRef: (fullPath: string) => any;
	/**
	 * Sets ref for non-registered input components
	 */
    setRef: (fullPath: string, element: any) => void;
	/**
	 * Triggers validation on existing form field values or newValues, if passed. Returns errors object
	 */
    trigger: (fullPath?: string, newValues?: any) => {};
	/**
	 * Handles form submit. If triggred by button, calls preventDefault. Triggers validation, and if there are errors, returns false and focuses first error field if "shouldFocusError" option is set to true, otherwise returns false and calls wrapped function
	 */
    handleSubmit: (handler: any) => (e: any) => boolean;
	/**
	 * Returns true if field has validation error. Can be invoked on custom errors object
	 */
    hasError: (fullPath?: any, targetErrors?: any) => boolean;
	/**
	 * Clears field error. Can be invoked on custom errors object. Returns errors object
	 */
    clearError: (fullPath: string, targetErrors?: any) => any;
	/**
	 * Sets custom errors object if needed. Should be same shape as defaultValues property object. Returns resulting errors object
	 */
    setErrors: (errorsObj: any) => any;
	/**
	 * Appends new object to the existing array of objects. Returns resulting array
	 */
    append: (fullPath: string, object: any) => any[];
	/**
	 * Prepends new object to the existing array of objects. Returns resulting array
	 */
    prepend: (fullPath: string, object: any) => any[];
	/**
	 * Removes object from the existing array at specified index. Returns resulting array
	 */
    remove: (fullPath: string, index: number) => any[];
	/**
	 * Swaps 2 elements in the existing array. Returns resulting array
	 */
    swap: (fullPath: string, index1: number, index2: number) => any[];
	/**
	 * Generates unique keys for siblings when rendering arrays
	 */
    key: (object: any) => string;
	/**
	 * Resets the form values to desired state. Triggers validation afterwards is optional
	 */
    reset: (values?: {}, validate?: boolean) => void;
	/**
	 * React component to display field validation error, if exists. Can be used as render prop (({ message, type }) => ...) or regular component (rendered as <span />)
	 */
    Error: ({ for: fullPath, children }: {
		/**
		 * fullPath field name
		 */
        for: string;
        children: any;
    }) => any;
	/**
	 * React component that lists all validation errors as a summary list
	 */
    Errors: ({ focusable = false, children }: {
		/**
		 * Should element in list be clickable - focuses on the registered field with validation error
		 */
		focusable?: boolean;
        children: any;
    }) => any;
	/**
	 * Current form state
	 */
    formState: {
		/**
		 * Object with validation errors, same shape as defaultValues property object
		 */
        errors: any;
		/**
		 * True if there are no validation errors. When mode is "onSubmit", errors and this field will be populated when form is submitted
		 */
        isValid: boolean;
		/**
		 * True if any of form fields values was touched
		 */
        isTouched: boolean;
		/**
		 * True if any of the fields are changed compared to defaultValues
		 */
        isDirty: boolean;
    };
};
export default useForm;
export function yupResolver(schema: any): (fields: any) => {};