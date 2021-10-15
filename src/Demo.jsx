import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import * as yup from 'yup';
import useForm, { yupResolver } from './useForm';

let renderCount = 0;

const schema = yup.object().shape({
	title: yup.string().nullable().min(1).required('Title is required'),
	occupation: yup.array().min(1, 'Please select at least 1 occupation').of(yup.string()),
	firstName: yup.string().min(3, 'Please enter at least 3 chars').required('Please enter first name'),
	lastName: yup.string().required('Please enter last name'),
	birthDate: yup.date().nullable().required('Birth date is required').typeError('Invalid format'),
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

const leftColumn = 'column is-one-quarter has-text-right';
const rightColumn = 'column is-three-quarters';

// const selectStyle = {
// 	container: provided => ({
// 		...provided,
// 		fontSize: '13px',
// 	}),
// };

const Demo = () => {
	const { getValue, setValue, getRef, onBlur, onChange, register, trigger, handleSubmit, key, prepend, append, remove, hasError, clearError, Error, reset, formState } =
		useForm({
			defaultValues: defaultModel,
			mode: 'onSubmit',
			// mode: 'onBlur',
			// mode: 'onChange',
			shouldFocusError: true,
			resolver: yupResolver(schema),
		});

	const { isDirty, errors } = formState;

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
		return <Error for={path}>{({ message }) => <p className="help is-danger">⚠ {message}</p>}</Error>;
	};

	renderCount += 1;
	console.log('Errors', renderCount, errors);
	// console.log('values', values);
	// console.log('defaultModel', defaultModel);

	return (
		<div>
			<div>
				<div key="1" className="field is-horizontal">
					<div className="field-label is-normal">
						<label className="label">Celebrity</label>
						<p className="help has-text-grey-light">(native form inputs & birthdate date picker)</p>
					</div>
					<div className="field-body">
						<div className="field is-narrow">
							<div className="select is-fullwidth">
								<select className={hasError('title') ? 'hasError' : ''} {...register('title')}>
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
							<input
								type="text"
								placeholder="Enter first name"
								{...register('firstName')}
								className={hasError('firstName') ? 'input is-danger' : 'input'}
							/>
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

				<div key="2" className="field is-horizontal">
					<div className="field-label is-normal">
						<label className="label">Occupation</label>
						<p className="help has-text-grey-light">(how to use &lt;select /&gt; multiple or array of checkboxes)</p>
					</div>
					<div className="field-body">
						<div className="field is-narrow">
							<div className="control">
								<div
									className={hasError('occupation') ? 'select is-multiple is-small is-fullwidth is-danger' : 'select is-multiple is-small is-fullwidth'}
								>
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
								getOptionLabel={option => option.name}
								getOptionValue={option => option.id}
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

				<div key="3" className="field is-horizontal">
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

						<p className="help has-text-grey-light">(dynamic rows)</p>
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
									{/* <div className="field is-narrow">xxx</div> */}
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

				<div key="4" className="field is-horizontal">
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

						<BulmaError for="albums" />
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

									<div className="field">
										<input type="range" min="0" max="100" step="1" className="range slider is-fullwidth" {...register(`movies.${idx}.metaCritic`)} />
										<br />
										Metacritic score: {getValue(`movies[${idx}].metaCritic`)}%
									</div>
									<div className="field is-narrow">
										<ReactDatePicker
											dateFormat="yyyy"
											showYearPicker
											placeholderText="Enter movie date"
											selected={getValue(`movies.${idx}.year`)}
											className={hasError(`movies.${idx}.year`) ? 'input is-danger' : 'input'}
											onChange={date => {
												setValue(`movies.${idx}.year`, date);
											}}
										/>
										<BulmaError for={`movies.${idx}.year`} />
									</div>
									<div className="field">
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
									<div className="field">
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
												getOptionLabel={option => option.name}
												getOptionValue={option => option.id}
												value={optionsGenres.filter(option => getValue(`movies.${idx}.genres`).includes(option.id))}
												onChange={options => {
													const optionIds = options.map(x => x.id);
													const picked = optionsGenres.filter(option => optionIds.includes(option.id)).map(x => x.id);
													setValue(`movies.${idx}.genres`, picked);
												}}
											/>
										</div>
									</div>
									<div className="break" style={{ width: '100%' }} />
								</React.Fragment>
							);
						})}
					</div>
				</div>

				<hr />

				<div key="5" className="field is-horizontal">
					<div className="field-label" />
					<div className="field-body">
						<div className="field is-expanded">
							<div className="field has-addons">
								<p className="control">
									<a className="button is-static">+44</a>
								</p>
								<p className="control is-expanded">
									<input className="input" type="tel" placeholder="Your phone number" />
								</p>
							</div>
							<p className="help">Do not enter the first zero</p>
						</div>
					</div>
				</div>

				<div key="6" className="field is-horizontal">
					<div className="field-label is-normal">
						<label className="label">Department</label>
					</div>
					<div className="field-body">
						<div className="field is-narrow">
							<div className="control">
								<div className="select is-fullwidth">
									<select>
										<option>Business development</option>
										<option>Marketing</option>
										<option>Sales</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div key="7" className="field is-horizontal">
					<div className="field-label">
						<label className="label">Already a member?</label>
					</div>
					<div className="field-body">
						<div className="field is-narrow">
							<div className="control">
								<label className="radio">
									<input type="radio" name="member" />
									Yes
								</label>
								<label className="radio">
									<input type="radio" name="member" />
									No
								</label>
							</div>
						</div>
					</div>
				</div>

				<div key="8" className="field is-horizontal">
					<div className="field-label is-normal">
						<label className="label">Subject</label>
					</div>
					<div className="field-body">
						<div className="field">
							<div className="control">
								<input className="input is-danger" type="text" placeholder="e.g. Partnership opportunity" />
							</div>
							<p className="help is-danger">This field is required</p>
						</div>
					</div>
				</div>

				<div key="9" className="field is-horizontal">
					<div className="field-label is-normal">
						<label className="label">Question</label>
					</div>
					<div className="field-body">
						<div className="field">
							<div className="control">
								<textarea className="textarea" placeholder="Explain how we can help you" defaultValue="" />
							</div>
						</div>
					</div>
				</div>

				<div key="a" className="field is-horizontal">
					<div className="field-label" />
					<div className="field-body">
						<div className="field">
							<div className="control">
								<button className="button is-primary">Send message</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<h5>{renderCount}</h5>
			<h5>{isDirty && <>Dirty</>}</h5>
			<a
				onClick={() => {
					trigger('movies');
				}}
			>
				ValidateMovies
			</a>
			<a
				onClick={() => {
					clearError('movies[2]');
				}}
			>
				ClearMovies
			</a>

			<div className="columns">
				<div className={leftColumn}>
					<label>Movies</label>
					<div>
						<button
							onClick={e => {
								e.preventDefault();
								append('movies', {
									name: '',
									year: null,
									genres: [],
									metaCritic: 11,
									coStars: [],
								});
							}}
						>
							+ Add new
						</button>
						{hasError(`movies`) && <span className="error">{errors.movies.message}</span>}
					</div>
				</div>
				<div className={rightColumn}>
					{key(getValue('movies'))}
					{getValue('movies').map((movie, idx) => {
						return (
							<React.Fragment key={key(movie)}>
								<div className="columns is-gapless mb-0">
									{key(movie)}
									<div className="column">
										<input type="text" {...register(`movies[${idx}].name`)} className={hasError(`movies.${idx}.name`) ? 'hasError' : ''} />
										{hasError(`movies.${idx}.name`) && <span className="error">{errors.movies[idx].name.message}</span>}
									</div>
									<div className="column">
										<ReactDatePicker
											dateFormat="yyyy"
											showYearPicker
											selected={getValue(`movies.${idx}.year`)}
											className={hasError(`movies.${idx}.year`) ? 'hasError' : ''}
											onChange={date => {
												setValue(`movies.${idx}.year`, date);
											}}
										/>
										{hasError(`movies[${idx}].year`) && <span className="error">{errors.movies[idx].year.message}</span>}
									</div>
									<div className="column is-one-third">
										<div className="select-wrapper">
											<Select
												placeholder="Select Genre(s)"
												isMulti
												isClearable
												options={optionsGenres}
												getOptionLabel={option => option.name}
												getOptionValue={option => option.id}
												value={optionsGenres.filter(option => getValue(`movies.${idx}.genres`).includes(option.id))}
												onChange={options => {
													const optionIds = options.map(x => x.id);
													const picked = optionsGenres.filter(option => optionIds.includes(option.id)).map(x => x.id);
													setValue(`movies.${idx}.genres`, picked);
												}}
											/>
										</div>
										{hasError(`movies.${idx}.genres`) && <span className="error">{errors.movies[idx].genres.message}</span>}
									</div>

									<div className="column">
										{hasError(`movies.${idx}.metaCritic`) && <span className="error">{errors.movies[idx].metaCritic.message}</span>}
									</div>
									<div className="column">
										<button
											onClick={e => {
												e.preventDefault();
												remove('movies', idx);
											}}
										>
											-
										</button>
									</div>
								</div>

								<div className="columns is-gapless mb-0">
									<div className="column">
										<div>
											co-stars:
											<button
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
											{hasError(`movies[${idx}].coStars`) && <span className="error">{errors.movies[idx].coStars.message}</span>}
											{getValue(`movies[${idx}].coStars`).map((star, jdx) => {
												return (
													<div key={key(star)} className="columns is-gapless mb-0">
														<div className="column">
															<input
																type="text"
																className={hasError(`movies[${idx}].coStars[${jdx}].firstName`) ? 'hasError' : ''}
																{...register(`movies[${idx}].coStars[${jdx}].firstName`)}
															/>
															{hasError(`movies[${idx}].coStars[${jdx}].firstName`) && (
																<span className="error">{errors.movies[idx].coStars[jdx].firstName.message}</span>
															)}
														</div>

														<div className="column">
															<input
																type="text"
																className={hasError(`movies[${idx}].coStars[${jdx}].lastName`) ? 'hasError' : ''}
																{...register(`movies[${idx}].coStars[${jdx}].lastName`)}
															/>
															{hasError(`movies[${idx}].coStars[${jdx}].lastName`) && (
																<span className="error">{errors.movies[idx].coStars[jdx].lastName.message}</span>
															)}
														</div>

														<div className="column">
															<button
																onClick={e => {
																	e.preventDefault();
																	remove(`movies[${idx}].coStars`, jdx);
																}}
															>
																-
															</button>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</React.Fragment>
						);
					})}
				</div>
			</div>

			<div className="columns">
				<div className={leftColumn}>
					<label>Your rating</label>
				</div>
				<div className={rightColumn}>
					{optionsRadio.map(option => {
						return (
							<label key={option.id} className="radio">
								<input type="radio" {...register('radio')} checked={String(getValue('radio')) === String(option.id)} value={option.id} />
								{option.name}
							</label>
						);
					})}
				</div>
			</div>

			<div className="columns">
				<div className={leftColumn}>
					<label>Would recommend?</label>
				</div>

				<div className={rightColumn}>
					<input type="checkbox" className={hasError('checkbox') ? 'hasError' : ''} {...register('checkbox')} />
				</div>
			</div>

			<hr />
			<button type="submit" className="button is-primary mr-2" onClick={handleSubmit(onSubmit)}>
				Submit form
			</button>
			<button type="submit" className="button" onClick={onReset}>
				Reset
			</button>
		</div>
	);
};

export default Demo;

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
];

// const coStars = new Array(1000).fill(1).map((x, idx) => {
// 	return {
// 		firstName: `Actor ${idx}`,
// 		lastName: `Actor ${idx}`,
// 	};
// });

const resetModel = Object.freeze({
	title: 'Mr',
	occupation: [],
	firstName: 'Michael',
	lastName: 'Fox',
	radio: '3',
	checkbox: false,
	birthDate: new Date('1948-05-19'),
	albums: [{ name: 'Power Of Love', releaseDate: new Date('1980-05-09') }],
	movies: [
		{
			name: 'Back To The Future',
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
	],
});

const defaultModel = Object.freeze({
	title: 'Ms',
	occupation: ['actress', 'singer'],
	firstName: 'Grace',
	lastName: 'Jones',
	radio: '3',
	checkbox: false,
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
