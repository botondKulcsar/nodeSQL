const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(
      'sessions',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          unique: 'actions_unique'
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: 'actions_unique'
        }
      },
      {
        uniqueKeys: {
          actions_unique: {
            fields: ['user_id', 'token']
          }
        }
      }
    )
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')
  }
}
