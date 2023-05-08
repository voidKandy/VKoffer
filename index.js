#! /usr/bin/env node

require('dotenv').config();
require = require('esm')(module);

const cli = require('./src/cli.js');

try {
  // import the cli function from cli.js
  cli.cli(process.argv);
} catch(error) {
  console.log(`Error: ${error.message}`)
}

