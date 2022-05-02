import { Box, Stack, Divider, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import QuestCard from "../components/QuestCard";
import "../firebase/database";
import { listenToUserData } from "../firebase/database";
import { questTypes } from "../appMeta";

export default function Quests() {
  // get all active quests
  const [activeQuests, setActiveQuests] = useState({});
  useEffect(() => {
    const unsubscribe = listenToUserData("active", setActiveQuests);
    return unsubscribe;
  }, []);

  // catagorize into different types
  const questIdByType = {};
  questTypes.forEach((type) => {
    questIdByType[type] = [];
  });
  for (var id in activeQuests) {
    const quest = activeQuests[id];
    questIdByType[quest.type].push(id);
  }

  // media query
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      spacing={0}
      padding={0}
      alignItems={isMobile ? "center" : "right"}
      justifyContent={isMobile ? "flex-start" : "center"}
      direction={isMobile ? "column" : "row"}
    >
      {questTypes.map((type) => (
        <QuestCard
          key={type}
          type={type}
          activeQuests={activeQuests}
          questIdByType={questIdByType}
        ></QuestCard>
      ))}
    </Stack>
  );
}
