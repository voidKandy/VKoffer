import { query } from './scripts/query.js';
import { load_csv } from './scripts/csvToJson.js';
import writeToKeys from './scripts/writeToKeys.js';
import writeToJson from './scripts/writeToJson.js';
import removeFromJson from './scripts/removeFromJson.js';
import { promptUser } from './scripts/promptUser.js';


function parseArguments(args) {
  args.splice(0, 2);
  // console.log(args);
  const operation = {
    command: args[0],
    arg: undefined
  };
  if (args.length > 1) {
    console.log(args[1])
    operation.arg = args[1];
  }
  return operation
}

export function cli(args) {
  const operation = parseArguments(args); 
  
  // Query passwords
  if (operation.command === 'q') {
    query(operation.arg);
  }
  // Import password.csv
  else if (operation.command === 'import') {
    load_csv(operation.arg);
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
  // console.log(operation);
}

