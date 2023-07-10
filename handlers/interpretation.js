import OpenAIClient from '../clients/openai.js'
import YoutubeClient from '../clients/youtube.js'
import FirebaseClient from '../clients/firebase.js'
import { createMessagesFromText } from '../helpers/llm.js'
import Promise from 'promise'
import { info as logInfo } from '../helpers/logger.js'
import { sleep } from '../helpers/utils.js'

const prompt = `Please extract the main points from the provided information, focusing on important details and omitting nonessential parts. Avoid referring to external sources or speculative content. Your task is to fully understand the crucial ideas presented and relay them in your own words, without referencing the origin or any additional context. The goal is to interpret the fundamental ideas being conveyed and restate them in a clear, succinct manner.`

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
        const chunkSize = 1
        let completions = []

        for (let i = 0; i < messages.length; i += chunkSize) {
            const chunk = messages.slice(i, i + chunkSize)
            const completionPromises = chunk.map((m) =>
                OpenAIClient.createChatCompletion([m])
            )
            const chunkCompletions = await Promise.all(completionPromises)
            completions = [...completions, ...chunkCompletions]
            sleep(5000)
        }

        return completions
    }

    console.log(messages)

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
