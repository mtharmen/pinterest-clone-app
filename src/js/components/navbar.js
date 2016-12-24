import React from 'react';
import { Link } from 'react-router';

class Navbar extends React.Component{
  	render() {
	    return (
	    	<header>
			    <nav className="navbar navbar-default " role="navigation">
			    	<div className="container">
				        <ul className="nav navbar-nav navbar-left">
				            <li>
				            	<Link to="/" className="navbar-brand"><i className="fa fa-home" aria-hidden="true"></i> Home</Link>
				            </li>
				        </ul>
						{this.props.user ? (
							<ul className="nav navbar-nav navbar-right">
								<li>
									<Link to={"/user/"+this.props.user.username}><i className="fa fa-user-circle-o" aria-hidden="true"></i> Profile</Link>
								</li>
								<li> 
									<a href="/auth/logout"><i className="fa fa-sign-out" aria-hidden="true"></i> Logout</a>
								</li>
							</ul>
						) : (
							<ul className="nav navbar-nav navbar-right">
								<li>
									<a href="/auth/twitter"> <i className="fa fa-sign-in" aria-hidden="true"></i> Login with <i className="fa fa-twitter" aria-hidden="true"></i></a>
								</li>
							</ul>
						)}
					</div>
			    </nav>
			</header>
	    );
  	}
};

export default Navbar;