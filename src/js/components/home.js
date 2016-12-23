import React from 'react';

import Gallery from './gallery';

class Home extends React.Component {

	render() {
		return (
			<Gallery user={this.props.route.user}/>
		);
	}
}

export default Home;