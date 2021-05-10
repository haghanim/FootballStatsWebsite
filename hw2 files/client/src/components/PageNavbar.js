import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Player.css';
import pic from './ball.png'

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		};
	};

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

	render() {
		return (
			<div >
				
				<nav className="navbar ml-auto navbar-expand-lg navbar-light bg-light">
				<img src = {pic} className="ball"/>
			      <span className="bar" >Y </span>
			      <div className="ball" id="navbarNavAltMarkup">
			        <div className="navbar-nav">
			        	{this.state.navDivs}
						<div className="bar" >YAMNFootballStatsYAMNFootballStatsYAMNFootballStatsYAMNFootballStatsYAMNFootballStatsYAMNFootballStatsYAMNFootballStats</div>
						<div className="navbar-brand bar" >YAMN Football Stats</div>
			        </div>
			      </div>
			    </nav>
			</div>
    );
	};
};