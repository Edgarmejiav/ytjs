const express = require('express');
const youtubedl = require('youtube-dl-exec');
const path = require('path');

const app = express();
const PORT = 3000;


app.get('/', (req, res) => {
    res.send('Hola Mundo');
});
app.get('/hi', (req, res) => {
    res.send('hi Mundo');
})
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
