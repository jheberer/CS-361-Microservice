const express = require('express');
const app = express();
const port = 8080;

// axios can be used to call the wiktimedia API
const axios = require('axios')

// parsoid can be used to parse the data received from wikimedia
// documentation here: https://github.com/wikimedia/parsoid-jsapi
const parsoid = require('parsoid-jsapi')

app.listen(port, () => {
    console.log(`API is hosted at URL: http://localhost:${port}`);
  });

app.get('/', (req, res) => {
    res.send('This is the root page. Please follow the published documentation to use this API.')
});

app.get('/word/:word', async (req, res) => {
    const word = req.params.word;

    const axios_response = await axios.get(`https://en.wiktionary.org/w/api.php`, {
      params: {
        action: 'query',
        format: 'json',
        titles: word,
        prop: 'revisions',
        rvprop: 'content',
      },
    });

    const axios_data = axios_response.data;

    const pdoc = await parsoid.parse({ src: axios_data, contentmodel: 'wikitext' });

    res.send(pdoc.document.outerHTML)

    // console.log(pdoc.document.outerHTML)

    // res.send(yield pdoc.toWikitext());

});