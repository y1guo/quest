import {
  pink,
  amber,
  orange,
  blue,
  cyan,
  blueGrey,
  deepOrange,
  red,
  yellow,
} from "@mui/material/colors";

// color of quest card depending on quest type
export const questColor = (quest, theme) =>
  quest.type === "main"
    ? theme.palette.mode === "light"
      ? pink[100]
      : red[900]
    : quest.type === "side"
    ? theme.palette.mode === "light"
      ? amber[200]
      : yellow[900]
    : quest.type === "optional"
    ? theme.palette.mode === "light"
      ? cyan[200]
      : cyan[800]
    : quest.type === "daily"
    ? theme.palette.mode === "light"
      ? blue[200]
      : blue[900]
    : theme.palette.mode === "light"
    ? "#ffffff"
    : "#121212";
