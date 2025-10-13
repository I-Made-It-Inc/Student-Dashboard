// dataverseClient.js - Dataverse API Client
const axios = require('axios');

let cachedToken = null;
let tokenExpiry = null;

/**
 * Get access token for Dataverse API
 */
async function getAccessToken() {
    // Return cached token if still valid
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 60000) {
        return cachedToken;
    }

    const tenantId = process.env.DATAVERSE_TENANT_ID;
    const clientId = process.env.DATAVERSE_CLIENT_ID;
    const clientSecret = process.env.DATAVERSE_CLIENT_SECRET;
    const dataverseUrl = process.env.DATAVERSE_URL;

    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('scope', `${dataverseUrl}/.default`);
    params.append('grant_type', 'client_credentials');

    try {
        const response = await axios.post(tokenUrl, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        cachedToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000);

        return cachedToken;
    } catch (error) {
        console.error('Failed to get access token:', error.response?.data || error.message);
        throw new Error('Authentication failed');
    }
}

/**
 * Find contact by email address
 */
async function findContactByEmail(email) {
    const token = await getAccessToken();
    const dataverseUrl = process.env.DATAVERSE_URL;

    try {
        const response = await axios.get(
            `${dataverseUrl}/api/data/v9.2/contacts`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'OData-MaxVersion': '4.0',
                    'OData-Version': '4.0',
                    'Accept': 'application/json',
                    'Prefer': 'odata.include-annotations="*"'
                },
                params: {
                    $filter: `emailaddress1 eq '${email}'`,
                    $select: 'contactid,firstname,lastname,emailaddress1,mobilephone,fullname,nickname,description,imi_careerinterests,imi_school,imi_graduationyear,jobtitle,address1_city'
                }
            }
        );

        if (response.data.value && response.data.value.length > 0) {
            return response.data.value[0];
        }
        return null;
    } catch (error) {
        console.error('Error finding contact:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Create new contact
 */
async function createContact(contactData) {
    const token = await getAccessToken();
    const dataverseUrl = process.env.DATAVERSE_URL;

    try {
        const response = await axios.post(
            `${dataverseUrl}/api/data/v9.2/contacts`,
            contactData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'OData-MaxVersion': '4.0',
                    'OData-Version': '4.0',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        // Fetch the created contact
        const contactId = response.headers['odata-entityid'].split('(')[1].split(')')[0];
        return await getContactById(contactId);
    } catch (error) {
        console.error('Error creating contact:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Get contact by ID
 */
async function getContactById(contactId) {
    const token = await getAccessToken();
    const dataverseUrl = process.env.DATAVERSE_URL;

    try {
        const response = await axios.get(
            `${dataverseUrl}/api/data/v9.2/contacts(${contactId})`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'OData-MaxVersion': '4.0',
                    'OData-Version': '4.0',
                    'Accept': 'application/json'
                },
                params: {
                    $select: 'contactid,firstname,lastname,emailaddress1,mobilephone,fullname,nickname,description,imi_careerinterests,imi_school,imi_graduationyear,jobtitle,address1_city'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error getting contact:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Update contact
 */
async function updateContact(contactId, updates) {
    const token = await getAccessToken();
    const dataverseUrl = process.env.DATAVERSE_URL;

    try {
        await axios.patch(
            `${dataverseUrl}/api/data/v9.2/contacts(${contactId})`,
            updates,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'OData-MaxVersion': '4.0',
                    'OData-Version': '4.0',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        // Return updated contact
        return await getContactById(contactId);
    } catch (error) {
        console.error('Error updating contact:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = {
    findContactByEmail,
    createContact,
    updateContact
};