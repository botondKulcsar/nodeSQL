const router = require('express').Router()
const { ReadingLists } = require('../models')
const { tokenExtractor } = require('../util/middlewares')

router.post('/', async (req, res) => {
  if (!req.body.blogId || !req.body.userId) {
    return res.status(400).json({
      error: 'userId or blogId missing'
    })
  }

  const readingList = await ReadingLists.create(req.body)
  res.status(201).json(readingList)
})

router.put('/:id', tokenExtractor, async (req, res) => {
    if (!('read' in req.body)) {
        return res.status(400).json({ error: 'bad request' })
    }

    const userId = req.decodedToken.id

    const readingList = await ReadingLists.findByPk(req.params.id)

    if (userId !== readingList.userId) {
        return res.status(400).json({ error: 'mind your OWN reading list!' })
    }

    readingList.read = req.body.read

    const savedReadingList = await readingList.save()

    res.json(savedReadingList)
})

module.exports = router
