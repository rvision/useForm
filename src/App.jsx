import React, { useEffect } from 'react';
import Demo from './Demo';

const App = () => {
	return (
		<section className="hero">
			<div className="hero-body">
				<p className="title">useForm demo</p>
				<p className="subtitle">testing with native inputs and custom components</p>
			</div>

			<div className="px-6">
				<Demo />
			</div>
		</section>
	);
};

export default App;
