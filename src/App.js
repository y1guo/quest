import React from "react";
import "./App.css";
import { logIn, logOut } from "./auth";
import { fsAddDoc, fsGetDocs } from "./fb-demo";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };

        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    handleLogIn() {
        logIn((user) => {
            this.setState({
                user: user,
            });
        });
    }

    handleLogOut() {
        logOut(() => {
            this.setState({
                user: null,
            });
        });
    }

    render() {
        if (!this.state.user) {
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
                        <h1>Hello {this.state.user.displayName}!</h1>
                        <button onClick={this.handleLogOut}>log out</button>
                        <h3>主线任务</h3>
                        <ol>
                            <li>主线任务1</li>
                            <li>主线任务2</li>
                        </ol>
                        <h3>支线任务</h3>
                        <ol>
                            <li>支线任务1</li>
                            <li>支线任务2</li>
                        </ol>
                        <h3>每日任务</h3>
                        <ol>
                            <li>每日任务1</li>
                            <li>每日任务2</li>
                        </ol>
                        <h3>可选任务</h3>
                        <ol>
                            <li>可选任务1</li>
                            <li>可选任务2</li>
                        </ol>
                    </header>
                </div>
            );
        }
    }
}

export default App;
