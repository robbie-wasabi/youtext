import * as dotenv from 'dotenv'
dotenv.config()

import { YoutubeTranscript } from "youtube-transcript";

import express from "express";
const app = express();
const port = process.env.PORT || 3000;

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
        transcript = transcript.replaceAll(',', ', ')
        res.send(transcript)
    } catch (e) {
        res.send(e);
        return;
    }
});

app.get("/", async (req, res) => {
    res.send("provide a youtube video id to get transcript")
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
