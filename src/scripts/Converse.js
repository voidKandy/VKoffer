import * as fs from 'fs';
import { promptUser } from '../utils/promptUser.js';
import { Configuration, OpenAIApi } from 'openai';
import { createCompletion } from '../ai-utils/createCompletion.js';
import { loadConversation, pushToConversation } from "../ai-utils/convoLogging.js";
import { centerPrint } from "../utils/formatPrints.js";
import { exec } from 'child_process';

const system_prompts_path = 'src/ai-utils/system_prompts.json';
const sys_prompts = JSON.parse(
  fs.readFileSync(system_prompts_path, "utf8")
);


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

async function Conversation(sys_prmpt=null, response) {

  return user_prompt;
}

async function Converse(sys_prmpt=null) {
  

  let system_prompt;
  if (!sys_prmpt) {
    system_prompt = sys_prompts['succinct_code']
  } else {
    system_prompt = sys_prompts[sys_prmpt]
  }

  // passing true to start fresh
  loadConversation(true);
  pushToConversation(system_prompt);

  console.clear();
  console.log("\n\n");
  centerPrint("+------------------------------+");
  centerPrint("| LANGUAGE INTERFACE INITIATED |");
  centerPrint("+------------------------------+");
  console.log("\n\n");

  let conversationActive = true;

  while (conversationActive) {
    let user_response = await promptUser("");
    if (user_response.toLowerCase() === "bye") {
      conversationActive = false;
    }
    // Make terminal commands from interface
    else if (user_response[0] === "!") {
      exec(user_response.substring(1, user_response.length), (error, stdout, stderr) => {
        if (error) {
          console.log(`Error: ${error.message}`);
        } 
        if (stderr) {
          console.log(`stderr: ${stderr}`);
        }
        console.log(stdout);
      });
    } 
    else {

      const user_prompt = {
        role: "user",
        content: user_response
      };

      pushToConversation(user_prompt);

      const full_convo = loadConversation();
      let response = await createCompletion(full_convo);
      centerPrint(`${response.content}`);
    }
  }

}
export { Converse };

