import { getTranscript } from "../transcript";
import mockTranscript from "../../mock_data/transcript_short.json";

describe("Transcript Service", () => {
  it("should return a transcript", async () => {
    const transcript = await getTranscript("hiDRFTVH0rY");
    expect(transcript).toEqual(mockTranscript.text);
  });
});
