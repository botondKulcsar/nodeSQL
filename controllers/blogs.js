const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  const id = parseInt(req.params.id)
  if (!isNaN(id) && id) {
    req.blog = await Blog.findByPk(id)
  }

  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()

  // console.log(JSON.stringify(blogs, null, 2))

  return res.status(200).json(blogs)
})

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
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

router.delete('/:id', blogFinder, async (req, res) => {
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
