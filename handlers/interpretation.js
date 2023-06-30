import OpenAIClient from '../clients/openai.js'
import YoutubeClient from '../clients/youtube.js'
import FirebaseClient from '../clients/firebase.js'
import { createMessagesFromText } from '../helpers/llm.js'
import Promise from 'promise'
import { info as logInfo } from '../helpers/logger.js'

const prompt = `Please summarize the key points from the transcript by extracting the essential information, removing unnecessary details, and refraining from introducing any external sources or speculative content. Focus solely on the core ideas discussed in the text without mentioning the speaker(s) or their beliefs. Again, your goal is to read the transcript, understand the concepts, and reexplain them in your own words without mentioning anything else.`

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
    const interpretation = completions.map((c) =>
        c.data.choices.map((c) => c.message.content).join(' ')
    )

    info(`saving interpretation to firebase`)
    await FirebaseClient.addInterpretation(ytId, interpretation)

    // if (postComment) {
    //     // TODO: automatically create comment on youtube video.
    // }

    info(`finished creating interpretation for ${ytId}`)

    return {
        id: ytId,
        interpretation
    }
}
