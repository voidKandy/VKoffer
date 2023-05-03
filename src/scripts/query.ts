import * as readline from 'readline';
import * as fs from 'fs';

interface PromptOption {
  value: any;
  label: string;
}

class Prompt {
  private rl: readline.ReadLine;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  public async select(website: string, data: Password[]): Promise<Password> {
    const filteredPasswords = data.filter(p => p.website === website);
    if (filteredPasswords.length === 0) {
      console.log(`No passwords found for ${website}`);
      return null;
    } 
    else if (filteredPasswords.length === 1) {
      return filteredPasswords[0];
    }
    else {
      const options = filteredPasswords.map((p, i) => ({ value: p, label: `${i+1}. ${p.user}`}));
      const selectedPassword = await this.selectOption(`Select a password for ${website}:`, options);
      return selectedPassword.value;
    }
  }

  private async selectOption<T>(message: string, options: PromptOption<T>[]): Promise<PromptOption<T>> {
    console.log(message);
    for (let i = 0; i < options.length; i++) {
      console.log(`${i + 1}. ${options[i].label}`);
    }
    const answer = await this.question(`Enter a number between 1 and ${options.length}: `);
    const optionIndex = parseInt(answer, 10) - 1;
    if (isNaN(optionIndex) || optionIndex < 0 || optionIndex >= options.length) {
      console.log(`Invalid input: ${answer}`);
      return this.selectOption(message, options);
    }
    return options[optionIndex];
  }

  public async question(message: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(message, (answer) => {
        resolve(answer);
      });
    });
  }

  public close(): void {
    this.rl.close();
  }
}     

async function main() {
  const prompt = new Prompt();
  const data_json = JSON.parse(fs.readFileSync('./src/passwords/passwords.json', 'utf8'));
  const passwords = data_json.map(d => d.website);

  console.log(passwords);
  
  const website = await prompt.question('Enter a website: ');
  const selectedPassword = await prompt.select(website, data_json);
  if (selectedPassword) {
    console.log(`Website: ${selectedPassword.website}`);
    console.log(`Username: ${selectedPassword.user}`);
    console.log(`Password: ${selectedPassword.password}`);
  }
  prompt.close();
}
main().catch((err) => {
  console.error(err);
});
