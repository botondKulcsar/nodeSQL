const Blog = require('./blog')
const User = require('./user')
const ReadingLists = require('./reading_lists')
const Session = require('./session')

Blog.belongsTo(User)
User.hasMany(Blog)

Session.belongsTo(User)
User.hasOne(Session)

User.belongsToMany(Blog, { through: ReadingLists, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingLists, as: 'users_marked' })

module.exports = {
  Blog,
  User,
  ReadingLists,
  Session
}
