import { useMemo } from "react";
import { Timestamp } from "firebase/firestore";
import {
    Box,
    Card,
    CardActionArea,
    LinearProgress,
    Typography,
    useTheme,
} from "@mui/material";
import { questColor } from "../colors";
import { seconds2String } from "../utils";

export default function QuestCard(props) {
    // media query
    const theme = useTheme();
    const color = questColor(props.quest, theme);

    // calculate progress bar
    const [progressType, progressValue, progressLabel, progressColor] =
        useMemo(() => {
            if (props.quest.dateExpire) {
                const secondsRemaining =
                    (props.quest.dateExpire.toMillis() -
                        Timestamp.now().toMillis()) /
                    1000;
                const totalSeconds =
                    (props.quest.dateExpire.toMillis() -
                        props.quest.dateAdded.toMillis()) /
                    1000;
                if (secondsRemaining > 0) {
                    return [
                        "determinate",
                        200 - (100 * secondsRemaining) / totalSeconds,
                        "+" + seconds2String(secondsRemaining),
                        "primary",
                    ];
                } else {
                    return [
                        "indeterminate",
                        0,
                        "-" + seconds2String(-secondsRemaining),
                        "secondary",
                    ];
                }
            } else {
                return ["determinate", 0, "", "inherit"];
            }
        }, [props.quest]);

    return (
        <Card elevation={3} sx={{ backgroundColor: color }}>
            <CardActionArea onClick={() => props.setQuestIdOnFocus(props.id)}>
                <Typography variant="h6" padding={2}>
                    {props.quest.title || "New Quest"}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        px: 1,
                    }}
                >
                    <Box></Box>
                    <Typography variant="caption">{progressLabel}</Typography>
                </Box>
                {props.quest.dateExpire && (
                    <LinearProgress
                        variant={progressType}
                        value={progressValue}
                        color={progressColor}
                    />
                )}
            </CardActionArea>
        </Card>
    );
}
