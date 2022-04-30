import "./firebase/init";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import SignIn from "./SignIn";
import Dashboard from "./pages/Dashboard";
import { CssBaseline } from "@mui/material";

const auth = getAuth();

function App() {
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    return unsubscribe;
  }, []);

  return (
    <div className="App">
      <CssBaseline />
      {user ? <Dashboard /> : <SignIn />}
    </div>
  );
}

export default App;
