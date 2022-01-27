const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class ReadingLists extends Model {}

ReadingLists.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
      // unique: 'uniqueTag'
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' }
      // unique: 'uniqueTag'
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'reading_lists',
    indexes: [{ unique: true, fields: ['userId', 'blogId'] }]
  }
)

module.exports = ReadingLists
