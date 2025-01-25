const fs = require('fs');
const path = require('path');

async function fetchGuideData() {
    const filePath = path.join(__dirname, '..', 'assets', 'guide_json.json');

    try {

        const rawData = fs.readFileSync(filePath, 'utf-8');
        const guideData = JSON.parse(rawData);


        console.log('Raw response data:', JSON.stringify(guideData, null, 2));



        const logsDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir); 
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); 
        const logFilePath = path.join(logsDir, `response-${timestamp}.json`);
        fs.writeFileSync(logFilePath, JSON.stringify(guideData, null, 2)); 

        console.log('Response saved to log file:', logFilePath);

        return guideData;
    } catch (error) {
        console.error('Error reading or processing guide data:', error.message);
        throw new Error('Failed to read or process the guide data.');
    }
}

module.exports = { fetchGuideData };
