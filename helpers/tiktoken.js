import { get_encoding, encoding_for_model } from '@dqbd/tiktoken'

// TODO: clean up this class
export class Tiktoken {
    model
    tokensPerMessage
    tokensPerName

    constructor(model) {
        var tokensPerMessage, tokensPerName
        if (model == 'gpt-3.5-turbo' || model == 'gpt-3.5-turbo-0301') {
            tokensPerMessage = 4
            tokensPerName = -1
            model = 'gpt-3.5-turbo-0301'
        } else if (model == 'gpt-4-0314') {
            tokensPerMessage = 3
            tokensPerName = 1
        } else {
            throw new Error(
                `num_tokens_from_messages() is not implemented for model ${model}.\n` +
                    ' See https://github.com/openai/openai-python/blob/main/chatml.md for' +
                    ' information on how messages are converted to tokens.'
            )
        }

        this.tokensPerName = tokensPerName
        this.tokensPerMessage = tokensPerMessage
        this.encoding = encoding_for_model(model)

        try {
            this.encoding = encoding_for_model(model)
        } catch (err) {
            console.warn(
                'Warning: model not found. Using cl100k_base encoding.'
            )
            this.encoding = get_encoding('cl100k_base')
        }
    }

    countMessageTokens(messages) {
        var numTokens = 0
        messages.forEach((message) => {
            numTokens += this.tokensPerMessage
            Object.entries(message).forEach(([key, value]) => {
                numTokens += this.encoding.encode(value).length
                if (key == 'name') {
                    numTokens += this.tokensPerName
                }
            })
        })
        numTokens += 3 // every reply is primed with assistant
        return numTokens
    }
}

// Returns the number of tokens used by a list of messages.
// function countMessageTokens(messages, model = 'gpt-3.5-turbo-0301') {
//     var encoding
//     try {
//         encoding = encoding_for_model(model)
//     } catch (err) {
//         console.warn('Warning: model not found. Using cl100k_base encoding.')
//         encoding = get_encoding('cl100k_base')
//     }
//     var tokensPerMessage, tokensPerName
//     if (model == 'gpt-3.5-turbo') {
//         return countMessageTokens(messages, 'gpt-3.5-turbo-0301')
//     } else if (model == 'gpt-4') {
//         return countMessageTokens(messages, 'gpt-4-0314')
//     } else if (model == 'gpt-3.5-turbo-0301') {
//         tokensPerMessage = 4
//         tokensPerName = -1
//     } else if (model == 'gpt-4-0314') {
//         tokensPerMessage = 3
//         tokensPerName = 1
//     } else {
//         throw new Error(
//             `num_tokens_from_messages() is not implemented for model ${model}.\n` +
//                 ' See https://github.com/openai/openai-python/blob/main/chatml.md for' +
//                 ' information on how messages are converted to tokens.'
//         )
//     }
//     var numTokens = 0
//     messages.forEach((message) => {
//         numTokens += tokensPerMessage
//         Object.entries(message).forEach(([key, value]) => {
//             numTokens += encoding.encode(value).length
//             if (key == 'name') {
//                 numTokens += tokensPerName
//             }
//         })
//     })
//     numTokens += 3 // every reply is primed with assistant
//     return numTokens
// }
