const questTypes = ["daily", "main", "side", "optional"];
const questTypeNames = {
  daily: "每日任务",
  main: "主线任务",
  side: "支线任务",
  optional: "可选任务",
};
const questFieldNames = {
  dateActive: "Active",
  dateAdded: "Created",
  dateExpire: "Expire",
  dateModified: "Modified",
  prerequisite: "Prerequisite",
  description: "Description",
  note: "Note",
  title: "Title",
  type: "Quest Type",
};

export { questTypes, questTypeNames, questFieldNames };
