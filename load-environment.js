const dotenv = require("dotenv");

function loadEnvironment() {
  try {
    dotenv.config();
  } catch (err) {}
  // The .env file may not be found in production environment. It really depends
  // on how an eventual infrastructure is set up.
}

module.exports = loadEnvironment;
