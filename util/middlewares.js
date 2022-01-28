const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const Session = require('../models/session')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(authorization.substring(7), SECRET)
      // check if token is in the DB
      const session = await Session.findOne({
        where: {
          userId: decodedToken.id
        }
      })
      if (!session) {
        return res
          .status(401)
          .json({ error: 'No active session found. Please login!' })
      }

      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  tokenExtractor
}
