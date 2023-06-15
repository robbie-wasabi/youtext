import YoutubeClient from '../clients/youtube.js'

export const getTranscriptHandler = async (id) => {
    return await YoutubeClient.getTranscript(id)
}
