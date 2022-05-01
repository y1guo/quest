import {
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";

export default function BottomNavigationBar(props) {
  return (
    <Paper sx={{ backgroundImage: "none" }} elevation={3}>
      <BottomNavigation
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
      <Box sx={{ height: "20px" }}></Box>
    </Paper>
  );
}
