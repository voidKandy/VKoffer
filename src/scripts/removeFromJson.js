import * as fs from 'fs';
import { promptUser } from '../utils/promptUser.js';

async function getUser() {
  const user = await promptUser('Enter a user: ');
  return { user };
}

async function removeFromJson(user) {
  try {
    const json_path = 'src/datas/passwords/passwords.json';
    const fileContents = fs.readFileSync(json_path, 'utf8');
    const existingData = JSON.parse(fileContents);

    const { user: userInput } = await getUser();
    const matchingEntries = existingData.filter(({ user: existingUser }) =>
      existingUser.includes(userInput)
    );
    const matchingIndexes = matchingEntries.map((_, index) => index);

    console.log(`Found ${matchingEntries.length} entries that match the user:`, userInput);
    console.log(matchingEntries);

    const confirmDelete = await promptUser('Do you want to delete these entries (Y/N)? ');
    if (confirmDelete.trim().toUpperCase() === 'Y') {
      // Remove the matching entries from the existingData array
      matchingEntries.forEach((entry) => {
        const index = existingData.indexOf(entry);
        existingData.splice(index, 1);
      });

      // Write the updated data back to the JSON file
      fs.writeFileSync(json_path, JSON.stringify(existingData, null, 2));
      console.log(`Deleted ${matchingEntries.length} entries.`);
    } else {
      console.log('Deletion cancelled.');
    }

    return matchingIndexes;
  } catch (err) {
    console.error('Error deleting data: ', err);
    return [];
  }
}

export default removeFromJson;
