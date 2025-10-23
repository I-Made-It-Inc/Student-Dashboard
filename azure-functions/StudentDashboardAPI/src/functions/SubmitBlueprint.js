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

            // Calculate XP based on sections with >100 words (20 XP per complete section)
            const sections = [
                body.trendspotter || '',
                body.futureVisionary || '',
                body.innovationCatalyst || '',
                body.connector || '',
                body.growthHacker || ''
            ];

            let completeSections = 0;
            sections.forEach(section => {
                const sectionWordCount = section.trim().split(/\s+/).filter(word => word.length > 0).length;
                if (sectionWordCount >= 100) {
                    completeSections++;
                }
            });

            const xpEarned = completeSections * 20;

            // If no sections are complete, save as draft (no XP)
            const status = completeSections > 0 ? 'submitted' : 'draft';

            context.log(`Calculated XP: ${xpEarned} (${completeSections} complete sections)`);

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
                xpEarned: xpEarned,
                connectorBonus: body.connectorBonus || false,
                featuredInsight: body.featuredInsight || false,
                status: status,
                wordCount: wordCount,
                aiQualityScore: body.aiQualityScore || null
            };

            context.log('Submitting blueprint for:', blueprintData.studentEmail);

            // Submit to database
            const result = await sqlClient.submitBlueprint(blueprintData);

            context.log('✅ Blueprint submitted successfully:', result.blueprintId);

            // If XP was earned and we have azureAdUserId, update UserXP table
            let updatedXP = null;
            if (xpEarned > 0 && body.azureAdUserId) {
                try {
                    // Ensure user XP record exists (create if needed)
                    let userXP = await sqlClient.getUserXP(body.azureAdUserId);
                    if (!userXP) {
                        context.log('Creating initial UserXP record for new user');
                        userXP = await sqlClient.createUserXP(
                            body.azureAdUserId,
                            body.studentEmail,
                            body.contactId || null
                        );
                    }

                    // Add XP transaction
                    updatedXP = await sqlClient.addXPTransaction(
                        body.azureAdUserId,
                        xpEarned,
                        'blueprint',
                        result.blueprintId,
                        `Blueprint submission: ${completeSections} complete sections`
                    );

                    context.log('✅ XP updated:', updatedXP);
                } catch (xpError) {
                    context.log.error('⚠️ Failed to update XP (blueprint saved):', xpError);
                    // Continue - blueprint is saved even if XP update fails
                }
            }

            return {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    success: true,
                    message: status === 'draft'
                        ? 'Blueprint saved as draft (complete at least one section to earn XP)'
                        : 'Blueprint submitted successfully',
                    data: {
                        blueprintId: result.blueprintId,
                        submissionDate: result.submissionDate,
                        xpEarned: result.xpEarned,
                        wordCount: result.wordCount,
                        status: result.status,
                        completeSections: completeSections,
                        // Include updated XP balance if available
                        currentXP: updatedXP?.currentXP || null,
                        lifetimeXP: updatedXP?.lifetimeXP || null
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
