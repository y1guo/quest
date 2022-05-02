import { getAuth } from "firebase/auth";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

function Entry(props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {props.children}
    </Box>
  );
}

function UserSettings() {
  return (
    <Entry>
      <Typography variant="h4" paddingX={"1rem"}>
        {getAuth().currentUser.displayName}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={() => getAuth().signOut()}
      >
        Log Out
      </Button>
    </Entry>
  );
}

function ThemeSettings(props) {
  return (
    <Entry>
      <Typography variant="h6">Appearance</Typography>
      <FormControl>
        <RadioGroup
          row
          onChange={(event) => {
            props.setThemeSetting(event.target.value);
          }}
          value={props.themeSetting}
        >
          <FormControlLabel
            value="auto"
            control={<Radio />}
            label="Auto"
            labelPlacement="top"
          />
          <FormControlLabel
            value="light"
            control={<Radio />}
            label="Light"
            labelPlacement="top"
          />
          <FormControlLabel
            value="dark"
            control={<Radio />}
            label="Dark"
            labelPlacement="top"
          />
        </RadioGroup>
      </FormControl>
    </Entry>
  );
}

function SampleSwitch() {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch defaultChecked />}
        label="Follow System"
      />
      <FormControlLabel disabled control={<Switch />} label="Disabled" />
    </FormGroup>
  );
}

export default function Settings(props) {
  return (
    <Container sx={{ padding: 0 }}>
      <Stack spacing={1} padding={3} divider={<Divider />}>
        <UserSettings />
        <ThemeSettings
          themeSetting={props.themeSetting}
          setThemeSetting={props.setThemeSetting}
        />
      </Stack>
    </Container>
  );
}
