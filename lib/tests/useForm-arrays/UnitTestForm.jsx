import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { yupResolver } from '../../resolvers';
import useForm from '../../useForm';

const toYYYYMMDDString = date => {
	if (date === null) {
		return null;
	}
	if (date instanceof Date) {
		const year = date.getFullYear();
		const month = (1 + date.getMonth()).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');

		return `${year}-${month}-${day}`;
	}
	return date;
};

function UnitTestForm({ mode, defaultValues, schema, onFormSubmit }) {
	const {
		getValue,
		setValue,
		setRef,
		register,
		handleSubmit,
		array,
		key,
		hasError,
		Error,
		Errors,
		formState: { reset },
	} = useForm({
		defaultValues,
		mode,
		classNameError: 'is-danger',
		shouldFocusError: true,
		resolver: yupResolver(schema),
	});

	const onReset = e => {
		e.preventDefault();
		reset();
	};

	return (
		<div>
			<Errors focusable>
				{errorList => (
					<div className="notification is-danger" role="errors-summary">
						<h6>Your form has some errors:</h6>
						<ul className="validation-errors">{errorList}</ul>
					</div>
				)}
			</Errors>

			<div className="field is-horizontal">
				<div className="field-body" style={{ flexFlow: 'row wrap' }}>
					{(getValue('albums') || []).map((album, idx) => (
						<React.Fragment key={key(album)}>
							<div className="field">
								<label>
									Album name
									<input type="text" placeholder="Enter album name" data-testid={`albums.${idx}.name`} {...register(`albums.${idx}.name`, 'input')} />
									<Error for={`albums.${idx}.name`} />
								</label>
							</div>
							<div className="field is-narrow">
								<label>
									Album release date
									<input
										type="date"
										{...register(`albums.${idx}.releaseDate`, 'input')}
										value={getValue(`albums.${idx}.releaseDate`) ? toYYYYMMDDString(getValue(`albums.${idx}.releaseDate`)) : ''}
									/>
									<Error for={`albums.${idx}.releaseDate`} />
								</label>
							</div>
							<div className="field is-narrow pt-1">
								<button
									className="button is-small is-light is-warning"
									data-testid={`button-remove_album_${idx}`}
									onClick={e => {
										e.preventDefault();
										array.remove('albums', idx);
									}}
								>
									remove album {idx}
								</button>
							</div>
							<div className="break" style={{ width: '100%' }} />
						</React.Fragment>
					))}
				</div>
			</div>

			<div className="field is-horizontal">
				<div className="field-label is-normal" />
				<div className="field-body">
					<button type="submit" className="button is-large is-primary mr-2" data-testid="button-submit" onClick={handleSubmit(onFormSubmit)}>
						Submit form
					</button>
					<button type="submit" className="button is-large" data-testid="button-reset" onClick={onReset}>
						Reset
					</button>
				</div>
			</div>

			<div className="field-label is-normal">
				<label className="label">Albums:</label>
				<button
					type="button"
					name="add_new_album"
					className="button is-small is-light is-primary"
					data-testid="button-add_new_album"
					onClick={e => {
						e.preventDefault();
						array.append('albums', { name: '', releaseDate: null });
					}}
				>
					+ Add new album
				</button>

				<button
					type="button"
					name="add_new_album"
					className="button is-small is-light is-warning"
					data-testid="button-prepend_new_album"
					onClick={e => {
						e.preventDefault();
						// const { length } = getValue('albums');
						array.prepend('albums', { name: Date.now(), releaseDate: null });
						// if (hadError) {
						// 	trigger('albums');
						// }
					}}
				>
					+ Prepend new album
				</button>

				<button
					type="button"
					name="add_new_album"
					className="button is-small is-light is-info"
					data-testid="button-swap_albums"
					onClick={e => {
						e.preventDefault();
						array.swap('albums', 0, 2);
					}}
				>
					Swap 0-2 albums
				</button>

				<button
					type="button"
					name="clear_albums"
					className="button is-small is-light is-warning"
					data-testid="button-clear_albums"
					onClick={e => {
						e.preventDefault();
						setValue('albums', []);
					}}
				>
					x Clear albums
				</button>
			</div>
		</div>
	);
}

export default UnitTestForm;
