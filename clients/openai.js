import { Configuration, OpenAIApi } from 'openai'
import config from '../config.js'

export default class OpenAIClient {
    static _configuration = new Configuration({
        apiKey: config.openaiApiKey
    })
    static _openai = new OpenAIApi(this._configuration)
    static _model = config.openaiModel

    // [{role: "user", content: "Hello world"}]
    // https://platform.openai.com/docs/api-reference/chat
    static createChatCompletion = async (messages) => {
        return await this._openai.createChatCompletion({
            model: this._model,
            messages,
            temperature: 0.0
        })
    }
}
