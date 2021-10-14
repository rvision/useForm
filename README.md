# useForm
React forms utility library, lightweight alternative to existing frameworks.

## demo
codesandbox links

### Another form library?
if you need performant forms library, use [react-hook-form](https://react-hook-form.com/).

If you think formState, control, Controller, useController, useFormContext, watch, useWatch, useFormState, useFieldArray is complicated to use, then read on.

This library works with controlled components only.

#### Introduction
Idea is to reference all form fields in a natural way, with regards of the initial object shape/structure. For example:

```js
departments[5].employees[3].tasks[1].name	// or departments.5.employees.3.tasks.1.name
cities[2].population	// or cities.2.population, whatever suits you better
artists[1].albums[2]	// or artists.1.albums.2, whatever suits you better
```

Let's call this identifier 'fullPath'. Most of the methods to work with form fields and errors will use this naming convention for operations.

#### Usage
##### hook options
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
defaultValues   | object        | initial form values; for new records it has to be populated with default values (e.g. empty strings, true/false, etc.)
mode            | 'onSubmit'/'onChange'/'onBlur'   | validation behaviour: onSubmit validates form when submitting, onChange when field is edited, onBlur when field is blurred
shouldFocusError | bool        | if field has errors, it will focus on error field - depending on the mode
resolver | function(fields)    | validation function; currently only [yup](https://github.com/jquense/yup) is supported out-of-the-box, but adding more shouldn't be the problem




#### Contributions
#### Roadmap
- no validation code will be introduced; there are alredy a bunch of libraries that do that


### In

**Parameter**   | **Type**      | **Description**
--------------- | ------------- | --------------------------------------------------------------
companyId       | guid          | Company identifier (required field)
id              | guid[]        | Recurring template id (required field)

#### features
- Import a HTML file and watch it magically convert to Markdown
- Drag and drop images (requires your Dropbox account be linked)
- [Breakdance](https://breakdance.github.io/breakdance/) - HTML to Markdown converter

## License

MIT

**Free Software, Hell Yeah!**