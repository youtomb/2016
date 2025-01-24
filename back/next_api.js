const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function fetchNextData(params, videoId) {
    const apiKey = 'AIzaSyDCU8hByM-4DrUqRUYnGn-3llEO78bcxq8';
    const apiUrl = `https://www.googleapis.com/youtubei/v1/next?key=${apiKey}`;

    const postData = {
        context: {
            client: {
                clientName: 'TVHTML5',
                clientVersion: '5.20150715',
                screenWidthPoints: 600,
                screenHeightPoints: 275,
                screenPixelDensity: 2,
                theme: 'CLASSIC',
                webpSupport: false,
                acceptRegion: 'US',
                acceptLanguage: 'en-US',
            },
            user: {
                enableSafetyMode: false,
            },
        },
        params: params,
        videoId: videoId,
    };

    try {
        console.log('Sending request to YouTube /next API with payload:', postData);

        const response = await axios.post(apiUrl, postData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Received response from YouTube /next API.');

        // Save raw response to a file
        const logsDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logFilePath = path.join(logsDir, `next-response-${timestamp}.json`);

        // Directly write raw response data (stringify only the `data` field to avoid circular issues)
        fs.writeFileSync(logFilePath, JSON.stringify(response.data, null, 2), 'utf-8');

        console.log('Response saved to:', logFilePath);

        return response.data;
    } catch (error) {
        console.error('Error fetching next data:', error.message);

        // Log error details if present
        if (error.response && error.response.data) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }

        throw new Error('Failed to fetch data from YouTube /next API.');
    }
}

module.exports = { fetchNextData };
