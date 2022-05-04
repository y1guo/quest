import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { questTypes, questTypeNames, questFieldNames } from "../appMeta";
import { createEmptyQuest, firestoreSaveQuest } from "../firebase/database";
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
  Grow,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Slide,
  Snackbar,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  pink,
  amber,
  orange,
  blue,
  cyan,
  blueGrey,
  deepOrange,
  red,
} from "@mui/material/colors";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Timestamp } from "firebase/firestore";

function deepCopy(object) {
  return JSON.parse(JSON.stringify(object));
}

export default function QuestCard(props) {
  // media query
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // color of the card depending on quest type
  const color =
    props.quest.type === "main"
      ? theme.palette.mode === "light"
        ? pink[100]
        : "#801313"
      : props.quest.type === "side"
      ? theme.palette.mode === "light"
        ? orange[200]
        : "#ab5810"
      : props.quest.type === "optional"
      ? theme.palette.mode === "light"
        ? cyan[200]
        : "#004346"
      : props.quest.type === "daily"
      ? theme.palette.mode === "light"
        ? blue[200]
        : "#093170"
      : theme.palette.mode === "light"
      ? blueGrey[50]
      : blueGrey[700];

  // card expanded or not
  const [expanded, setExpanded] = useState(false);

  // saved versions
  // const mergeGlobalToLocal = (local, global) => {
  //   const current = local[local.length-1]
  //   if (current) {
  //     console.log("mergeGlobalToLocal: global == current?", JSON.stringify(global) === JSON.stringify(current))
  //   } else {
  //     console.log("mergeGlobalToLocal: current version not found, set current to global")
  //   }
  // }

  // const reducer = (state, action) => {
  //   // update local versions
  //   switch (action.type) {
  //     case "localUpdate":
  //       console.log("localUpdate: state:", state);
  //       return state;
  //     case "globalUpdate":
  //       console.log("globalUpdate: state:", state);
  //       return state;
  //     default:
  //       throw new Error();
  //   }
  // };
  // const [localVersions, dispatchLocalVersions] = useReducer(
  //   reducer,
  //   localStorage.getItem("localVersions") || []
  // );
  // useEffect(() => {
  //   dispatchLocalVersions({ type: "globalUpdate" });
  // }, [props.quest]);

  // const [localVersions, setLocalVersions] = useState(localStorage.getItem("localVersions") || []);
  // const currentVersion = useMemo(()=>localVersions[localVersions.length - 1],[localVersions])
  // const mergeGlobalToLocal = useCallback((globalVersion)=>{console.log("currentVersion:", currentVersion);if (currentVersion) {
  //   if (JSON.stringify(currentVersion) !== JSON.stringify(globalVersion)) {
  //     setLocalVersions([...localVersions, deepCopy(globalVersion)]);
  //   }
  // } else {
  //   setLocalVersions([deepCopy(globalVersion)])
  // }},[currentVersion, localVersions])
  // useEffect(()=>{
  //   mergeGlobalToLocal(props.quest)
  // },[props.quest])
  // auto save
  // useEffect(() => {
  //   // if (initialRender.current) {
  //   //   initialRender.current = false;
  //   // } else {
  //   if (props.id === "xIvtNn43d4lsjc7qLipZ") {
  //     const timer = setTimeout(() => {
  //       console.log(
  //         "QuestCard: saved versions:",
  //         localVersions.map((q) => q.title)
  //       );
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }

  //   // }
  // }, [props.quest]);
  const [lastEditTime, setLastEditTime] = useState(props.quest.dateModified);
  const setQuest = (newQuest) => {
    setLastEditTime(Timestamp.now());
    props.setQuest(newQuest);
  };
  useEffect(() => {
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
  }, [lastEditTime, props.id, props.quest]);

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMore = (event) => setAnchorEl(event.currentTarget);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const handleDelete = () => {
    console.log("QuestCards: Delete: confirm delete");
  };
  const lastEditSince = () => {
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
    <Card elevation={3} sx={{ backgroundColor: color }}>
      <CardActionArea onClick={() => setExpanded(!expanded)}>
        <Typography variant="h6" padding={2}>
          {props.quest.title || "New Quest"}
        </Typography>
      </CardActionArea>
      <Collapse
        in={expanded}
        timeout={props.settings.enableAnimation.value ? "auto" : 0}
        unmountOnExit
      >
        <Box sx={{ display: "flex", alignItems: "center", pl: 2 }}>
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
        <CardContent sx={{ pt: 0 }}>
          <TextField
            fullWidth
            label={questFieldNames["title"]}
            variant="filled"
            multiline
            maxRows={2}
            InputProps={{ disableUnderline: true }}
            margin="dense"
            value={props.quest.title}
            onChange={(e) =>
              setQuest({ ...props.quest, title: e.target.value })
            }
          />
          <TextField
            fullWidth
            label={questFieldNames["note"]}
            variant="filled"
            multiline
            maxRows={20}
            InputProps={{ disableUnderline: true }}
            margin="dense"
            value={props.quest.note}
            onChange={(e) => setQuest({ ...props.quest, note: e.target.value })}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
}
