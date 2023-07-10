import OpenAIClient from '../clients/openai.js'
import YoutubeClient from '../clients/youtube.js'
import FirebaseClient from '../clients/firebase.js'
import { createMessagesFromText } from '../helpers/llm.js'
import Promise from 'promise'
import { info as logInfo } from '../helpers/logger.js'

// TODO: this prompt is *okay* but it could be a lot better
// an ideal prompt satisfies the following:
// 1. strictly avoid references to the content itself (e.g. "in this video", "in the transcript", "in this clip") as
//    the user is already aware of the content and it is redundant to mention it.
// 2. sparingly refer to the speaker. although referring to the speaker is sometimes necessary, again, the user
//    probably already knows who the speaker is.
// 3. strictly avoid restating the prompt in the output.
const prompt = `From the provided content, extract key points as standalone facts or ideas. Present these key points in a coherent, fluent narrative without making references to any speaker or dialogue. The resulting narrative should maintain a smooth flow in the format of a short paper with each sentence delivering significant insights from the content. Make sure to be succinct and comprehensive but also thorough`

export const getInterpretationHandler = async (
    ytId,
    override = false,
    postComment = false,
    useMockData = false
) => {
    const info = (message) => {
        logInfo(ytId, message)
    }

    // return interpretation if it exists in fb
    if (!useMockData) {
        const interpretation = await FirebaseClient.getInterpretation(ytId)
        if (interpretation) {
            info(`found interpretation`)
            return interpretation
        }
    }

    info(`creating interpretation`)

    info(`fetching transcript`)
    const transcript = await YoutubeClient.fetchTranscript(ytId, useMockData)

    info(`parsing transcript`)
    const messages = createMessagesFromText(transcript, prompt)

    // TODO: doesn't seem like we can add multiple user messages in a single request...
    async function createCompletions(messages) {
        const completionsPromises = messages.map((m) =>
            OpenAIClient.createChatCompletion([m])
        )
        return Promise.all(completionsPromises)
    }

    info(`creating completions`)
    const completions = await createCompletions(messages)
    if (completions.length == 0) {
        throw new Error('ChatGPT returned no completions')
    }

    // map completions to a single interpretation
    const content = completions.map((c) =>
        c.data.choices.map((c) => c.message.content).join(' ')
    )

    info(`saving interpretation to firebase`)
    await FirebaseClient.addInterpretation(ytId, content)

    // if (postComment) {
    //     // TODO: automatically create comment on youtube video.
    // }

    info(`finished creating interpretation for ${ytId}`)

    return {
        id: ytId,
        content
    }
}
