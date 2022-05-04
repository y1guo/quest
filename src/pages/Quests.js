import {
  Box,
  Stack,
  Divider,
  useMediaQuery,
  useTheme,
  Grid,
  Container,
  Card,
  CardActionArea,
  IconButton,
  Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useEffect, useMemo, useState } from "react";
import QuestCard from "../components/QuestCard";
import "../firebase/database";
import { firestoreCreateEmptyQuest } from "../firebase/database";

function NewQuestButton() {
  return (
    <Card elevation={3}>
      <CardActionArea onClick={() => firestoreCreateEmptyQuest(null)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            height: "4rem",
          }}
        >
          <AddOutlinedIcon />
        </Box>
      </CardActionArea>
    </Card>
  );
}

export default function Quests(props) {
  // media query
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // rank quests by importance
  const getPriority = (quest) => {
    let priority = 0;
    priority +=
      quest.type === "daily"
        ? 100
        : quest.type === "main"
        ? 75
        : quest.type === "side"
        ? 50
        : quest.type === "optional"
        ? 25
        : 0;
    return priority;
  };
  const getPriorityList = () => {
    const res = [];
    for (let id in props.activeQuests) {
      res.push({ id: id, priority: getPriority(props.activeQuests[id]) });
    }
    return res.sort((q1, q2) => q2.priority - q1.priority);
  };
  const priorityList = useMemo(getPriorityList, [props.activeQuests]);

  return (
    <Container sx={{ padding: 2 }} maxWidth="xl">
      <Grid container spacing={2} alignItems="center">
        {priorityList.map(({ id, priority }) => (
          <Grid item key={id} xs={12} sm={12} lg={12} xl={3}>
            {/* <Grid item key={id} xs={12} sm={6} lg={4} xl={3}> */}
            <QuestCard
              id={id}
              quest={props.activeQuests[id]}
              setQuest={(newQuest) =>
                props.setActiveQuests({
                  ...props.activeQuests,
                  [id]: newQuest,
                })
              }
              priority={priority}
              settings={props.settings}
            ></QuestCard>
          </Grid>
        ))}
        <Grid item xs={12} sm={12} lg={12} xl={3}>
          <NewQuestButton />
        </Grid>
      </Grid>
    </Container>
  );
}
