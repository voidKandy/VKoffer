import * as fs from 'fs';
import { copyToClipboard } from '../utils/clipboardCopy.js';
import { promptUser } from '../utils/promptUser.js';



class Prompt {
  async select(keyName, json_data) {

  // console.log(Object.entries(json_data[0]));
  // console.log((Object.entries(json_data[0])[0][1]));
  // console.log(keyName);
    
  const filteredData = json_data.filter(data => ((Object.entries(data)[0][1]).toLowerCase()).includes(keyName.toLowerCase()));
    if (filteredData.length === 0) {
      console.log(`No passwords found for ${keyName}`)
      return null;
    }
    else if (filteredData.length === 1) {
      return filteredData[0];
    }
    else {                                                                    
      const options = filteredData.map((data, i) => ({ value: data, label: `${data[(Object.keys(json_data[0])[1])]}` }));
      // console.log(options);
      const selectedOption = await this.selectOption(`Select one:`, options);
      return selectedOption;
    }
  };

  async selectOption(message, options) {
    console.log(message);
    for (let i = 0; i < options.length; i++) {
      console.log(`${i + 1}. ${options[i].label}`);
    }
    const answer = await promptUser(`Enter a number between 1 and ${options.length}: `);
    const optionIndex = parseInt(answer, 10) - 1;
    if (isNaN(optionIndex) || optionIndex < 0 || optionIndex >= options.length) {
      console.log(`Invalid input: ${answer}`);
      return this.selectOption(message, options);
    }
    return (options[optionIndex])['value'];
  };
};

async function queryPasswords(keyName, data=null) {
  let data_json;
  if (data === 'k') {
    data_json = JSON.parse(fs.readFileSync('src/datas/passwords/keys.json', 'utf8'));
  } else {
    data_json = JSON.parse(fs.readFileSync('src/datas/passwords/passwords.json', 'utf8'));
  }
  const prompt = new Prompt();
  const selectedPassword = await prompt.select(keyName, data_json);
  if (selectedPassword) {
    console.log(`Selected Password for: ${selectedPassword[Object.keys(data_json[0])[1]]}`);
    copyToClipboard(selectedPassword[Object.keys(data_json[0])[2]]);
  }
};

export { queryPasswords };
