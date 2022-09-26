# System

A Personal Assistant Progressive Web App

## Database Structure

```
/usrs/$uid/$folder/$documentId
```

### Folders

-   active
-   archive
-   trash

### Document Fields

```
type: str[quest type]
title: str[quest title]
note: str[note]
dateAdded: timestamp
dateModified: timestamp
dateActive: timestamp
dateExpire: timestamp
priority: int[1-5]
prerequisite: list[documentId]
```
