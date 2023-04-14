import { Configuration, OpenAIApi } from "openai";
import config from "./config.js";

const configuration = new Configuration({
  apiKey: config.openaiApiKey,
});
const openai = new OpenAIApi(configuration);

const model = "gpt-3.5-turbo";
const temperature = 0.6;

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
    return error;
    // if (error.response) {
    //   console.error(error.response.status, error.response.data);
    //   return eror
    //   res.status(error.response.status).json(error.response.data);
    // } else {
    //   console.error(`Error with OpenAI API request: ${error.message}`);
    //   res.status(500).json({
    //     error: {
    //       message: "An error occurred during your request.",
    //     },
    //   });
    // }
  }
};
