import { YoutubeTranscript } from "youtube-transcript";

const formatTranscriptData = (data) => {
  let transcript = data.map((t) => t.text).join();
  transcript = transcript.replaceAll(",", ", ");
  return transcript;
};

export const getTranscript = async (id) => {
  try {
    const data = await YoutubeTranscript.fetchTranscript(id);
    return formatTranscriptData(data);
  } catch (e) {
    return e;
  }
};
