# Blueprint SQL Database Integration - Setup Complete ✅

## What I Just Did

### ✅ Backend Files Created
1. **sqlClient.js** - Database connection helper with methods for:
   - `submitBlueprint()` - Insert new blueprint
   - `getBlueprintsByEmail()` - Get all blueprints for a student
   - `getBlueprintById()` - Get specific blueprint
   - `getBlueprintStats()` - Get statistics (total submissions, XP, etc.)
   - `getFeaturedBlueprints()` - Get featured blueprints for peer inspiration

2. **src/functions/SubmitBlueprint.js** - Azure Function to submit blueprints
   - POST endpoint: `/api/SubmitBlueprint`
   - Auto-calculates word count
   - Returns blueprintId and submission details

3. **src/functions/GetBlueprints.js** - Azure Function to retrieve blueprints
   - GET endpoint: `/api/GetBlueprints`
   - Supports multiple query modes:
     - `?studentEmail=...` - Get all blueprints for student
     - `?blueprintId=...` - Get specific blueprint
     - `?featured=true&limit=10` - Get featured blueprints
     - `?studentEmail=...&stats=true` - Get statistics

### ✅ Frontend Integration
4. **js/api.js** - Added Blueprint API methods:
   - `submitBlueprint(blueprintData)`
   - `getBlueprints(studentEmail)`
   - `getBlueprintById(blueprintId)`
   - `getBlueprintStats(studentEmail)`
   - `getFeaturedBlueprints(limit)`

5. **local.settings.json** - Added SQL connection environment variables

---

## Frontend Integration (Next Steps)

Once the backend is working, update the Blueprint submission page to use the real API:

### In `js/blueprint.js`, find the submit handler and add:

```javascript
async function submitBlueprintToBackend() {
    const studentEmail = window.IMI.data.userData.email;

    const blueprintData = {
        studentEmail: studentEmail,
        contactId: window.IMI.data.userData.contactId,
        articleTitle: document.getElementById('article-title').value,
        articleSource: document.getElementById('article-source').value,
        articleUrl: document.getElementById('article-url').value,
        trendspotter: document.getElementById('trendspotter').value,
        futureVisionary: document.getElementById('future-visionary').value,
        innovationCatalyst: document.getElementById('innovation-catalyst').value,
        connector: document.getElementById('connector').value,
        growthHacker: document.getElementById('growth-hacker').value,
        status: 'submitted'
    };

    try {
        const result = await window.IMI.api.submitBlueprint(blueprintData);
        console.log('✅ Blueprint submitted:', result);

        // Show success message
        window.IMI.utils.showNotification('Blueprint submitted successfully! +100 XP', 'success');

        // Update XP display
        updateXPDisplay(result.data.xpEarned);

    } catch (error) {
        console.error('❌ Failed to submit blueprint:', error);
        window.IMI.utils.showNotification('Failed to submit blueprint. Please try again.', 'error');
    }
}
```

### To Display Past Blueprints:

```javascript
async function loadStudentBlueprints() {
    const studentEmail = window.IMI.data.userData.email;

    try {
        const blueprints = await window.IMI.api.getBlueprints(studentEmail);
        console.log('✅ Loaded blueprints:', blueprints.length);

        // Display in UI
        displayBlueprints(blueprints);

    } catch (error) {
        console.error('❌ Failed to load blueprints:', error);
    }
}
```

---

## Production Deployment

When deploying to Azure:

### 1. Add Environment Variables to Azure Function App
In Azure Portal → Your Function App → Configuration → Application settings:
- `SQL_SERVER` = `imi-student-portal-sql-server.database.windows.net`
- `SQL_DATABASE` = `StudentDashboardDB`
- `SQL_USERNAME` = `imi_student_portal_sql`
- `SQL_PASSWORD` = `[your password]`

### 2. Update Frontend Config
In `js/config.js`, change:
```javascript
API: {
    baseUrl: 'https://studentdashboardapi.azurewebsites.net/api', // Your deployed Function App URL
    // ...
}
```

### 3. Enable CORS on Azure Function App
Azure Portal → Your Function App → CORS → Add allowed origins:
- `https://i-made-it-inc.github.io` (or your GitHub Pages URL)
- `http://localhost:8080` (for local testing)

---

## Database Schema Reference

Your `Blueprints` table has these columns:

| Column | Type | Description |
|--------|------|-------------|
| `blueprintId` | int (PK) | Auto-incrementing ID |
| `studentEmail` | nvarchar(255) | Student's email (FK to Dataverse) |
| `contactId` | uniqueidentifier | Dataverse Contact GUID |
| `submissionDate` | datetime2 | When submitted |
| `articleTitle` | nvarchar(500) | Article title |
| `articleSource` | nvarchar(255) | Publication name |
| `articleUrl` | nvarchar(1000) | Link to article |
| `trendspotter` | nvarchar(MAX) | Archetype 1 response |
| `futureVisionary` | nvarchar(MAX) | Archetype 2 response |
| `innovationCatalyst` | nvarchar(MAX) | Archetype 3 response |
| `connector` | nvarchar(MAX) | Archetype 4 response |
| `growthHacker` | nvarchar(MAX) | Archetype 5 response |
| `xpEarned` | int | XP points (default 100) |
| `connectorBonus` | bit | +25 XP bonus flag |
| `featuredInsight` | bit | +50 XP featured flag |
| `status` | nvarchar(50) | 'draft', 'submitted', 'reviewed' |
| `wordCount` | int | Total word count |
| `aiQualityScore` | decimal(3,2) | 0.00-1.00 quality score |
| `createdAt` | datetime2 | Creation timestamp |
| `updatedAt` | datetime2 | Last update timestamp |

---

## Troubleshooting

### Connection Errors
**Error**: "Failed to connect to SQL database"
- ✅ Check firewall rules in Azure Portal (allow Azure services)
- ✅ Verify `SQL_PASSWORD` is correct
- ✅ Test connection from Azure Portal Query Editor

### "ECONNREFUSED" Errors
**Error**: Connection refused
- ✅ Ensure Azure Functions are running (`npm start` or `func start`)
- ✅ Check `baseUrl` in `js/config.js` points to `http://localhost:7071/api`

### CORS Errors
**Error**: "blocked by CORS policy"
- ✅ Check `local.settings.json` has `"CORS": "*"` under `Host`
- ✅ For production, add your domain to Azure Function CORS settings

---

## Testing Checklist

- [ ] SQL password added to `local.settings.json`
- [ ] Azure Functions start without errors
- [ ] Test POST to `/api/SubmitBlueprint` with curl
- [ ] Test GET from `/api/GetBlueprints?studentEmail=...`
- [ ] Verify data appears in Azure Portal Query Editor
- [ ] Frontend calls API successfully (check browser console)
- [ ] Blueprint submissions increment XP in UI

---

## Next Steps After Testing

1. **Integrate with Blueprint Page UI** - Connect submit button to real API
2. **Add "View Past Blueprints" Section** - Display history with load function
3. **Deploy to Azure** - Publish Functions and update frontend config
4. **Add More Features**:
   - Draft saving (auto-save as user types)
   - Edit existing blueprints
   - AI quality scoring
   - Peer Blueprint recommendations
   - Featured insights showcase

---

## Questions?

If you encounter any issues:
1. Check Azure Functions logs: `npm start` output
2. Check browser console for API call errors
3. Test SQL connection in Azure Portal Query Editor
4. Verify all environment variables are set correctly

Your database is ready and the API is built! Just add your password and test it out.
