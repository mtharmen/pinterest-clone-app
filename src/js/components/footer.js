import React from 'react';

class Footer extends React.Component {
	render() {
		return (
			<footer className="footer">
			    <div className="container">
					<p><small>
						<a href="https://www.freecodecamp.com/challenges/build-a-pinterest-clone" target="_blank">FCC Pinterest Clone App</a> | 
						<a href="https://github.com/mtharmen/pinterest-clone-app" target="_blank"> GitHub Repo <i className="fa fa-github" aria-hidden="true"></i></a> | 
						<a href="http://fontawesome.io/" target="_blank"> Icons from Font Awesome <i className="fa fa-font-awesome" aria-hidden="true"></i></a> | 
						<a href="https://bootswatch.com/darkly/" target="_blank"> Darkly Theme from Bootswatch</a>
					</small></p>
				</div>
			</footer>
		);
	}
}

export default Footer;