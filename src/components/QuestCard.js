import { useEffect, useState } from "react";
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
import { Alert, Box, Divider, Snackbar, Stack, TextField } from "@mui/material";

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
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
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
    <div>
      <Accordion expanded={expanded} onChange={toggleExpanded}>
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
        autoHideDuration={6000}
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
        autoHideDuration={6000}
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
    </div>
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
  const [expanded, setExpanded] = useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleNewQuestClick = () => {
    createEmptyQuest(props.type);
  };

  return (
    <Card sx={{ width: "100%", height: "auto" }} elevation={0}>
      <CardHeader
        avatar={
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        }
        title={questTypeNames[props.type]}
        titleTypographyProps={{ fontSize: "1.5rem" }}
        action={
          <IconButton onClick={handleNewQuestClick}>
            <AddIcon />
          </IconButton>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {props.questIdByType[props.type].map((id) => (
            <CustomizedAccordions
              key={id}
              id={id}
              activeQuests={props.activeQuests}
              questIdByType={props.questIdByType}
            ></CustomizedAccordions>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}
