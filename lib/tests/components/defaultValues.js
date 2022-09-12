const defaultValues = Object.freeze({
	title: 'Ms',
	occupation: ['actress', 'singer'],
	firstName: 'Grace',
	lastName: 'Jones',
	radio: '3',
	checkbox: false,
	notes: 'I love this artist!',
	birthDate: new Date('1948-05-19'),
	albums: [{ name: 'Warm Leatherette', releaseDate: new Date('1980-05-09') }],
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
	],
	files: [],
	color: '#ec7e7e',
	date: '2021-10-28',
});

export default defaultValues;
