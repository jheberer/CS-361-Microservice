const express = require('express');
const app = express();
const port = 8080;

const heroku_port = process.env.PORT || 8080;


// axios can be used to call the wiktimedia API
const axios = require('axios')

// I haven't figured ou thow to use parsoid, wikimedia's official parser,
// so I'll just get the data as HTML and use an HTML parser to get the relevant
// info
const cheerio = require('cheerio')

app.listen(heroku_port, () => {
    console.log(`API is hosted at URL: http://localhost:${heroku_port}`);
  });

app.get('/', (req, res) => {
    res.send('This is the root page. Please follow the published documentation to use this API.')
});

app.get('/word/:word', async (req, res) => {
    const word = req.params.word;

    try {
      const axios_response = await axios.get(`https://en.wiktionary.org/api/rest_v1/page/definition/${word}`);

      // res.send(axios_html)
      const response_data = axios_response.data
      const part_of_speech = response_data.en[0].partOfSpeech
      const language = response_data.en[0].language

      // parse the definition--an HTML expression--with cheerio
      const $ = cheerio.load(response_data.en[0].definitions[0].definition);
      const definition = $.text();

      const word_package = {
        'word': word,
        'language of origin': language,
        'part of speech': part_of_speech,
        'common definition': definition
      }
      
      // res.send(response_data.en[0].definitions[0].definition)
      res.status(200).send(word_package)
  } 
  catch (error) {
    if (error.response) {
      const error_status = error.response.status;
      // 404 returns when there's no matching wiktionary page
      if (error_status === 404) {
        res.status(404).send("Error 404: Word definition not found. Please confirm this is a valid English word.")
      }
      else {
        res.status(error_status).send(`Error: ${error_status}. Please try again.`);
      }
    }
    else {
      res.status(500).send('UNKNOWN ERROR');
    }
  }
    

    
});