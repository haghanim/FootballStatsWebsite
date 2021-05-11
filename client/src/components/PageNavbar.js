/**
 * Displays the navbar for our webpage.
 */

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/main.css';
import pic from './ball.png'

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		};
	};

	/**
	 * Creates a list of the buttons for the navbar
	 */
	componentDidMount() {
		const pageList = ['players', 'teams', 'leagues'];

		let navbarDivs = pageList.map((page, i) => {
			if (this.props.active === page) {
				return <a className="nav-item nav-link active" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			} else {
				return <a className="nav-item nav-link" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			}
		});

		this.setState({
			navDivs: navbarDivs
		});
	};

	/**
	 * HTML section of the file. This will display the navBar HTML that will be displayed
	 * at the top of the website.
	 */
	render() {
		return (
			<div >

				<nav className="navbar ml-auto navbar-expand-lg navbar-light bg-light">
				<img src = {pic} className="ball"/>
			      <span className="bar" >Y </span>
			      <div className="ball" id="navbarNavAltMarkup">
			        <div className="navbar-nav">
			        	{this.state.navDivs}
						<div className="navbar-brand bar rentered ser" ><h4>YAMN FOOTBALL STATS</h4></div>
			        </div>
			      </div>
			    </nav>
			</div>
    );
	};
};
