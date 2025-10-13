const { app } = require('@azure/functions');
const dataverseClient = require('../../dataverseClient');

app.http('UpdateProfile', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('UpdateProfile function triggered');

        // Parse request body
        let body;
        try {
            const bodyText = await request.text();
            body = bodyText ? JSON.parse(bodyText) : {};
        } catch (error) {
            return {
                status: 400,
                jsonBody: { error: 'Invalid JSON in request body' }
            };
        }

        // Validate request
        if (!body.email) {
            return {
                status: 400,
                jsonBody: { error: 'Email is required in request body' }
            };
        }

        const { email, mobilePhone } = body;

        try {
            // Find contact by email
            const contact = await dataverseClient.findContactByEmail(email);

            if (!contact) {
                return {
                    status: 404,
                    jsonBody: { error: 'Contact not found' }
                };
            }

            // Update phone number
            const updatedContact = await dataverseClient.updateContact(contact.contactid, {
                mobilephone: mobilePhone || null
            });

            context.log(`Updated contact ${contact.contactid}: mobilephone=${mobilePhone}`);

            // Return updated profile
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    contactId: updatedContact.contactid,
                    firstName: updatedContact.firstname,
                    lastName: updatedContact.lastname,
                    email: updatedContact.emailaddress1,
                    mobilePhone: updatedContact.mobilephone,
                    message: 'Profile updated successfully'
                }
            };

        } catch (error) {
            context.log.error('Error in UpdateProfile:', error);
            return {
                status: 500,
                jsonBody: { error: 'Failed to update profile', details: error.message }
            };
        }
    }
});
