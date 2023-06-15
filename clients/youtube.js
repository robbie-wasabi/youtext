import { YoutubeTranscript } from 'youtube-transcript'
// import { youtube_v3 } from 'googleapis'

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

    // TODO: in progress
    // https://developers.google.com/youtube/v3/docs/commentThreads/insert
    // static createComment = async (videoId, commentText, apiKey) => {
    //     const youtube = youtube_v3({
    //         version: 'v3',
    //         auth: config.apiKey
    //     })

    //     const commentThreadData = {
    //         snippet: {
    //             channelId: '', // The channel ID of the user creating the comment
    //             videoId: videoId,
    //             topLevelComment: {
    //                 snippet: {
    //                     textOriginal: commentText
    //                 }
    //             }
    //         }
    //     }

    //     try {
    //         const response = await youtube.commentThreads.insert({
    //             part: 'snippet',
    //             requestBody: commentThreadData
    //         })

    //         console.log('Comment created:', response.data)
    //         return response.data
    //     } catch (error) {
    //         console.error('Error creating comment:', error)
    //         throw error
    //     }
    // }
}
