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

// color of quest card depending on quest type
export const questColor = (quest, theme) =>
  quest.type === "main"
    ? theme.palette.mode === "light"
      ? pink[100]
      : "#801313"
    : quest.type === "side"
    ? theme.palette.mode === "light"
      ? orange[200]
      : "#ab5810"
    : quest.type === "optional"
    ? theme.palette.mode === "light"
      ? cyan[200]
      : "#004346"
    : quest.type === "daily"
    ? theme.palette.mode === "light"
      ? blue[200]
      : "#093170"
    : theme.palette.mode === "light"
    ? blueGrey[50]
    : blueGrey[700];
