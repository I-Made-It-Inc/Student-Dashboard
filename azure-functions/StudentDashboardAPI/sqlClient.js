// sqlClient.js - Azure SQL Database Client for Blueprint Storage
const sql = require('mssql');

// SQL connection configuration
const sqlConfig = {
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    options: {
        encrypt: true, // Required for Azure SQL
        trustServerCertificate: false,
        enableArithAbort: true,
        connectTimeout: 30000,
        requestTimeout: 30000
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Connection pool (reuse connections for better performance)
let pool = null;

/**
 * Get or create SQL connection pool
 */
async function getPool() {
    if (pool && pool.connected) {
        return pool;
    }

    try {
        pool = await sql.connect(sqlConfig);
        console.log('✅ SQL connection pool established');
        return pool;
    } catch (error) {
        console.error('❌ Failed to connect to SQL database:', error);
        throw new Error('Database connection failed');
    }
}

/**
 * Submit a new Blueprint
 * @param {Object} blueprintData - Blueprint submission data
 * @returns {Object} Created blueprint with ID
 */
async function submitBlueprint(blueprintData) {
    const pool = await getPool();

    try {
        const result = await pool.request()
            .input('azureAdUserId', sql.NVarChar(100), blueprintData.azureAdUserId || null)
            .input('studentEmail', sql.NVarChar(255), blueprintData.studentEmail)
            .input('contactId', sql.UniqueIdentifier, blueprintData.contactId || null)
            .input('submissionDate', sql.DateTime2, blueprintData.submissionDate || new Date())
            .input('articleTitle', sql.NVarChar(500), blueprintData.articleTitle || null)
            .input('articleSource', sql.NVarChar(255), blueprintData.articleSource || null)
            .input('articleUrl', sql.NVarChar(1000), blueprintData.articleUrl || null)
            .input('trendspotter', sql.NVarChar(sql.MAX), blueprintData.trendspotter || null)
            .input('futureVisionary', sql.NVarChar(sql.MAX), blueprintData.futureVisionary || null)
            .input('innovationCatalyst', sql.NVarChar(sql.MAX), blueprintData.innovationCatalyst || null)
            .input('connector', sql.NVarChar(sql.MAX), blueprintData.connector || null)
            .input('growthHacker', sql.NVarChar(sql.MAX), blueprintData.growthHacker || null)
            .input('xpEarned', sql.Int, blueprintData.xpEarned || 100)
            .input('connectorBonus', sql.Bit, blueprintData.connectorBonus || false)
            .input('featuredInsight', sql.Bit, blueprintData.featuredInsight || false)
            .input('status', sql.NVarChar(50), blueprintData.status || 'submitted')
            .input('wordCount', sql.Int, blueprintData.wordCount || null)
            .input('aiQualityScore', sql.Decimal(3, 2), blueprintData.aiQualityScore || null)
            .query(`
                INSERT INTO Blueprints (
                    azureAdUserId, studentEmail, contactId, submissionDate,
                    articleTitle, articleSource, articleUrl,
                    trendspotter, futureVisionary, innovationCatalyst, connector, growthHacker,
                    xpEarned, connectorBonus, featuredInsight, status, wordCount, aiQualityScore
                )
                OUTPUT INSERTED.*
                VALUES (
                    @azureAdUserId, @studentEmail, @contactId, @submissionDate,
                    @articleTitle, @articleSource, @articleUrl,
                    @trendspotter, @futureVisionary, @innovationCatalyst, @connector, @growthHacker,
                    @xpEarned, @connectorBonus, @featuredInsight, @status, @wordCount, @aiQualityScore
                )
            `);

        return result.recordset[0];
    } catch (error) {
        console.error('❌ Error submitting blueprint:', error);
        throw error;
    }
}

/**
 * Get blueprints for a user by Azure AD User ID (PRIMARY METHOD)
 * @param {string} azureAdUserId - Azure AD Object ID (immutable)
 * @param {number} limit - Number of blueprints to return (default: 10)
 * @param {number} offset - Number of blueprints to skip (default: 0)
 * @returns {Array} List of blueprints
 */
async function getBlueprintsByUserId(azureAdUserId, limit = 10, offset = 0) {
    const pool = await getPool();

    try {
        const result = await pool.request()
            .input('azureAdUserId', sql.NVarChar(100), azureAdUserId)
            .input('limit', sql.Int, limit)
            .input('offset', sql.Int, offset)
            .query(`
                SELECT *
                FROM Blueprints
                WHERE azureAdUserId = @azureAdUserId
                ORDER BY submissionDate DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `);

        return result.recordset;
    } catch (error) {
        console.error('❌ Error fetching blueprints by user ID:', error);
        throw error;
    }
}

/**
 * Get blueprints for a student with pagination (LEGACY - use getBlueprintsByUserId instead)
 * @param {string} studentEmail - Student's email address
 * @param {number} limit - Number of blueprints to return (default: 10)
 * @param {number} offset - Number of blueprints to skip (default: 0)
 * @returns {Array} List of blueprints
 */
async function getBlueprintsByEmail(studentEmail, limit = 10, offset = 0) {
    const pool = await getPool();

    try {
        const result = await pool.request()
            .input('studentEmail', sql.NVarChar(255), studentEmail)
            .input('limit', sql.Int, limit)
            .input('offset', sql.Int, offset)
            .query(`
                SELECT *
                FROM Blueprints
                WHERE studentEmail = @studentEmail
                ORDER BY submissionDate DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `);

        return result.recordset;
    } catch (error) {
        console.error('❌ Error fetching blueprints:', error);
        throw error;
    }
}

/**
 * Get a single blueprint by ID
 * @param {number} blueprintId - Blueprint ID
 * @returns {Object} Blueprint data
 */
async function getBlueprintById(blueprintId) {
    const pool = await getPool();

    try {
        const result = await pool.request()
            .input('blueprintId', sql.Int, blueprintId)
            .query(`
                SELECT *
                FROM Blueprints
                WHERE blueprintId = @blueprintId
            `);

        return result.recordset[0] || null;
    } catch (error) {
        console.error('❌ Error fetching blueprint:', error);
        throw error;
    }
}

/**
 * Update an existing blueprint
 * @param {number} blueprintId - Blueprint ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated blueprint
 */
async function updateBlueprint(blueprintId, updates) {
    const pool = await getPool();

    try {
        // Build dynamic SET clause based on provided updates
        const setClause = Object.keys(updates)
            .map(key => `${key} = @${key}`)
            .join(', ');

        const request = pool.request()
            .input('blueprintId', sql.Int, blueprintId);

        // Add all update parameters
        Object.entries(updates).forEach(([key, value]) => {
            if (key === 'submissionDate' || key === 'createdAt' || key === 'updatedAt') {
                request.input(key, sql.DateTime2, value);
            } else if (key === 'wordCount' || key === 'xpEarned') {
                request.input(key, sql.Int, value);
            } else if (key === 'connectorBonus' || key === 'featuredInsight') {
                request.input(key, sql.Bit, value);
            } else if (key === 'aiQualityScore') {
                request.input(key, sql.Decimal(3, 2), value);
            } else if (key === 'contactId') {
                request.input(key, sql.UniqueIdentifier, value);
            } else {
                request.input(key, sql.NVarChar(sql.MAX), value);
            }
        });

        const result = await request.query(`
            UPDATE Blueprints
            SET ${setClause}, updatedAt = GETUTCDATE()
            OUTPUT INSERTED.*
            WHERE blueprintId = @blueprintId
        `);

        return result.recordset[0] || null;
    } catch (error) {
        console.error('❌ Error updating blueprint:', error);
        throw error;
    }
}

/**
 * Delete a blueprint
 * @param {number} blueprintId - Blueprint ID
 * @returns {boolean} Success status
 */
async function deleteBlueprint(blueprintId) {
    const pool = await getPool();

    try {
        await pool.request()
            .input('blueprintId', sql.Int, blueprintId)
            .query(`
                DELETE FROM Blueprints
                WHERE blueprintId = @blueprintId
            `);

        return true;
    } catch (error) {
        console.error('❌ Error deleting blueprint:', error);
        throw error;
    }
}

/**
 * Get blueprint statistics for a user by Azure AD User ID (PRIMARY METHOD)
 * @param {string} azureAdUserId - Azure AD Object ID
 * @returns {Object} Statistics (total submissions, total XP, etc.)
 */
async function getBlueprintStatsByUserId(azureAdUserId) {
    const pool = await getPool();

    try {
        const result = await pool.request()
            .input('azureAdUserId', sql.NVarChar(100), azureAdUserId)
            .query(`
                SELECT
                    COUNT(*) as totalSubmissions,
                    SUM(xpEarned) as totalXP,
                    AVG(wordCount) as avgWordCount,
                    MAX(submissionDate) as lastSubmission,
                    SUM(CASE WHEN connectorBonus = 1 THEN 1 ELSE 0 END) as connectorBonusCount,
                    SUM(CASE WHEN featuredInsight = 1 THEN 1 ELSE 0 END) as featuredInsightCount
                FROM Blueprints
                WHERE azureAdUserId = @azureAdUserId
            `);

        return result.recordset[0];
    } catch (error) {
        console.error('❌ Error fetching blueprint stats by user ID:', error);
        throw error;
    }
}

/**
 * Get blueprint statistics for a student (LEGACY - use getBlueprintStatsByUserId instead)
 * @param {string} studentEmail - Student's email
 * @returns {Object} Statistics (total submissions, total XP, etc.)
 */
async function getBlueprintStats(studentEmail) {
    const pool = await getPool();

    try {
        const result = await pool.request()
            .input('studentEmail', sql.NVarChar(255), studentEmail)
            .query(`
                SELECT
                    COUNT(*) as totalSubmissions,
                    SUM(xpEarned) as totalXP,
                    AVG(wordCount) as avgWordCount,
                    MAX(submissionDate) as lastSubmission,
                    SUM(CASE WHEN connectorBonus = 1 THEN 1 ELSE 0 END) as connectorBonusCount,
                    SUM(CASE WHEN featuredInsight = 1 THEN 1 ELSE 0 END) as featuredInsightCount
                FROM Blueprints
                WHERE studentEmail = @studentEmail
            `);

        return result.recordset[0];
    } catch (error) {
        console.error('❌ Error fetching blueprint stats:', error);
        throw error;
    }
}

/**
 * Get recent featured blueprints (for sharing with peers)
 * @param {number} limit - Number of blueprints to return
 * @returns {Array} Featured blueprints (anonymized)
 */
async function getFeaturedBlueprints(limit = 10) {
    const pool = await getPool();

    try {
        const result = await pool.request()
            .input('limit', sql.Int, limit)
            .query(`
                SELECT TOP (@limit)
                    blueprintId,
                    articleTitle,
                    articleSource,
                    trendspotter,
                    futureVisionary,
                    innovationCatalyst,
                    connector,
                    growthHacker,
                    submissionDate,
                    xpEarned
                FROM Blueprints
                WHERE featuredInsight = 1
                    AND status = 'submitted'
                ORDER BY submissionDate DESC
            `);

        return result.recordset;
    } catch (error) {
        console.error('❌ Error fetching featured blueprints:', error);
        throw error;
    }
}

/**
 * Get user XP data by Azure AD User ID
 * @param {string} azureAdUserId - Azure AD Object ID
 * @returns {Object} User XP data or null if not exists
 */
async function getUserXP(azureAdUserId) {
    const pool = await getPool();

    try {
        const result = await pool.request()
            .input('azureAdUserId', sql.NVarChar(100), azureAdUserId)
            .query(`
                SELECT
                    xpId,
                    azureAdUserId,
                    studentEmail,
                    dataverseContactId,
                    currentXP,
                    lifetimeXP,
                    xpSpent,
                    createdAt,
                    updatedAt
                FROM UserXP
                WHERE azureAdUserId = @azureAdUserId
            `);

        return result.recordset[0] || null;
    } catch (error) {
        console.error('❌ Error fetching user XP:', error);
        throw error;
    }
}

/**
 * Create initial XP record for new user
 * @param {string} azureAdUserId - Azure AD Object ID
 * @param {string} studentEmail - Student email
 * @param {string} dataverseContactId - Dataverse contact ID (optional)
 * @returns {Object} Created user XP record
 */
async function createUserXP(azureAdUserId, studentEmail, dataverseContactId = null) {
    const pool = await getPool();

    try {
        const result = await pool.request()
            .input('azureAdUserId', sql.NVarChar(100), azureAdUserId)
            .input('studentEmail', sql.NVarChar(255), studentEmail)
            .input('dataverseContactId', sql.UniqueIdentifier, dataverseContactId)
            .query(`
                INSERT INTO UserXP (azureAdUserId, studentEmail, dataverseContactId, currentXP, lifetimeXP, xpSpent)
                OUTPUT INSERTED.*
                VALUES (@azureAdUserId, @studentEmail, @dataverseContactId, 0, 0, 0)
            `);

        console.log('✅ Created new UserXP record for:', studentEmail);
        return result.recordset[0];
    } catch (error) {
        console.error('❌ Error creating user XP:', error);
        throw error;
    }
}

/**
 * Add XP transaction (earn or spend) - updates UserXP and creates transaction record
 * @param {string} azureAdUserId - Azure AD Object ID
 * @param {number} xpAmount - Amount of XP (positive for earn, negative for spend)
 * @param {string} source - Source of XP ('blueprint', 'idea', 'project', etc.)
 * @param {number} sourceId - ID of the source record (blueprintId, ideaId, etc.)
 * @param {string} description - Description of transaction
 * @returns {Object} Updated XP balance
 */
async function addXPTransaction(azureAdUserId, xpAmount, source, sourceId, description) {
    const pool = await getPool();
    const transaction = pool.transaction();

    try {
        await transaction.begin();

        // Update UserXP table
        const updateResult = await transaction.request()
            .input('azureAdUserId', sql.NVarChar(100), azureAdUserId)
            .input('xpAmount', sql.Int, xpAmount)
            .query(`
                UPDATE UserXP
                SET
                    currentXP = currentXP + @xpAmount,
                    lifetimeXP = CASE
                        WHEN @xpAmount > 0 THEN lifetimeXP + @xpAmount
                        ELSE lifetimeXP
                    END,
                    xpSpent = CASE
                        WHEN @xpAmount < 0 THEN xpSpent + ABS(@xpAmount)
                        ELSE xpSpent
                    END,
                    updatedAt = GETUTCDATE()
                OUTPUT INSERTED.currentXP, INSERTED.lifetimeXP, INSERTED.xpSpent
                WHERE azureAdUserId = @azureAdUserId
            `);

        if (updateResult.recordset.length === 0) {
            throw new Error('User XP record not found');
        }

        const updatedXP = updateResult.recordset[0];

        // Insert transaction record
        await transaction.request()
            .input('azureAdUserId', sql.NVarChar(100), azureAdUserId)
            .input('transactionType', sql.NVarChar(50), xpAmount > 0 ? 'earn' : 'spend')
            .input('source', sql.NVarChar(50), source)
            .input('sourceId', sql.Int, sourceId)
            .input('xpAmount', sql.Int, xpAmount)
            .input('xpBalance', sql.Int, updatedXP.currentXP)
            .input('description', sql.NVarChar(500), description)
            .query(`
                INSERT INTO XPTransactions (
                    azureAdUserId, transactionType, source, sourceId,
                    xpAmount, xpBalance, description
                )
                VALUES (
                    @azureAdUserId, @transactionType, @source, @sourceId,
                    @xpAmount, @xpBalance, @description
                )
            `);

        await transaction.commit();

        console.log('✅ XP transaction completed:', {
            azureAdUserId,
            xpAmount,
            newBalance: updatedXP.currentXP
        });

        return {
            currentXP: updatedXP.currentXP,
            lifetimeXP: updatedXP.lifetimeXP,
            xpSpent: updatedXP.xpSpent
        };

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Error in XP transaction:', error);
        throw error;
    }
}

/**
 * Get XP transaction history for a user
 * @param {string} azureAdUserId - Azure AD Object ID
 * @param {number} limit - Number of transactions to return (default: 50)
 * @param {number} offset - Number of transactions to skip (default: 0)
 * @returns {Array} List of transactions
 */
async function getXPTransactions(azureAdUserId, limit = 50, offset = 0) {
    const pool = await getPool();

    try {
        const result = await pool.request()
            .input('azureAdUserId', sql.NVarChar(100), azureAdUserId)
            .input('limit', sql.Int, limit)
            .input('offset', sql.Int, offset)
            .query(`
                SELECT
                    transactionId,
                    transactionType,
                    source,
                    sourceId,
                    xpAmount,
                    xpBalance,
                    description,
                    transactionDate
                FROM XPTransactions
                WHERE azureAdUserId = @azureAdUserId
                ORDER BY transactionDate DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `);

        return result.recordset;
    } catch (error) {
        console.error('❌ Error fetching XP transactions:', error);
        throw error;
    }
}

/**
 * Close the connection pool (for cleanup)
 */
async function closePool() {
    if (pool) {
        await pool.close();
        pool = null;
        console.log('✅ SQL connection pool closed');
    }
}

module.exports = {
    submitBlueprint,
    getBlueprintsByUserId,       // PRIMARY: Query by Azure AD User ID
    getBlueprintsByEmail,         // LEGACY: Fallback for old data
    getBlueprintById,
    updateBlueprint,
    deleteBlueprint,
    getBlueprintStatsByUserId,   // PRIMARY: Stats by Azure AD User ID
    getBlueprintStats,            // LEGACY: Stats by email
    getFeaturedBlueprints,
    getUserXP,                    // XP: Get user XP data
    createUserXP,                 // XP: Create new user XP record
    addXPTransaction,             // XP: Add XP transaction (earn/spend)
    getXPTransactions,            // XP: Get transaction history
    closePool
};
