import * as fs from 'fs';
import { promptUser } from '../utils/promptUser.js'

async function getNewDatas() {
  const website = await promptUser('Enter a website: ');
  const user = await promptUser('Enter a user: ');
  const password = await promptUser('Enter a password: ');
  
  return {website, user, password};
};


async function writeToJson(website, user, password) {

  try {
  const json_path = ('src/datas/passwords/passwords.json');

  if (!fs.existsSync(json_path)) {
    try {
      fs.writeFileSync(json_path, '{}');
    } catch (error) {
      console.error(error);
    }
  };


  const fileContents = fs.readFileSync(json_path, 'utf8');
  const existingData = JSON.parse(fileContents);

  const {website, user, password} = await getNewDatas();

  existingData.push({
    website: website,
    user: user,
    password: password
  });

  fs.writeFileSync(json_path, JSON.stringify(existingData, null, 2));

    console.log('Data appended to file successfully');
  } catch (err) {
    console.error('Error appending data to file: ', err);
  }
};

export default writeToJson ; 
