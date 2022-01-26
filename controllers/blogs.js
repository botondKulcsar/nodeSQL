const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Blog, User } = require('../models')
const { Op } = require('sequelize')
const { sequelize } = require('../util/db')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const blogFinder = async (req, res, next) => {
  const id = parseInt(req.params.id)
  if (!isNaN(id) && id) {
    req.blog = await Blog.findByPk(id)
  }

  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    }
    // where.title = {
    //   [Op.iLike]: `%${req.query.search}%`
    // }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: sequelize.literal('likes DESC')
    // order: [
    //   ['title', 'DESC'],
    //   ['likes', 'DESC']
    // ]
  })

  return res.status(200).json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id })
  return res.status(201).json(blog)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = parseInt(req.body.likes)
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (req.decodedToken.id !== req.blog.userId) {
    return res.status(401).json({ error: 'mind your OWN blogs!' })
  }
  if (req.blog) {
    await req.blog.destroy()
    return res
      .status(204)
      .json({ message: `Blog with id ${+req.params.id} has been deleted.` })
  } else {
    res.status(404).end()
  }
})

module.exports = router
