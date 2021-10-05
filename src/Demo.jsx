import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import * as yup from 'yup';
import useForm, { yupResolver } from './useForm';

const schema = yup.object().shape({
	title: yup.string().nullable().min(1).required('Title is required'),
	occupation: yup.array().min(1, 'Please enter at least 1 occupation').of(yup.string()),
	firstName: yup.string().required('Please enter first name'),
	lastName: yup.string().required('Please enter last name'),
	birthDate: yup.date().nullable().required('Date is required').typeError('Invalid format'),
	albums: yup
		.array()
		.ensure()
		.min(1, 'Please enter at least 1 album')
		.of(
			yup.object().shape({
				name: yup.string().required('Please enter album name'),
				releaseDate: yup.date().nullable().required('Release date is required').typeError('Invalid format'),
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
				genres: yup.array().ensure().min(1, 'Please enter at least 1 genre'),
				coStars: yup
					.array()
					.ensure()
					.min(1, 'Please enter at least 1 co-star')
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
	const { getValue, values, setValue, register, trigger, handleSubmit, key, prepend, Error, append, remove, hasError, clearError, reset, formState } = useForm({
		defaultValues: defaultModel,
		mode: 'onSubmit',
		// mode: 'onSubmit',
		// mode: 'onChange',
		// reValidateMode: 'onChange',
		shouldFocusError: false,
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

	console.log('Errors', errors);
	// console.log('values', values);
	// console.log('defaultModel', defaultModel);

	return (
		<div>
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
					<label>Title</label>
				</div>
				<div className={rightColumn}>
					<select className={hasError('title') ? 'hasError' : ''} {...register('title')}>
						{optionsTitle.map(option => {
							return (
								<option key={option.id} value={option.id}>
									{option.name}
								</option>
							);
						})}
					</select>
					{errors.title && <span className="error">{errors.title.message}</span>}
				</div>
			</div>

			<div className="columns">
				<div className={leftColumn}>
					<label>Occupation</label>
				</div>
				<div className={rightColumn}>
					<select multiple className={hasError('occupation') ? 'hasError' : ''} {...register('occupation')}>
						{optionsOccupation.map(option => {
							return (
								<option key={option} value={option}>
									{option}
								</option>
							);
						})}
					</select>
					{errors.occupation && <span className="error">{errors.occupation.message}</span>}
				</div>
			</div>

			<div className="columns">
				<div className={leftColumn}>
					<label>Birthdate</label>
				</div>
				<div className={rightColumn}>
					<ReactDatePicker
						selected={getValue('birthDate')}
						className={hasError('birthDate') ? 'hasError' : ''}
						onChange={date => {
							setValue('birthDate', date);
						}}
					/>
					{/* <input
						type="date"
						id="field-date"
						name="date"
						className={hasError('date') ? 'hasError' : ''}
						value={getValue('date')}
						onChange={e => {
							setValue('date', e.target.value);
						}}
					/> */}

					{hasError('birthDate') && (
						<span className="error" aria-live="polite">
							{errors.birthDate.message}
						</span>
					)}
				</div>
			</div>

			<div className="columns">
				<div className={leftColumn}>
					<label>Name</label>
				</div>
				<div className={rightColumn}>
					<div className="columns is-gapless">
						<div className="column">
							<input type="text" className={hasError('firstName') ? 'hasError' : ''} {...register('firstName')} />
							<input type="text" className={hasError('lastName') ? 'hasError' : ''} {...register('lastName')} />

							{hasError('firstName') && (
								<span className="error" aria-live="polite">
									{errors.firstName.message}
								</span>
							)}

							{hasError('lastName') && (
								<span className="error" aria-live="polite">
									{errors.lastName.message}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="columns">
				<div className={leftColumn}>
					<label>Albums</label>
					<div>
						<button
							onClick={e => {
								e.preventDefault();
								prepend('albums', { name: '', releaseDate: null });
							}}
						>
							+ Add new
						</button>

						{hasError(`albums`) && <span className="error">{errors.albums.message}</span>}
					</div>
				</div>
				<div className={rightColumn}>
					{key(getValue('albums'))}
					{getValue('albums').map((album, idx) => {
						const k = key(album);
						return (
							<div key={k} className="columns is-gapless mb-0">
								<div className="column">
									{k}
									<input type="text" {...register(`albums.${idx}.name`)} className={hasError(`albums.${idx}.name`) ? 'hasError' : ''} />
									{hasError(`albums.${idx}.name`) && <span className="error">{errors.albums[idx].name.message}</span>}
								</div>
								<div className="column">
									<ReactDatePicker
										selected={getValue(`albums.${idx}.releaseDate`)}
										className={hasError(`albums.${idx}.releaseDate`) ? 'hasError' : ''}
										onChange={date => {
											setValue(`albums.${idx}.releaseDate`, date);
										}}
									/>
									{hasError(`albums.${idx}.releaseDate`) && <span className="error">{errors.albums[idx].releaseDate.message}</span>}
								</div>
								<div className="column">
									<button
										onClick={e => {
											e.preventDefault();
											remove('albums', idx);
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
									metaCritic: 50,
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
												// styles={selectStyle}
												placeholder="Select Genre(s)"
												isMulti
												isClearable
												options={optionsGenres}
												getOptionLabel={option => option.name}
												getOptionValue={option => option.id}
												value={optionsGenres.filter(option => getValue(`movies.${idx}.genres`).includes(option.id))}
												onChange={options => {
													setValue(
														`movies.${idx}.genres`,
														options.map(x => x.id),
													);
												}}
											/>
										</div>
										{hasError(`movies.${idx}.genres`) && <span className="error">{errors.movies[idx].genres.message}</span>}
									</div>

									<div className="column">
										<input type="range" className="range slider is-fullwidth" step="1" {...register(`movies.${idx}.metaCritic`)} />
										Metacritic: {getValue(`movies[${idx}].metaCritic`)}%
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
								<input
									type="radio"
									{...register('radio')}
									checked={String(getValue('radio')) === String(option.id)}
									value={option.id}
									className={hasError('radio') ? 'hasError' : ''}
								/>
								{option.name}
							</label>
						);
					})}
					{hasError('radio') && <span className="error">{errors.radio.message}</span>}
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
			<button type="submit" onClick={handleSubmit(onSubmit)}>
				Submit form
			</button>
			<button type="submit" onClick={onReset}>
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
const optionsOccupation = ['actress', 'musician', 'singer', 'hedonist'];
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
