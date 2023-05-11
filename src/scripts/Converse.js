import * as fs from 'fs';
import { promptUser } from '../utils/promptUser.js';
import { Configuration, OpenAIApi } from 'openai';
import { createCompletion } from '../ai-utils/createCompletion.js';
import { loadConversation, pushToConversation } from "../utils/convoLogging.js";
import { centerPrint } from "../utils/formatPrints.js";

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

  let full_prompt = []; 

  let system_prompt;
  if (!sys_prmpt) {
    system_prompt = sys_prompts['succinct_code']
  } else {
    system_prompt = sys_prompts[sys_prmpt]
  }

  const user_prompt = {
    role: "user",
    content: response
  };

  full_prompt.push(system_prompt);
  full_prompt.push(user_prompt);

  return full_prompt;
}

async function Converse(sys_prmpt=null) {
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
    let full_prompt = await Conversation(sys_prmpt, user_response);
    let response = await createCompletion(full_prompt);
    centerPrint(`${response.content}`);
  }

}
export { Converse };

