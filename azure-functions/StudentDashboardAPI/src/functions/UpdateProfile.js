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

        const { email, mobilePhone, nickname, description, careerInterests, school, graduationYear } = body;

        try {
            // Find contact by email
            const contact = await dataverseClient.findContactByEmail(email);

            if (!contact) {
                return {
                    status: 404,
                    jsonBody: { error: 'Contact not found' }
                };
            }

            // Build update object with only provided fields
            const updates = {};
            if (mobilePhone !== undefined) updates.mobilephone = mobilePhone || null;
            if (nickname !== undefined) updates.nickname = nickname || null;
            if (description !== undefined) updates.description = description || null;
            if (careerInterests !== undefined) updates.imi_careerinterests = careerInterests || null;
            if (school !== undefined) updates.imi_school = school || null;
            if (graduationYear !== undefined) updates.imi_graduationyear = graduationYear || null;

            // Update contact
            const updatedContact = await dataverseClient.updateContact(contact.contactid, updates);

            context.log(`Updated contact ${contact.contactid}:`, updates);

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
                    nickname: updatedContact.nickname,
                    description: updatedContact.description,
                    careerInterests: updatedContact.imi_careerinterests,
                    school: updatedContact.imi_school,
                    graduationYear: updatedContact.imi_graduationyear,
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
