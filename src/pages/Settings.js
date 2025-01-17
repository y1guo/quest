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
                paddingX: 2,
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
                        props.themeSetting.setter(event.target.value);
                        localStorage.setItem(
                            "theme",
                            JSON.stringify(event.target.value)
                        );
                    }}
                    value={props.themeSetting.value}
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

function LanguageSettings(props) {
    return (
        <Entry>
            <Typography variant="h6">Language</Typography>
            <FormControl>
                <RadioGroup
                    row
                    onChange={(event) => {
                        props.language.setter(event.target.value);
                        localStorage.setItem(
                            "language",
                            JSON.stringify(event.target.value)
                        );
                    }}
                    value={props.language.value}
                >
                    <FormControlLabel
                        value="en"
                        control={<Radio />}
                        label="English"
                        labelPlacement="top"
                    />
                    <FormControlLabel
                        value="zh"
                        control={<Radio />}
                        label="中文"
                        labelPlacement="top"
                    />
                </RadioGroup>
            </FormControl>
        </Entry>
    );
}

export default function Settings(props) {
    return (
        <Container sx={{ px: 0, py: 2 }} maxWidth="md">
            <Stack spacing={1} padding={0} divider={<Divider />}>
                <UserSettings />
                <ThemeSettings themeSetting={props.settings.themeSetting} />
                <LanguageSettings language={props.settings.language} />
            </Stack>
        </Container>
    );
}
