I just added a login page that allows user to either sign in as developers (static data), or with their Microsoft account (sync profile with Dataverse Contacts). I also stored Blueprint submissions in Azure SQL Database.

TODOs:
- XP system backend
  - MS mode season points (both dashboard & blueprint pages)

Testing Checklist:
1. First login: Dashboard shows 0 weeks streak, 0 pts, Bronze tier
2. Blueprint submission: XP increases, season points increase, streak updates
3. Same week submission: XP increases but streak stays same
4. Next week submission: Streak increments
5. Tier progression: Check if tier updates when crossing thresholds (2500, 5000, 10000 XP)
6. Developer mode: All features work, data persists during session, resets on hard refresh
7. Past seasons: Shows historical performance (when you have completed a past season)



- idea submission backend
- Connection request
- course catalogue