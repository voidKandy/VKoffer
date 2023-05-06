import * as fs from 'fs';

function csv_to_json(csv_path, json_path) {
  
  const csv_content = fs.readFileSync(csv_path, 'utf8');

  const lines = csv_content.split('\n').map(line => line.trim());

  const fields = lines.map(line => line.split(',').map(field => field.trim())).slice(1);

  const data = [];

  fields.forEach(field => {
    const website = field[1];
    const username = field[2];
    const password = field[3];

    if (website && username && password) {
      data.push({
        website: website,
        user: username,
        password: password
      });
    }
  });

  fs.writeFileSync(json_path, JSON.stringify(data, null, 2));
  
  console.log(`-------------------------------------------------------------------------------------------------------------------\nWrote file from ${csv_path} to ${json_path}\n-------------------------------------------------------------------------------------------------------------------`)

}

function load_csv(passwords_csv) {

  if (passwords_csv === undefined) {
    console.error('Please provide a path to your passwords.csv file.\nUsage: vk_pass load_csv -- path/to/csv\n')
    return;
 }

  const passwords_json = './src/passwords/passwords.json'

  csv_to_json(passwords_csv, passwords_json);
}


export { load_csv };

