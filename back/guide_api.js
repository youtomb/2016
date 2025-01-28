const fs = require('fs');
const path = require('path');

async function fetchGuideData() {
    const filePath = path.join(__dirname, '..', 'assets', 'guide_json.json');

    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        let guideData = JSON.parse(rawData);

        console.log('Raw response data:', JSON.stringify(guideData, null, 2));

        // Check if the /token/ directory exists (inside the /back/ directory)
        const tokenDirPath = path.join(__dirname, 'token');
        if (fs.existsSync(tokenDirPath)) {
            console.log('token directory exists, modifying guide data...');

            // If guideData exists and is an array, modify it by removing sections containing "Sign in"
            if (guideData.items && Array.isArray(guideData.items)) {
                guideData.items.forEach(section => {
                    if (section.guideSectionRenderer && section.guideSectionRenderer.items) {
                        // Modify items in each section
                        section.guideSectionRenderer.items = section.guideSectionRenderer.items.filter(item => {
                            // Filter out items that contain "Sign in"
                            return !(
                                item.guideEntryRenderer &&
                                item.guideEntryRenderer.formattedTitle &&
                                item.guideEntryRenderer.formattedTitle.runs.some(run => run.text === 'Sign in')
                            );
                        });
                    }
                });
            }

            // Remove "Sign in" entry from the footer section
            if (guideData.footer && guideData.footer.guideSectionRenderer && guideData.footer.guideSectionRenderer.items) {
                guideData.footer.guideSectionRenderer.items = guideData.footer.guideSectionRenderer.items.filter(item => {
                    return !(
                        item.guideEntryRenderer &&
                        item.guideEntryRenderer.formattedTitle &&
                        item.guideEntryRenderer.formattedTitle.runs.some(run => run.text === 'Sign in')
                    );
                });
            }
        } else {
            console.log('token directory does not exist');
        }

        // Return the modified guide data
        return guideData;
    } catch (error) {
        console.error('Error reading or processing guide data:', error.message);
        throw new Error('Failed to read or process the guide data.');
    }
}

module.exports = { fetchGuideData };
