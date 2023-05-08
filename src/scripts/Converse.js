import * as fs from 'fs';
import { promptUser } from '../utils/promptUser.js';
import { Configuration, OpenAIApi } from 'openai';
import { createCompletion } from '../ai-utils/createCompletion.js';


// path to conversation
const json_path = 'src/datas/user_messages.json';

const system_prompts_path = 'src/ai-utils/system_prompts.json';
const sys_prompts = JSON.parse(
  fs.readFileSync(system_prompts_path, "utf8")
);

function loadConversation() {
 
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

function pushToConversation(content, role=null) {
    
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

async function breakIce() {
  const icebreaker_path = 'src/datas/icebreakers.txt';

  const icebreakersArray = JSON.parse(
    fs.readFileSync(icebreaker_path, "utf8")
  );
  

  for (let i = 0; i < icebreakersArray.length; i++) {
    const message = icebreakersArray[i];
    pushToConversation(message, "assistant");
    const response = await promptUser(`${message} \n`);
    pushToConversation(response, "user");
  }
};


async function Converse(sys_prmpt) {

  const system_prompt = sys_prompts[sys_prmpt]

  const init_response = await promptUser(
    "--------------------------------\n| LANGUAGE INTERFACE INITIATED |\n--------------------------------\n"
  );
  
  const request_json = {
    role: "user",
    content: init_response
  };

  system_prompt.push(request_json);

  if (init_response === "break the ice") {
    await breakIce();
  } 
  else {

    const response = await createCompletion(system_prompt);
    console.log(response.content);
    pushToConversation(system_prompt);
  }

}
export { Converse };

