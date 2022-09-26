import React, { useEffect, useMemo, useState } from "react";
import { Timestamp } from "firebase/firestore";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Popover,
    Rating,
    Select,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import {
    questTypeNamesEN,
    questTypeNamesZH,
    questFieldNamesEN,
    questFieldNamesZH,
} from "../appMeta";
import {
    firestoreSaveQuest,
    firestoreMoveQuestToTrash,
    firestoreCreateEmptyLog,
    listenToUserData,
} from "../firebase/database";
import { questColor } from "../colors";
import { seconds2String } from "../utils";

export default function QuestEditor(props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    // background color
    const color = useMemo(
        () => (props.quest ? questColor(props.quest, theme) : null),
        [props.quest, theme]
    );
    // language
    const [questTypeNames, questFieldNames] = useMemo(
        () =>
            props.settings.language.value === "en"
                ? [questTypeNamesEN, questFieldNamesEN]
                : [questTypeNamesZH, questFieldNamesZH],
        [props.settings.language.value]
    );

    // auto save
    const [lastEditTime, setLastEditTime] = useState(null);
    const setQuest = (newQuest) => {
        setLastEditTime(Timestamp.now());
        props.setQuest(newQuest);
    };
    useEffect(() => {
        if (props.quest && lastEditTime) {
            if (props.quest.dateModified.toMillis() < lastEditTime.toMillis()) {
                const timer = setTimeout(() => {
                    firestoreSaveQuest(
                        { ...props.quest, dateModified: lastEditTime },
                        props.id,
                        () => console.log("saveQuest: success"),
                        () => console.log("saveQuest: failure")
                    );
                }, 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [lastEditTime, props.id, props.quest]);

    // menu
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClickMore = (event) => setAnchorEl(event.currentTarget);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const handleDelete = () => {
        firestoreMoveQuestToTrash(
            props.quest,
            props.id,
            () => console.log("fireStoreMoveToTrash: success"),
            () => console.log("fireStoreMoveToTrash: failure")
        );
        props.setQuestIdOnFocus(null);
    };
    const lastEditSince = () => {
        if (!props.quest) {
            return "";
        }
        return seconds2String(
            (Timestamp.now().toMillis() - props.quest.dateModified.toMillis()) /
                1000
        );
    };

    // get logs
    const [logs, setLogs] = useState({});
    useEffect(() => {
        const unsubscribe = listenToUserData(
            setLogs,
            "active",
            props.id,
            "logs"
        );
        return unsubscribe;
    }, [props.id]);
    // logs to string, order by date
    const logs2String = useMemo(() => {
        const logsList = [];
        for (let id in logs) {
            logsList.push({ id: id, time: logs[id].date.toMillis() });
        }
        const logIdByDate = logsList
            .sort((doc1, doc2) => doc2.time - doc1.time)
            .map((doc) => doc.id);
        return logIdByDate.map((id) => {
            return {
                id: id,
                value: logs[id].date.toDate().toLocaleString() + logs[id].note,
            };
        });
    }, [logs]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Popover
                sx={{ backgroundColor: color }}
                anchorReference="anchorPosition"
                anchorPosition={{
                    top: window.innerHeight / 2,
                    left: window.innerWidth / 2,
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
                open={props.id !== null}
                onClose={() => {
                    // on close, immediately save new edit
                    if (
                        lastEditTime &&
                        props.quest.dateModified.toMillis() <
                            lastEditTime.toMillis()
                    ) {
                        firestoreSaveQuest(
                            { ...props.quest, dateModified: lastEditTime },
                            props.id,
                            () => console.log("saveQuest: success"),
                            () => console.log("saveQuest: failure")
                        );
                    }
                    props.setQuestIdOnFocus(null);
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxHeight:
                            "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 1,
                            pl: 2,
                        }}
                    >
                        <EditOutlinedIcon fontSize="small" />
                        <Typography
                            variant="body2"
                            pl={0.5}
                            color="text.secondary"
                        >
                            {lastEditSince() + " "}
                            ago
                        </Typography>
                        <IconButton
                            sx={{ ml: "auto" }}
                            onClick={() => {
                                firestoreCreateEmptyLog(props.id);
                            }}
                        >
                            <AddOutlinedIcon />
                        </IconButton>
                        <IconButton onClick={handleClickMore}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem
                                onClick={() => {
                                    setOpenConfirmDelete(true);
                                    setAnchorEl(null);
                                }}
                            >
                                <ListItemIcon>
                                    <DeleteOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Delete</ListItemText>
                            </MenuItem>
                        </Menu>
                        <Dialog open={openConfirmDelete}>
                            <DialogTitle>
                                {"Do you really want to delete?"}
                            </DialogTitle>
                            <DialogActions>
                                <Button
                                    onClick={() => {
                                        setOpenConfirmDelete(false);
                                        handleDelete();
                                    }}
                                >
                                    Yes
                                </Button>
                                <Button
                                    onClick={() => {
                                        setOpenConfirmDelete(false);
                                    }}
                                    autoFocus
                                >
                                    No
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                    <Box sx={{ overflow: "auto" }}>
                        <TextField
                            sx={{ m: 0 }}
                            fullWidth
                            label={questFieldNames["title"]}
                            variant="filled"
                            multiline
                            InputProps={{
                                disableUnderline: true,
                                sx: { backgroundColor: "transparent" },
                            }}
                            value={props.quest.title}
                            onInput={(e) =>
                                setQuest({
                                    ...props.quest,
                                    title: e.target.value,
                                })
                            }
                        />

                        <TextField
                            sx={{ m: 0 }}
                            fullWidth
                            label={questFieldNames["note"]}
                            variant="filled"
                            multiline
                            InputProps={{
                                disableUnderline: true,
                                sx: { backgroundColor: "transparent" },
                            }}
                            value={props.quest.note}
                            onInput={(e) =>
                                setQuest({
                                    ...props.quest,
                                    note: e.target.value,
                                })
                            }
                        />
                        {logs2String.map((element) => (
                            <TextField
                                key={element.id}
                                sx={{ m: 0 }}
                                fullWidth
                                variant="filled"
                                multiline
                                InputProps={{
                                    disableUnderline: true,
                                    sx: { backgroundColor: "transparent" },
                                }}
                                value={element.value}
                                // onInput={(e) =>
                                //   setQuest({ ...props.quest, note: e.target.value })
                                // }
                            />
                        ))}

                        <Grid
                            container
                            py={2}
                            px={2}
                            spacing={2}
                            alignItems="center"
                        >
                            <Grid item xs={6} sm={3} md={2}>
                                <DatePicker
                                    label="Active Date"
                                    value={props.quest.dateActive.toDate()}
                                    onChange={(newValue) => {
                                        setQuest({
                                            ...props.quest,
                                            dateActive:
                                                Timestamp.fromDate(newValue),
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3} md={2}>
                                <TimePicker
                                    label="Active Time"
                                    value={props.quest.dateActive.toDate()}
                                    onChange={(newValue) => {
                                        setQuest({
                                            ...props.quest,
                                            dateActive:
                                                Timestamp.fromDate(newValue),
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3} md={2}>
                                <DatePicker
                                    label="Expire Date"
                                    value={
                                        props.quest.dateExpire
                                            ? props.quest.dateExpire.toDate()
                                            : null
                                    }
                                    onChange={(newValue) => {
                                        setQuest({
                                            ...props.quest,
                                            dateExpire:
                                                Timestamp.fromDate(newValue),
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3} md={2}>
                                <TimePicker
                                    label="Expire Time"
                                    value={
                                        props.quest.dateExpire
                                            ? props.quest.dateExpire.toDate()
                                            : null
                                    }
                                    onChange={(newValue) => {
                                        setQuest({
                                            ...props.quest,
                                            dateExpire:
                                                Timestamp.fromDate(newValue),
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="quest-type-select-label">
                                        {questFieldNames["type"]}
                                    </InputLabel>
                                    <Select
                                        labelId="quest-type-select-label"
                                        value={props.quest.type}
                                        label={questFieldNames["type"]}
                                        onChange={(event) => {
                                            setQuest({
                                                ...props.quest,
                                                type: event.target.value,
                                            });
                                        }}
                                    >
                                        <MenuItem value={"main"}>
                                            {questTypeNames["main"]}
                                        </MenuItem>
                                        <MenuItem value={"side"}>
                                            {questTypeNames["side"]}
                                        </MenuItem>
                                        <MenuItem value={"optional"}>
                                            {questTypeNames["optional"]}
                                        </MenuItem>
                                        <MenuItem value={"daily"}>
                                            {questTypeNames["daily"]}
                                        </MenuItem>
                                        <MenuItem value={"none"}>
                                            {questTypeNames["none"]}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={3} md={2}>
                                <Typography variant="subtitle2">
                                    Priority
                                </Typography>
                                <Rating
                                    value={
                                        props.quest.priority
                                            ? props.quest.priority
                                            : null
                                    }
                                    onChange={(event, newValue) => {
                                        setQuest({
                                            ...props.quest,
                                            priority: newValue,
                                        });
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>
                                        {questFieldNames["prerequisite"]}
                                    </InputLabel>
                                    <Select
                                        native
                                        defaultValue=""
                                        label="Grouping"
                                    >
                                        <option value="" />
                                        <optgroup label="Category 1">
                                            <option value={1}>Option 1</option>
                                            <option value={2}>Option 2</option>
                                        </optgroup>
                                        <optgroup label="Category 2">
                                            <option value={3}>Option 3</option>
                                            <option value={4}>Option 4</option>
                                        </optgroup>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Popover>
        </LocalizationProvider>
    );
}
