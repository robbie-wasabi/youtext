import { Tiktoken } from './tiktoken.js'

function createMessage(chunk, prompt) {
    return {
        role: 'user',
        content: `"""${chunk}""" ${prompt}`
    }
}

// split the text into sentences without splitting the sentences themselves (easier said that done)
// the youtube transcriber has a tendency to prefer commas or periods. our best bet for now is to split on the
// punctuation that is most prevalent.
function parseSentences(text) {
    var sentences = []
    const numPeriods = (text.match(/\./g) || []).length
    const numCommas = (text.match(/,/g) || []).length
    if (numPeriods > numCommas) {
        sentences = text.split(',')
    } else {
        sentences = text.split('.')
    }

    return sentences.map((s) => s.replace(/[^\w\s]/g, ''))
}

// Split text into chunks of a maximum length
export function splitText(
    text,
    maxChunkTokenSize = 7000, // TODO: I think that they actually made the token limit larger...
    model = 'gpt-4',
    question = ''
) {
    var sentences = []
    if (text.length < maxChunkTokenSize) {
        sentences = [text]
    } else {
        sentences = parseSentences(text)
    }

    const tiktoken = new Tiktoken(model)

    var chunks = []
    var currentChunk = []
    sentences.forEach((s) => {
        s = s.trim()
        var messageWithAdditionalSentence = [
            createMessage(currentChunk.join(' ') + ' ' + s, question)
        ]

        var expectedTokenUsage =
            tiktoken.countMessageTokens(messageWithAdditionalSentence, model) +
            1
        console.log(expectedTokenUsage)
        if (expectedTokenUsage <= maxChunkTokenSize) {
            currentChunk.push(s)
        } else {
            chunks.push(currentChunk.join(' '))
            currentChunk = [s]
            var messageThisSentenceOnly = [
                createMessage(currentChunk.join(' '), question)
            ]

            expectedTokenUsage =
                tiktoken.countMessageTokens(messageThisSentenceOnly, model) + 1
            if (expectedTokenUsage > maxChunkTokenSize) {
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
    maxLength = 7000,
    model = 'gpt-4'
) {
    var chunks = splitText(text)

    console.log(chunks)
    return createMessagesFromChunks(chunks, question)
}
