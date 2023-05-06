import { query } from './scripts/query.js';
import { load_csv } from './scripts/csv_to_json.js';
import writeToJson from './scripts/write_to_json.js';
import removeFromJson from './scripts/remove_from_json.js';
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

  if (operation.command === 'query') {
    query();
  }
  else if (operation.command === 'import') {
    load_csv(operation.arg);
  }
  else if (operation.command === 'upload') {
    writeToJson();
  }
  else if (operation.command === 'remove') {
    removeFromJson();
  }
  // console.log(operation);
}

