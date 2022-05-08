export function seconds2String(seconds) {
  return seconds < 120
    ? Math.round(seconds).toString() + " secs"
    : seconds / 60 < 120
    ? Math.round(seconds / 60).toString() + " mins"
    : seconds / 3600 < 48
    ? Math.round(seconds / 3600).toString() + " hours"
    : Math.round(seconds / 86400).toString() + " days";
}
