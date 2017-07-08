class App extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact path="/" render={() => (
            this.props.isAuthenticated
            ?
              <Redirect to="/home" />
            :
              <h1>
                I am the landing page
              </h1>
          )}
        />
        <Route
          exact path="/login" render={() => (
            this.props.isAuthenticated
            ?
              <Redirect to="/home" />
            :
              (<h1>
                I am the login page
              </h1>)
          )}
        />
      </Switch>
    );
  }