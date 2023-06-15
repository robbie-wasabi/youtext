import YoutubeClient from '../clients/youtube.js'

export const getTranscriptHandler = async (id) => {
    try {
        const res = await YoutubeClient.getTranscript(id)
        return res
    } catch (error) {
        return error
    }
}
