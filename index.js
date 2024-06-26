const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = 3000;


app.use(bodyParser.json(), cors());

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
    const shortUrl = 'http://localhost:3000/' + id;
    urls.push({ id: id++, url, shortUrl });
    res.send(urls);
});


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});