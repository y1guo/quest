import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Timestamp } from "firebase/firestore";
import {
  Alert,
  Box,
  Button,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Fade,
  FormControl,
  Grid,
  Grow,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Rating,
  Select,
  Slide,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { questTypes, questTypeNames, questFieldNames } from "../appMeta";
import {
  createEmptyQuest,
  firestoreSaveQuest,
  firestoreMoveQuestToTrash,
} from "../firebase/database";
import { questColor } from "../colors";

// function deepCopy(object) {
//   return JSON.parse(JSON.stringify(object));
// }

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

export default function QuestEditor(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // background color
  const color = useMemo(
    () => (props.quest ? questColor(props.quest, theme) : null),
    [props.quest, theme]
  );

  // auto save
  const [lastEditTime, setLastEditTime] = useState(null);
  // useEffect(() => {
  //   if (props.quest) {
  //     if (props.quest.dateModified.toMillis() > lastEditTime.toMillis()){
  //     setLastEditTime(props.quest.dateModified);}
  //   } else {
  //     setLastEditTime(null);
  //   }
  // }, [props.quest, lastEditTime]);
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
    const seconds =
      (Timestamp.now().toMillis() - props.quest.dateModified.toMillis()) / 1000;
    return seconds < 120
      ? Math.round(seconds).toString() + " secs"
      : seconds / 60 < 120
      ? Math.round(seconds / 60).toString() + " mins"
      : seconds / 3600 < 48
      ? Math.round(seconds / 3600).toString() + " hours"
      : Math.round(seconds / 86400).toString() + " days";
  };

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
        onClose={() => props.setQuestIdOnFocus(null)}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 2rem)",
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
            <Typography variant="body2" pl={0.5} color="text.secondary">
              {lastEditSince() + " "}
              ago
            </Typography>
            <IconButton sx={{ ml: "auto" }} onClick={handleClickMore}>
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
              <DialogTitle>{"Do you really want to delete?"}</DialogTitle>
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
              maxRows={2}
              InputProps={{ disableUnderline: true }}
              // margin="dense"
              value={props.quest ? props.quest.title : ""}
              onChange={(e) =>
                setQuest({ ...props.quest, title: e.target.value })
              }
            />
            <TextField
              sx={{ m: 0 }}
              fullWidth
              label={questFieldNames["note"]}
              variant="filled"
              multiline
              // maxRows={20}
              InputProps={{ disableUnderline: true }}
              // margin="none"
              value={props.quest ? props.quest.note : ""}
              onChange={(e) =>
                setQuest({ ...props.quest, note: e.target.value })
              }
            />
            <Grid container py={2} px={2} spacing={2} alignItems="center">
              <Grid item xs={6} sm={3} md={2}>
                {/* <Typography variant="button">Active</Typography> */}
                <DatePicker
                  label="Active Date"
                  value={props.quest ? props.quest.dateActive.toDate() : null}
                  onChange={(newValue) => {
                    // setValue(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <TimePicker
                  label="Active Time"
                  value={props.quest ? props.quest.dateActive.toDate() : null}
                  onChange={(newValue) => {
                    // setValue(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <DatePicker
                  label="Expire Date"
                  value={
                    props.quest
                      ? props.quest.dateExpire
                        ? props.quest.dateExpire.toDate()
                        : null
                      : null
                  }
                  onChange={(newValue) => {
                    // setValue(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <TimePicker
                  label="Expire Time"
                  value={
                    props.quest
                      ? props.quest.dateExpire
                        ? props.quest.dateExpire.toDate()
                        : null
                      : null
                  }
                  onChange={(newValue) => {
                    // setValue(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth>
                  <InputLabel id="quest-type-select-label">
                    {questFieldNames["type"]}
                  </InputLabel>
                  <Select
                    labelId="quest-type-select-label"
                    value={props.quest ? props.quest.type : ""}
                    label={questFieldNames["type"]}
                    onChange={() => {}}
                  >
                    <MenuItem value={"main"}>{questTypeNames["main"]}</MenuItem>
                    <MenuItem value={"side"}>{questTypeNames["side"]}</MenuItem>
                    <MenuItem value={"optional"}>
                      {questTypeNames["optional"]}
                    </MenuItem>
                    <MenuItem value={"daily"}>
                      {questTypeNames["daily"]}
                    </MenuItem>
                    <MenuItem value={"none"}>{"None"}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <Typography variant="subtitle2">Priority</Typography>
                <Rating
                  // value={value}
                  onChange={(event, newValue) => {
                    // setValue(newValue);
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Popover>
    </LocalizationProvider>
  );
}
