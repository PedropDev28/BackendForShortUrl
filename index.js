const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const environment = require('./env');
const supabaseUrl = environment.supabaseUrl;
const supabaseKey = environment.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const port = 3000;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

let urls = [];
let id = 0;


app.get('/urls', async (req, res) => {
    let { data: urls, error } = await supabase
        .from('Urls')
        .select('*');
    if (error) {
        res.status(500).send('Error al obtener las URLs ' + error.message);
    } else {
        res.send(urls);
    }
});

app.get('/:id', async (req, res) => {
    try {
        const { data: urls, error } = await supabase
            .from('Urls')
            .select('long_Url')
            .eq('id', req.params.id);

        if (error) {
            throw new Error('Error al obtener la URL: ' + error.message);
        }

        if (!urls || urls.length === 0) {
            res.status(404).send('URL no encontrada');
        } else {
            res.redirect(urls[0].long_Url);
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.post('/urls', async (req, res) => {
    const url = req.body.url;
    const idUser = req.body.idUser;
    let { data: insertedUrls, error: insertError } = await supabase
        .from('Urls')
        .insert([{ long_Url: url, user: idUser }])
        .select(); 

    if (insertError) {
        res.status(500).send('Error al insertar la URL ' + insertError.message);
        return;
    }

    // Obtener el último ID insertado
    const lastInsertedId = insertedUrls[0].id;
    const shortUrl = `acortado.vercel.app/${lastInsertedId}`;

    // Actualizar la URL acortada
    let { data: updatedUrls, error: updateError } = await supabase
        .from('Urls')
        .update({ short_Url: shortUrl })
        .eq('id', lastInsertedId)
        .select();

    if (updateError) {
        res.status(500).send('Error al actualizar la URL acortada ' + updateError.message);
    } else {
        res.send(updatedUrls);
    }
});

app.delete('/:id', async (req, res) => {
    let { data: urls, error } = await supabase
        .from('urls')
        .delete()
        .eq({ id: req.params.id });
    if (error) {
        res.status(500).send('Error al eliminar la URL');
    } else {
        res.send(urls);
    }
});

app.options('*', cors(corsOptions)); // Manejar solicitudes preflight

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
