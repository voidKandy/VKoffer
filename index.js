#! /usr/bin/env node

require = require('esm')(module);

try {
  // import the cli function from cli.js
  require('./src/cli').cli(process.argv);
} catch(error) {
  console.log(`Error: ${error.message}`)
}

