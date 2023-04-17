import { YoutubeTranscript } from "youtube-transcript";
import express from "express";
import { getTopics } from "./helpers/text.js";
import cfg from "./config.js";

const app = express();

app.get("/", async (req, res) => {
  res.send("provide a youtube video id to get transcript");
});

app.get("/health", (req, res) => {
  res
    .status(200)
    .send({ status: "Healthy", timestamp: new Date().toISOString() });
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.send("must supply youtube video id");
    return;
  }

  // fetch transcript from yt
  let transcript = "";
  try {
    const data = await YoutubeTranscript.fetchTranscript(id);
    transcript = data.map((t) => t.text).join();
    transcript = transcript.replaceAll(",", ", ");
    const topics = await getTopics(transcript);
    res.send(topics);
  } catch (e) {
    res.send(e);
    return;
  }
});

app.listen(cfg.port, () => {
  console.log(`Server is running at http://localhost:${cfg.port}`);
});

export { app };
