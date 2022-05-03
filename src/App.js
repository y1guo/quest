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
import { listenToUserData } from "./firebase/database";

// const [theme, setTheme] = useState(createTheme());
// const theme = createTheme({
//   palette: {
//     mode: "dark",
//   },
// });

function App() {
  // set user
  const [user, setUser] = useState(getAuth().currentUser || { uid: "loading" });
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => setUser(user));
    return unsubscribe;
  }, []);

  // set theme mode dark or light
  const systemDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [themeSetting, setThemeSetting] = useState(
    JSON.parse(localStorage.getItem("theme")) || "auto"
  );
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

  // enable animation or not
  // collapse not working on safari/ios
  const [enableAnimation, setEnableAnimation] = useState(
    JSON.parse(localStorage.getItem("enableAnimation")) || true
  );

  // wrap up all settings
  const settings = {
    themeSetting: { value: themeSetting, setter: setThemeSetting },
    enableAnimation: { value: enableAnimation, setter: setEnableAnimation },
  };

  // page to display
  const [page, setPage] = useState("Quests");

  // media query
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // get all active quests
  const [activeQuests, setActiveQuests] = useState({});
  useEffect(() => {
    if (user && user.uid !== "loading") {
      const unsubscribe = listenToUserData("active", setActiveQuests);
      return unsubscribe;
    }
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? (
        user.uid === "loading" ? null : (
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
                <Quests activeQuests={activeQuests} settings={settings} />
              ) : page === "Calendar" ? (
                <Calendar />
              ) : page === "Settings" ? (
                <Settings settings={settings} />
              ) : null}
            </Box>
            <Box width={"100%"}>
              <NavigationBar page={page} setPage={setPage} />
            </Box>
          </Box>
        )
      ) : (
        <SignIn />
      )}
    </ThemeProvider>
  );
}

export default App;
