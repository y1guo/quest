import React, { useEffect, useMemo, useState } from "react";
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
import { createEmptyQuest, saveQuest } from "../firebase/database";
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

// Quest Editting Panel

function copyQuest(quest) {
  return { ...quest, prerequisite: [...quest.prerequisite] };
}

function EditQuest(props) {
  const handleChange = (type) => (event) => {
    const newQuest = copyQuest(props.quest);
    newQuest[type] = event.target.value;
    props.setQuest(newQuest);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Title"
        multiline
        maxRows={4}
        value={props.quest.title}
        onChange={handleChange("title")}
      />
      <TextField
        label="Note"
        multiline
        maxRows={20}
        value={props.quest.note}
        onChange={handleChange("note")}
      />
    </Stack>
  );
}

// Quest Items Accordion

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  // "&:not(:last-child)": {
  //   borderBottom: 0,
  // },
  // "&:before": {
  //   display: "none",
  // },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .0)"
      : "rgba(0, 0, 0, .0)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTop: "1px solid rgba(0, 0, 0, .0 )",
}));

function CustomizedAccordions(props) {
  const [quest, setQuest] = useState(copyQuest(props.activeQuests[props.id]));
  useEffect(() => {
    setQuest(props.activeQuests[props.id]);
  }, [props.activeQuests, props.id]);

  const [expanded, setExpanded] = useState(quest.title ? false : true);
  const toggleExpanded = (event) => {
    if (expanded) {
      saveQuest(
        quest,
        props.id,
        () => setOpenSnackBarSuccess(true),
        () => setOpenSnackBarError(true)
      );
    }
    setExpanded(!expanded);
  };
  const [openSnackBarSuccess, setOpenSnackBarSuccess] = useState(false);
  const handleCloseSnackBarSuccess = () => {
    setOpenSnackBarSuccess(false);
  };
  const [openSnackBarError, setOpenSnackBarError] = useState(false);
  const handleCloseSnackBarError = () => {
    setOpenSnackBarError(false);
  };

  return (
    <Box>
      <Accordion
        expanded={expanded}
        onChange={toggleExpanded}
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary>
          <Typography>{quest.title ? quest.title : "New Quest"}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <EditQuest
            id={props.id}
            activeQuests={props.activeQuests}
            questIdByType={props.questIdByType}
            quest={quest}
            setQuest={setQuest}
          />
        </AccordionDetails>
      </Accordion>
      <Snackbar
        open={openSnackBarSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSnackBarSuccess}
      >
        <Alert
          onClose={handleCloseSnackBarSuccess}
          severity={"success"}
          sx={{ width: "100%" }}
        >
          Quest Saved
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSnackBarError}
        autoHideDuration={4000}
        onClose={handleCloseSnackBarError}
      >
        <Alert
          onClose={handleCloseSnackBarError}
          severity={"error"}
          sx={{ width: "100%" }}
        >
          Couldn't Save Quest!
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Quest Card

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(-90deg)" : "rotate(0deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

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
      : null;

  // card expanded or not
  const [expanded, setExpanded] = useState(false);

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMore = (event) => setAnchorEl(event.currentTarget);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const handleDelete = () => {
    console.log("QuestCards: Delete: confirm delete");
  };
  const lastEdit = () => {
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
          {props.quest.title}
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
            {lastEdit() + " "}
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
          />
        </CardContent>
      </Collapse>
    </Card>
  );
}
