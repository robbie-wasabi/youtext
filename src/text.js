import cfg from "./config.js";
import { createChatCompletion } from "./openai.js";

// todo: if only one chunk, text is split into two chunks for some reason and first chunk is empty
function splitText(text, maxLength = 8192) {
  const paragraphs = text.trim().split("\n");
  let currentLength = 0;
  let currentChunk = [];
  const chunks = [];

  for (const paragraph of paragraphs) {
    if (currentLength + paragraph.length + 1 <= maxLength) {
      currentChunk.push(paragraph);
      currentLength += paragraph.length + 1;
    } else {
      chunks.push(currentChunk.join("\n"));
      currentChunk = [paragraph];
      currentLength = paragraph.length + 1;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join("\n"));
  }

  return chunks;
}

function createMessage(chunk, prompt) {
  return {
    role: "user",
    content: `"""${chunk}""" ${prompt}`,
  };
}

// use openai to transform text
async function transform(text, prompt) {
  if (!text) {
    return "Error: No text to transform";
  }

  const textLength = text.length;
  console.log(`Text length: ${textLength} characters`);

  const summaries = [];
  const chunks = Array.from(splitText(text));

  // todo: hack to remove empty chunks
  // for (let i = chunks.length - 1; i >= 0; i--) {
  //   if (chunks[i].length === 0) {
  //     chunks.splice(i, 1);
  //   }
  // }

  for (const [i, chunk] of chunks.entries()) {
    console.log(`Transforming chunk ${i + 1} / ${chunks.length}`);
    const messages = [createMessage(chunk, prompt)];

    const summary = await createChatCompletion(messages, prompt);

    summaries.push(summary);
  }

  console.log(`Transformed ${chunks.length} chunks.`);

  const combinedSummary = summaries.join("\n");
  const messages = [createMessage(combinedSummary, prompt)];

  const finalSummary = await createChatCompletion(messages, prompt);

  return finalSummary;
}

const createPrompt = (prompt) => {
  const prefix = "In the above text, ";
  return `${prefix}${prompt}`;
};

async function getTopics(text) {
  const prompt = createPrompt(
    `create a numbered list of the main topics. Omit any topics that refer to the text, discussion, or transcript itself.`
  );
  return await transform(text, prompt);
}

async function getSummary(text) {
  const prompt = createPrompt(`write a summary`);
  return await transform(text, prompt);
}

export { getTopics, getSummary };
