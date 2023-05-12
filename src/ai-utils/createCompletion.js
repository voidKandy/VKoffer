import { Configuration, OpenAIApi } from 'openai';
import { pushToConversation } from '../ai-utils/convoLogging.js';

const apiKey = process.env.OPEN_AI_API_KEY;

async function createCompletion(messages) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
      temperature: 0.2,
      // stream: false 
    })
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }
  
  let response = await res.json();
  response = response.choices[0].message;
  pushToConversation(response);

  return response;
};

export { createCompletion };
