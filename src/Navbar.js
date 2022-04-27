import "./Navbar.css";
import { auth, logout } from "./auth";
import Clock from "./Clock";

function MenuBar() {
    return (
        <div className="Menu">
            <h3 className="username">{auth.currentUser.displayName}</h3>
            <button className="logout" onClick={logout}>
                Log Out
            </button>
        </div>
    );
}

function Navbar(props) {
    return (
        <div className="Navbar">
            <MenuBar />
            <Clock />
        </div>
    );
}

export default Navbar;
