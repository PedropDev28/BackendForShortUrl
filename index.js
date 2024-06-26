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
    let { data, error } = await supabase
        .from('Urls')
        .select('*')
        .eq('id', req.params.id);
    if (error) {
        res.status(500).send('Error al obtener la URL ' + error.message);
    } else {
        res.send(data);
    }
});

app.post('/urls', async (req, res) => {
    const url = req.body.url;
    const idUser = req.body.idUser;
    const shortUrl = 'acortado.vercel.app/' + Math.random().toString(36).substring(7);
    let { data, error } = await supabase
        .from('Urls')
        .insert([{ long_Url: url, short_Url: shortUrl, user: idUser }])
        .select();
    if (error) {
        res.status(500).send('Error al insertar la URL ' + error.message);
    } else {
        res.send(data);
    }
});

app.delete('/urls/:id', async (req, res) => { 
    let { data, error } = await supabase
        .from('Urls')
        .delete()
        .eq('id', req.params.id); 
    if (error) {
        res.status(500).send('Error al eliminar la URL' + error.message);
    } else {
        res.send(data);
    }
});

app.options('*', cors(corsOptions)); 

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
