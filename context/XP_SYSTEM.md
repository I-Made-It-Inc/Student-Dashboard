Key Learnings: XP System Architecture

Data Storage & Sources

Database Schema (Azure SQL)

- UserXP Table: Stores user XP data
  - azureAdUserId (PRIMARY KEY) - Azure AD Object ID (immutable identifier)
  - currentXP - Available XP balance
  - lifetimeXP - Total XP ever earned
  - xpSpent - Total XP spent on redemptions
  - studentEmail - Email (fallback identifier for legacy data)
- XPTransactions Table: Transaction history (not yet fully integrated in frontend)
  - Records all XP changes with source tracking

XP Earning Rules

- Blueprint Submissions: 20 XP per section with ≥100 words (max 100 XP per blueprint)
- Sections: Trendspotter, Future Visionary, Innovation Catalyst, Connector, Growth Hacker

Backend (Azure Functions)

Key Functions

1. GetUserXP (azure-functions/StudentDashboardAPI/src/functions/GetUserXP.js)
  - Fetches user XP by azureAdUserId
  - Auto-creates user record with 0 XP if not exists
  - Returns: { currentXP, lifetimeXP, xpSpent }
2. SubmitBlueprint (azure-functions/StudentDashboardAPI/src/functions/SubmitBlueprint.js)
  - Calculates XP based on word count (≥100 words per section = 20 XP)
  - Updates UserXP table using addXPTransaction() (atomic SQL transaction)
  - Returns updated XP values in response

SQL Client Functions (sqlClient.js)

- getUserXP(azureAdUserId) - Fetch XP data
- createUserXP(azureAdUserId, studentEmail, dataverseContactId) - Create with 0 XP
- addXPTransaction(azureAdUserId, xpAmount, source, sourceId, description) - Atomic XP update
- getXPTransactions(azureAdUserId, limit, offset) - Get transaction history

Frontend Architecture

Single Source of Truth

window.IMI.data.userData object contains:
{
  currentXP: 40,      // Available XP balance
  lifetimeXP: 40,     // Total XP earned
  xpSpent: 0,         // Total XP spent
  // ... other user data
}

Data Loading Flow (main.js)

Microsoft Mode:
1. User authenticates via MSAL
2. loadUserData() fetches profile from Dataverse
3. fetchUserXP(azureAdUserId, email) fetches XP from Azure SQL
4. userData object created with database values
5. UI updates via updateDashboardStats() and updateBlueprintXPDisplay()

Developer Mode:
1. No API calls made
2. userData created with mock values: currentXP: 1850, lifetimeXP: 4950 (2450 past + 2500 current season)
3. XP increments on blueprint submission (in-memory only)

Key Files & Functions

js/api.js - API client
- fetchUserXP(azureAdUserId, studentEmail) - Fetch XP from Azure SQL
- submitBlueprint(blueprintData) - Submit blueprint, returns updated XP

js/main.js - Core initialization
- Lines 129-138: Fetch XP in Microsoft mode
- Lines 176-178: Initialize XP values (currentXP: 1850, lifetimeXP: 4950 in developer mode)
- Lines 287-317: updateDashboardStats(data) - Updates dashboard XP displays

js/navigation.js - Page navigation
- Lines 130-162: loadDashboardContent() - Loads dashboard, calls updateDashboardStats()
- Lines 175-179: loadInnovationContent() - Loads blueprint page, calls updateBlueprintXPDisplay()
- CRITICAL: Line 728 was an empty stub that caused bugs - now removed

js/blueprint.js - Blueprint page
- Lines 36-57: updateBlueprintXPDisplay() - Updates Available XP and Lifetime XP displays
- Lines 244-270: Microsoft mode submission - updates userData from API response, refreshes XP display
- Lines 289-308: Developer mode submission - increments userData XP locally, refreshes XP display

UI Update Pattern

Static HTML Placeholders:
- Dashboard: pages/dashboard.html lines 22, 164 → "0 XP"
- Blueprint: pages/blueprint.html lines 266, 270 → "0"
- These show immediately while JavaScript loads

JavaScript Updates:
1. userData loads → UI updates to show real values
2. On redemption → userData updated → updateBlueprintXPDisplay() or updateDashboardStats() called
3. On blueprint submission → userData updated → updateBlueprintXPDisplay() called

Critical Bugs Fixed

1. Duplicate Function Names - updateDashboardStats() existed in both main.js (real) and navigation.js (empty stub). Removed stub.
2. Static HTML Confusion - Changed placeholders from "1,850 XP" to "0 XP" to avoid confusion during loading
3. Missing XP Refresh - Added updateBlueprintXPDisplay() calls after blueprint submission
4. Developer Mode XP - Added XP increment logic for developer mode submissions

Authentication & User Identity

- Primary ID: azureAdUserId (Azure AD Object ID) - immutable, used for all database queries
- Fallback ID: studentEmail - for legacy data and auto-creation
- Auth Modes:
  - microsoft - Full Azure AD + SQL integration
  - developer - Mock data, no API calls

Key Design Principles

1. userData as Single Source of Truth - All UI reads from window.IMI.data.userData, never directly from API
2. Update Then Refresh - Always update userData first, then call display update functions
3. Script Load Order - main.js loads before navigation.js (index-template.html lines 105, 107)
4. Separation of Concerns - API calls in api.js, display updates in page-specific JS files
5. Microsoft vs Developer Split - All database logic conditional on authMode === 'microsoft'

Not Yet Implemented

- XP Transactions History - Backend exists but frontend doesn't display it
- XP Spent Tracking - Updated on redemption but not persisted to database yet
- Season Points - Separate system (your next task!)
- XP Decay/Expiration - Not implemented
- Admin XP Adjustments - No admin interface yet

Testing Notes

- Hard refresh clears developer mode sessionStorage
- Microsoft mode: Check console for "✅ User XP fetched: X XP"
- Developer mode: Starts with 1850 current XP, 4950 lifetime XP (2450 from Summer 2025 + 2500 current season), increments on submission
- Both modes should show "0 XP" briefly on initial load before updating
