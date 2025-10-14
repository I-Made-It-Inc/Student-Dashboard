I just added a login page that allows user to either sign in as developers (static data), or with their Microsoft account (sync profile with Dataverse Contacts). Next, I want to add more backend functionality by storing Blueprint submissions in Azure SQL Database. Maybe also add a UI section to view past submitted blueprints.

Rough steps:
  1. Create Azure SQL Serverless database (done)
  2. Create table: Blueprints (studentId, submissionDate, trendspotter, futureVisionary, etc.) (done)
  3. Add Azure Function endpoints: (done)
    - POST /api/submitBlueprint
    - GET /api/getBlueprints?studentId={id}
  4. Add UI for student to lead their past blueprints
  5. Connect frontend Blueprint page to save/load
  