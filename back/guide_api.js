const fs = require('fs');
const path = require('path');

async function fetchGuideData() {
    const filePath = path.join(__dirname, '..', 'assets', 'guide_json.json');

    try {
        // Read the guide JSON file
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const guideData = JSON.parse(rawData);

        // Log the raw response data to the console
        console.log('Raw response data:', JSON.stringify(guideData, null, 2));


        // Save the modified response data to a log file
        const logsDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir); // Create the logs directory if it doesn't exist
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Replace invalid filename characters
        const logFilePath = path.join(logsDir, `response-${timestamp}.json`); // Add .json extension
        fs.writeFileSync(logFilePath, JSON.stringify(guideData, null, 2)); // Write the modified response to the file

        console.log('Response saved to log file:', logFilePath);

        return guideData;
    } catch (error) {
        console.error('Error reading or processing guide data:', error.message);
        throw new Error('Failed to read or process the guide data.');
    }
}

module.exports = { fetchGuideData };
