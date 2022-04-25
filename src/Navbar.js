import "./Navbar.css";
import { login, logout } from "./auth";
import Clock from "./Clock";

function Navbar(props) {
    return (
        <div className="Navbar sticky">
            <div className="container">
                <div className="container align-left">
                    <Clock />
                </div>
            </div>
            <div className="container">
                <div className="container align-right">
                    <div className="Menu">
                        <ul>
                            <li>
                                <h3>
                                    {props.user ? props.user.displayName : null}
                                </h3>
                            </li>
                            <li>
                                {props.user ? (
                                    <button onClick={logout}>log out</button>
                                ) : (
                                    <button onClick={login}>log in</button>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
