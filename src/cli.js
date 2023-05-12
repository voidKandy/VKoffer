import { queryPasswords } from './scripts/queryPasswords.js';
import { load_csv } from './scripts/csvToJson.js';
import writeToKeys from './scripts/writeToKeys.js';
import writeToJson from './scripts/writeToJson.js';
import removeFromJson from './scripts/removeFromJson.js';
import { Converse } from './scripts/Converse.js';

function parseArguments(args) {
  args.splice(0, 2);
  
  const operation = {
    command: args[0],
    arg1: args[1] || undefined,
    arg2: args[2] || undefined
  };
 
  return operation
}

export function cli(args) {
  const operation = parseArguments(args); 
  
  // query passwords 
  if (operation.command === 'q') {
    queryPasswords(operation.arg1, operation.arg2);
  }
  // query keys
  if (operation.command === 'k') {
    queryPasswords(operation.arg1, "k");
  }
  // Import password.csv
  else if (operation.command === 'import') {
    load_csv(operation.arg1);
  }
  // Manually add data to json
  else if (operation.command === 'add') {
    writeToJson();
  }
  // Manually remove data by user
  else if (operation.command === 'remove') {
    removeFromJson();
  }
  // Add to special keys json
  else if (operation.command === '+key') {
    writeToKeys(); 
  }
  // start conversation
  else if (operation.command === 'convo') {
    Converse(operation.arg1);
  }
  // console.log(operation);
}

