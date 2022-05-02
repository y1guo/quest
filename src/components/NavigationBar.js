import {
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";

export default function NavigationBar(props) {
  // media query
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper elevation={3}>
      <BottomNavigation
        sx={{ backgroundColor: "transparent" }}
        showLabels
        value={props.page}
        onChange={(event, newPage) => {
          if (newPage !== props.page) {
            props.setPage(newPage);
          }
        }}
      >
        <BottomNavigationAction
          label="Dashboard"
          value="Dashboard"
          icon={<DashboardIcon />}
        />
        <BottomNavigationAction
          label="Quests"
          value="Quests"
          icon={<TaskOutlinedIcon />}
        />
        <BottomNavigationAction
          label="Calendar"
          value="Calendar"
          icon={<CalendarMonthIcon />}
        />
        <BottomNavigationAction
          label="Settings"
          value="Settings"
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
      {isMobile && <Box sx={{ height: "20px" }}></Box>}
    </Paper>
  );
}
