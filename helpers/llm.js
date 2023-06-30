import nlp from 'compromise'
import { Tiktoken } from './tiktoken.js'

function createMessage(chunk, prompt) {
    return {
        role: 'user',
        content: `"""${chunk}""" ${prompt}`
    }
}

// Split text into chunks of a maximum length
export function splitText(
    text,
    maxLength = 3000, // TODO: I think that they actually made the token limit larger...
    model = 'gpt-3.5-turbo',
    question = ''
) {
    // flatted paragraphs
    var flattenedParagraphs = text.split('\n').join(' ')

    // TODO:
    // parse sententces... this isn't reliable
    // var sentences = nlp(flattenedParagraphs).sentences().out('array')
    var sentences = []

    // split the text into sentences without splitting the sentences themselves (easier said that done)
    // the youtube transcriber has a tendency to prefer commas or periods. our best bet for now is to split on the
    // punctuation that is most prevalent.
    if (sentences.length <= 1 && text.length > maxLength) {
        var numPeriods = (flattenedParagraphs.match(/\./g) || []).length
        var numCommas = (flattenedParagraphs.match(/,/g) || []).length
        if (numPeriods > numCommas) {
            sentences = flattenedParagraphs.split(',')
        } else {
            sentences = flattenedParagraphs.split('.')
        }

        sentences = sentences.map((s) => s.replace(/[^\w\s]/g, ''))
    }

    var chunks = []
    var currentChunk = []

    const tiktoken = new Tiktoken(model)
    sentences.forEach((s) => {
        s = s.trim()
        var messageWithAdditionalSentence = [
            createMessage(currentChunk.join(' ') + ' ' + s, question)
        ]

        var expectedTokenUsage =
            tiktoken.countMessageTokens(messageWithAdditionalSentence, model) +
            1
        console.log(expectedTokenUsage)
        if (expectedTokenUsage <= maxLength) {
            currentChunk.push(s)
        } else {
            chunks.push(currentChunk.join(' '))
            currentChunk = [s]
            var messageThisSentenceOnly = [
                createMessage(currentChunk.join(' '), question)
            ]

            expectedTokenUsage =
                tiktoken.countMessageTokens(messageThisSentenceOnly, model) + 1
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
    var chunks = splitText(text)
    // console.log(chunks)
    return createMessagesFromChunks(chunks, question)
}
