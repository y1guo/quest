import "./firebase/init";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Box, Container, CssBaseline, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import SignIn from "./SignIn";
import Dashboard from "./pages/Dashboard";
import Quests from "./pages/Quests";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import NavigationBar from "./components/NavigationBar";

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

  // media query
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "column-reverse",
          }}
        >
          <Box sx={{ overflow: "auto", flexGrow: 1 }}>
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
          </Box>
          <Box width={"100%"}>
            <NavigationBar page={page} setPage={setPage} />
          </Box>
        </Box>
      ) : (
        <SignIn />
      )}
    </ThemeProvider>
  );
}

export default App;
