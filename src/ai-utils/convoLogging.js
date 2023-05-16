import * as fs from "fs";
// path to conversation
const json_path = 'src/datas/user_messages.json';
const repo_json_path = `src/datas/repo_messages.json`

export function loadConversation(options = {}) {
  let conversationPath = options.repo ? repo_json_path : json_path;

  if (!fs.existsSync(conversationPath)) {
    try {
      fs.writeFileSync(conversationPath, '[]');
    } catch (error) {
      console.error(error);
    }
  };

  if (options.clear) {
    fs.writeFileSync(conversationPath, '[]');
  } 

  const existingData = JSON.parse(
    fs.readFileSync(conversationPath, "utf8")
  );
  
  return existingData;
}

export function pushToConversation(content, role = null, options = {}) {
  const conversationPath = options.repo ? repo_json_path : json_path;
  let existingData = loadConversation(options);
  // console.log(existingData)
  if (role === null) {
    existingData.push(content);
  } 
  else {
    existingData.push(
      {
        role: role,
        content: content
      }
    );
  }

  fs.writeFileSync(conversationPath, JSON.stringify(existingData, null, 2));
}
