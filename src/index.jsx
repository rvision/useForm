import React from 'react';
import ReactDOM from 'react-dom';
// import all styles
import '../assets/styles/index.scss';
import App from './App';

// run
ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('app'),
);
