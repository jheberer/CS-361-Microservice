# Word definition microservice
This microservice will provide the part of speech and common language definition of a provided word.

## Using this microservice
This microservice is implemented as RESTful API.

### Requesting data
Make an call to the endpoint defined as follows:

> GET https://hebererj-cs361-ms-d18cbed0dc46.herokuapp.com/word/:word

Where "word" is a parameter containing the desired word definition. Please note that this should be in lowercase.

Example (using axios library in JS):
'''
const word_microservice = "https://hebererj-cs361-ms-d18cbed0dc46.herokuapp.com/word/knife"

// note there are many means of making endpoint calls with Javascript, so choose according to your own comfort
const response = await axios.get(word_microservice);
'''

### Receiving data
If successful, the calling application will receive a status code of 200, and a JSON file formatted as follows:
'''
{
  "word":"knife",
  "language of origin":"English",
  "part of speech":"Noun",
  "common definition":"A utensil or a tool designed for cutting, consisting of a flat piece of hard material, usually steel or other metal (the blade), usually sharpened on one edge, attached to a handle. The blade may be pointed for piercing."
}
'''

If there was an error--for example, if a non-word is submitted as a parameter--then the API will send a 404 status along with a text message indicating as such.
