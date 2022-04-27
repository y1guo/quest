import "./Login.css";
import { login } from "./auth";

function Login() {
    return (
        <div className="Login">
            <button onClick={login}>Log In</button>
        </div>
    );
}

export default Login;
