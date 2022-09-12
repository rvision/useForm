import * as yup from 'yup';

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
	files: yup
		.array()
		.ensure()
		// .min(1, 'Please enter at least 1 file to upload (txt, jpg, png, gif)')
		.of(
			yup
				.mixed()
				.test(
					'format',
					'Unsupported Format',
					value => value === null || (value && ['application/pdf', 'text/plain', 'image/jpg', 'image/jpeg', 'image/gif', 'image/png'].includes(value.type)),
				)
				.required('File is required'),
		),
});

export default schema;
