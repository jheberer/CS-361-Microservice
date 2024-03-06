const express = require('express');
const app = express();
const port = 8080;
const learner_key = '0b34b17f-674a-434f-8829-dbbd35d0c3bb';

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
      const axios_response = await axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${learner_key}`);

      // res.send(axios_html)
      const response_data = axios_response.data[0]
      const stems = response_data.meta.stems
      const etymology = response_data.et
      const short_definition = response_data.shortdef
      const synonyms = response_data.syns
      const variants = response_data.vrs
      const part_of_speech = response_data.fl

      const word_package = {
        'word': word,
        'stems': stems,
        'etymology': etymology,
        'short_definition': short_definition,
        'synonyms': synonyms,
        'variants': variants, 
        'part of speech': part_of_speech
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