// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate");

// Your Google Cloud Platform project ID
const projectId = process.env.GOOGLE_PROJECT_ID;

// Instantiates a client
const _translate = new Translate({
  projectId: projectId
});

// Translate text into target language
module.exports = function(text, target) {
  return _translate
    .translate(text, target)
    .then(results => {
      var translation = results[0];
      return translation;
    })
    .catch(err => {
      return "";
      // console.error("ERROR:", err);
    });
};
