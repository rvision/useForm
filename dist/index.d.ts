import { FC, ReactNode, SyntheticEvent } from "react";

export interface UseFormOptions {
	/**
   * form identifier: set it only if you have multiple forms at once
   */
	id?: string;
	/**
   * initial values of form fields; do NOT declare them inline
   */
	defaultValues?: {};
	/**
   * "onSubmit" | "onBlur" | "onChange"
   */
    mode?: "onSubmit" | "onBlur" | "onChange";
	/**
	 * className to use when rendering error in registered inputs, Error and Errors components
	 */
    classNameError?: string;
	/**
	 * if set to true, when validating on form submit or field blur, it will focus the field if it is invalid
	 */
    shouldFocusError?: boolean;
	/**
	 * validation resolver: validates form values and returns errors object; currently yupResolver and zodResolver available
	 * @param values form values
	 * @returns errors object
	 */
    resolver?: (values: any) => any;
}

declare function useForm(options: UseFormOptions): {
	/**
	 * gets form property value via dot notation
	 * @param fullPath path to property, e.g. 'firstName'; for array items, use indexes - e.g. 'albums.3.name'
	 * @returns value
	 */
    getValue: (fullPath?: string) => any;
	/**
	 * sets form property value via dot notationh
	 * @param fullPath path to property, e.g. 'firstName'; for array items, use indexes - e.g. 'albums.3.name'
	 * @param value value to be set
	 */
    setValue: (fullPath: string, value: any) => void;
	/**
	 * registers native input via dot notationh
	 * @param fullPath path to property, e.g. 'firstName'; for array items, use indexes - e.g. 'albums.3.name'
	 * @param className css class that will be set to className property; if invalid, classNameError will be appended
	 * @returns object with handlers and properties (e.g. onChange, value, checked, etc.)
	 */
    register: (fullPath: string, className?: string) => any;
	/**
	 * onChange handler which sets form property value by using name property (dot notation)
	 * @param e event
	 */
    onChange: (e: SyntheticEvent) => void;
	/**
	 * onBlur handler which fires validation if onBlur mode is set
	 * @param e event
	 */
    onBlur: (e: SyntheticEvent) => void;
	/**
	 * gets HTMLElement if registered via register
	 * @param fullPath path to property, e.g. 'firstName'; for array items, use indexes - e.g. 'albums.3.name'
	 * @returns HTMLElement
	 */
    getRef: (fullPath: string) => HTMLElement;
	/**
	 * sets HTMLElement reference used for focus
	 * @param fullPath path to property, e.g. 'firstName'; for array items, use indexes - e.g. 'albums.3.name'
	 * @param element HTMLElement
	 */
    setRef: (fullPath: string, element: HTMLElement) => void;
	/**
	 * triggers validation on specific form field(s); if fullPath is omitted, it will validate whole form
	 * @param fullPath path(s) to properties to validate, e.g. 'firstName'; for array items, use indexes - e.g. 'albums.3.name'
	 * @returns Promise<{errors: any}>
	 */
    trigger: (fullPath?: string | string[]) => Promise<{errors: any, values: any}>;
	/**
	 * submit handler: use in form element (&lt;form onSubmit={handleSubmit(onSubmit)} onReset={onReset}&gt;) or directly on submit button (&lt;button type="submit" onClick={handleSubmit(onSubmit)} /&gt;)
	 * @param handler handler function
	 * @returns true if form is valid
	 */
    handleSubmit: (handler: Function) => (e: SyntheticEvent) => boolean;
	/**
	 * returns if field value is valid or not
	 * @param fullPath path to property, e.g. 'firstName'; for array items, use indexes - e.g. 'albums.3.name'
	 * @param targetErrors custom errors to test if field is valid
	 * @returns true if field value is valid, otherwise false
	 */
    hasError: (fullPath?: any, targetErrors?: any) => boolean;
	/**
	 * gets error details for field value
	 * @param fullPath path to property, e.g. 'firstName'; for array items, use indexes - e.g. 'albums.3.name'
	 * @param targetErrors custom errors to test if field is valid
	 * @returns error object if field value is invalid, otherwise undefined
	 */
    getError: (fullPath?: any, targetErrors?: any) => any;
	/**
	 * clears validation error for field
	 * @param fullPath path to property, e.g. 'firstName'; for array items, use indexes - e.g. 'albums.3.name'
	 */
    clearError: (fullPath: string) => void;
	/**
	 * sets custom errors object
	 * @param errorsObj errors object
	 */
    setErrors: (errorsObj: any) => void;
	/**
	 * array manipulations
	 */
	array: {
		/**
		 * clears all array elements
		 * @param fullPath path to array property, e.g. 'albums'
		 */
		clear: (fullPath: string) => void;
		/**
		 * appends array element at the end of the array
		 * @param fullPath path to array property, e.g. 'albums'
		 * @param object element to add to array
		 */
		append: (fullPath: string, object: any) => void;
		/**
		 * adds array element at the start of the array
		 * @param fullPath path to array property, e.g. 'albums'
		 * @param object element to add to array
		 */
		prepend: (fullPath: string, object: any) => void;
		/**
		 * removes element of the array at specific index
		 * @param fullPath path to array property, e.g. 'albums'
		 * @param index position of the element in the array to be removed
		 */
		remove: (fullPath: string, index: number) => void;
		/**
		 * swaps two elements in the array
		 * @param fullPath path to array property, e.g. 'albums'
		 * @param index1 position of the first element in the array
		 * @param index2 position of the second element in the array
		 */
		swap: (fullPath: string, index1: number, index2: number) => void;
	},
	/**
	 * returns stable key for objects to use as React key property (e.g. &lt;div key={key(object)}) /&gt;)
	 * @param object
	 * @returns hash string
	 */
    key: (object?: any) => string;
    Error: ({ for: fullPath, children }: {
        fullPath: string;
        children: ReactNode;
    }) => any;
    Errors: ({ focusable, children }: {
		focusable?: boolean;
        children: ReactNode;
    }) => any;
	/**
	 * form state information
	 */
    formState: {
		/**
		 * errors object tree
		 */
        errors: any;
		/**
		 * are the form values valid?
		 */
        isValid: boolean;
		/**
		 * is any of the fields 'touched' by user?
		 */
        isTouched: boolean;
		/**
		 * are form values dirty?
		 */
        isDirty: boolean;
		/**
		 * did form had any validation errors?
		 */
        hadError: boolean;
		/**
		 * resets the form values to initial or custom
		 * @param values sets custom values
		 * @param reValidate set to true if you want to revalidate form fields, false to skip validation
		 */
		reset: (values?: any, reValidate?: boolean) => void;
    };
};
export default useForm;

export const yupResolver: (schema: any) => (values: any) => any;
export const zodResolver: (schema: any) => (values: any) => any;
