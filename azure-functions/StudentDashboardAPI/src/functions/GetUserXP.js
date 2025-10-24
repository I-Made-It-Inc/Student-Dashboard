const { app } = require('@azure/functions');
const sqlClient = require('../../sqlClient');

app.http('GetUserXP', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('GetUserXP function triggered');

        try {
            // Get query parameters
            const azureAdUserId = request.query.get('azureAdUserId');
            const studentEmail = request.query.get('studentEmail');

            // Validate required parameters
            if (!azureAdUserId && !studentEmail) {
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    jsonBody: {
                        error: 'Either azureAdUserId or studentEmail is required'
                    }
                };
            }

            context.log('Fetching XP for:', azureAdUserId || studentEmail);

            // Try to get existing XP record
            let userXP = await sqlClient.getUserXP(azureAdUserId);

            // If user doesn't exist, auto-create with 0 XP
            if (!userXP && azureAdUserId && studentEmail) {
                context.log('User XP not found, creating new record with 0 XP');
                userXP = await sqlClient.createUserXP(azureAdUserId, studentEmail, null);
            } else if (!userXP) {
                // If we only have azureAdUserId and no record exists, return error
                return {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    jsonBody: {
                        error: 'User XP record not found. Please provide studentEmail to create new record.'
                    }
                };
            }

            context.log('✅ User XP retrieved:', userXP.currentXP, 'XP');

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    success: true,
                    data: {
                        currentXP: userXP.currentXP,
                        lifetimeXP: userXP.lifetimeXP,
                        xpSpent: userXP.xpSpent,
                        currentStreak: userXP.currentStreak || 0,
                        lastSubmissionWeek: userXP.lastSubmissionWeek,
                        currentTier: userXP.currentTier || 'bronze',
                        createdAt: userXP.createdAt,
                        updatedAt: userXP.updatedAt
                    }
                }
            };

        } catch (error) {
            context.log.error('❌ Error in GetUserXP:', error);
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    error: 'Failed to retrieve user XP',
                    details: error.message
                }
            };
        }
    }
});
