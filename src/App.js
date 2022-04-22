import React from "react";
import "./App.css";
import logIn from "./log-in";
import logOut from "./log-out";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            user: null,
        };

        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    handleLogIn() {
        logIn((user) => {
            this.setState({
                loggedIn: true,
                user: user,
            });
        });
    }

    handleLogOut() {
        logOut();
        this.setState({
            loggedIn: false,
            user: null,
        });
    }

    render() {
        if (!this.state.loggedIn) {
            return (
                <div className="App">
                    <header className="App-header">
                        <button onClick={this.handleLogIn}>log in</button>
                    </header>
                </div>
            );
        } else {
            return (
                <div className="App">
                    <header className="App-header">
                        <p>Hello {this.state.user.displayName}!</p>
                        <button onClick={logOut}>log out</button>
                    </header>
                </div>
            );
        }
    }
}

export default App;
