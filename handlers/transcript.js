import YoutubeClient from '../clients/youtube.js'

export const getTranscriptHandler = async (id, useMockData = false) => {
    return await YoutubeClient.fetchTranscript(id, useMockData)
}
