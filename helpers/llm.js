import { get_encoding, encoding_for_model } from '@dqbd/tiktoken'
import nlp from 'compromise'

// Returns the number of tokens used by a list of messages.
function countMessageTokens(messages, model = 'gpt-3.5-turbo-0301') {
    var encoding
    try {
        encoding = encoding_for_model(model)
    } catch (err) {
        console.warn('Warning: model not found. Using cl100k_base encoding.')
        encoding = get_encoding('cl100k_base')
    }
    var tokensPerMessage, tokensPerName
    if (model == 'gpt-3.5-turbo') {
        return countMessageTokens(messages, 'gpt-3.5-turbo-0301')
    } else if (model == 'gpt-4') {
        return countMessageTokens(messages, 'gpt-4-0314')
    } else if (model == 'gpt-3.5-turbo-0301') {
        tokensPerMessage = 4
        tokensPerName = -1
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
    var numTokens = 0
    messages.forEach((message) => {
        numTokens += tokensPerMessage
        Object.entries(message).forEach(([key, value]) => {
            numTokens += encoding.encode(value).length
            if (key == 'name') {
                numTokens += tokensPerName
            }
        })
    })
    numTokens += 3 // every reply is primed with assistant
    return numTokens
}

function createMessage(chunk, prompt) {
    return {
        role: 'user',
        content: `"""${chunk}""" ${prompt}`
    }
}

// Split text into chunks of a maximum length
export function splitText(
    text,
    maxLength = 3000,
    model = 'gpt-3.5-turbo',
    question = ''
) {
    // Flatten paragraphs
    var flattenedParagraphs = text.split('\n').join(' ')

    // Use the compromise library to split the text into sentences
    var sentences = nlp(flattenedParagraphs).sentences().out('array')
    // console.log(sentences)

    var chunks = []
    var currentChunk = []

    sentences.forEach((sentence) => {
        sentence = sentence.trim()
        var messageWithAdditionalSentence = [
            createMessage(currentChunk.join(' ') + ' ' + sentence, question)
        ]

        var expectedTokenUsage =
            countMessageTokens(messageWithAdditionalSentence, model) + 1
        if (expectedTokenUsage <= maxLength) {
            currentChunk.push(sentence)
        } else {
            chunks.push(currentChunk.join(' '))
            currentChunk = [sentence]
            var messageThisSentenceOnly = [
                createMessage(currentChunk.join(' '), question)
            ]

            expectedTokenUsage =
                countMessageTokens(messageThisSentenceOnly, model) + 1
            if (expectedTokenUsage > maxLength) {
                throw new Error(
                    'Sentence is too long in webpage: ' +
                        expectedTokenUsage +
                        ' tokens.'
                )
            }
        }
    })

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '))
    }

    return chunks
}

function createMessagesFromChunks(chunks, question = '') {
    return chunks.map((chunk) => createMessage(chunk, question))
}

export function createMessagesFromText(
    text,
    question = '',
    maxLength = 3000,
    model = 'gpt-3.5-turbo'
) {
    var chunks = splitText(text, maxLength, model, question)
    // console.log(chunks)
    return createMessagesFromChunks(chunks, question)
}
