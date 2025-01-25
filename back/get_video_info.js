const fs = require('fs');
const path = require('path');
const youtubeDl = require('youtube-dl-exec');

function handleGetVideoInfo(req, res) {
    const videoId = req.query.video_id;

    if (!videoId) {
        return res.status(400).send('Video ID is required');
    }

    youtubeDl(videoId, {
        dumpSingleJson: true, 
        noWarnings: true,  
        quiet: true,         
    })
    .then(output => {

        console.log('Video Info:', output);

        const logsDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logFilePath = path.join(logsDir, `video-info-${timestamp}.json`);

        fs.writeFileSync(logFilePath, JSON.stringify(output, null, 2));
        console.log('Video info logged to file:', logFilePath);

        const adaptiveFmts = {
            video: [],
            audio: []
        };

        console.log('formats:', output.formats);

        if (output.formats && Array.isArray(output.formats)) {
            output.formats.forEach(format => {
                if (format.url && format.format_id) {
                    if (format.vcodec && format.vcodec !== 'none') {
                        let type = format.vcodec.includes('vp9') ? 'video/webm' : 'video/mp4';
                        let videoFormat = `quality_label=${encodeURIComponent(format.quality_label || '')}&lmt=${encodeURIComponent(format.lmt || '')}&type=${encodeURIComponent(type)}&url=${encodeURIComponent(format.url)}&itag=${encodeURIComponent(format.format_id)}&signature=${encodeURIComponent(format.signature || '')}`;
                        adaptiveFmts.video.push(videoFormat);
                    }
                    else if (format.container && format.container.includes('m4a_dash')) {
                        let type = 'audio/mp4';
                        let audioFormat = `quality_label=${encodeURIComponent(format.quality_label || '')}&lmt=${encodeURIComponent(format.lmt || '')}&type=${encodeURIComponent(type)}&url=${encodeURIComponent(format.url)}&itag=${encodeURIComponent(format.format_id)}&signature=${encodeURIComponent(format.signature || '')}`;
                        adaptiveFmts.audio.push(audioFormat);
                    }
                }
            });
        }

  
        if (adaptiveFmts.video.length === 0) {
            console.log('No video formats found');
            return res.status(404).send('No suitable video formats found');
        }

     
        if (adaptiveFmts.audio.length === 0) {
            console.log('No audio formats found');
            return res.status(404).send('No suitable audio formats found');
        }


        const adaptiveFmtsString = [...adaptiveFmts.video, ...adaptiveFmts.audio].join('&');
        console.log('Adaptive Formats:', adaptiveFmtsString); 

        // neeeds work!

        const videoInfo = {
            cbrver: '49.0.2623.87',
            adformat: '1_5',
            muted: '0',
            watermark: ',https://s.ytimg.com/yts/img/watermark/youtube_watermark-vflHX6b6E.png,https://s.ytimg.com/yts/img/watermark/youtube_hd_watermark-vflAzLcD6.png',
            enablecsi: '1',
            probe_url: `https://r16---sn-aigllm7l.googlevideo.com/videogoodput?id=${videoId}&source=goodput&range=0-4999&expire=1460485980&ip=207.241.226.76`,
            signature: '04525CFF07D8736C2E4207FF8D85F851CD44ACC6.6C15E4638F90FEF74C4F932342CC7383FDE6F822',
            key: 'cms1',
            ttsurl: `https://www.youtube.com/api/timedtext?v=${videoId}`,
            caption_tracks: 'n=English+%28auto-generated%29',
            vmap: `<?xml version="1.0" encoding="UTF-8"?><vmap:VMAP xmlns:vmap="http://www.iab.net/videosuite/vmap" xmlns:yt="http://youtube.com" version="1.0"></vmap:VMAP>`,      
            vmap_url: `https://www.youtube.com/vmap?video_id=${videoId}`,
            adaptive_fmts: adaptiveFmtsString 

        };

        const urlEncodedData = Object.keys(videoInfo)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(videoInfo[key])}`)
            .join('&');

        res.send(urlEncodedData);
    })
    .catch(err => {
        console.error('Error fetching video info:', err);
        res.status(500).send('Failed to fetch video info');
    });
}

module.exports = { handleGetVideoInfo };
