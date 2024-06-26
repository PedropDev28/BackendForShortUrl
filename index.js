const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

const corsOptions = {
    origin: '*', // Permitir todas las orígenes
    optionsSuccessStatus: 200 
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

let urls = [];
let id = 0;

app.get('/urls', (req, res) => {
    res.send(urls);
});

app.get('/:id', (req, res) => {
    const url = urls.find(url => url.id === parseInt(req.params.id));
    if (url) {
        res.redirect(url.url);
    } else {
        res.status(404).send('URL no encontrada');
    }
});

app.post('/urls', (req, res) => {
    const url = req.body.url;
    const shortUrl = 'acortado.vercel.app/' + id;
    urls.push({ id: id++, url, shortUrl });
    res.send(urls);
});

app.delete('/:id', (req, res) => {
    urls = urls.filter(url => url.id !== parseInt(req.params.id));
    res.send(urls);
});

app.options('*', cors(corsOptions)); // Manejar solicitudes preflight

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
