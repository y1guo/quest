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
  const theme = React.useMemo(() => {
    const theme = createTheme({
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
    });
    // change Web / MacOS PWA status bar color
    const setThemeColor = (color) =>
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute("content", color);
    setThemeColor(theme.palette.background.default);

    return theme;
  }, [themeSetting, systemDarkMode]);

  // language setting
  const [language, setLanguage] = useState(
    JSON.parse(localStorage.getItem("language")) || "en"
  );

  // wrap up all settings
  const settings = {
    themeSetting: { value: themeSetting, setter: setThemeSetting },
    language: { value: language, setter: setLanguage },
  };

  // media query
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // page to display
  const [page, setPage] = useState("Quests");

  // get all active quests
  const [activeQuests, setActiveQuests] = useState({});
  useEffect(() => {
    if (user && user.uid !== "loading") {
      const unsubscribe = listenToUserData(setActiveQuests, "active");
      return unsubscribe;
    }
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        id="status-bar"
        sx={{
          height: `env(safe-area-inset-top)`,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "#000",
        }}
      />
      {user ? (
        user.uid === "loading" ? null : (
          <Box
            sx={{
              width: "100%",
              height: `calc(100% - env(safe-area-inset-top))`,
              display: "flex",
              alignItems: "center",
              flexDirection: isMobile ? "column" : "column-reverse",
            }}
          >
            <Box sx={{ width: "100%", overflow: "auto", flexGrow: 1 }}>
              {page === "Dashboard" ? (
                <Dashboard />
              ) : page === "Quests" ? (
                <Quests
                  activeQuests={activeQuests}
                  setActiveQuests={setActiveQuests}
                  settings={settings}
                />
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
