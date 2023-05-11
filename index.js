#! /usr/bin/env node

require = require('esm')(module);
require('dotenv').config();

const cli = require('./src/cli.js');

try {
  // import the cli function from cli.js
  cli.cli(process.argv);
} catch(error) {
  console.log(`Error: ${error.message}`)
}

