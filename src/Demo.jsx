import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as yup from 'yup';
import useForm from './useForm';

const schema = yup.object().shape({
	title: yup.string().nullable().min(1).required('Title is required'),
	occupation: yup.array().min(1, 'Please enter at least 1 occupation').of(yup.string()),
	firstName: yup.string().required('Please enter first name'),
	lastName: yup.string().required('Please enter last name'),
	date: yup.date().required('Date is required').typeError('Invalid format'),
	boyfriends: yup
		.array()
		.ensure()
		.min(1, 'Please enter at least 1')
		.of(
			yup.object().shape({
				firstName: yup.string().required('Please enter first name'),
				lastName: yup.string().required('Please enter last name'),
				// birthDate: yup.date().required('Date is required').typeError('Invalid format'),
			}),
		),
});

const Demo = () => {
	const { getValue, values, setValue, register, trigger, handleSubmit, key, prepend, append, remove, hasError, reset, formState } = useForm({
		defaultValues: defaultModel,

		// mode: 'onSubmit',
		// reValidateMode: 'onChange',
		validate: fields => {
			try {
				schema.validateSync(fields, { abortEarly: false });
			} catch (validationError) {
				const errors = validationError.inner.reduce((allErrors, error) => {
					const err = {
						message: error.message,
						type: error.type,
					};
					if (error.path.indexOf('.') > 0) {
						const split = error.path.replace(/\[|\]\.?/g, '.').split(/[\.\[\]\'\"]/);
						allErrors[split[0]] = allErrors[split[0]] || [];
						allErrors[split[0]][split[1]] = allErrors[split[0]][split[1]] || {};
						allErrors[split[0]][split[1]][split[2]] = err;
					} else {
						allErrors[error.path] = err;
					}

					return allErrors;
				}, {});
				return errors;
			}
			return {};
		},
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
						selected={getValue('date')}
						onChange={date => {
							setValue('date', date);
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
					{hasError('date') && (
						<span className="error" aria-live="polite">
							{errors.date.message}
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
					<label>Boyfriends</label>
					<div>
						<button
							onClick={e => {
								e.preventDefault();
								prepend('boyfriends', { firstName: '', lastName: '' });
							}}
						>
							+ Add new
						</button>
					</div>
				</div>
				<div className="column is-half">
					{getValue('boyfriends').map((boyfriend, idx) => {
						return (
							<div key={key(boyfriend)} className="columns is-gapless mb-0">
								<div className="column">
									<input
										type="text"
										{...register(`boyfriends.${idx}.firstName`)}
										className={hasError(`boyfriends.${idx}.firstName`) ? 'hasError' : ''}
									/>
								</div>
								<div className="column">
									<input type="text" {...register(`boyfriends.${idx}.lastName`)} className={hasError(`boyfriends.${idx}.lastName`) ? 'hasError' : ''} />
								</div>
								<div className="column">
									<button
										onClick={e => {
											e.preventDefault();
											remove(`boyfriends.${idx}`);
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
	date: new Date('1948-05-19'),
	boyfriends: [
		{ firstName: 'Atila', lastName: 'Altaunbay', birthDate: new Date('1976-01-01') },
		{ firstName: 'Dolph', lastName: 'Lundgren', birthDate: new Date('1957-11-03') },
	],
});
