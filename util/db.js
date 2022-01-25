const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected')
  } catch (error) {
    console.log('DB connection FAILED! Error: ', error)
    process.exit(1)
  }

  return null
}

module.exports = { sequelize, connectToDatabase }
