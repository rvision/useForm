export interface UseFormOptions {
	/**
   * initial values of form fields
   */
	defaultValues?: {}
	/**
   * "onSubmit" | "onBlur" | "onChange"
   */
    mode?: "onSubmit" | "onBlur" | "onChange"
    classNameError?: string // className to use when rendering error
    shouldFocusError?: boolean;
    resolver?: (values: any) => {};
}

declare function useForm(options: UseFormOptions): {
    getValue: (fullPath?: string) => any;
    setValue: (fullPath: string, value: any, validate?: boolean) => void;
    register: (fullPath: string, className?: string) => any;
    onChange: (e: any) => void;
    onBlur: (e: any) => void;
    getRef: (fullPath: string) => any;
    setRef: (fullPath: string, element: any) => void;
    trigger: (fullPath?: string, newValues?: any) => {};
    handleSubmit: (handler: any) => (e: any) => boolean;
    hasError: (fullPath?: any, targetErrors?: any) => boolean;
    clearError: (fullPath: string, targetErrors?: any) => any;
    setErrors: (errorsObj: any) => any;
    append: (fullPath: string, object: any) => any[];
    prepend: (fullPath: string, object: any) => any[];
    remove: (fullPath: string, index: number) => any[];
    swap: (fullPath: string, index1: number, index2: number) => any[];
    key: (object: any) => string;
    reset: (values?: {}, validate?: boolean) => void;
    Error: ({ for: fullPath, children }: {
        for: string;
        children: any;
    }) => any;
    Errors: ({ focusable, children }: {
		focusable?: boolean;
        children: any;
    }) => any;
    formState: {
        errors: any;
        isValid: boolean;
        isTouched: boolean;
        isDirty: boolean;
    };
};
export default useForm;

export const yupResolver: (schema: any) => (values: any) => any;
