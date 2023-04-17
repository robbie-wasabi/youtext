import cfg from "../config.js";
import { createChatCompletion } from "./openai.js";

// some thoughts
// maybe we upload each summary to ipfs

function splitText(text, maxLength = 8192) {
  let currentLength = 0;
  let currentChunk = [];
  let startIndex = 0;
  const chunks = [];

  // remove brackets and content inside. for example, [music] or [applause]
  text = text.replace(/\[.*?\]/g, "");

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

  const pushChunk = (joinedChunk, separator) => {
    chunks.push({
      text: joinedChunk,
      start: startIndex,
      end: startIndex + joinedChunk.length - 1,
    });
    startIndex += joinedChunk.length + separator.length;
  };

  if (text.includes("\n")) {
    if (currentLength + paragraph.length + 1 <= maxLength) {
      currentChunk.push(paragraph);
      currentLength += paragraph.length + 1;
    } else {
      chunks.push(currentChunk.join("\n"));
      currentChunk = [paragraph];
      currentLength = paragraph.length + 1;
    }
  } else {
    const separatedText = splitTextBySpace(text);
    for (const word of separatedText) {
      if (currentLength + word.length + 1 <= maxLength) {
        currentChunk.push(word);
        currentLength += word.length + 1;
      } else {
        pushChunk(currentChunk.join(" "), " ");
        currentChunk = [word];
        currentLength = word.length + 1;
      }
    }
  }

  if (currentChunk.length > 0) {
    pushChunk(
      currentChunk.join(text.includes("\n") ? "\n" : " "),
      text.includes("\n") ? "\n" : " "
    );
  }

  return chunks;
}

function createMessage(chunk, prompt) {
  return {
    role: "user",
    content: `"""${chunk}""" ${prompt}`,
  };
}

// use openai api to transform text
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
    console.log(
      `Chunk ${i + 1} / ${chunks.length} length: ${chunk.text.length}`
    );
  }

  for (const [i, chunk] of chunks.entries()) {
    console.log(`Transforming chunk ${i + 1} / ${chunks.length}`);
    const messages = [createMessage(chunk.text, prompt)];

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
  const prefix = "From the text above, ";
  return `${prefix}${prompt}`;
};

async function getTopics(text) {
  const prompt = createPrompt(
    `create a list of the main topics. Omit any topics that refer to the text, discussion, or transcript itself.`
  );
  return await transform(text, prompt);
}

async function getSummary(text) {
  const prompt = createPrompt(`write a summary`);
  return await transform(text, prompt);
}

export { getTopics, getSummary };
