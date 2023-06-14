import { YoutubeTranscript } from 'youtube-transcript'

export default class YoutubeClient {
    static formatTranscriptData = (data) => {
        let transcript = data.map((t) => t.text).join()
        transcript = transcript.replaceAll(',', ', ')
        return transcript
    }

    static getTranscript = async (id) => {
        const data = await YoutubeTranscript.fetchTranscript(id)
        return this.formatTranscriptData(data)
    }
}
