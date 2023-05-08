import * as fs from 'fs';
import { promptUser } from '../utils/promptUser.js'

async function getNewDatas() {
  const service = await promptUser('Enter a service: ');
  const id = await promptUser('Enter an identifier: ');
  const key = await promptUser('Enter key: ');
  
  return {service, id, key};
};


async function writeToKeys(service, id, key) {

  try {
    const json_path = ('src/datas/passwords/keys.json');

    let existingData = [];

    if (fs.existsSync(json_path)) {
      const fileContents = fs.readFileSync(json_path, 'utf8');
      existingData = JSON.parse(fileContents);
    } else {
      fs.writeFileSync(json_path, '[]', 'utf8');
    }

    const newData = await getNewDatas();
    existingData.push({ ...newData });

    fs.writeFileSync(json_path, JSON.stringify(existingData, null, 2), 'utf8');
    console.log('Data appended to file successfully');
  } catch (err) {
    console.error('Error appending data to file: ', err);
  }
}

export default writeToKeys; 

