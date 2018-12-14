// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate");

// Google Cloud Platform variables
if (process.env.PRIVATE_KEY && process.env.CLIENT_EMAIL) {
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const private_key = process.env.PRIVATE_KEY;
  const client_email = process.env.CLIENT_EMAIL;

  // Instantiates a client
  const _translate = new Translate({
    projectId: projectId,
    credentials: {
      private_key: private_key.replace(/\\n/g, "\n"),
      client_email: client_email
    }
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
        console.error("ERROR");
        return "";
      });
  };
}
