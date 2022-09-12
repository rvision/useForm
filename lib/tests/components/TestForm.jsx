import React, { useCallback } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import useForm, { yupResolver } from '../../useForm';
import defaultValues from './defaultValues';
import { optionsGenres, optionsOccupation, optionsRadio, optionsTitle } from './options';
import schema from './schema';

const optionLabel = option => option.name;
const optionValue = option => option.id;

const renderCount = 0;

function TestForm({ onFormSubmit }) {
	const {
		getValue,
		setValue,
		onChange,
		setRef,
		register,
		handleSubmit,
		key,
		append,
		remove,
		hasError,
		Error,
		Errors,
		reset,
		formState: { isDirty, isValid, isTouched, errors },
	} = useForm({
		defaultValues,
		mode: 'onSubmit',
		classNameError: 'is-danger',
		shouldFocusError: true,
		resolver: yupResolver(schema),
	});

	const onSubmit = vals => {
		if (onFormSubmit) onFormSubmit(vals);
	};

	const onReset = e => {
		e.preventDefault();
		reset();
	};

	function BulmaError({ for: path }) {
		return <Error for={path}>{({ message }) => <p className="help is-danger mb-2">⚠ {message}</p>}</Error>;
	}

	return (
		<div>
			<div className="columns mb-5">
				<div className="column">
					<p className="title">
						<a href="https://github.com/rvision/useForm">useForm</a> demo
					</p>
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
			</div>

			<Errors focusable>
				{errorList => (
					<div className="notification is-danger" role="errors-summary">
						<h6>Your form has some errors:</h6>
						<ul className="validation-errors">{errorList}</ul>
					</div>
				)}
			</Errors>

			<div className="field is-horizontal">
				<div className="field-label is-normal">
					<label className="label">Celebrity</label>
					<p className="help has-text-grey-light">(native form inputs & birthdate react-datepicker)</p>
				</div>
				<div className="field-body">
					<div className="field is-narrow">
						<div className="select is-fullwidth">
							<label>
								Title
								<select {...register('title')} data-testid="title">
									{optionsTitle.map(option => (
										<option key={option.id} value={option.id} data-testid={`title-option-${option.id.toLowerCase()}`}>
											{option.name}
										</option>
									))}
								</select>
							</label>
						</div>
					</div>
					<div className="field">
						<label>
							First name
							<input type="text" placeholder="Enter first name" {...register('firstName', 'input')} />
						</label>
						<BulmaError for="firstName" />
					</div>
					<div className="field">
						<label>
							Last name
							<input type="text" placeholder="Enter last name" {...register('lastName', 'input')} />
							<BulmaError for="lastName" />
						</label>
					</div>
					<div className="field">
						<label>
							Birth date
							<ReactDatePicker
								showMonthDropdown
								showYearDropdown
								placeholderText="Enter birthdate"
								className={hasError('birthDate') ? 'input is-danger has-text-centered' : 'input has-text-centered'}
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
						</label>
						<BulmaError for="birthDate" />
					</div>
				</div>
			</div>
			<hr />
			<div className="field is-horizontal">
				<div className="field-label is-normal">
					<label className="label">Albums:</label>
					<button
						type="button"
						name="add_new_album"
						className="button is-small is-light is-primary"
						onClick={e => {
							e.preventDefault();
							append('albums', { name: '', releaseDate: null });
						}}
					>
						+ Add new album
					</button>
					<BulmaError for="albums" />
					<br />

					<button
						type="button"
						name="clear_albums"
						className="button is-small is-light is-warning"
						onClick={e => {
							e.preventDefault();
							setValue('albums', []);
						}}
					>
						x Clear albums
					</button>

					<p className="help has-text-grey-light">(dynamic rows, 1st level)</p>
				</div>

				<div className="field-body" style={{ flexFlow: 'row wrap' }}>
					{(getValue('albums') || []).map((album, idx) => (
						<React.Fragment key={key(album)}>
							<div className="field is-narrow mb-4 pt-1">
								<img
									src="https://is5-ssl.mzstatic.com/image/thumb/Purple125/v4/d4/26/96/d4269693-47e7-991d-e3af-31e9234a6818/source/256x256bb.jpg"
									style={{ width: '30px', verticalAlign: 'text-top' }}
								/>
							</div>
							<div className="field">
								<label>
									Album name
									<input type="text" placeholder="Enter album name" {...register(`albums.${idx}.name`, 'input')} />
									<BulmaError for={`albums.${idx}.name`} />
								</label>
							</div>
							<div className="field is-narrow">
								<label>
									Album release date
									<ReactDatePicker
										showYearDropdown
										placeholderText="Enter release date"
										selected={getValue(`albums.${idx}.releaseDate`)}
										className={hasError(`albums.${idx}.releaseDate`) ? 'input is-danger has-text-centered' : 'input has-text-centered'}
										ref={ref => {
											if (ref && ref.input) {
												setRef(`albums.${idx}.releaseDate`, ref.input);
											}
										}}
										onChange={date => {
											setValue(`albums.${idx}.releaseDate`, date);
										}}
									/>
									<BulmaError for={`albums.${idx}.releaseDate`} />
								</label>
							</div>
							<div className="field is-narrow pt-1">
								<button
									className="button is-small is-light is-warning"
									onClick={e => {
										e.preventDefault();
										remove('albums', idx);
									}}
								>
									remove album
								</button>
							</div>
							<div className="break" style={{ width: '100%' }} />
						</React.Fragment>
					))}
				</div>
			</div>
			<hr />
			<div className="field is-horizontal">
				<div className="field-label is-normal">
					<label className="label">Movies:</label>

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
						+ Add new movie
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
						x Clear movies
					</button>

					<p className="help has-text-grey-light">(dynamic nested arrays)</p>
				</div>

				<div className="field-body" style={{ flexFlow: 'row wrap' }}>
					{(getValue('movies') || []).map((movie, idx) => {
						const k = key(movie);
						return (
							<React.Fragment key={k}>
								<div className="field is-narrow mb-4 pt-1">
									<img
										src="https://cdn4.iconfinder.com/data/icons/system-basic-vol-6/20/icon-window-play-128.png"
										style={{ width: '30px', verticalAlign: 'text-top' }}
									/>
								</div>
								<div className="field">
									<label>
										Movie name
										<input type="text" placeholder="Enter movie name" {...register(`movies.${idx}.name`, 'input')} />
										<BulmaError for={`movies.${idx}.name`} />
									</label>
								</div>
								<div className="field is-narrow ">
									<label>
										Movie year
										<ReactDatePicker
											dateFormat="yyyy"
											showYearPicker
											placeholderText="Enter movie date"
											selected={getValue(`movies.${idx}.year`)}
											className={hasError(`movies.${idx}.year`) ? 'input has-text-centered is-danger ' : 'input has-text-centered'}
											ref={ref => {
												if (ref && ref.input) {
													setRef(`movies.${idx}.year`, ref.input);
												}
											}}
											onChange={date => {
												setValue(`movies.${idx}.year`, date);
											}}
										/>
										<BulmaError for={`movies.${idx}.year`} />
									</label>
								</div>
								{/* <Range {...register(`movies.${idx}.metaCritic`)} /> */}
								<div className="field has-text-centered">
									<label>
										<input
											data-testid={`movies[${idx}].metaCritic`}
											type="range"
											min="0"
											max="100"
											step="1"
											className="range slider is-fullwidth"
											{...register(`movies.${idx}.metaCritic`)}
										/>
									</label>
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
										remove movie
									</button>
								</div>

								<div className="break" style={{ width: '100%' }} />

								<div className="field is-narrow mb-4">
									<div style={{ width: '30px' }} />
								</div>
								<div className="field mb-4 mt-1">
									<div
										style={{
											fontSize: '12px',
										}}
									>
										<label>
											Movie genres
											<Select
												placeholder="Select Genre(s)"
												isMulti
												isClearable
												options={optionsGenres}
												getOptionLabel={optionLabel}
												getOptionValue={optionValue}
												value={optionsGenres.filter(option => getValue(`movies.${idx}.genres`).includes(option.id))}
												ref={ref => setRef(`movies.${idx}.genres`, ref)}
												onChange={options => {
													const optionIds = options.map(x => x.id);
													const picked = optionsGenres.filter(option => optionIds.includes(option.id)).map(x => x.id);
													setValue(`movies.${idx}.genres`, picked);
												}}
											/>
											<BulmaError for={`movies.${idx}.genres`} />
										</label>
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
												+ Add new co-star
											</button>
											<br />

											<button
												className="button is-small is-light is-warning"
												onClick={e => {
													e.preventDefault();
													setValue(`movies.${idx}.coStars`, []);
												}}
											>
												x remove all co-stars
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
									{getValue(`movies[${idx}].coStars`).map((star, jdx) => (
										<React.Fragment key={key(star)}>
											<div className="field is-narrow mb-4 pt-1">
												<img
													src="https://i.pinimg.com/736x/bb/e3/02/bbe302ed8d905165577c638e908cec76.jpg"
													style={{ width: '30px', verticalAlign: 'text-top' }}
												/>
											</div>
											<div className="field mb-2">
												<input
													type="text"
													placeholder="Enter actor's first name"
													{...register(`movies[${idx}].coStars[${jdx}].firstName`, 'input')}
												/>
												<BulmaError for={`movies[${idx}].coStars[${jdx}].firstName`} />
											</div>

											<div className="field">
												<input
													type="text"
													placeholder="Enter actor's last name"
													{...register(`movies[${idx}].coStars[${jdx}].lastName`, 'input')}
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
													remove co-star
												</button>
											</div>
											<div className="break" style={{ width: '100%' }} />
										</React.Fragment>
									))}
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
									{optionsOccupation.map(option => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
								<BulmaError for="occupation" />
							</div>
						</div>
					</div>
					<div className="field is-narrow">
						<div className="control is-size-7">
							{optionsOccupation.map(option => {
								const occupations = getValue('occupation');
								const checked = (occupations || []).includes(option);
								return (
									<React.Fragment key={option}>
										<label className="checkbox mr-2">
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
												data-testid={`occupation-${option}`}
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
							value={(optionsOccupation || []).map(name => ({ id: name, name })).filter(option => (getValue('occupation') || []).includes(option.id))}
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
					<p className="help has-text-grey-light">
						Native inputs, all working with register method:
						<br />
						textarea, radio, checkbox, color <br />
						url, email, date, time
					</p>
				</div>
				<div className="field-body" style={{ flexFlow: 'row wrap' }}>
					<div className="field">
						<label className="label">
							Notes
							<textarea {...register('notes')} className={hasError('notes') ? 'textarea is-danger' : 'textarea'} />
						</label>
						<BulmaError for="notes" />
					</div>
					<div className="field">
						<label className="label">Your rating</label>
						{optionsRadio.map(option => (
							<label key={option.id} className="radio mr-1">
								<input
									type="radio"
									className="radio mr-1"
									{...register('radio')}
									checked={String(getValue('radio')) === String(option.id)}
									data-testid={`radio-${option.id}`}
									value={option.id}
								/>
								{option.name}
							</label>
						))}
					</div>
					<div className="field">
						<label className="label">Recommendation</label>
						<label className="checkbox">
							<input type="checkbox" className={hasError('checkbox') ? 'mr-2 is-danger' : 'mr-2'} {...register('checkbox')} />
							Yes I would recommend this artist
						</label>
					</div>
					<div className="field">
						<input type="color" {...register('color', 'input')} />
						<BulmaError for="color" />
					</div>
					<div className="break" style={{ width: '100%' }} />

					<div className="field">
						<input type="url" placeholder="Enter url" {...register('url', 'input')} />
						<BulmaError for="url" />
					</div>
					<div className="field">
						<input type="email" placeholder="Enter email" {...register('email', 'input')} />
						<BulmaError for="email" />
					</div>
					<div className="field">
						<input type="date" {...register('date', 'input')} />
						<BulmaError for="date" />
					</div>
					<div className="field">
						<input type="time" placeholder="Enter time" {...register('time', 'input')} />
						<BulmaError for="time" />
					</div>
				</div>
			</div>
			<hr />

			<div className="field is-horizontal">
				<div className="field-label is-normal">
					Here is test for file upload
					<br />
					<button
						className="button is-small is-light is-primary"
						onClick={e => {
							e.preventDefault();
							append('files', null);
						}}
					>
						+ Add new
					</button>
					<br />
					<BulmaError for="files" />
				</div>
				<div className="field-body">
					{(getValue('files') || []).map((file, idx) => (
						<React.Fragment key={key()}>
							<div className="field is-narrow">
								<label className="file-label">
									<input className="file-input" name={`files[${idx}]`} type="file" onChange={onChange} />
									<span className="file-cta is-size-7">
										<span className="file-label">{(file || {}).name || 'Choose a file…'}</span>
									</span>
									<button
										className="button is-small is-light is-warning"
										onClick={e => {
											e.preventDefault();
											remove('files', idx);
										}}
									>
										x
									</button>
								</label>
								<BulmaError for={`files[${idx}]`} />
							</div>
						</React.Fragment>
					))}
				</div>
			</div>
			<hr />

			<div className="field is-horizontal">
				<div className="field-label is-normal" />
				<div className="field-body">
					<button type="submit" className="button is-large is-primary mr-2" onClick={handleSubmit(onSubmit)}>
						Submit form
					</button>
					<button type="submit" className="button is-large" onClick={onReset}>
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
}

export default TestForm;
