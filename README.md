# useForm
React forms hook, lightweight alternative to existing frameworks.

[See full demo](https://k7s4y.csb.app/)

Concerned about performance? Try this demo, optimized with with React.memo:

[400 form inputs](https://7izw4f.csb.app/)

## Installation
```bash
npm install --save @rvision/use-form
```
or
```bash
yarn add @rvision/use-form
```

## Quickstart: basic usage
```jsx
const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  agree: false
};

const Form = () => {
  const {
    register,
    handleSubmit,
  } = useForm({
    defaultValues
  });

  const onSubmit = values =>  console.log(values); // handles form submit: call API, etc.

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Enter first name:
          <input type="text" {...register('firstName')} />
        </label>
        <label>
          Enter last name:
          <input type="text" {...register('lastName')} />
        </label>
        <label>
          Enter email:
          <input type="email" {...register('email')} />
        </label>
        <label>
          <input type="checkbox" {...register('agree')} />
          I agree to terms and conditions
        </label>
        <button type="submit">
          Register
        </button>
    </div>
  );
}
```

## Another form library?
Recently, [react-hook-form](https://react-hook-form.com/) gained stellar popularity because it's easy to use and it uses uncontrolled components, making it very performant. And it works fine. Unless you have to deal with complex, dynamic forms, then you'll have to use ```formState, control, Controller, useController, useFormContext, watch, useWatch, useFormState, useFieldArray``` and on and on. This imperative not to "re-render" form component ended up in having multiple useEffects and derived states which makes your code harder to reason about. [Removing unnecessary Effects will make your code easier to follow, faster to run, and less error-prone.](https://beta.reactjs.org/learn/escape-hatches#you-might-not-need-an-effect).

## Motivation
I ended building this library because the code for the complex forms was absolute horror.
This library works with **controlled components only**, meaning that on each keystroke in input field, whole form will be re-rendered. Performance depends on the **number** and **types** of components used. For native inputs, it is decently fast, for custom components, your mileage may vary.
Note that handlers have **stable references**. This allows you to memoize parts of big forms and achieve better [rendering performance](https://7izw4f.csb.app/). If you have hundreds of inputs in your form, you're not building a form, you are building Excel clone an you should probably use uncontrolled inputs.

## Goals
- **0 dependencies**
- **lightweight**: ~3.5kb minified & gzipped
- **simplicity**: low learning curve
- **nested arrays** without hassle
- **un-opinionated** - components freedom: doesn't force you to use any specific component for inputs or form, it allows use of native input fields via ```register``` and custom components via ```getValue/setValue``` functions
- **stable handlers** allow easily to memoize rendering
- **schema-based validation**: sync validation support for [yup](https://github.com/jquense/yup) and [zod](https://github.com/colinhacks/zod) included
- **natural way** to reference to any field with regards of the initial object shape/structure. For example:

```js
getValue('firstName') // 1st level property
setValue('birthDate') // 1st level property
getValue('departments.5.employees.3.tasks.1.name')	// nested property, name of second task
trigger('cities.2.population')	// nested property, population of third city
getValue('artists.1.albums.2')	// nested property, third album of the second artist
```

Let's call this identifier ```fullPath```. Most of the methods to work with fields and errors will use this naming convention for operations.

### Hook options
```js
useForm({
	defaultValues: {},
	mode: 'onSubmit',
	focusOn: fullPath,
	classNameError: null,
	shouldFocusError: false,
	resolver: () => {}
});
```

**Property**       | **Type**      | **Description**
--------------- | ------------- | --------------------------------------------------------------
```defaultValues```| ```object```        | initial form values; for new records it has to be populated with default values (e.g. empty strings, true/false, date, etc.)
```mode```      | ```'onSubmit' / 'onChange' / 'onBlur'```  | validation mode, see below
```focusOn```      | ```string```  | fullPath to registered input via (register or setRef) that will be focused when form is mounted
```classNameError``` | ```string```        | Registered fields with validation error will have this css class name appended to their className list. Errors and Error components will use this class name also
```shouldFocusError``` | ```bool```        | if field has validation error, it will focus on error field when validation mode is onBlur. Also, when form is submitted and there are errors, it will focus on the first field with validation error
```resolver``` | ```function(fieldValues)```    | validation function, yupResolver and zodResolver are provided for [yup](https://github.com/jquense/yup) and [zod](https://github.com/colinhacks/zod) or you can write your custom



### Validation
**Mode**       | **Description**
---------------| ------------------------------------------------------------------------------------------------------------------
 <none> |  default validaton behaviour: validates when form is submitted, if there are any validation errors - when edited, fields with errors will be re-validated like ```'onChange'``` mode. Like a combination of ```'onSubmit'``` and ```'onChange'``` modes. I find this pattern suitable for most use cases.
 ```'onSubmit'```    |   validates when form is submitted, if there are any validation errors - when edited, errors will be removed for fields with errors and revalidated on next form submit
 ```'onChange'``` |  validates form fields on each change
 ```'onBlur'``` |  validates fields when focused out. For registered inputs, it will trap user to the field if ```shouldFocusError``` option is set to true


### Returned props
```js
const {
	register,
	getValue,
	setValue,
	onChange,
	onBlur,
	getRef,
	setRef,
	trigger,
	handleSubmit,
	hasError,
	getError,
	clearError,
	setErrors,
	array: {
		clear,
		append,
		prepend,
		remove,
		swap,
		insert,
	},
	key,
	Error,
	Errors,
	formState: {
		errors,
		isValid,
		isTouched,
		isDirty,
		hadError,
		reset,
	},
} = useForm(options);
```

#### register(fullPath: string, className: string )

field registration method for native inputs; uses ```fullPath``` concept to identify the field in the object hierarchy; className is used with classNameError setting if field has validation error
```jsx
{/* Examples: */}
<input type="text" {...register('movies[${i}].coStars[${j}].firstName')} />
{/* or */}
<input type="checkbox" {...register('agreeToTermsAndConditions')} />
{/* or */}
<input type="number" {...register('employee[5].age', 'my-number-input' )} />
{/* or */}
<input type="radio" {...register('radio')} checked={String(getValue('radio')) === String(option.id)} value={option.id} />
{/* or */}
<select {...register('cars[2].stereo')}>
	<option key="mp3" value="mp3">MP3 player</option>
	<option key="cd" value="cd">CD player</option>
</select>
```
**NOTE**
Only input type that doesn't allow automatic registration is file type, because of the browser security. You can only use ```onChange``` event to set the value, but you cannot display it. Here is an example how to deal with those fields:
```jsx
<div className="field-body">
	{getValue('files').map((file, idx) => {
		return (
			<React.Fragment key={key(file || key())}>
				<div className="file">
					<label className="file-label">
						<input className="file-input" name={`files[${idx}]`} type="file" onChange={onChange} />
						<span className="file-cta">
							<span className="file-label">{(file || {}).name || 'Choose a file…'}</span>
						</span>
					</label>
				</div>
				<Error for={`files[${idx}]`} />
			</React.Fragment>
		);
	})}
</div>
```


#### getValue(fullPath: string) : any

method to get value of the field, uses ```fullPath``` concept as field identifier. use it for custom components
```jsx
<ReactDatePicker selected={getValue('birthDate')} />
```

#### setValue(fullPath: string, newValue: any, shouldRevalidate: true)

method to set value of the field, uses ```fullPath``` concept as field identifier. promise returns new values/errors object. use it for custom components.
```jsx
<ReactDatePicker
	onChange={date => {
		setValue('movies.3.releaseDate', date, false);
	}}
/>
{/* or */}
<a onClick={setValue('movies',[])}>Clear movie list</a>{/* NOTE:use array.clear if you want to preserve existing validation errors */}
```

#### onChange(event: React.SyntheticEvent)

if you need debouncing or additional logic when field value is changed, use ```'onChange'``` method; it overrides default method set by register
```jsx
<input
	type="text"
	{...register('firstName')}
	onChange={e => {
		// additional logic
		onChange(e);
	}}
/>
```

#### onBlur(event: React.SyntheticEvent)

same, but for ```onBlur``` event
```jsx
<input
	type="text"
	{...register('firstName')}
	onBlur={e => {
		//additional logic
		onBlur(e);
	}}
/>
```

#### getRef(fullPath: string)

helper method to get reference (ref) to the native input, uses ```fullPath``` concept as field identifier
```jsx
<a onClick={() => {
	getRef(`movies[${i}].coStars[0].firstName`).focus()
}}>
```

#### setRef(fullPath: string, element: ref-able DOM element)

helper method to store reference (ref) to the native input, uses ```fullPath``` concept as field identifier; Use it for storing refs for custom components, this way they can be focusable when clicking on the error in the list of errors from ```<Errors />``` component
```jsx
<ReactDatePicker
	selected={getValue('birthDate')}
	ref={ref => {
		if (ref && ref.input) {
			setRef('birthDate', ref.input);
		}
	}}
	onChange={date => {
		setValue('birthDate', date);
	}}
/>
{/* or */}
<Select
	placeholder="Select Genre(s)"
	ref={ref => setRef(`movies.${idx}.genres`, ref)}
	onChange={options => {
		setValue(`movies.${idx}.genres`, options);
	}}
/>
```


#### hasError(fullPath: string?, targetErrors: any?) : bool

returns bool if field value has validation errors; if ```fullPath``` is omitted returns if there are any errors for all fields
```jsx
{hasError('firstName') && <p>This field has errors</p>}
```

#### getError(fullPath: string?, targetErrors: any?) : any

returns error object (type/message) if field value has validation errors; if ```fullPath``` is omitted returns errors for all fields
```jsx
{hasError('firstName') && <p>{getError('firstName').message}</p>}
```

#### clearError(fullPath: string)

clears error from the errors object for specific fullPath
```jsx
<a onClick={clearError('firstName')}>Clear firstname validation error</a>
```

#### setErrors(errors: object)

allows to set validation errrors from other parts of the system (e.g. API or similar)
```jsx
setErrors({
	email: {
		type: 'duplicate',
		message: 'This email address is already in use',
	},
	['otherFields[2].otherProperty']: {
		type: 'invalid',
		message: 'This property is invalid',
	},
});
```

#### trigger(fullPath: string? | string[], newValues: any?) : Promise<{errors: any, values: any}>

triggers validation on default form values object or passed newValues; it re-validates only the error with ```fullPath```; returns errors in promise
```jsx
<a onClick={trigger('firstName').then(errors => console.log(errors))}>Check first name</a>
```

#### Error

React component to display field validation error, can be used with render props or can be wrapped to customize the error markup; visible only if there is a validation error; if set, uses classNameError from the options
```jsx
<Error for="movies[3].actors[0].firstName">{({ type, message }) => <p className="my-custom-css-class">{message}</p>}</Error>
{/* or */}
<Error for="firstName" />	// => this will render <span className="required classNameError">First name is required</span>
```

#### Errors

React component that renders validation summary with all validation errors as ```<li />```. If ```focusable```, each of the errors will behave like a link when clicked and focus on the input with error. Can be used with render prop or without.
```jsx
<Errors focusable>
	{errorList => (
		<div className="notification is-danger">
			<ul className="validation-errors">{errorList}</ul>
		</div>
	)}
</Errors>
{/* or */}
<Errors focusable={false} />	// => will render <li>Please enter first name</li>... etc.
```

#### handleSubmit(handler: function) : bool

performs validation first; prevents default event; submits form data to handler function; focuses on first field with error (if errors exist and ```shouldFocusError``` is set to true); returns true if form was submitted, otherwise false
```jsx
<button type="submit" onClick={handleSubmit(values => console.log(values))}>
	Save the form
</button>
{/* or */}
<form onSubmit={handleSubmit(onSubmit)}>
	<button type="submit">Submit</button>
</form>
```

#### key(any?): string

helper method to get unique keys for siblings when rendering arrays. It works by utilizing WeakMap where objects are keys. Can be used to generate unique id's as well, by omitting the object parameter (e.g. key()). It keeps same keys even for new objects, modified via setValue


**NOTE:** it is advised to use stable keys, so if you have database uuid, give it a priority:
```jsx
{getValue(`movies[${i}].coStars`).map((star) => {
	return (
		<li key={star.id || key(star)}>
			...other markup
		</li>
	)
}
```

### Methods to work with arrays

**NOTE:** Pass reValidate parameter as true if you want to trigger validation (if set mode requires it (onSubmit, onChange, onBlur)), otherwise false. This allows flexibility in behaviour, e.g. if you are adding an element to array which already has error on let's say 1st element, but limit of the array size is 2

#### array.clear(fullPath: string)

clears existing array
```jsx
<button onClick={e => {
	e.preventDefault();
	array.clear('albums');
}}>Clear albums</button>
```

#### array.append(fullPath: string, newValue: any)

appends new object to the existing array of objects
```jsx
<button onClick={e => {
	e.preventDefault();
	array.append('albums', { name: '', releaseDate: null });
}}>Add new album</button>
```

#### array.prepend(fullPath: string, newValue: any)

prepends new object to the existing array of objects
```jsx
<button onClick={e => {
	e.preventDefault();
	array.prepend('movies[3].actors', { name: '' });
}}>Add new actor</button>
```

#### array.remove(fullPath: string, index: int)

removes array item from the existing array
```jsx
<button onClick={e => {
	e.preventDefault();
	array.remove('movies[3].actors', 3);
}}>Remove this actor</button>
```

#### array.swap(fullPath: string, index1: int, index2: int)

swaps item positions in the existing array, useful for drag'n'drop operations
```jsx
<button onClick={e => {
	e.preventDefault();
	array.swap('movies[3].actors', 0, 1);
}}>Swap actors</button>
```

#### array.insert(fullPath: string, index: int, newValue: any)

inserts item to the array at specific index
```jsx
<button onClick={e => {
	e.preventDefault();
	array.insert('movies[3].actors', { firstName: 'James', lastName: 'Dean' }, 5);
}}>Swap actors</button>
```

### Form state props
These props return current form state and reset function
```js
formState: {
	errors: object,
	isValid: bool,
	isTouched: bool,
	isDirty: bool
	hadError: bool,
	reset: (values?: any, reValidate?: boolean) => void;
}
```

#### errors: object

object with validation errors; shape of this object follows the shape/structure of form values

#### isValid: bool

true if there are no validation errors; when mode is ```'onSubmit'```, errors and this field will be populated when form is submitted

#### isTouched: bool

true if any of the fields are changed

#### isDirty: bool

true if any of form values is different than default ones provided

#### hadError: bool

true if any of form data changes produced validation errors

#### reset(newValues: any?, reValidate: bool)

resets the form to newValues or default ones; triggers revalidation based on reValidate parameter
```jsx
<button type="button" onClick={formState.reset}>
	Reset the form
</button>
```

#### Contributions
PRs welcome

#### Roadmap/plan
- target size: below 4kb
- no async validation currently
- no fields validation code will be introduced; it's pointless since there are alredy a bunch of libraries that do that


## Changelog

<= v1.0.29:
- Errors component doesn't render ghost errors (without message)
- better class names for errors

<= v1.0.28:
- removed id property, useId is better
- added focusOn option

<= v1.0.24:
- fixed number detection
- refactored trigger
- removed promises and revalidate flag form array operations
- reset form fix
- exports getError
- _deleteNested fix
- removed cloning of initial values
- introducing Promises for trigger and setValue
- react & react-dom: same versions in dev and peer dependencies
- fix for null defaultValues, minor improvements
- setValue returns new values; trigger triggers validation for whole object if fullPath is undefined
- trigger accepts multiple fullPaths; defaultValues doesn't create new instances when null is passed; setCustomErrors use useEvent
- added useEvent for stable handler references; fix yupResolver export
- register method does not accept object as second parameter (className), but plain string


## License

MIT

**Free Software, Hell Yeah!**