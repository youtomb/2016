const axios = require('axios');
const fs = require('fs');
const path = require('path');

function addVideoRendererToEachItem(data) {
    if (data && data.contents && data.contents.sectionListRenderer) {
        const sections = data.contents.sectionListRenderer.contents;

        sections.forEach(section => {
            if (section.shelfRenderer && section.shelfRenderer.content && section.shelfRenderer.content.horizontalListRenderer) {
                section.shelfRenderer.content.horizontalListRenderer.items.forEach(item => {
                    if (item.tileRenderer) {
                        item.videoRenderer = generateVideoRenderer(item.tileRenderer);
                        delete item.tileRenderer;
                    }
                });
            }
        });
    }
    return data;
}

function generateVideoRenderer(tileRenderer) {
    return {
        title: extractTitle(tileRenderer),
        description: extractDescription(tileRenderer),
        channel: extractChannel(tileRenderer),
        views: extractViews(tileRenderer),
        publishedTime: extractPublishedTime(tileRenderer),
        videoId: extractVideoId(tileRenderer)
    };
}

function extractTitle(tileRenderer) {
    const metadata = tileRenderer.metadata || {};
    const title = metadata.tileMetadataRenderer && metadata.tileMetadataRenderer.title
        ? metadata.tileMetadataRenderer.title.simpleText
        : 'Unknown Title';
    
    console.log("Title:", title); 
    return title;
}

function extractDescription(tileRenderer) {
    const metadata = tileRenderer.metadata || {};
    const description = metadata.tileMetadataRenderer && metadata.tileMetadataRenderer.description
        ? metadata.tileMetadataRenderer.description.simpleText
        : 'No description available';
    
    console.log("Description:", description); 
    return description;
}

function extractChannel(tileRenderer) {
    const metadata = tileRenderer.metadata || {};
    const channelMetadata = metadata.tileMetadataRenderer && metadata.tileMetadataRenderer.lines
        ? metadata.tileMetadataRenderer.lines[1]?.lineRenderer?.items[0]?.lineItemRenderer?.text?.simpleText || 'Unknown Channel'
        : 'Unknown Channel';
    
    console.log("Channel:", channelMetadata); 
    return {
        name: channelMetadata,
        id: '',
    };
}

function extractViews(tileRenderer) {
    const metadata = tileRenderer.metadata || {};
    const lines = metadata.tileMetadataRenderer && metadata.tileMetadataRenderer.lines || [];
    
    console.log("Lines for Views:", lines); 
    
    const viewsLine = lines.find(line => {
        return line.lineRenderer && line.lineRenderer.items.some(item => 
            item.lineItemRenderer && item.lineItemRenderer.text && item.lineItemRenderer.text.simpleText
        );
    });

    if (viewsLine) {
        const viewsText = viewsLine.lineRenderer.items.find(item => {
            return item.lineItemRenderer && item.lineItemRenderer.text && item.lineItemRenderer.text.simpleText && item.lineItemRenderer.text.simpleText.includes('views');
        });
        const views = viewsText ? viewsText.lineItemRenderer.text.simpleText : '0 views';
        console.log("Views:", views);
        return views;
    }
    return '0 views';
}

function extractPublishedTime(tileRenderer) {
    const metadata = tileRenderer.metadata || {};
    const lines = metadata.tileMetadataRenderer && metadata.tileMetadataRenderer.lines || [];
    
    console.log("Lines for Time:", lines); 
    
    const timeLine = lines.find(line => {
        return line.lineRenderer && line.lineRenderer.items.some(item => 
            item.lineItemRenderer && item.lineItemRenderer.text && item.lineItemRenderer.text.simpleText && item.lineItemRenderer.text.simpleText.includes('ago')
        );
    });

    if (timeLine) {
        const timeText = timeLine.lineRenderer.items.find(item => {
            return item.lineItemRenderer && item.lineItemRenderer.text && item.lineItemRenderer.text.simpleText;
        });
        const time = timeText ? timeText.lineItemRenderer.text.simpleText : 'Unknown time';
        console.log("Published Time:", time);
        return time;
    }
    return 'Unknown time';
}

function extractVideoId(tileRenderer) {
    return tileRenderer.videoId || 'Unknown videoId';
}

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

async function handleSearchRequest(req, res) {
    const { query, context } = req.body;

    if (!query || !context) {
        return res.status(400).json({
            error: 'Missing query or context in the request body.',
            expectedFormat: 'POST JSON body: { "query": "<search_term>", "context": { ... } }'
        });
    }

    const apiKey = 'AIzaSyDCU8hByM-4DrUqRUYnGn-3llEO78bcxq8';
    const apiUrl = 'https://www.googleapis.com/youtubei/v1/search';

    const postData = {
        query,
        context: {
            client: {
                clientName: 'TVHTML5',
                clientVersion: '7.20240701.16.00',
                hl: 'en',
                gl: 'US',
            }
        }
    };

    try {
        const response = await axios.post(apiUrl, postData, {
            headers: { 'Content-Type': 'application/json' },
            params: { key: apiKey }
        });

        console.log("Raw response data:", JSON.stringify(response.data, null, 2));

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logFilePath = path.join(logsDir, `response-${timestamp}.json`);
        fs.writeFileSync(logFilePath, JSON.stringify(response.data, null, 2));

        const processedResponse = addVideoRendererToEachItem(response.data);

        res.json(processedResponse);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch data from YouTube API.',
            details: error.message
        });
    }
}

module.exports = { handleSearchRequest };
