import { Configuration, OpenAIApi } from "openai";
import config from "../config.js";

const configuration = new Configuration({
  apiKey: config.openaiApiKey,
});
const openai = new OpenAIApi(configuration);

const model = "gpt-3.5-turbo";

export const createChatCompletion = async (messages) => {
  if (!configuration.apiKey) {
    throw new Error("OpenAI API key is required");
  }

  try {
    const completion = await openai.createChatCompletion({
      model,
      messages,
    });
    return completion.data.choices[0].message.content;
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return error.response.data;
    } else {
      return {
        error: {
          message: "An error occurred during your request.",
        },
      };
    }
  }
};
