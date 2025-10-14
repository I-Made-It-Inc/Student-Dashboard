const { app } = require('@azure/functions');
const sqlClient = require('../../sqlClient');

app.http('SubmitBlueprint', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('SubmitBlueprint function triggered');

        try {
            // Parse request body
            const body = await request.json();

            // Validate required fields
            if (!body.studentEmail) {
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    jsonBody: {
                        error: 'studentEmail is required'
                    }
                };
            }

            // Calculate word count if not provided
            let wordCount = body.wordCount;
            if (!wordCount) {
                const allText = [
                    body.trendspotter || '',
                    body.futureVisionary || '',
                    body.innovationCatalyst || '',
                    body.connector || '',
                    body.growthHacker || ''
                ].join(' ');
                wordCount = allText.trim().split(/\s+/).filter(word => word.length > 0).length;
            }

            // Prepare blueprint data
            const blueprintData = {
                azureAdUserId: body.azureAdUserId || null, // Azure AD Object ID (immutable)
                studentEmail: body.studentEmail,
                contactId: body.contactId || null,
                submissionDate: body.submissionDate ? new Date(body.submissionDate) : new Date(),
                articleTitle: body.articleTitle || null,
                articleSource: body.articleSource || null,
                articleUrl: body.articleUrl || null,
                trendspotter: body.trendspotter || null,
                futureVisionary: body.futureVisionary || null,
                innovationCatalyst: body.innovationCatalyst || null,
                connector: body.connector || null,
                growthHacker: body.growthHacker || null,
                xpEarned: body.xpEarned || 100,
                connectorBonus: body.connectorBonus || false,
                featuredInsight: body.featuredInsight || false,
                status: body.status || 'submitted',
                wordCount: wordCount,
                aiQualityScore: body.aiQualityScore || null
            };

            context.log('Submitting blueprint for:', blueprintData.studentEmail);

            // Submit to database
            const result = await sqlClient.submitBlueprint(blueprintData);

            context.log('✅ Blueprint submitted successfully:', result.blueprintId);

            return {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    success: true,
                    message: 'Blueprint submitted successfully',
                    data: {
                        blueprintId: result.blueprintId,
                        submissionDate: result.submissionDate,
                        xpEarned: result.xpEarned,
                        wordCount: result.wordCount,
                        status: result.status
                    }
                }
            };

        } catch (error) {
            context.log.error('❌ Error in SubmitBlueprint:', error);
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    error: 'Failed to submit blueprint',
                    details: error.message
                }
            };
        }
    }
});
