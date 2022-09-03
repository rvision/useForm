# useForm
React forms utility library, lightweight alternative to existing frameworks.

[see full demo](https://k7s4y.csb.app/)

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

  const onSubmit = values => console.log(values);

  return (
    <div>
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
        <button type="submit" onClick={handleSubmit(onSubmit)}>
          Register
        </button>
    </div>
  );
}
```

## Another form library?
If you need performant forms library, please use [react-hook-form](https://react-hook-form.com/).

If you think ```formState, control, Controller, useController, useFormContext, watch, useWatch, useFormState, useFieldArray``` is complicated to use, then read on.

## Introduction
This library works with **controlled components only**. Performance and number of re-renders depends on the **number** and **types** of components used. For native inputs, it is fast, for custom components, your mileage may vary.

## Goals
- **0 dependencies**
- **lightweight**: ~3.1kb minified & gzipped
- **simplicity: low learning curve**
- **nested arrays** support without hassle
- **un-opinionated - components freedom**: doesn't force you to use any specific component for inputs or form, it embraces use of native input fields via ```register``` and custom components via ```getValue/setValue``` methods
- **natural way** to reference to any field with regards of the initial object shape/structure. For example:

```js
firstName // 1st level property
birthDate // 1st level property
departments[5].employees[3].tasks[1].name	// or departments.5.employees.3.tasks.1.name - nested property, name of second task
cities[2].population	// or cities.2.population, whatever suits you better - nested property, population of third city
artists[1].albums[2]	// or artists.1.albums.2, whatever suits you better - nested property, third album of the second artist
```

Let's call this identifier ```fullPath```. Most of the methods to work with fields and errors will use this naming convention for operations.

### Hook options
```js
useForm({
	defaultValues: {},
	mode: 'onSubmit',
	classNameError: null,
	shouldFocusError: false,
	resolver: () => {}
});
```

**Field**       | **Type**      | **Description**
--------------- | ------------- | --------------------------------------------------------------
```defaultValues```   | ```object```        | initial form values; for new records it has to be populated with default values (e.g. empty strings, true/false, etc.)
```mode```            | ```'onSubmit'/'onChange'/'onBlur'```   | validation behaviour: ```onSubmit``` validates form when submitting, ```onChange``` when field is edited, ```onBlur``` when field is blurred
```classNameError``` | ```string```        | If set, registered fields with errors will have this css class name appended to their className list
```shouldFocusError``` | ```bool```        | if field has errors, it will focus on error field - when? depends on the mode
```resolver``` | ```function(fieldValues)```    | validation function; currently only [yup](https://github.com/jquense/yup) is supported out-of-the-box (```yupResolver```), but adding more can be done easily

### Returned props
```js
const {
	register,
	onChange,
	onBlur,
	getValue,
	setValue,
	getRef,
	setRef,
	Error,
	Errors,
	trigger,
	hasError,
	clearError,
	setErrors,
	key,
	append,
	prepend,
	remove,
	swap,
	reset,
	handleSubmit,
	formState: {
		errors,
		isValid,
		isTouched,
		isDirty,
	}
} = useForm(options);
```

#### register(fullPath: string, className: string )

field registration method for native inputs; uses ```fullPath``` concept to identify the field in the object hierarchy; options object with className is used to concat this className with classNameError setting if field has validation error
```jsx
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
				<BulmaError for={`files[${idx}]`} />
			</React.Fragment>
		);
	})}
</div>
```

#### onChange(event: React.SyntheticEvent)

if you need debouncing or additional logic when field value is changed, use ```'onChange'``` method; it overrides default method set by register
```jsx
<input
	type="text"
	{...register('firstName')}
	onChange={e => {
		//additional logic
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

#### key(any?): string

helper method to get unique keys for siblings when rendering arrays. It works by utilizing WeakMap where objects are keys. Can be used to generate unique id's as well, by omitting the object parameter (e.g. key()).


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

#### Error

React component to display field validation error, can be used with render props or can be wrapped to customize the error markup; visible only if there is a validation error; if set, uses classNameError from the options
```jsx
<Error for="movies[3].actors[0].firstName">{({ type, message }) => <p className="my-custom-css-class">{message}</p>}</Error>
{/* or */}
<Error for="firstName" />	// will render <span className="required classNameError">First name is required</span>
```

#### Errors

React component that renders all validation errors **for focusable inputs** as ```<li />```, registered by ```register``` method or for custom components that passed the ref via ```setRef``` method. Each of the errors will behave like a link when clicked if prop, focuses on the input with error. Can be used with render prop or without.
```jsx
<Errors focusable>
	{errorList => (
		<div className="notification is-danger">
			<ul className="validation-errors">{errorList}</ul>
		</div>
	)}
</Errors>
{/* or */}
<Errors focusable={false} />	// will render <li>Please enter first name</li>... etc.
```

#### getValue(fullPath: string) : any

method to get value of the field, uses ```fullPath``` concept as field identifier. use it for custom components
```jsx
<ReactDatePicker selected={getValue('birthDate')} />
```

#### setValue(fullPath: string, newValue: any, shouldRevalidate: true)

method to set value of the field, uses ```fullPath``` concept as field identifier. use it for custom components.
```jsx
<ReactDatePicker
	onChange={date => {
		setValue('movies.3.releaseDate', date, false);
	}}
/>
{/* or */}
<a onClick={setValue('movies',[])}>Clear movie list</a>
```

#### trigger(fullPath: string?, newValues: any) : any

triggers validation on default form values object or passed newValues; it re-validates only the error with ```fullPath```; returns errors
```jsx
<a onClick={trigger('firstName')}>Check first name</a>
```

#### hasError(fullPath: string?) : bool

returns bool if field value has validation errors; if ```fullPath``` is omitted returns if there are any errors for all fields
```jsx
{ hasError('firstName') && <p>This field has errors</p>}
```

#### clearError(fullPath: string) : any

clears error from the errors object, returns errors
```jsx
<a onClick={clearError('firstName')}>Clear firstname validation error</a>
```

#### setErrors(errors: object) : any

used to set validation errrors from other parts of the system (API or similar); sets 1 or more errors via errors object: keys are fullPath identifiers, values are message/type error objects; returns errors
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

#### handleSubmit(handler: function) : bool

submits form data to handler function; performs validation first; prevents default event; focuses on first field with error (if errors exist and ```shouldFocusError``` is set to true); returns true/false if form was submitted
```jsx
<button type="submit" onClick={handleSubmit(values => console.log(values))}>
	Save the form
</button>
```

#### reset(newValues: any?, reValidate: bool)

resets the form to newValues or default ones; triggers revalidation based on second parameter
```jsx
<button type="submit" onClick={() => reset()}>
	Reset the form
</button>
```

### Methods to work with arrays

#### append(fullPath: string, newValue: any) : any[]

appends new object to the existing array of objects; returns resulting array
```jsx
<button onClick={e => {
	e.preventDefault();
	append('albums', { name: '', releaseDate: null });
}}>Add new album</button>
```

#### prepend(fullPath: string, newValue: any) : any[]

prepends new object to the existing array of objects; returns resulting array
```jsx
<button onClick={e => {
	e.preventDefault();
	prepend('movies[3].actors', { name: '' });
}}>Add new actor</button>
```

#### remove(fullPath: string, index: int) : any[]

removes array item from the existing array; returns resulting array
```jsx
<button onClick={e => {
	e.preventDefault();
	remove('movies[3].actors', 3);
}}>Remove this actor</button>
```

#### swap(fullPath: string, index1: int, index2: int) : any[]

swaps item positions in the existing array, useful for drag'n'drop operations; returns resulting array
```jsx
<button onClick={e => {
	e.preventDefault();
	swap('movies[3].actors', 0, 1);
}}>Swap actors</button>
```

### Form state props
These props return current form state
```js
formState: {
	errors: object,
	isValid: bool,
	isTouched: bool,
	isDirty: bool
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

#### Contributions
PRs welcome

#### Roadmap
- no fields validation code will be introduced; it's pointless since there are alredy a bunch of libraries that do that


## Changelog

v1.0.12:

- trigger accepts multiple fiullPaths; defaultValues doesn't create new instances when null is passed; setCustomErrors use useEvent

v1.0.10:

- added useEvent for stable handler references; fix yupResolver export

v1.0.8:

- register method does not accept object as second parameter (className), but plain string


## License

MIT

**Free Software, Hell Yeah!**