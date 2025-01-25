const fs = require('fs');
const path = require('path');
const axios = require('axios');

function addDataToContent(data) {
    console.log('Received Data:', data);

    if (data) {
        data.newField = 'Added this new data';

        if (data.content && data.content.horizontalListRenderer) {
            data.content.horizontalListRenderer.newList = 'Added new data here!';
        }
    }
    
    return data;
}

async function fetchBrowseData(browseId) {
    const apiKey = 'AIzaSyDCU8hByM-4DrUqRUYnGn-3llEO78bcxq8';
    const apiUrl = `https://www.googleapis.com/youtubei/v1/browse?key=${apiKey}`;


    const postData = {
        context: {
            client: {
                clientName: 'TVHTML5',
                clientVersion: '7.20240701.16.00',
                hl: 'en',
                gl: 'US',
            }
        },
        browseId: browseId
    };

    try {
        console.log('Sending request to YouTube Browse API with payload:', postData);

        const response = await axios.post(apiUrl, postData, {
            headers: { 
                'Content-Type': 'application/json'
            }
        });

        console.log('Received response from YouTube Browse API:', response.data);

        const updatedData = addDataToContent(response.data);

        const logsDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir); 
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); 
        const logFilePath = path.join(logsDir, `response-${timestamp}.json`);
        fs.writeFileSync(logFilePath, JSON.stringify(updatedData, null, 2)); 

        console.log('Updated response saved to log file:', logFilePath);

        return updatedData;
    } catch (error) {
        console.error('Error fetching browse data:', error.message);
        throw new Error('Failed to fetch data from YouTube Browse API.');
    }
}

module.exports = { fetchBrowseData };
