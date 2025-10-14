I just added a login page that allows user to either sign in as developers (static data), or with their Microsoft account (sync profile with Dataverse Contacts). Next, I want to add more backend functionality by storing Blueprint submissions in Azure SQL Database. Maybe also add a UI section to view past submitted blueprints.

Rough steps:
1. Create Azure SQL Serverless database (✅ done)
2. Create table: Blueprints (studentId, submissionDate, trendspotter, futureVisionary, etc.) (✅ done)
3. Add Azure Function endpoints: (✅ done)
  - POST /api/SubmitBlueprint
  - GET /api/GetBlueprints?studentEmail={email}
4. Connect frontend Blueprint page to save/load (✅ done)
  - XP calculation: 20 XP per section (≥100 words), max 100 XP
  - Auto-detects Microsoft vs Developer mode
  - Shows blueprintId in success message
5. Allow students to enter article info (Title, Source, URL) (✅ done)
  - 3 required input fields with validation
  - Saved with Blueprint submission
  - Included in draft save/load
6. Add UI for student to view their past blueprints (next)
7. Dashboard - this week's blueprint challenge: pull from this week's submitted blueprints