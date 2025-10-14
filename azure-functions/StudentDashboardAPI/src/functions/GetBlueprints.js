const { app } = require('@azure/functions');
const sqlClient = require('../../sqlClient');

app.http('GetBlueprints', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('GetBlueprints function triggered');

        try {
            // Get query parameters
            const studentEmail = request.query.get('studentEmail');
            const blueprintId = request.query.get('blueprintId');
            const featured = request.query.get('featured');
            const stats = request.query.get('stats');

            // Validate required parameters (either email, blueprintId, or featured flag)
            if (!studentEmail && !blueprintId && !featured && !stats) {
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    jsonBody: {
                        error: 'Either studentEmail, blueprintId, featured, or stats parameter is required'
                    }
                };
            }

            let result;

            // Handle different query types
            if (stats && studentEmail) {
                // Get statistics for a student
                context.log('Fetching blueprint stats for:', studentEmail);
                result = await sqlClient.getBlueprintStats(studentEmail);
            } else if (blueprintId) {
                // Get specific blueprint by ID
                context.log('Fetching blueprint:', blueprintId);
                result = await sqlClient.getBlueprintById(parseInt(blueprintId));

                if (!result) {
                    return {
                        status: 404,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        jsonBody: {
                            error: 'Blueprint not found'
                        }
                    };
                }
            } else if (featured === 'true') {
                // Get featured blueprints for sharing
                const limit = parseInt(request.query.get('limit')) || 10;
                context.log('Fetching featured blueprints, limit:', limit);
                result = await sqlClient.getFeaturedBlueprints(limit);
            } else {
                // Get blueprints for a student with pagination
                const limit = parseInt(request.query.get('limit')) || 10;
                const offset = parseInt(request.query.get('offset')) || 0;
                context.log('Fetching blueprints for:', studentEmail, 'limit:', limit, 'offset:', offset);
                result = await sqlClient.getBlueprintsByEmail(studentEmail, limit, offset);
            }

            context.log('✅ Blueprints retrieved successfully');

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    success: true,
                    data: result,
                    count: Array.isArray(result) ? result.length : (result ? 1 : 0)
                }
            };

        } catch (error) {
            context.log.error('❌ Error in GetBlueprints:', error);
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    error: 'Failed to retrieve blueprints',
                    details: error.message
                }
            };
        }
    }
});
