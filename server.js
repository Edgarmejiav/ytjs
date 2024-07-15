const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const youtubedl = require('youtube-dl-exec');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/download', (req, res) => {
    const videoURL = req.body.url;

    if (!videoURL) {
        return res.status(400).json({ success: false, message: 'URL no proporcionada' });
    }

    youtubedl(videoURL, { dumpSingleJson: true }).then(info => {
        const title = info.title.replace(/[^a-zA-Z0-9]/g, '_');
        const output = `${title}.mp4`;

        youtubedl(videoURL, {
            output: output,
            format: 'bestvideo+bestaudio'
        }).then(() => {
            res.json({ success: true });
        }).catch(err => {
            console.error('Error durante la descarga:', err);
            res.status(500).json({ success: false, message: 'Error durante la descarga' });
        });
    }).catch(err => {
        console.error('Error al obtener la información del video:', err);
        res.status(500).json({ success: false, message: 'Error al obtener la información del video' });
    });
});
app.get('/video', (req, res) => {
    const videoPath = path.join(__dirname, 'Shawn_Mendes___There_s_Nothing_Holdin__Me_Back__Official_Music_Video_.mp4');
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if(start >= fileSize) {
            res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
            return;
        }

        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
