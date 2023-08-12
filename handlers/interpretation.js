import OpenAIClient from '../clients/openai.js'
import YoutubeClient from '../clients/youtube.js'
import FirebaseClient from '../clients/firebase.js'
import { createMessagesFromText } from '../helpers/llm.js'

const prompt = `Please summarize the key points from the transcript by extracting the essential information, removing unnecessary details, and refraining from introducing any external sources or speculative content. Focus solely on the core ideas discussed in the text without mentioning the speaker or their beliefs.`

export const getInterpretationHandler = async (yt_id) => {
    let interpretation
    try {
        // return interpretation if it exists
        interpretation = await FirebaseClient.getInterpretation(yt_id)
        if (interpretation) {
            console.log('interpretation exists in firebase')
            return interpretation
        }

        // otherwise, generate interpretation

        const transcript = await YoutubeClient.getTranscript(yt_id)
        const messages = createMessagesFromText(transcript, prompt)
        const completion = await OpenAIClient.createChatCompletion(messages)
        const content = completion.data.choices
            .map((c) => c.message.content)
            .join(' ')
        await FirebaseClient.addInterpretation(yt_id, content)

        return {
            yt_id,
            content
        }
    } catch (error) {
        console.log(error)
        return error
    }
}
