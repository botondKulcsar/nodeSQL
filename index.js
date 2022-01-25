require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3005

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: DataTypes.TEXT
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
  }
)

Blog.sync()

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll()

    console.log(JSON.stringify(blogs, null, 2))

    return res.status(200).json(blogs)
  } catch (error) {
    return res.status(500).json({ error })
  }
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    return res.status(201).json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByPk(+req.params.id)
        if (blog) {
            await blog.destroy()
            return res.status(200).json({ message: `Blog with id ${+req.params.id} has been deleted.` })
        } else {
            res.status(404).end()
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
