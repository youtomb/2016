const axios = require('axios');


async function fetchGuideData() {
    const apiKey = 'AIzaSyDCU8hByM-4DrUqRUYnGn-3llEO78bcxq8';
    const apiUrl = 'https://www.googleapis.com/youtubei/v1/guide';

    const postData = {
        context: {
            client: {
                clientName: 'TVHTML5',
                clientVersion: '6.90240701.16.00',
                hl: 'en',
                gl: 'US',
            }
        }
    };

    try {
        console.log('Sending request to YouTube Guide API with payload:', postData);

        const response = await axios.post(apiUrl, postData, {
            headers: { 'Content-Type': 'application/json' },
            params: { key: apiKey }
        });

        console.log('Received response from YouTube Guide API:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching guide data:', error.message);
        throw new Error('Failed to fetch data from YouTube Guide API.');
    }
}

module.exports = { fetchGuideData };
