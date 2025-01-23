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
