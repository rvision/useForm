# useForm
React forms utility library, lightweight alternative to existing frameworks.

## demo
codesandbox links

### Another form library?
if you need performant forms library, use [react-hook-form](https://react-hook-form.com/).

If you think formState, control, Controller, useController, useFormContext, watch, useWatch, useFormState, useFieldArray is complicated to use, then read on.

#### Introduction
Idea is to reference all form fields in a natural way, with regards of the initial object shape/structure. For example:

```js
departments[5].employees[3].tasks[1].name	// or departments.5.employees.3.tasks.1.name, whatever suits you better
cities[2].population	// or cities.2.population, whatever suits you better
artists[1].albums[2]	// or artists.1.albums.2, whatever suits you better
```

Let's call this identifier 'fullPath'. Most of the methods to work with form fields and errors will use this naming convention for operations.

#### Usage
##### hook options
```js
const { /* methods, explained below */ } = useForm({
	defaultValues: {},
	mode: 'onSubmit',
	// mode: 'onBlur',
	// mode: 'onChange',
	shouldFocusError: false,
	resolver: () => {}
});
```




#### Contributions
#### Roadmap

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