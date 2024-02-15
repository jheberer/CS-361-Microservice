const express = require('express');
const app = express();
const port = 8080;

// axios can be used to call the wiktimedia API
const axios = require('axios')

// I haven't figured ou thow to use parsoid, wikimedia's official parser,
// so I'll just get the data as HTML and use an HTML parser to get the relevant
// info
const cheerio = require('cheerio')

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
        action: 'parse',
        format: 'json',
        page: word
        // prop: 'extracts'
      }
    });
    
    // console.log(axios_response.data)

    const axios_html = axios_response.data.parse.text['*'];

    // const $ = cheerio.load(axios_html);

    // const etymology_data = $('#Etymology');

    // if (etymology_data.length > 0) {
    //     const etymology_content = etymology_data.html();
    //     res.send(etymology_content)
    // } else {
    //     console.error('Element with id "Etymology" not found.');
    // }

    res.send(axios_html)
});