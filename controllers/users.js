const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  if (!req.body.password || req.body.password.length < 4) {
    return res.status(400).json({ error: 'password missing' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds)

  const user = User.build({
    username: req.body.username,
    name: req.body.name,
    passwordHash
  })

  const savedUser = await user.save()
  const userToSendBack = savedUser.toJSON()
  delete userToSendBack.passwordHash
  res.json(userToSendBack)
})

router.put('/:username', async (req, res) => {
  if (!req.body.name || req.body.name.length < 3) {
    return res
      .status(400)
      .json({ error: 'name field missing or less than 3 chars' })
  }
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  user.name = req.body.name

  const savedUser = await user.save()
  const userToSendBack = savedUser.toJSON()
  delete userToSendBack.passwordHash
  res.json(userToSendBack)
})

module.exports = router
