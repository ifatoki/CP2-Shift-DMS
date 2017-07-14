import React from 'react';

class LandingContainer extends React.Component {

  render() {
    return (
      <div>
        <div className="ui large top fixed hidden menu">
          <div className="ui container">
            <a className="active item">Home</a><a className="item">Work</a><a className="item">Company</a><a className="item">Careers</a>
            <div className="right menu">
              <div className="item">
                <a className="ui button" name="login" href="login">Log in</a>
              </div>
              <div className="item">
                <a className="ui primary button" name="signup" href="/signup">Sign Up</a>
              </div>
            </div>
          </div>
        </div>
        <h1 style={{ paddingTop: '60px', marginTop: '0px' }}>
          Welcome to SHIFT DMS
        </h1>
      </div>
    );
  }
}

export default LandingContainer;
