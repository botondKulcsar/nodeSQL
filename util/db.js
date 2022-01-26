const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const migrationConfig = {
  migrations: { glob: 'migrations/*js' },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  loggger: console
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConfig)
  const migrations = await migrator.up()

  console.log('Migrations up to date', {
    files: migrations.map(mig => mig.name)
  })
}

const rollbackMigrations = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConfig)
  const migrations = await migrator.down()
  console.log('Migrations rolled back', {
    files: migrations.map(mig => mig.name)
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()

    await runMigrations()

    console.log('Database connected')
  } catch (error) {
    console.log('DB connection FAILED! Error: ', error)
    process.exit(1)
  }

  return null
}

module.exports = { sequelize, connectToDatabase, rollbackMigrations }
