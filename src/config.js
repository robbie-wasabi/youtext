import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  openaiApiKey: process.env.OPENAI_API_KEY,
  fastLlmModel: process.env.FAST_LLM_MODEL || "text-davinci-003",
};

export default config;
