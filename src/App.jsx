import React, { useEffect } from 'react';
import Demo from './Demo';

const App = () => {
	return (
		<section className="hero">
			<div className="hero-body">
				<p className="title">useForm demo</p>
				<p className="subtitle">testing with native inputs and custom components</p>
			</div>

			<div className="columns">
				<div className="column is-8 is-offset-2">
					<div className="columns">
						<div className="column">
							<Demo />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default App;
