import React from 'react';

class ErrorPage extends React.Component {
	render() {
		return (
			<div>
				<h1>Error: Could not fetch data from server</h1>
				<h2>Go Back to the home page and try again</h2>
			</div>
		);
	}
}

export default ErrorPage;