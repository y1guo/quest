import { Box, Stack, Divider } from "@mui/material";
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

  return (
    <Stack spacing={0} padding={0} divider={<Divider />}>
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
