import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as yup from 'yup';
import useForm, { yupResolver } from './useForm';

const schema = yup.object().shape({
	title: yup.string().nullable().min(1).required('Title is required'),
	occupation: yup.array().min(1, 'Please enter at least 1 occupation').of(yup.string()),
	firstName: yup.string().required('Please enter first name'),
	lastName: yup.string().required('Please enter last name'),
	birthDate: yup.date().required('Date is required').typeError('Invalid format'),
	albums: yup
		.array()
		.ensure()
		.min(1, 'Please enter at least 1 album')
		.of(
			yup.object().shape({
				name: yup.string().required('Please enter album name'),
				releaseDate: yup.date().required('Release date is required').typeError('Invalid format'),
			}),
		),
	movies: yup
		.array()
		.ensure()
		.min(1, 'Please enter at least 1 movie')
		.of(
			yup.object().shape({
				name: yup.string().required('Please enter movie name'),
				year: yup.date().required('Movie year is required').typeError('Invalid format'),
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

const Demo = () => {
	const { getValue, values, setValue, register, trigger, handleSubmit, key, prepend, append, remove, hasError, reset, formState } = useForm({
		defaultValues: defaultModel,
		// mode: 'onSubmit',
		// reValidateMode: 'onChange',
		validate: yupResolver(schema),
	});

	const { errors } = formState;

	const onSubmit = vals => {
		// e.preventDefault();
		console.log('vals');
		console.log(vals);
	};

	const onReset = e => {
		e.preventDefault();
		reset();
	};

	console.log('render', errors);

	return (
		<div>
			<div className="columns">
				<div className="column is-half has-text-right">
					<label>Title</label>
				</div>
				<div className="column is-half">
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
				<div className="column is-half has-text-right">
					<label>Occupation</label>
				</div>
				<div className="column is-half">
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
				<div className="column is-half has-text-right">
					<label>Birthdate</label>
				</div>
				<div className="column is-half">
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
				<div className="column is-half has-text-right">
					<label>Name</label>
				</div>
				<div className="column is-half">
					<div className="columns is-gapless">
						<div className="column is-half">
							<input type="text" className={hasError('firstName') ? 'hasError' : ''} {...register('firstName')} />
							{hasError('firstName') && <span className="error">{errors.firstName.message}</span>}
						</div>

						<div className="column is-half">
							<input type="text" className={hasError('lastName') ? 'hasError' : ''} {...register('lastName')} />
							{hasError('lastName') && <span className="error">{errors.lastName.message}</span>}
						</div>
					</div>
				</div>
			</div>

			<div className="columns">
				<div className="column is-half has-text-right">
					<label>Albums</label>
					<div>
						<button
							onClick={e => {
								e.preventDefault();
								append('albums', { name: '', releaseDate: null });
							}}
						>
							+ Add new
						</button>

						{hasError(`albums`) && <span className="error">{errors.albums.message}</span>}
					</div>
				</div>
				<div className="column is-half">
					{getValue('albums').map((album, idx) => {
						const k = key(album);

						return (
							<div key={k} className="columns is-gapless mb-0">
								<div className="column">
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
				<div className="column is-half has-text-right">
					<label>Movies</label>
					<div>
						<button
							onClick={e => {
								e.preventDefault();
								append('movies', {
									name: '',
									year: null,
									coStars: [],
								});
							}}
						>
							+ Add new
						</button>
						{hasError(`movies`) && <span className="error">{errors.movies.message}</span>}
					</div>
				</div>
				<div className="column is-half">
					{getValue('movies').map((movie, idx) => {
						return (
							<div key={key(movie)} className="columns is-gapless mb-0">
								<div className="column">
									<input type="text" {...register(`movies[${idx}]name`)} className={hasError(`movies.${idx}.name`) ? 'hasError' : ''} />
									{hasError(`movies.${idx}.name`) && <span className="error">{errors.movies[idx].name.message}</span>}
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
										{getValue(`movies[${idx}].coStars`).map((star, jdx) => {
											return (
												<div key={key(star)} className="columns is-gapless mb-0">
													<div className="column is-half">
														<input
															type="text"
															className={hasError(`movies[${idx}].coStars[${jdx}].firstName`) ? 'hasError' : ''}
															{...register(`movies[${idx}].coStars[${jdx}].firstName`)}
														/>
														{hasError(`movies[${idx}].coStars[${jdx}].firstName`) && (
															<span className="error">{errors.movies[idx].coStars[jdx].firstName.message}</span>
														)}
													</div>

													<div className="column is-half">
														<input
															type="text"
															className={hasError(`movies[${idx}].coStars[${jdx}].lastName`) ? 'hasError' : ''}
															{...register(`movies[${idx}].coStars[${jdx}].lastName`)}
														/>
														{hasError(`movies[${idx}].coStars[${jdx}].lastName`) && (
															<span className="error">{errors.movies[idx].coStars[jdx].lastName.message}</span>
														)}
													</div>
												</div>
											);
										})}
									</div>
								</div>
								<div className="column">
									<ReactDatePicker
										selected={getValue(`movies.${idx}.year`)}
										className={hasError(`movies.${idx}.year`) ? 'hasError' : ''}
										onChange={date => {
											setValue(`movies.${idx}.year`, date);
										}}
									/>
									{hasError(`movies[${idx}]year`) && <span className="error">{errors.movies[idx].year.message}</span>}
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
						);
					})}
				</div>
			</div>

			<div className="columns">
				<div className="column is-half has-text-right">
					<label>Radio</label>
				</div>
				<div className="column is-half">
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
				<div className="column is-half has-text-right">
					<label>Checkbox</label>
				</div>

				<div className="column is-half">
					<input type="checkbox" className={hasError('checkbox') ? 'hasError' : ''} {...register('checkbox')} />
					{hasError('checkbox') && <span className="error">{errors.checkbox.message}</span>}
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
const defaultModel = Object.freeze({
	title: 'Ms',
	occupation: ['singer', 'actress'],
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
			coStars: [
				{
					firstName: 'Arnold',
					lastName: 'Schwarzenegger',
				},
			],
		},
	],
});
