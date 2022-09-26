# System

A Personal Assistant Progressive Web App

## Functions

-   ### Dashboard
-   ### Quests
    -   Types: Daily, Main, Side, Optional, Uncategorized
    -   Title: Description of the quest
    -   Note: Seperate notes with timestamps
    -   Log: Recording 'Done's for repeatitive quests
    -   Active Time: After which the quest becomes active
    -   Expire Time: After which the quest becomes inactive
    -   Deadline:
    -   Priority: Ranking from 1 to 5
    -   Prerequisites: Quest will be unlocked after all the prerequisites are satisfied
-   ### Calender
    -   Things to do in list / graphics order
-   ### Wallet
    -   Incomes
    -   Expenses
    -   Budgets and Balances
    -   Statistics
-   ### Settings
    -   Account (Log Out)
    -   Appearance (Light / Dark Mode)
    -   Language (EN / CN)

## Database Structure

```
/users/$uid/$folder/$documentId/$fields

[folder]
    quests:     a quest consists of a goal and a series of events
    events:     an event has certain beginning and ending times, and an associated note
    wallet:     wallet stores records of incomes and expenses
    trashes:    deleted documents are moved here

[quest fields]
    type:           str
    title:          str
    note:           str
    dateAdded:      timestamp
    dateModified:   timestamp
    dateActive:     timestamp
    dateExpire:     timestamp
    deadline:       timestamp
    period:         int(seconds)
    priority:       int[1 - 5]
    prerequisites:  list[$documentId]

[event fields]
    dateAdded:      timestamp
    dateModified:   timestamp
    dateStart:      timestamp
    dateEnd:        timestamp
    note:           str

[wallet fields]
    date:           timestamp
    amount:         float
    note:           str
    dateAdded:      timestamp
    dateModified:   timestamp
```
