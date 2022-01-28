const router = require('express').Router()
const { tokenExtractor } = require('../util/middlewares.js')
const Session = require('../models/session')

router.delete('/', tokenExtractor, async (req, res) => {
  const userId = req.decodedToken.id
  const session = await Session.findOne({
    where: {
      userId
    }
  })
  if (!session) {
    return res.status(400).json({ error: 'already logged out' })
  }

  await session.destroy()

  res.status(200).json({ message: 'logout successfull' })
})

module.exports = router
