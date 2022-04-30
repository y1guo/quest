import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Container } from "@mui/material";
import Quests from "./Quests";
import Calendar from "./Calendar";
import Settings from "./Settings";
import FixedBottomNavigation from "../components/FixedBottomNavigation";

const theme = createTheme();

function DashboardContent() {
  return <div>Dashboard</div>;
}

export default function Dashboard() {
  const [page, setPage] = useState("Dashboard");

  return (
    <ThemeProvider theme={theme}>
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
          {/* <Container> */}
          {page === "Dashboard" ? (
            <DashboardContent />
          ) : page === "Quests" ? (
            <Quests />
          ) : page === "Calendar" ? (
            <Calendar />
          ) : page === "Settings" ? (
            <Settings />
          ) : null}
          {/* </Container> */}
        </Container>
        <FixedBottomNavigation page={page} setPage={setPage} />
      </Box>
    </ThemeProvider>
  );
}
