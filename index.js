const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
import { createClient } from '@supabase/supabase-js'
import { environment } from './env.js';
const supabaseUrl = environment.supabaseUrl;
const supabaseKey = environment.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey);

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

app.get('/urls', async (req, res) => {
    let { data: urls, error } = await supabase
        .from('urls')
        .select('*');
    if (error) {
        res.status(500).send('Error al obtener las URLs');
    } else {
        res.send(urls);
    }
});

app.get('/:id', async (req, res) => {
    let { data, error } = await supabase
        .from('urls')
        .select('*')
        .eq({ id: req.params.id });
    if (error) {
        res.status(500).send('Error al obtener la URL');
    } else {
        res.send(data);
    }
});

app.post('/urls', async (req, res) => {
    const url = req.body.url;
    const idUser = req.body.idUser;
    const shortUrl = 'acortado.vercel.app/' + id;
    if(!idUser) {
        let { data, error } = await supabase
            .from('urls')
            .insert([{ long_Url: url, short_Url: shortUrl}]);
        if (error) {
            res.status(500).send('Error al insertar la URL');
        } else {
            res.send(data);
        }
    }else{
        let { data, error } = await supabase
            .from('urls')
            .insert([{ long_Url: url, short_Url: shortUrl, user: idUser}]);
        if (error) {
            res.status(500).send('Error al insertar la URL');
        } else {
            res.send(data);
        }
    }
});

app.delete('/:id', async (req, res) => {
    let { data, error } = await supabase
        .from('urls')
        .delete()
        .eq({ id: req.params.id });
    if (error) {
        res.status(500).send('Error al eliminar la URL');
    } else {
        res.send(data);
    }
});

app.options('*', cors(corsOptions)); // Manejar solicitudes preflight

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
