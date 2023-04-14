import cfg from "./config.js";
import { createChatCompletion } from "./openai.js";

function splitText(text, maxLength = 8192) {
  let currentLength = 0;
  let currentChunk = [];
  const chunks = [];

  // remove brackets and content inside. for example, [music] or [applause]
  text = text.replace(/\[.*?\]/g, "");

  // fallback to splitting by space if we can't split by newline.
  // note that this may result in splitting a sentence in half
  // todo: we should figure out a better way to split text
  const splitTextBySpace = (txt) =>
    txt.split(/(\s+)/).reduce(
      (acc, word) => {
        const last = acc.pop();
        const newString = (last + word).trim();
        if (newString.length <= maxLength) {
          return [...acc, newString];
        }
        return [...acc, last.trim(), word];
      },
      [""]
    );

  if (text.includes("\n")) {
    let paragraphs = text.trim().split("\n");

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
  } else {
    const separatedText = splitTextBySpace(text);
    for (const word of separatedText) {
      if (currentLength + word.length + 1 <= maxLength) {
        currentChunk.push(word);
        currentLength += word.length + 1;
      } else {
        chunks.push(currentChunk.join(" "));
        currentChunk = [word];
        currentLength = word.length + 1;
      }
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(text.includes("\n") ? "\n" : " "));
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

  // log lengths of each chunk
  for (const [i, chunk] of chunks.entries()) {
    console.log(`Chunk ${i + 1} / ${chunks.length} length: ${chunk.length}`);
  }

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
