import { YoutubeTranscript } from 'youtube-transcript'
import fs from 'fs'

export default class YoutubeClient {
    static _formatTranscriptData = (data) => {
        let transcript = data.map((t) => t.text).join()
        transcript = transcript.replaceAll(',', ', ')
        return transcript
    }

    static _fetchTranscript = async (id) => {
        const data = await YoutubeTranscript.fetchTranscript(id)
        return this._formatTranscriptData(data)
    }

    static _readMockData = (id) => {
        return fs.readFileSync(`./mockdata/${id}.txt`, 'utf8')
    }

    static fetchTranscript = async (id, useMockData = false) => {
        // if useMockData is true, read from mockdata folder
        const data = useMockData
            ? this._readMockData(id)
            : await this._fetchTranscript(id)

        return data
    }
}

export class YoutubeCommentorClient {
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
