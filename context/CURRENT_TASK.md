I just added a login page that allows user to either sign in as developers (static data), or with their Microsoft account (sync profile with Dataverse Contacts). Next, I want to add more backend functionality by storing Blueprint submissions in Azure SQL Database. Maybe also add a UI section to view past submitted blueprints.

Rough steps:
7. Dashboard - this week's blueprint challenge: pull from this week's submitted blueprints
8. Consider what happens if email changes or Dynamics contact gets deleted
9. Remove unnecessary logs