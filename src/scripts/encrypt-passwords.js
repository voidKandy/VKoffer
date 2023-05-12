import { encrypt, decrypt } from '../utils/crypto.js';
import { readJson, writeJson } from '../scripts/writeToJson.js';

const json_path = 'src/datas/passwords/passwords.json';

const encrypted_data = [];

readJson(json_path).map((dict) => {
  const encrypted_p = encrypt(dict['password'])
  dict['password'] = encrypted_p
  encrypted_data.push(dict);
});

writeJson(json_path, encrypted_data);
  
