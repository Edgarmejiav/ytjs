const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const youtubedl = require('youtube-dl-exec');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/videos', express.static(path.join(__dirname, 'videos')));

app.get('/download', (req, res) => {
    res.send('GET request to the homepage')

    // youtubedl(videoURL, { dumpSingleJson: true }).then(info => {
    //     const title = info.title.replace(/[^a-zA-Z0-9]/g, '_');
    //     const output = path.join(__dirname, 'videos', `${title}.mp4`);
    //
    //     youtubedl(videoURL, {
    //         output: output,
    //         // format: 'bestvideo+bestaudio'
    //         format: 'worst'
    //     }).then(() => {
    //         res.json({ success: true, title: title });
    //     }).catch(err => {
    //         console.error('Error durante la descarga:', err);
    //         res.status(500).json({ success: false, message: 'Error durante la descarga' });
    //     });
    // }).catch(err => {
    //     console.error('Error al obtener la información del video:', err);
    //     res.status(500).json({ success: false, message: 'Error al obtener la información del video' });
    // });
});

app.get('/video', (req, res) => {
    const name = req.query.name; // Obtén el nombre del video desde la consulta (?name=nombre)
    if (!name) {
        return res.status(400).send('Nombre del video no especificado');
    }

    const videoPath = path.join(__dirname, 'videos', name+".mp4");

    console.log(videoPath)
    res.sendFile(videoPath, (err) => {
        if (err) {
            console.error('Error al enviar el video:', err.message);
            res.status(err.status).end();
        } else {
            console.log(`Video enviado correctamente: ${videoPath}`);
        }
    });
});
app.get('/delete', (req, res) => {
    const name = req.query.name; // Obtén el nombre del video desde la consulta (?name=nombre)
    if (!name) {
        return res.status(400).send('Nombre del video no especificado');
    }

    const videoPath = path.join(__dirname, 'videos', name + ".mp4");

    console.log(videoPath)
    fs.unlink(videoPath, (err) => {
        if (err) {
            console.error('Error al eliminar el video:', err.message);
            res.status(err.status).end();
        } else {
            console.log(`Video eliminado correctamente: ${videoPath}`);
        }
    })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
