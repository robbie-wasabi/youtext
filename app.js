import express from 'express'
import cfg from './config.js'
import { getTranscriptHandler } from './handlers/transcript.js'
import { getInterpretationHandler } from './handlers/interpretation.js'
import { SimpleView } from './helpers/views.js'

const app = express()

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err)
    res.status(500).send('Internal Server Error')
})

app.get('/favicon.ico', (req, res) => res.status(204))

app.get('/health', (req, res) => {
    res.status(200).send({
        status: 'Healthy',
        timestamp: new Date().toISOString()
    })
})

app.get('/:id/interpretation', async (req, res, next) => {
    try {
        const { view, useMock } = req.query
        const { id } = req.params
        if (!id) {
            throw new Error('Must supply YouTube video ID')
        }

        const interpretation = await getInterpretationHandler(
            id,
            false,
            false,
            useMock
        )
        view == '1'
            ? res.send(SimpleView(interpretation.content))
            : res.send(interpretation)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

app.get('/:id', async (req, res, next) => {
    try {
        const { view, override } = req.query
        const id = req.params.id
        if (!id) {
            throw new Error('Must supply YouTube video ID')
        }

        const transcript = await getTranscriptHandler(id)
        view == '1' ? res.send(SimpleView(transcript)) : res.send(transcript)
    } catch (error) {
        next(error)
    }
})

app.get('/', async (req, res) => {
    res.send('provide a youtube video id to get transcript')
})

app.listen(cfg.port, () => {
    console.log(`Server is running at http://localhost:${cfg.port}`)
})

export { app }
