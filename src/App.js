import "./firebase/init";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Box, Container, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import SignIn from "./SignIn";
import Dashboard from "./pages/Dashboard";
import Quests from "./pages/Quests";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import BottomNavigationBar from "./components/BottomNavigationBar";

// const [theme, setTheme] = useState(createTheme());
// const theme = createTheme({
//   palette: {
//     mode: "dark",
//   },
// });

function App() {
  // set user
  const [user, setUser] = useState(getAuth().currentUser);
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => setUser(user));
    return unsubscribe;
  }, []);

  // set theme mode dark or light
  const systemDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [themeSetting, setThemeSetting] = useState("auto");
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode:
            themeSetting === "dark"
              ? "dark"
              : themeSetting === "light"
              ? "light"
              : systemDarkMode
              ? "dark"
              : "light",
        },
      }),
    [themeSetting, systemDarkMode]
  );

  // select which page to display
  const [page, setPage] = useState("Dashboard");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? (
        <Box
          sx={{
            width: window.innerWidth,
            height: window.innerHeight,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Container sx={{ padding: 0, overflow: "auto" }}>
            {page === "Dashboard" ? (
              <Dashboard />
            ) : page === "Quests" ? (
              <Quests />
            ) : page === "Calendar" ? (
              <Calendar />
            ) : page === "Settings" ? (
              <Settings
                themeSetting={themeSetting}
                setThemeSetting={setThemeSetting}
              />
            ) : null}
          </Container>
          <BottomNavigationBar page={page} setPage={setPage} />
        </Box>
      ) : (
        <SignIn />
      )}
    </ThemeProvider>
  );
}

export default App;
