const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const { fetchGuideData } = require('./guide_api'); 
const { fetchBrowseData } = require('./browse_api'); 
const { handleSearchRequest } = require('./search_api'); 

const app = express();
const port = 8090;


app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.originalUrl}`);
    next(); 
});

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

app.use(express.json());


app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.use('/logs', express.static(path.join(__dirname, '../logs')));

app.get('/', (req, res) => {
    console.log('Received request for the root endpoint');
    res.sendFile(path.join(__dirname, '../index.html'));
});


app.get('/get-thumbnail', async (req, res) => {
    const videoId = req.query.videoId;

    if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required.' });
    }

    const youtubeThumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    try {
        res.json({ thumbnailUrl: youtubeThumbnailUrl });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch thumbnail.' });
    }
});


app.get('/web/*', (req, res) => {
    const requestedUrl = req.params[0];  

    const urlStartIndex = requestedUrl.indexOf('http');
    const youtubeUrl = requestedUrl.substring(urlStartIndex);  
    const fileName = path.basename(youtubeUrl);

    console.log(`Redirecting to asset: /assets/${fileName}`);

    return res.redirect(`/assets/${fileName}`);
});


app.get('/gen_204', async (req, res) => {
    try {
        const youtubeUrl = 'https://www.youtube-nocookie.com/gen_204?app_anon_id=a8d9033a-9d84-4178-a37f-8bf49003bc66&firstactive=1456804800&prevactive=1456804800&firstactivegeo=US&loginstate=0&firstlogin=0&prevlogin=0&c=TVHTML5&cver=5.20150715&ctheme=CLASSIC&label=c96c1c11';

        const response = await axios.get(youtubeUrl);

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error forwarding request to YouTube:', error);
        res.status(200).json({ status: 'Failed to fetch data from YouTube' });
    }
});


app.get('/device_204', async (req, res) => {
    try {
        const youtubeUrl = 'https://www.youtube-nocookie.com/device_204?app_anon_id=a8d9033a-9d84-4178-a37f-8bf49003bc66&firstactive=1456804800&prevactive=1456804800&firstactivegeo=US&loginstate=0&firstlogin=0&prevlogin=0&c=TVHTML5&cver=5.20150715&ctheme=CLASSIC&label=c96c1c11';

        const response = await axios.get(youtubeUrl);

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error forwarding request to YouTube:', error);
        res.status(200).json({ status: 'Failed to fetch data from YouTube' });
    }
});

app.get('/api/browse', async (req, res) => {
    const { browseId } = req.query;  

    if (!browseId) {
        return res.status(400).json({
            error: 'Missing browseId parameter in the request.'
        });
    }

    try {
        const browseData = await fetchBrowseData(browseId);  
        res.json(browseData);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            error: error.message
        });
    }
});

app.post('/api/browse', async (req, res) => {
    const { browseId } = req.body; 

    if (!browseId) {
        return res.status(400).json({
            error: 'Missing browseId parameter in the request body.'
        });
    }

    try {
        const browseData = await fetchBrowseData(browseId);
        res.json(browseData);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            error: error.message
        });
    }
});


async function handleGuideRequest(req, res) {
    console.log(`Received ${req.method} request for /api/guide`);

    try {
        const guideData = await fetchGuideData();
        res.json(guideData);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            error: error.message
        });
    }
}


app.get('/api/guide', handleGuideRequest);
app.post('/api/guide', handleGuideRequest);


app.post('/api/search', handleSearchRequest);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
