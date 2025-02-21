import { SourceMapConsumer } from 'source-map'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const form = formidable()
    
    const [fields, files] = await form.parse(req)
    const sourceMapFile = files.sourceMap?.[0]
    const line = parseInt(fields.line?.[0] || '')
    const column = parseInt(fields.column?.[0] || '')

    if (!sourceMapFile || isNaN(line) || isNaN(column)) {
      return res.status(400).json({ message: 'Invalid input' })
    }

    const rawSourceMap = JSON.parse(fs.readFileSync(sourceMapFile.filepath, 'utf8'))
    const consumer = await new SourceMapConsumer(rawSourceMap)

    const mappedLocation = consumer.originalPositionFor({
      line,
      column
    })

    consumer.destroy()

    return res.status(200).json(mappedLocation)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
} 