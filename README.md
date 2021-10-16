# useForm
React forms utility library, lightweight alternative to existing frameworks.

## demo
codesandbox links

## Another form library?
If you need performant forms library, please use [react-hook-form](https://react-hook-form.com/).

If you think formState, control, Controller, useController, useFormContext, watch, useWatch, useFormState, useFieldArray is complicated to use, then read on.

### Introduction
This library works with controlled components only. Performance of re-renders depends on the number and types of components used. For native inputs, it is fast, for custom components, your mileage may vary.

### Goals
- **low learning curve**
- **components freedom**: doesn't force you to use any specific component for inputs or form, it embraces use of native input fields via ```register``` and custom components via ```getValue/setValue``` methods
- reference to any field in a natural way, with regards of the initial object shape/structure. For example:

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
	shouldFocusError: false,
	resolver: () => {}
});
```

**Field**       | **Type**      | **Description**
--------------- | ------------- | --------------------------------------------------------------
```defaultValues```   | ```object```        | initial form values; for new records it has to be populated with default values (e.g. empty strings, true/false, etc.)
```mode```            | ```'onSubmit'/'onChange'/'onBlur'```   | validation behaviour: onSubmit validates form when submitting, onChange when field is edited, onBlur when field is blurred
```shouldFocusError``` | ```bool```        | if field has errors, it will focus on error field - when? depends on the mode
```resolver``` | ```function(fieldValues)```    | validation function; currently only [yup](https://github.com/jquense/yup) is supported out-of-the-box (yupResolver), but adding more can be done easily

### Returned props
```js
const {
	register,
	onChange,
	onBlur,
	key,
	getRef,
	Error,
	getValue,
	setValue,
	trigger,
	handleSubmit,
	hasError,
	clearError,
	append,
	prepend,
	remove,
	reset,
	formState: {
		errors,
		isValid,
		isTouched,
		isDirty,
	}
} = useForm(options);
```

**register(fullPath: string)**

field registration method for native inputs; uses fullPath concept to identify the field in the object hierarchy
```jsx
<input type="text" {...register('movies[${i}].coStars[${j}].firstName')} />
{/* or */}
<input type="checkbox" {...register('agreeToTermsAndConditions')} />
{/* or */}
<input type="number" {...register('employee[5].age')} />
{/* or */}
<input type="radio" {...register('radio')} checked={String(getValue('radio')) === String(option.id)} value={option.id} />
{/* or */}
<select {...register('cars[2].stereo')}>
	<option key="mp3" value="mp3">MP3 player</option>
	<option key="cd" value="cd">CD player</option>
</select>
```

**onChange(event: React.SyntheticEvent)**

if you need debouncing or additional logic when field value is changed, use onChange method; it overrides default method set by register
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

**onBlur(event: React.SyntheticEvent)**

same, but for onBlur event
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

**key(any?)**

helper method to get unique keys for siblings when rendering arrays. It works by utilizing WeakMap where objects are keys. Can be used to generate unique id's as well, by omitting the object parameter (e.g. key())
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

**getRef(fullPath: string)**

helper method to get reference (ref) to the native input, uses fullPath concept as field identifier
```jsx
<a onClick={() => {
	getRef(`movies[${i}].coStars[0].firstName`).focus()
}}>
```

**Error**

React component to display field validation error, can be used with render props or can be wrapped to customize the error markup; visible only if there is a validation error
```jsx
<Error for="movies[3].actors[0].firstName">{({ type, message }) => <p className="my-custom-css-class">{message}</p>}</Error>
{/* or */}
<Error for="movies[3].releaseDate" />	// will render <span className="validation-error">{err.message}</span>
```

**getValue(fullPath: string)**

method to get value of the field, uses fullPath concept as field identifier. use it for custom components
```jsx
<ReactDatePicker selected={getValue('birthDate')} />
```

**setValue(fullPath: string, newValue: any, shouldRevalidate: true)**

method to set value of the field, uses fullPath concept as field identifier. use it for custom components.
```jsx
<ReactDatePicker
	onChange={date => {
		setValue('movies.3.releaseDate', date, false);
	}}
/>
{/* or */}
<a onClick={setValue('movies',[])}>Clear movie list</a>
```

**trigger(fullPath: string?, newValues: any)**

triggers validation on default form values object or passed newValues; it re-validates only the error with fullPath
```jsx
<a onClick={trigger('firstName')}>Check first name</a>
```

**hasError(fullPath: string?)**

returns bool if field value has validation errors; if fullPath is omitted returns if there are any errors for all fields
```jsx
{ hasError('firstName') && <p>This field has errors</p>}
```

**clearError(fullPath: string)**

clears error from the errors object
```jsx
<a onClick={clearError('firstName')}>Clear firstname validation errors</a>
```

**handleSubmit(handler: function)**

submits form data to handler function; performs validation first; prevents default event; focuses on first field with error (if errors exist and shouldFocusError is set to true)
```jsx
<button type="submit" onClick={handleSubmit(values => console.log(values))}>
	Save the form
</button>
```

**reset(newValues: any?, reValidate: bool)**

resets the form to newValues or default ones; triggers revalidation based on second parameter
```jsx
<button type="submit" onClick={() => reset()}>
	Reset the form
</button>
```

### Methods to work with arrays

**append(fullPath: string, newValue: any)**

appends new object to the existing array of objects
```jsx
<button onClick={e => {
	e.preventDefault();
	append('albums', { name: '', releaseDate: null });
}}>Add new album</button>
```

**prepend(fullPath: string, newValue: any)**

prepends new object to the existing array of objects
```jsx
<button onClick={e => {
	e.preventDefault();
	prepend('movies[3].actors', { name: '' });
}}>Add new actor</button>
```

**remove(fullPath: string, index: int)**

removes array item from the existing array
```jsx
<button onClick={e => {
	e.preventDefault();
	remove('movies[3].actors', 3);
}}>Remove this actor</button>
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

**errors: object**

object with validation errors; shape of this object follows the shape/structure of form values

**isValid: bool**

true if there are no validation errors; when mode is 'onSubmit', errors and this field will be populated when form is submitted

**isTouched: bool**

true if any of the fields are changed

**isDirty: bool**

true if any of form values is different than default ones provided

#### Contributions
PRs welcome

#### Roadmap
- no fields validation code will be introduced; it's pointless since there are alredy a bunch of libraries that do that


## License

MIT

**Free Software, Hell Yeah!**