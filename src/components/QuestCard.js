import { Card, CardActionArea, Typography, useTheme } from "@mui/material";
import { questColor } from "../colors";

export default function QuestCard(props) {
  // media query
  const theme = useTheme();
  const color = questColor(props.quest, theme);

  return (
    <Card elevation={3} sx={{ backgroundColor: color }}>
      <CardActionArea onClick={() => props.setQuestIdOnFocus(props.id)}>
        <Typography variant="h6" padding={2}>
          {props.quest.title || "New Quest"}
        </Typography>
      </CardActionArea>
      {/* {props.quest.} */}
    </Card>
  );
}
