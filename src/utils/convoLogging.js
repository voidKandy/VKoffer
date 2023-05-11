
// path to conversation
const json_path = 'src/datas/user_messages.json';

export function loadConversation() {
 
  if (!fs.existsSync(json_path)) {
    try {
      fs.writeFileSync(json_path, '[]');
    } catch (error) {
      console.error(error);
    }
  };

  const existingData = JSON.parse(
    fs.readFileSync(json_path, "utf8")
  );

  return existingData;
};

export function pushToConversation(content, role=null) {
    
  const existingData = loadConversation();
  
  if (role === null) {
    existingData.push(content);
  } 
  else {
    existingData.push([
      {
        role: role,
        content: content
      }
    ]);
  }

  
  fs.writeFileSync(json_path, JSON.stringify(existingData, null, 2));

};

