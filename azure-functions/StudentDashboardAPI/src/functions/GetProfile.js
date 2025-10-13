const { app } = require('@azure/functions');
const dataverseClient = require('../../dataverseClient');

app.http('GetProfile', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('GetProfile function triggered');

        // Get email from query parameter
        const email = request.query.get('email');

        if (!email) {
            return {
                status: 400,
                jsonBody: { error: 'Email parameter is required' }
            };
        }

        try {
            // Try to find existing contact
            let contact = await dataverseClient.findContactByEmail(email);

            // If contact doesn't exist, create it
            if (!contact) {
                context.log(`Contact not found for ${email}, creating new contact`);

                // Get name from query parameters (passed from frontend)
                const firstName = request.query.get('firstName') || 'Unknown';
                const lastName = request.query.get('lastName') || 'User';

                contact = await dataverseClient.createContact({
                    firstname: firstName,
                    lastname: lastName,
                    emailaddress1: email
                });

                context.log(`Created new contact: ${contact.contactid}`);
            }

            // Return profile data
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    contactId: contact.contactid,
                    firstName: contact.firstname,
                    lastName: contact.lastname,
                    fullName: contact.fullname,
                    email: contact.emailaddress1,
                    mobilePhone: contact.mobilephone || null
                }
            };

        } catch (error) {
            context.log.error('Error in GetProfile:', error);
            return {
                status: 500,
                jsonBody: { error: 'Failed to retrieve profile', details: error.message }
            };
        }
    }
});
