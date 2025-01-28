const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const LOG_FILE = path.join(__dirname, 'logs', 'error.log');
const TOKEN_FOLDER = path.join(__dirname, 'token');
const TOKEN_FILE = path.join(TOKEN_FOLDER, 'oauth_token.json');

if (!fs.existsSync(TOKEN_FOLDER)) {
    fs.mkdirSync(TOKEN_FOLDER);
}

const logErrorToFile = (errorMessage) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${errorMessage}\n`;

    if (!fs.existsSync(path.dirname(LOG_FILE))) {
        fs.mkdirSync(path.dirname(LOG_FILE));
    }

    fs.appendFileSync(LOG_FILE, logMessage, 'utf8');
};

async function requestDeviceCode(client_id, scope) {
    try {
        const response = await axios.post('https://oauth2.googleapis.com/device/code', null, {
            params: {
                client_id: client_id,
                scope: scope
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(`Request failed with status code ${error.response ? error.response.status : error.message}`);
    }
}

async function requestToken(client_id, device_code, client_secret, interval) {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    
    const params = qs.stringify({
        client_id: client_id,
        client_secret: client_secret,
        device_code: device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code'  
    });

    try {

        console.log('Requesting token with the following params:');
        console.log(`client_id: ${client_id}`);
        console.log(`device_code: ${device_code}`);
        console.log(`client_secret: ${client_secret}`); 

        const response = await axios.post(tokenUrl, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data.access_token) {
            console.log('Authorization successful, server response:', response.data);
            return response.data;  
        }

        if (response.data.error === 'authorization_pending') {
            console.log('Authorization pending. Please complete authorization on another device.');
        } else {
            throw new Error('Unexpected error during token request: ' + response.data.error_description);
        }
    } catch (error) {
  
        console.error('Error during token request:', error.message);

        if (error.response) {
            console.error('Error response status:', error.response.status);
            console.error('Error response data:', error.response.data);

            if (error.response.data && error.response.data.error) {
                console.error('Error from server:', error.response.data.error);
                console.error('Error description:', error.response.data.error_description);
            }
        } else {

            console.error('No response from server:', error.message);
        }

        throw new Error(`Error requesting token: ${error.message}`);
    }
}


async function getYouTubeChannelData() {
    try {

        const simulatedResponse = {
            "kind": "youtube#channelListResponse",
            "etag": "etag_value_here",
            "items": [
                {
                    "kind": "youtube#channel",
                    "id": "UCxxxxxxx",
                    "snippet": {
                        "title": "Yap",
                        "description": "This is your channel description",
                        "thumbnails": {
                            "default": {
                                "url": "https://example.com/default-thumbnail.jpg"
                            }
                        },
                        "localized": {
                            "title": "Your Channel",
                            "description": "Channel description"
                        }
                    },
                    "statistics": {
                        "viewCount": "500000",
                        "subscriberCount": "10000",
                        "videoCount": "150"
                    }
                }
            ]
        };

        return simulatedResponse;
    } catch (error) {
        throw new Error(`Error fetching YouTube channel data: ${error.message}`);
    }
}

const oauthRouter = (app) => {

    app.post('/o/oauth2/device/code', async (req, res) => {
        const { client_id, scope } = req.body;

        if (!client_id || !scope) {
            const errorMessage = 'Client ID and scope are required.';
            res.status(400).send(errorMessage);
            logErrorToFile(errorMessage);
            return;
        }

        try {
            const { device_code, user_code, verification_url, expires_in } = await requestDeviceCode(client_id, scope);

            res.json({
                device_code,
                user_code,
                verification_url,
                expires_in
            });
        } catch (error) {
            const errorMessage = `Error during device code request: ${error.message}`;
            res.status(500).send('Error during device code request.');
            logErrorToFile(errorMessage);
        }
    });


    app.post('/o/oauth2/token', async (req, res) => {
        const { client_id, device_code, client_secret } = req.body; 
    
        if (!client_id || !device_code || !client_secret) {
            const errorMessage = 'Client ID, client secret, and device_code are required.';
            res.status(400).send(errorMessage);
            logErrorToFile(errorMessage);
            return;
        }
    
        try {

            const tokenData = await requestToken(client_id, device_code, client_secret);
    
       
            if (tokenData.access_token) {
                res.json(tokenData);
                fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2), 'utf8');
            } else {

                const errorMessage = 'Invalid token response: ' + JSON.stringify(tokenData);
                res.status(400).send(errorMessage);
                logErrorToFile(errorMessage);
            }
        } catch (error) {

            console.error('Error during token request:', error.message);
    
            if (error.response) {
                const errorDetails = error.response.data;
                const errorType = errorDetails.error;
                const errorDescription = errorDetails.error_description;
    
                console.error('Error response status:', error.response.status);
                console.error('Error response data:', errorDetails);
    
                if (errorType === 'authorization_pending') {
                    
                    const errorMessage = 'Authorization pending. Please authorize the device.';
                    res.status(428).send(errorMessage); 
                    logErrorToFile(`Authorization pending. Waiting for user authorization.`);
                } else if (errorType === 'slow_down') {
 
                    console.log('Received slow_down error, retrying...');
                    const retryDelay = 2000; 
                    setTimeout(async () => {
                        try {
                            const tokenData = await requestToken(client_id, device_code, client_secret);
                            res.json(tokenData);
                            fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2), 'utf8');
                        } catch (retryError) {
                            const retryErrorMessage = `Retry failed: ${retryError.message}`;
                            res.status(418).send(retryErrorMessage);
                            logErrorToFile(retryErrorMessage);
                        }
                    }, retryDelay); 
                } else if (error.response.status === 400) {
                    const errorMessage = `Bad request: ${errorDescription}`;
                    res.status(400).send(errorMessage);
                    logErrorToFile(`Bad request error: ${errorDescription}`);
                } else if (error.response.status === 401) {
                    const errorMessage = 'Unauthorized: Invalid client credentials.';
                    res.status(401).send(errorMessage);
                    logErrorToFile(`Unauthorized error: ${errorDescription}`);
                } else {
                    const errorMessage = `Unexpected error: ${error.message}`;
                    res.status(418).send(errorMessage);
                    logErrorToFile(`Unexpected error: ${errorDescription}`);
                }
            } else {
                const errorMessage = 'Authorization pending. Please authorize the device.';
                res.status(428).send(errorMessage); 
                logErrorToFile(`Authorization pending. Waiting for user authorization.`);
            }
        }
    });
    
    app.get('/api/youtube/channels', async (req, res) => {

        try {
            const channelData = await getYouTubeChannelData();
            res.json(channelData);
        } catch (error) {
            const errorMessage = `Error fetching YouTube channel data: ${error.message}`;
            res.status(500).send(errorMessage);
            logErrorToFile(errorMessage);
        }
    });

    
    

};

module.exports = oauthRouter;
