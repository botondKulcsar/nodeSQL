const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('reading_lists', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        unique: 'actions_unique',
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'blogs', key: 'id' },
        unique: 'actions_unique',
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      uniqueKeys: {
        actions_unique: {
          fields: ['user_id', 'blog_id']
        }
      }
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('reading_lists')
  }
}
