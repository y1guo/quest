# System

A Personal Assistant Progressive Web App

## Database Structure

```
/usrs/$uid/$folder/$documentId/$fields

[folder]
    active
    archive
    trash

[fields]
    type: str[quest type]
    title: str[quest title]
    note: str
    dateAdded: timestamp
    dateModified: timestamp
    dateActive: timestamp
    dateExpire: timestamp
    priority: int[1 - 5]
    prerequisite: list[$documentId]
```
