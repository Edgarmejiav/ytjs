const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const youtubedl = require('youtube-dl-exec');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

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
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// Ruta para manejar la solicitud del video
app.get('/video', (req, res) => {
    // Ruta al video que deseas enviar
    const videoPath = path.join(__dirname, 'videos', 'Shawn_Mendes___There_s_Nothing_Holdin__Me_Back__Official_Music_Video_.mp4.webm');
    console.log(videoPath)
    res.sendFile(videoPath);
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
