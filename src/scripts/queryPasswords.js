import * as fs from 'fs';
import { copyToClipboard } from './clipboardCopy.js';
import { promptUser } from './promptUser.js';

class Prompt {
  async select(website, data) {
    const filteredPasswords = data.filter(p => (p.website).indexOf(website) !== -1);
    if (filteredPasswords.length === 0) {
      console.log(`No passwords found for ${website}`);
      return null;
    } 
    else if (filteredPasswords.length === 1) {
      return filteredPasswords[0];
    }
    else {
      const options = filteredPasswords.map((p, i) => ({ value: p, label: `${p.user}`, site: `${p.website}`}));
      const selectedOption = await this.selectOption(`Select a user for ${website}:`, options);
      return selectedOption.value;
    }
  }

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
    return options[optionIndex];
  }
}

async function queryPasswords(website) {
  const data_json = JSON.parse(fs.readFileSync('./src/passwords/passwords.json', 'utf8'));
  const passwords = data_json.map(d => d.website);

  const prompt = new Prompt();
  const selectedPassword = await prompt.select(website, data_json);
  if (selectedPassword) {
    console.log(`Selected Password for user: ${selectedPassword.user}`)
    copyToClipboard(selectedPassword.password);
  }
}

export { queryPasswords };
