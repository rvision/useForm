import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import * as yup from 'yup';
import useForm, { yupResolver } from './useForm';

// const Select = () => false;
// const ReactDatePicker = () => false;

const optionsTitle = [
	{ id: 'Mr', name: 'Mr' },
	{ id: 'Mrs', name: 'Mrs' },
	{ id: 'Ms', name: 'Ms' },
];

const optionsOccupation = ['actress', 'musician', 'singer', 'hedonist', 'nutcase'];
const optionsRadio = [
	{ id: '1', name: '1' },
	{ id: '2', name: '2' },
	{ id: '3', name: '3' },
	{ id: '4', name: '4' },
	{ id: '5', name: '5' },
];
const optionsGenres = [
	{ id: 0, name: 'Action' },
	{ id: 1, name: 'Adventure' },
	{ id: 2, name: 'Fantasy' },
	{ id: 3, name: 'Thriller' },
	{ id: 4, name: 'Comedy' },
	{ id: 5, name: 'Drama' },
	{ id: 6, name: 'Romance' },
];

const defaultModel = Object.freeze({
	title: 'Ms',
	occupation: ['actress', 'singer'],
	firstName: 'Grace',
	lastName: 'Jones',
	radio: '3',
	checkbox: false,
	notes: 'I love this artist!',
	birthDate: new Date('1948-05-19'),
	albums: [
		{ name: 'Warm Leatherette', releaseDate: new Date('1980-05-09') },
		{ name: 'Nightclubbing', releaseDate: new Date('1981-05-11') },
		{ name: 'Living My Life', releaseDate: new Date('1982-11-07') },
	],
	movies: [
		{
			name: 'A View to a Kill',
			year: new Date('1985-01-01'),
			genres: [0, 1, 3],
			metaCritic: 40,
			coStars: [
				{
					firstName: 'Roger',
					lastName: 'Moore',
				},
			],
		},
		{
			name: 'Conan the Destroyer',
			year: new Date('1984-01-01'),
			genres: [0, 1, 2],
			metaCritic: 53,
			coStars: [
				{
					firstName: 'Arnold',
					lastName: 'Schwarzenegger',
				},
			],
		},
	],
});

const schema = yup.object().shape({
	title: yup.string().nullable().min(1).required('Title is required'),
	occupation: yup.array().min(1, 'Please select at least 1 occupation').of(yup.string()),
	firstName: yup.string().min(3, 'Please enter at least 3 chars').required('Please enter first name'),
	lastName: yup.string().required('Please enter last name'),
	birthDate: yup.date().nullable().required('Birth date is required').typeError('Invalid format'),
	notes: yup.string().required('Please add some notes'),
	albums: yup
		.array()
		.ensure()
		.min(1, 'Please enter at least 1 album')
		.of(
			yup.object().shape({
				name: yup.string().required('Please enter album name'),
				releaseDate: yup.date().nullable().required("Album's release date is required").typeError('Invalid format'),
			}),
		),
	movies: yup
		.array()
		.ensure()
		.min(1, 'Please enter at least 1 movie')
		.of(
			yup.object().shape({
				name: yup.string().required('Please enter movie name'),
				year: yup.date().nullable().required('Movie year is required').typeError('Invalid format'),
				metaCritic: yup.number().nullable().required('Metacritic rating is required').typeError('Invalid format'),
				genres: yup.array().ensure().min(1, 'Please enter at least 1 movie genre'),
				coStars: yup
					.array()
					.ensure()
					.min(1, 'Please enter at least 1 movie co-star')
					.of(
						yup.object().shape({
							firstName: yup.string().required('Please enter first name'),
							lastName: yup.string().required('Please enter last name'),
						}),
					),
			}),
		),
});

const optionLabel = option => option.name;
const optionValue = option => option.id;

let renderCount = 0;

const Demo = () => {
	const {
		getValue,
		setValue,
		// getRef,
		// onBlur,
		// onChange,
		register,
		// trigger,
		handleSubmit,
		key,
		// prepend,
		append,
		remove,
		hasError,
		// clearError,
		Error,
		Errors,
		reset,
		formState: { isDirty, isValid, isTouched, errors },
	} = useForm({
		defaultValues: defaultModel,
		mode: 'onSubmit',
		// mode: 'onBlur',
		// mode: 'onChange',
		shouldFocusError: false,
		resolver: yupResolver(schema),
	});

	// const { isDirty, isValid, isTouched, errors } = formState;

	const onSubmit = vals => {
		// e.preventDefault();
		console.log('vals');
		console.log(vals);
	};

	const onReset = e => {
		e.preventDefault();
		reset();
	};

	const BulmaError = ({ for: path }) => {
		return <Error for={path}>{({ message }) => <p className="help is-danger mb-2">⚠ {message}</p>}</Error>;
	};

	renderCount += 1;

	return (
		<div>
			<div className="columns mb-5">
				<div className="column">
					<p className="title">useForm demo</p>
					<p className="subtitle">demo with native inputs and custom components</p>
				</div>
				<div className="column has-text-right">
					<ul>
						<li>
							Render count: <b className="mr-3 is-danger">{renderCount}</b>
						</li>
						<li>
							Is valid: <b className="mr-3">{isValid === true ? 'true' : 'false'}</b>
						</li>
						<li>
							Is touched: <b className="mr-3">{isTouched === true ? 'true' : 'false'}</b>
						</li>
						<li>
							Is dirty: <b className="mr-3">{isDirty === true ? 'true' : 'false'}</b>
						</li>
					</ul>
				</div>
				<div className="column has-text-right">
					<button
						className="button is-small is-danger"
						onClick={e => {
							e.preventDefault();

							const movies = new Array(100).fill(1).map((item, idx) => {
								return {
									name: `movie ${idx}`,
									year: null,
									genres: [Math.floor((Math.random() * optionsGenres.length) % optionsGenres.length)],
									metaCritic: 0,
									coStars: [],
								};
							});

							setValue('movies', movies);
						}}
					>
						Set 100 movies
					</button>
				</div>
			</div>

			<Errors />

			<div className="field is-horizontal">
				<div className="field-label is-normal">
					<label className="label">Celebrity</label>
					<p className="help has-text-grey-light">(native form inputs & birthdate react-datepicker)</p>
				</div>
				<div className="field-body">
					<div className="field is-narrow">
						<div className="select is-fullwidth">
							<select className={hasError('title') ? 'is-danger' : ''} {...register('title')}>
								{optionsTitle.map(option => {
									return (
										<option key={option.id} value={option.id}>
											{option.name}
										</option>
									);
								})}
							</select>
						</div>
					</div>
					<div className="field">
						<input type="text" placeholder="Enter first name" {...register('firstName')} className={hasError('firstName') ? 'input is-danger' : 'input'} />
						<BulmaError for="firstName" />
					</div>
					<div className="field">
						<input type="text" placeholder="Enter last name" {...register('lastName')} className={hasError('lastName') ? 'input is-danger' : 'input'} />
						<BulmaError for="lastName" />
					</div>
					<div className="field">
						<ReactDatePicker
							showMonthDropdown
							showYearDropdown
							placeholderText="Enter birthdate"
							selected={getValue('birthDate')}
							className={hasError('birthDate') ? 'input is-danger has-text-centered' : 'input has-text-centered'}
							onChange={date => {
								setValue('birthDate', date);
							}}
						/>
						<BulmaError for="birthDate" />
					</div>
				</div>
			</div>
			<hr />

			<div className="field is-horizontal">
				<div className="field-label is-normal">
					<label className="label">Albums</label>
					<button
						className="button is-small is-light is-primary"
						onClick={e => {
							e.preventDefault();
							append('albums', { name: '', releaseDate: null });
						}}
					>
						+ Add new
					</button>
					<BulmaError for="albums" />
					<br />

					<button
						className="button is-small is-light is-warning"
						onClick={e => {
							e.preventDefault();
							setValue('albums', []);
						}}
					>
						x Clear
					</button>

					<p className="help has-text-grey-light">(dynamic rows, 1st level)</p>
				</div>

				<div className="field-body" style={{ flexFlow: 'row wrap' }}>
					{getValue('albums').map((album, idx) => {
						return (
							<React.Fragment key={key(album)}>
								<div className="field is-narrow mb-4">
									<img
										src="https://is5-ssl.mzstatic.com/image/thumb/Purple125/v4/d4/26/96/d4269693-47e7-991d-e3af-31e9234a6818/source/256x256bb.jpg"
										style={{ width: '30px', verticalAlign: 'text-top' }}
									/>
								</div>
								<div className="field">
									<input
										type="text"
										placeholder="Enter album name"
										{...register(`albums.${idx}.name`)}
										className={hasError(`albums.${idx}.name`) ? 'input is-danger' : 'input'}
									/>
									<BulmaError for={`albums.${idx}.name`} />
								</div>
								<div className="field is-narrow">
									<ReactDatePicker
										showYearDropdown
										placeholderText="Enter release date"
										selected={getValue(`albums.${idx}.releaseDate`)}
										className={hasError(`albums.${idx}.releaseDate`) ? 'input is-danger has-text-centered' : 'input has-text-centered'}
										onChange={date => {
											setValue(`albums.${idx}.releaseDate`, date);
										}}
									/>
									<BulmaError for={`albums.${idx}.releaseDate`} />
								</div>
								<div className="field is-narrow pt-1">
									<button
										className="button is-small is-light is-warning"
										onClick={e => {
											e.preventDefault();
											remove('albums', idx);
										}}
									>
										remove x
									</button>
								</div>
								<div className="break" style={{ width: '100%' }} />
							</React.Fragment>
						);
					})}
				</div>
			</div>
			<hr />

			<div className="field is-horizontal">
				<div className="field-label is-normal">
					<label className="label">Movies</label>

					<button
						className="button is-small is-light is-primary"
						onClick={e => {
							e.preventDefault();
							append('movies', {
								name: '',
								year: null,
								genres: [],
								metaCritic: 0,
								coStars: [],
							});
						}}
					>
						+ Add new
					</button>

					<BulmaError for="movies" />
					<br />

					<button
						className="button is-small is-light is-warning"
						onClick={e => {
							e.preventDefault();
							setValue('movies', []);
						}}
					>
						x Clear
					</button>

					<p className="help has-text-grey-light">(dynamic nested arrays)</p>
				</div>

				<div className="field-body" style={{ flexFlow: 'row wrap' }}>
					{getValue('movies').map((movie, idx) => {
						const k = key(movie);
						return (
							<React.Fragment key={k}>
								<div className="field is-narrow mb-4">
									<img
										src="https://cdn4.iconfinder.com/data/icons/system-basic-vol-6/20/icon-window-play-128.png"
										style={{ width: '30px', verticalAlign: 'text-top' }}
									/>
								</div>
								<div className="field">
									<input
										type="text"
										placeholder="Enter movie name"
										{...register(`movies.${idx}.name`)}
										className={hasError(`movies.${idx}.name`) ? 'input is-danger' : 'input'}
									/>
									<BulmaError for={`movies.${idx}.name`} />
								</div>
								<div className="field is-narrow ">
									<ReactDatePicker
										dateFormat="yyyy"
										showYearPicker
										placeholderText="Enter movie date"
										selected={getValue(`movies.${idx}.year`)}
										className={hasError(`movies.${idx}.year`) ? 'input has-text-centered is-danger ' : 'input has-text-centered'}
										onChange={date => {
											setValue(`movies.${idx}.year`, date);
										}}
									/>
									<BulmaError for={`movies.${idx}.year`} />
								</div>
								<div className="field">
									<input type="range" min="0" max="100" step="1" className="range slider is-fullwidth" {...register(`movies.${idx}.metaCritic`)} />
									<br />
									Metacritic score: {getValue(`movies[${idx}].metaCritic`)}%
								</div>
								<div className="field is-narrow">
									<button
										className="button is-small is-light is-warning"
										onClick={e => {
											e.preventDefault();
											remove('movies', idx);
										}}
									>
										remove x
									</button>
								</div>

								<div className="break" style={{ width: '100%' }} />

								<div className="field is-narrow mb-6">
									<label className="label is-size-7 mt-2">Genres:</label>
								</div>
								<div className="field mb-4">
									<div
										style={{
											fontSize: '12px',
										}}
									>
										<Select
											placeholder="Select Genre(s)"
											isMulti
											isClearable
											options={optionsGenres}
											getOptionLabel={optionLabel}
											getOptionValue={optionValue}
											value={optionsGenres.filter(option => getValue(`movies.${idx}.genres`).includes(option.id))}
											onChange={options => {
												const optionIds = options.map(x => x.id);
												const picked = optionsGenres.filter(option => optionIds.includes(option.id)).map(x => x.id);
												setValue(`movies.${idx}.genres`, picked);
											}}
										/>
										<BulmaError for={`movies.${idx}.genres`} />
									</div>
								</div>

								<div className="break" style={{ width: '100%' }} />

								<div className="field-label ml-5">
									<label className="label">Co-stars:</label>

									{(getValue(`movies.${idx}.coStars`) || []).length > 0 && (
										<>
											<button
												className="button is-small is-light is-primary"
												onClick={e => {
													e.preventDefault();
													append(`movies.${idx}.coStars`, {
														firstName: '',
														lastName: '',
													});
												}}
											>
												+ Add new
											</button>
											<br />

											<button
												className="button is-small is-light is-warning"
												onClick={e => {
													e.preventDefault();
													setValue(`movies.${idx}.coStars`, []);
												}}
											>
												x Clear
											</button>

											<p className="help has-text-grey-light">(movies.{idx}.coStars)</p>
										</>
									)}
									<BulmaError for={`movies.${idx}.coStars`} />
								</div>

								<div className="field-body" style={{ flexFlow: 'row wrap' }}>
									{(getValue(`movies.${idx}.coStars`) || []).length === 0 && (
										<div className="notification is-warning" style={{ fontSize: '11px', padding: '1em' }}>
											⚠ There are no actors/actresses set for this movie,{' '}
											<a
												onClick={e => {
													e.preventDefault();
													append(`movies.${idx}.coStars`, {
														firstName: '',
														lastName: '',
													});
												}}
											>
												add first one
											</a>
										</div>
									)}
									{getValue(`movies[${idx}].coStars`).map((star, jdx) => {
										return (
											<React.Fragment key={key(star)}>
												<div className="field is-narrow">
													<img
														src="https://png.pngitem.com/pimgs/s/24-248235_user-profile-avatar-login-account-fa-user-circle.png"
														style={{ width: '30px', verticalAlign: 'text-top' }}
													/>
												</div>
												<div className="field mb-2">
													<input
														type="text"
														placeholder="Enter actor's first name"
														className={hasError(`movies[${idx}].coStars[${jdx}].firstName`) ? 'input is-danger' : 'input'}
														{...register(`movies[${idx}].coStars[${jdx}].firstName`)}
													/>
													<BulmaError for={`movies[${idx}].coStars[${jdx}].firstName`} />
												</div>

												<div className="field">
													<input
														type="text"
														placeholder="Enter actor's last name"
														className={hasError(`movies[${idx}].coStars[${jdx}].lastName`) ? 'input is-danger' : 'input '}
														{...register(`movies[${idx}].coStars[${jdx}].lastName`)}
													/>
													<BulmaError for={`movies[${idx}].coStars[${jdx}].lastName`} />
												</div>

												<div className="field is-narrow">
													<button
														className="button is-small is-light is-warning"
														onClick={e => {
															e.preventDefault();
															remove(`movies[${idx}].coStars`, jdx);
														}}
													>
														remove x
													</button>
												</div>
												<div className="break" style={{ width: '100%' }} />
											</React.Fragment>
										);
									})}
								</div>
								<div className="break mb-5" style={{ width: '100%' }} />
							</React.Fragment>
						);
					})}
				</div>
			</div>
			<hr />

			<div className="field is-horizontal">
				<div className="field-label is-normal">
					<label className="label">Occupation</label>
					<p className="help has-text-grey-light">(how to use &lt;select /&gt; multiple, react-select or array of checkboxes)</p>
				</div>
				<div className="field-body">
					<div className="field is-narrow">
						<div className="control">
							<div className={hasError('occupation') ? 'select is-multiple is-small is-fullwidth is-danger' : 'select is-multiple is-small is-fullwidth'}>
								<select multiple {...register('occupation')}>
									{optionsOccupation.map(option => {
										return (
											<option key={option} value={option}>
												{option}
											</option>
										);
									})}
								</select>
								<BulmaError for="occupation" />
							</div>
						</div>
					</div>
					<div className="field is-narrow">
						<div className="control is-size-7">
							{optionsOccupation.map(option => {
								const occupations = getValue('occupation');
								const checked = occupations.includes(option);
								return (
									<React.Fragment key={option}>
										<label className="checkbox" className="mr-2">
											<input
												type="checkbox"
												key={option}
												checked={checked}
												className="mr-1"
												onChange={e => {
													let newArr = [...occupations];
													if (e.target.checked) {
														newArr.push(option);
													} else {
														newArr = newArr.filter(o => o !== option);
													}
													setValue('occupation', newArr);
												}}
											/>
											{option}
										</label>
										<br />
									</React.Fragment>
								);
							})}
							<BulmaError for="occupation" />
						</div>
					</div>

					<div className="field is-narrow">
						<Select
							placeholder="Select occupation(s)"
							isMulti
							isClearable
							isSearchable={false}
							options={optionsOccupation.map(name => ({ id: name, name }))}
							getOptionLabel={optionLabel}
							getOptionValue={optionValue}
							value={optionsOccupation.map(name => ({ id: name, name })).filter(option => getValue('occupation').includes(option.id))}
							onChange={options => {
								const optionIds = options.map(o => o.id);
								const picked = optionsOccupation
									.map(name => ({ id: name, name }))
									.filter(option => optionIds.includes(option.id))
									.map(option => option.id);
								setValue('occupation', picked);
							}}
						/>
						<BulmaError for="occupation" />
					</div>
				</div>
			</div>
			<hr />

			<div className="field is-horizontal">
				<div className="field-label is-normal">
					<label className="label">Misc</label>
					<p className="help has-text-grey-light">(textarea, radio, checkbox usage))</p>
				</div>
				<div className="field-body">
					<div className="field">
						<label className="label">
							Notes
							<textarea {...register('notes')} className={hasError('notes') ? 'textarea is-danger' : 'textarea'} />
						</label>
						<BulmaError for="notes" />
					</div>
					<div className="field">
						<label className="label">Your rating</label>
						{optionsRadio.map(option => {
							return (
								<label key={option.id} className="radio mr-1">
									<input
										type="radio"
										className="radio mr-1"
										{...register('radio')}
										checked={String(getValue('radio')) === String(option.id)}
										value={option.id}
									/>
									{option.name}
								</label>
							);
						})}
					</div>
					<div className="field">
						<label className="label">Recommendation</label>
						<label className="checkbox">
							<input type="checkbox" className={hasError('checkbox') ? 'mr-2 is-danger' : 'mr-2'} {...register('checkbox')} />
							Yes I would recommend this artist
						</label>
					</div>
				</div>
			</div>
			<hr />

			<div className="field is-horizontal">
				<div className="field-label is-normal" />
				<div className="field-body">
					<button type="submit" className="button is-primary mr-2" onClick={handleSubmit(onSubmit)}>
						Submit form
					</button>
					<button type="submit" className="button" onClick={onReset}>
						Reset
					</button>
				</div>
			</div>
			<hr />

			<div className="columns">
				<div className="column">
					<h3>Form values</h3>
					<pre style={{ fontSize: '12px' }}>{JSON.stringify(getValue(), null, 4)}</pre>
				</div>
				<div className="column">
					<h3>Validation errors</h3>
					<pre style={{ fontSize: '12px' }}>{JSON.stringify(errors, null, 4)}</pre>
				</div>
			</div>
		</div>
	);
};

export default Demo;
