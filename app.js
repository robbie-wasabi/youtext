import express from 'express'
import cfg from './config.js'
import { getTranscriptHandler } from './handlers/transcript.js'
import { getInterpretationHandler } from './handlers/interpretation.js'

const app = express()

app.get('/', async (req, res) => {
    console.log('here')
    res.send('provide a youtube video id to get transcript')
})

app.get('/health', (req, res) => {
    res.status(200).send({
        status: 'Healthy',
        timestamp: new Date().toISOString()
    })
})

app.get('/:id', async (req, res) => {
    const id = req.params.id
    if (!id) {
        res.send('must supply youtube video id')
        return
    }
    const data = await getTranscriptHandler(id)
    res.send(data)
})

app.get('/:id/interpretation', async (req, res) => {
    const id = req.params.id
    if (!id) {
        res.send('must supply youtube video id')
        return
    }

    const interpretation = await getInterpretationHandler(id)
    res.send(interpretation)
})

app.listen(cfg.port, () => {
    console.log(`Server is running at http://localhost:${cfg.port}`)
})

export { app }
