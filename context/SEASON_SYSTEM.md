Seasonal Points System - Design Summary

Overview

A seasonal tracking system for the IMI Student Dashboard that records user performance across defined time periods. The system is non-competitive - it tracks individual progress against XP thresholds (tiers) rather than peer-to-peer
rankings.

---
Database Schema

1. Seasons Table (Configuration/Lookup)

CREATE TABLE Seasons (
    seasonId INT IDENTITY(1,1) PRIMARY KEY,
    seasonName NVARCHAR(100) NOT NULL UNIQUE,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,

    CONSTRAINT CHK_Season_Dates CHECK (endDate > startDate),
    INDEX IX_Season_Dates (startDate, endDate)
);

Purpose: Define non-overlapping season date ranges. You have direct SQL access to create/modify seasons manually.

---
2. SeasonalStats Table (User Performance Per Season)

CREATE TABLE SeasonalStats (
    seasonStatId INT IDENTITY(1,1) PRIMARY KEY,
    azureAdUserId NVARCHAR(100) NOT NULL,
    seasonId INT NOT NULL,

    -- Season performance metrics
    seasonPoints INT NOT NULL DEFAULT 0,
    blueprintCount INT NOT NULL DEFAULT 0,
    maxStreakDuringSeason INT NOT NULL DEFAULT 0,
    finalTier NVARCHAR(50),  -- Tier on last day of season (bronze/silver/gold/platinum)

    -- Timestamps
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),

    -- Constraints
    CONSTRAINT UQ_User_Season UNIQUE (azureAdUserId, seasonId),
    CONSTRAINT FK_SeasonalStats_Season FOREIGN KEY (seasonId)
        REFERENCES Seasons(seasonId),

    INDEX IX_User_Season (azureAdUserId, seasonId),
    INDEX IX_Season_Points (seasonId, seasonPoints DESC)
);

Purpose: One record per user per season. Captures:
- seasonPoints - Total XP earned from blueprints submitted during season dates
- blueprintCount - Number of blueprints submitted during season
- maxStreakDuringSeason - Highest streak value achieved on any day during the season
- finalTier - User's tier on the last day of season (NULL during active season, populated when season ends)

---
3. UserXP Table (Modified - Added 3 Columns)

ALTER TABLE UserXP
ADD currentStreak INT NOT NULL DEFAULT 0,
    lastSubmissionWeek DATE,  -- Monday of the last week user submitted
    currentTier NVARCHAR(50);  -- Calculated from lifetimeXP

CREATE INDEX IX_UserXP_Streak ON UserXP(currentStreak DESC);

Purpose: Store global stats that persist across seasons:
- currentStreak - Consecutive weeks with at least one submission (never resets between seasons)
- lastSubmissionWeek - Monday of the most recent week with a submission (used for streak calculation)
- currentTier - Current tier based on lifetimeXP thresholds (bronze/silver/gold/platinum)

---
4. Blueprints & XPTransactions Tables

NO CHANGES - Season assignment is calculated on-the-fly by matching submissionDate against Seasons date ranges.

---
Key Design Principles

1. Season Assignment

- Blueprints are automatically assigned to seasons based on submissionDate falling within a season's startDate and endDate
- No seasonId or seasonName column needed in Blueprints table
- Query pattern:
SELECT seasonId FROM Seasons
WHERE @submissionDate BETWEEN startDate AND endDate

2. Tier System

- Global tiers are based on lifetimeXP from UserXP table
- Tier thresholds (from config.js):
  - Bronze: 0 XP
  - Silver: 2,500 XP
  - Gold: 5,000 XP
  - Platinum: 10,000 XP
- Tiers only increase (never decrease) as lifetimeXP only increases
- currentTier in UserXP is recalculated on every XP update
- finalTier in SeasonalStats is a historical snapshot (tier on last day of season)

3. Streak Calculation (Week-Based)

- Week definition: Monday (00:00 EST) to Sunday (23:59 EST)
- Streak increments only when user submits in a NEW consecutive week
- Multiple submissions in same week: Increases XP and blueprint count, but NOT streak
- Streak continues across seasons - it's a global counter in UserXP table

Streak Logic:
// Get Monday of current week (EST timezone)
const currentWeekMonday = getMondayOfWeek(submissionDate);

if (!lastSubmissionWeek) {
    // First ever submission
    newStreak = 1;
} else if (currentWeekMonday === lastSubmissionWeek) {
    // Same week - no change to streak
    newStreak = currentStreak;
} else {
    // Different week - check if consecutive
    const expectedNextMonday = new Date(lastSubmissionWeek);
    expectedNextMonday.setDate(expectedNextMonday.getDate() + 7);

    if (currentWeekMonday === expectedNextMonday.toISOString().split('T')[0]) {
        // Next consecutive week
        newStreak = currentStreak + 1;
    } else {
        // Skipped week(s) - reset
        newStreak = 1;
    }
}

// IMPORTANT: Always update lastSubmissionWeek to current week Monday
lastSubmissionWeek = currentWeekMonday;

Corrected Streak Examples:

| Last Submission Week | Current Submission | Week Monday | Action           | New Streak | New Last Week |
|----------------------|--------------------|-------------|------------------|------------|---------------|
| NULL                 | 2024-10-21 (Mon)   | 2024-10-21  | First submission | 1          | 2024-10-21    |
| 2024-10-21           | 2024-10-23 (Wed)   | 2024-10-21  | Same week        | 1          | 2024-10-21    |
| 2024-10-21           | 2024-10-28 (Mon)   | 2024-10-28  | Next week        | 2          | 2024-10-28    |
| 2024-10-28           | 2024-11-04 (Mon)   | 2024-11-04  | Next week        | 3          | 2024-11-04    |
| 2024-11-04           | 2024-11-18 (Mon)   | 2024-11-18  | Skipped a week   | 1          | 2024-11-18    |

---
Data Flow: Blueprint Submission

When a user submits a blueprint:

Step 1: Insert Blueprint

- Insert into Blueprints table (existing logic, no changes)
- Calculate XP earned based on word count per section

Step 2: Update UserXP (Global Stats)

UPDATE UserXP
SET
    currentXP = currentXP + @xpAmount,
    lifetimeXP = lifetimeXP + @xpAmount,
    currentStreak = @newStreak,  -- Calculated using week-based logic
    lastSubmissionWeek = @currentWeekMonday,
    currentTier = @newTier,  -- Recalculate from new lifetimeXP
    updatedAt = GETUTCDATE()
WHERE azureAdUserId = @azureAdUserId

Step 3: Insert XPTransaction

- Insert transaction record (existing logic, no changes)

Step 4: Determine Season

SELECT seasonId FROM Seasons
WHERE @submissionDate BETWEEN startDate AND endDate

Step 5: Update SeasonalStats (Upsert)

MERGE SeasonalStats AS target
USING (SELECT @azureAdUserId AS userId, @seasonId AS season) AS source
ON target.azureAdUserId = source.userId AND target.seasonId = source.season
WHEN MATCHED THEN
    UPDATE SET
        seasonPoints = seasonPoints + @xpEarned,
        blueprintCount = blueprintCount + 1,
        maxStreakDuringSeason = CASE
            WHEN @newStreak > maxStreakDuringSeason
            THEN @newStreak
            ELSE maxStreakDuringSeason
        END,
        updatedAt = GETUTCDATE()
        // Also set final tier to @newTier every update
WHEN NOT MATCHED THEN
    INSERT (azureAdUserId, seasonId, seasonPoints, blueprintCount, maxStreakDuringSeason)
    VALUES (@azureAdUserId, @seasonId, @xpEarned, 1, @newStreak, // also @newTier);

Important: maxStreakDuringSeason is updated every submission if the current global streak exceeds the season's max.

---
Backend Functions Needed (sqlClient.js)

Season Management

async function getCurrentSeason()  // Get active season (today's date in range)
async function getSeasonById(seasonId)
async function getSeasonByDate(date)  // Find season containing a date

User Seasonal Stats

async function getUserSeasonStats(azureAdUserId, seasonId)
async function getUserAllSeasonStats(azureAdUserId)  // Historical view
async function updateSeasonalStats(azureAdUserId, seasonId, xpEarned, newStreak, newTier)

Streak Helpers

function getMondayOfWeek(date)  // Get Monday of week in EST timezone
function calculateStreak(lastSubmissionWeek, currentSubmissionDate)

Tier Helpers

function calculateTier(lifetimeXP)  // Returns bronze/silver/gold/platinum

---
Important Notes

1. Timezone Handling

- All streak calculations must use EST timezone
- Week boundaries: Monday 00:00 EST to Sunday 23:59 EST
- Be careful with Date conversions in JavaScript/SQL

2. Admin Control (Future)

- Leave schema flexible for future admin UI
- No admin endpoints needed for MVP
- Direct SQL access assumed for season creation/modification

3. No Peer Competition

- No leaderboard rankings comparing users
- Tiers indicate individual progress against thresholds
- SeasonalStats tracks personal historical performance only

---
Common Queries

Get user's current season performance:

SELECT ss.seasonPoints, ss.blueprintCount, ss.maxStreakDuringSeason,
        s.seasonName, s.startDate, s.endDate
FROM SeasonalStats ss
JOIN Seasons s ON ss.seasonId = s.seasonId
WHERE ss.azureAdUserId = @userId
  AND GETDATE() BETWEEN s.startDate AND s.endDate

Get user's global stats:

SELECT currentXP, lifetimeXP, currentStreak, currentTier, lastSubmissionWeek
FROM UserXP
WHERE azureAdUserId = @userId

Get user's seasonal history:

SELECT s.seasonName, ss.seasonPoints, ss.blueprintCount,
        ss.maxStreakDuringSeason, ss.finalTier, s.startDate, s.endDate
FROM SeasonalStats ss
JOIN Seasons s ON ss.seasonId = s.seasonId
WHERE ss.azureAdUserId = @userId
ORDER BY s.startDate DESC

---
XP Earning Rules (From XP_SYSTEM.md)

- Blueprint submissions: 20 XP per section with ≥100 words
- Maximum 100 XP per blueprint (5 sections)
- Sections: Trendspotter, Future Visionary, Innovation Catalyst, Connector, Growth Hacker

---
Additional season notes

- A student has participated in a season if they've made any blueprint submissions during that season
  - Since max streak and final tier are calculated on every blueprint submission, no need to post-process after season ends
  - When showing past seasons' performance, only pull from seasons participated in