const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const corsAnywhere = require('cors-anywhere'); 

const { fetchGuideData } = require('./guide_api'); 
const { fetchBrowseData } = require('./browse_api'); 
const { handleSearchRequest } = require('./search_api'); 
const { fetchNextData } = require('./next_api'); 
const { handleGetVideoInfo } = require('./get_video_info');

const bodyParser = require('body-parser');
const oauthRouter = require('./oauth_api_v3_api.js');

const app = express();
const port = 8090;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const server = corsAnywhere.createServer({
    originWhitelist: ['http://localhost:8090', '*', '""', ''], 
    removeHeaders: ['cookie', 'cookie2'],
    handleInitialRequest: (req, res) => {
        const origin = req.headers.origin;  

        if (origin === 'http://localhost:8090' || origin === '*') {
            res.setHeader('Access-Control-Allow-Origin', origin);  
        } else {
            res.setHeader('Access-Control-Allow-Origin', '*'); 
        }

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return true; 
        }
        return false; 
    }
});


server.listen(8070, 'localhost', () => {
    console.log('CORS Anywhere proxy running on http://localhost:8070');
});


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

oauthRouter(app);

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

app.get('/assets/:folder/*', (req, res) => {
    const folder = req.params.folder; 
    const requestedPath = req.params[0];  

    const fileName = path.basename(requestedPath);

    const redirectUrl = `/assets/${fileName}`; 
    console.log(`Redirecting from /assets/${folder}/${requestedPath} to ${redirectUrl}`);
    
    res.redirect(redirectUrl);  
});

app.get('/assets/:filename', (req, res) => {
    const filename = req.params.filename;
    
    const cleanedFilename = filename.replace(/^[a-f0-9]{8}/, '');

    console.log(`Serving file: /assets/${cleanedFilename}`);

    const filePath = path.join(__dirname, '../assets', cleanedFilename);
 
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${filePath}`);
            return res.status(404).send('File not found');
        }

        res.sendFile(filePath);
    });
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


app.get('/get_video_info', (req, res) => {
    handleGetVideoInfo(req, res);
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


app.get('/api/stats/qoe', (req, res) => {
    const qoeData = req.query; 
    console.log('QoE Data received:', qoeData);

    const { event, fmt, afmt, cpn, ei, el, docid, ns, fexp, html5, c, cver, cplayer, cbrand, cbr, cbrver, ctheme, cmodel, cnetwork, cos, cosver, cplatform, vps, cmt, afs, vfs, view, bwe, bh, vis } = qoeData;

    if (!event || !fmt || !afmt || !cpn || !ei || !docid || !ns) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const logEntry = `
    Event: ${event}, Format: ${fmt}, Audio Format: ${afmt}, CPN: ${cpn}, EI: ${ei}, EL: ${el}, DocID: ${docid}, 
    NS: ${ns}, Exp: ${fexp}, HTML5: ${html5}, C: ${c}, CVer: ${cver}, CPlayer: ${cplayer}, CBrand: ${cbrand}, 
    CBR: ${cbr}, CBRVer: ${cbrver}, CTheme: ${ctheme}, CModel: ${cmodel}, CNetwork: ${cnetwork}, COS: ${cos}, 
    COSVer: ${cosver}, CPlatform: ${cplatform}, VPS: ${vps}, CMT: ${cmt}, AFS: ${afs}, VFS: ${vfs}, View: ${view}, 
    BWE: ${bwe}, BH: ${bh}, VIS: ${vis}, Timestamp: ${new Date().toISOString()}
    \n`;

    const logFilePath = path.join(logsDir, 'qoe_report.txt');

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            return res.status(500).json({ error: 'Failed to log data' });
        }

        res.status(200).json({
            message: 'QoE data received and logged successfully',
            data: qoeData
        });
    });
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


app.post('/api/next', async (req, res) => {
    const {videoId } = req.body;

    if (typeof videoId !== 'string' || !videoId.trim()) {
        return res.status(400).json({
            error: '"videoId" is required and must be a non-empty string.'
        });
    }

    try {
        const nextData = await fetchNextData(videoId);

        res.json(nextData);
    } catch (error) {
        console.error('Error fetching next data:', error.message);

        res.status(500).json({
            error: 'Failed to fetch data from YouTube /next API.',
            details: error.message || 'No additional details available.'
        });
    }
});


app.post('/api/search', handleSearchRequest);


app.listen(port, () => {
    console.log(`Server running at http:/   /localhost:${port}`);
});
