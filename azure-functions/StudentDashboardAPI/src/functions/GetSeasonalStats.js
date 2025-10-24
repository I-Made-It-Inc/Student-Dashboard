const { app } = require('@azure/functions');
const sqlClient = require('../../sqlClient');

app.http('GetSeasonalStats', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('GetSeasonalStats function triggered');

        try {
            // Get query parameters
            const azureAdUserId = request.query.get('azureAdUserId');
            const seasonId = request.query.get('seasonId');
            const history = request.query.get('history') === 'true';

            // Validate required parameters
            if (!azureAdUserId) {
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    jsonBody: {
                        error: 'azureAdUserId is required'
                    }
                };
            }

            // If history mode, return all seasons
            if (history) {
                context.log('Fetching all season history for:', azureAdUserId);

                const allSeasons = await sqlClient.getUserAllSeasonStats(azureAdUserId);

                return {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    jsonBody: {
                        success: true,
                        data: allSeasons
                    }
                };
            }

            // Single season mode
            let targetSeasonId = seasonId ? parseInt(seasonId) : null;
            let season = null;

            // If no seasonId provided, get current season
            if (!targetSeasonId) {
                season = await sqlClient.getCurrentSeason();
                if (!season) {
                    return {
                        status: 404,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        jsonBody: {
                            error: 'No active season found'
                        }
                    };
                }
                targetSeasonId = season.seasonId;
            } else {
                // Get season by ID
                season = await sqlClient.getSeasonById(targetSeasonId);
                if (!season) {
                    return {
                        status: 404,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        jsonBody: {
                            error: 'Season not found'
                        }
                    };
                }
            }

            context.log('Fetching stats for season:', season.seasonName);

            // Get user's stats for this season
            const stats = await sqlClient.getUserSeasonStats(azureAdUserId, targetSeasonId);

            // Return season info even if user has no stats yet
            const responseData = {
                season: {
                    seasonId: season.seasonId,
                    seasonName: season.seasonName,
                    startDate: season.startDate,
                    endDate: season.endDate
                },
                stats: stats ? {
                    seasonPoints: stats.seasonPoints,
                    blueprintCount: stats.blueprintCount,
                    maxStreakDuringSeason: stats.maxStreakDuringSeason,
                    finalTier: stats.finalTier
                } : {
                    seasonPoints: 0,
                    blueprintCount: 0,
                    maxStreakDuringSeason: 0,
                    finalTier: null
                }
            };

            context.log('✅ Seasonal stats retrieved');

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    success: true,
                    data: responseData
                }
            };

        } catch (error) {
            context.log.error('❌ Error in GetSeasonalStats:', error);
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    error: 'Failed to retrieve seasonal stats',
                    details: error.message
                }
            };
        }
    }
});
