import {
  Box,
  Stack,
  Divider,
  useMediaQuery,
  useTheme,
  Grid,
  Container,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import QuestCard from "../components/QuestCard";
import "../firebase/database";

export default function Quests(props) {
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

  // media query
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container sx={{ padding: 2 }} maxWidth="xl">
      <Grid container spacing={2} alignItems="center">
        {priorityList.map(({ id, priority }) => (
          <Grid item key={id} xs={12} sm={12} lg={12} xl={3}>
            {/* <Grid item key={id} xs={12} sm={6} lg={4} xl={3}> */}
            <QuestCard
              id={id}
              quest={props.activeQuests[id]}
              priority={priority}
              settings={props.settings}
            ></QuestCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
