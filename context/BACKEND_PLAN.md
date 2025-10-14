### Storage Locations

**Dataverse**

- Partner companies
- Investors
- Basic student & parent information
    - Contact info, enrolment status, program history
    - Relationships to mentors, peers, and partner companies
    - Key milestones and engagement scores

**Azure SQL Database (Serverless, vCore, Automatic tuning)**

- Student transactional / activity data
    - Course registration, assignment submission metadata
    - Event attendance, website activity logs
    - Communication history, engagement metrics

**SharePoint Document Library or Azure Blob Storage**

- SharePoint for resumes, portfolios etc.
- Azure Blob Storage for large files or unstructured content (ex. images)



### Data Transfer / Integration Strategy

- **Master student record** lives in Dataverse with a unique ID
- **Azure SQL tables** reference this ID as foreign key
- **SharePoint libraries** use same ID in folder structure or metadata

**Integration tools:**

- **Virtual Tables** in Dataverse: Surface Azure SQL data without copying it (real-time read)
- **Power Automate**: Sync critical events bidirectionally
- **Azure Data Factory**: Batch ETL if you need reporting/analytics
- **Custom APIs**: If building custom web portal, query both sources

### Smart Sync Strategy

Don't sync everything - only sync what needs to be in Dataverse

### **1. Categorize Data by Sync Need**

**Real-time to Dataverse (Power Automate is fine):**

- Student profile updates (name, email, phone)
- Program enrollment changes
- Milestone achievements
- Relationship changes (mentor assignments, peer connections)
- Parent → partner/investor conversions

**Stay in Azure SQL (no sync needed):**

- Course page views, video watch time
- Draft assignment saves
- Search queries, navigation clicks
- Most website activity logs

**Batch sync (end-of-day or weekly):**

- Engagement scores/metrics (aggregate in Azure SQL, sync summary to Dataverse)
- Assignment completion counts
- Event attendance summaries
- Communication frequency metrics

### **2. Use Virtual Tables to Avoid Syncing Reads**

Virtual Tables in Dataverse let you query Azure SQL data without copying it.

**How it works:**

- Configure virtual table connection to Azure SQL
- Dataverse queries Azure SQL in real-time when data is accessed
- No sync needed for read operations
- Data stays in Azure SQL (cheap) but appears in Dataverse

**Use cases:**

- View student assignment history in Dataverse form
- Report on course registrations
- Display activity logs in timeline

**Setup:**

- Create virtual table provider using SQL Server connector
- Map Azure SQL tables to Dataverse entities
- Set permissions and query performance tuning

### **3. Scale Beyond Power Automate**

For high-volume operations, use **Azure Functions** or **Logic Apps**

**Hybrid approach:**

- **Power Automate**: Profile updates, enrollment changes (low volume, < 5k/day)
- **Azure Functions**: Assignment submissions, event signups (high volume, 20k-50k/day)
- **Virtual Tables**: All read operations (no sync!)
- **Scheduled batch jobs**: Nightly aggregate sync of metrics

### **4. Event-Driven Architecture**

Instead of syncing on every action, use **change data capture**:

**Azure SQL → Dataverse:**

1. Enable **Change Tracking** on Azure SQL tables
2. Scheduled Azure Function (every 5-15 minutes) checks for changes
3. Batch process changes and update Dataverse
4. Result: 96-288 sync operations/day instead of 50k+

### Practical Implementation Path

**Phase 1 (MVP):**

- Core student profiles in Dataverse
- All activity in Azure SQL
- Virtual tables for viewing activity in Dataverse
- Manual exports if needed

**Phase 2 (Scale):**

- Azure Function for nightly metric rollups
- Power Automate for critical profile changes
- Alerting for sync failures

**Phase 3 (Mature):**

- Change data capture with 15-min sync windows
- Predictive engagement scoring
- Automated archival of inactive students