import "./App.css";
import { useState, useEffect } from "react";
import "./firebase";
import { auth } from "./auth";
import Login from "./Login";
import Navbar from "./Navbar";
import Quest from "./Quest";

function App() {
    // monitor user change
    const [user, setUser] = useState(auth.currentUser);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
        return unsubscribe;
    }, []);

    if (user) {
        return (
            <div className="App">
                <Navbar />
                <Quest />
            </div>
        );
    } else {
        return (
            <div className="App">
                <Login />
            </div>
        );
    }
}

export default App;
