const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (req, res) => {
  const { username, password } = req.body
  if (!username || username.length < 4 || !password || password.length < 4) {
    return res.send(400).json({ error: 'missing/invalid credentials' })
  }
  const user = await User.findOne({
    where: {
      username
    }
  })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  // check for existing session in DB and delete it

  const session = await Session.findOne({
    where: {
      userId: user.id
    }
  })

  if (session) {
    await session.destroy()
  }

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 })

  await Session.create({ userId: user.id, token })

  res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
