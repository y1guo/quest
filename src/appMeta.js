const questTypes = ["daily", "main", "side", "optional", "none"];
const questTypeNamesZH = {
  daily: "每日任务",
  main: "主线任务",
  side: "支线任务",
  optional: "可选任务",
  none: "未分类",
};
const questTypeNamesEN = {
  daily: "Daily Quest",
  main: "Main Quest",
  side: "Side Quest",
  optional: "Optional Quest",
  none: "Uncategorized",
};
const questFieldNamesZH = {
  dateActive: "生效日期",
  dateAdded: "创建日期",
  dateExpire: "截止日期",
  dateModified: "修改日期",
  prerequisite: "前置任务",
  note: "记录",
  title: "标题",
  type: "任务种类",
};
const questFieldNamesEN = {
  dateActive: "Active",
  dateAdded: "Created",
  dateExpire: "Expire",
  dateModified: "Modified",
  prerequisite: "Prerequisite",
  note: "Note",
  title: "Title",
  type: "Quest Type",
};

export {
  questTypes,
  questTypeNamesEN,
  questTypeNamesZH,
  questFieldNamesEN,
  questFieldNamesZH,
};
