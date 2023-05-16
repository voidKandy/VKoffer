import { createCompletion } from '../ai-utils/createCompletion.js';
import { queryEmbeddings } from "./queryEmbeddings.js";
import { loadConversation, pushToConversation } from "../ai-utils/convoLogging.js";

export const repoChat = async (user_prompt) => {
  const contextText = await queryEmbeddings(user_prompt.content);
  const system_prompt = `
    You are VKOFFER, an AI assistant working entirely in the command line,
    Given the following sections from the current working directory
    answer any questions the user may have regarding this content.
    Answer in the least amount of words possible
    `
  const repoPrompt = `${system_prompt.replace(/\n/g, " ")}Sections:${JSON.stringify(contextText)}`

  pushToConversation(repoPrompt, "system", {repo: true});
  pushToConversation(user_prompt.content, "user", {repo: true});
}
