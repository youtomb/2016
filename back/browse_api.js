const axios = require('axios');

async function fetchBrowseData(browseId) {
    const apiKey = 'AIzaSyDCU8hByM-4DrUqRUYnGn-3llEO78bcxq8';
    const apiUrl = 'https://www.googleapis.com/youtubei/v1/browse';

    // Define the user agent
    const USER_AGENT_TV_HTML5 = "Mozilla/5.0 (PlayStation 4 5.55) AppleWebKit/601.2 (KHTML, like Gecko)";

    const postData = {
        context: {
            client: {
                clientName: 'TVHTML5',
                clientVersion: '7.20220918',
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
                'Content-Type': 'application/json',
                'User-Agent': USER_AGENT_TV_HTML5  // Add User-Agent header here
            },
            params: { key: apiKey }
        });

        console.log('Received response from YouTube Browse API:', response.data);
        return response.data;  
    } catch (error) {
        console.error('Error fetching browse data:', error.message);
        throw new Error('Failed to fetch data from YouTube Browse API.');
    }
}

module.exports = { fetchBrowseData };
