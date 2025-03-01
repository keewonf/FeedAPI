const { Router } = require("express")

const usersRouter = require("./users.routes")
const postsRouter = require("./posts.routes")
const commentsRouter = require("./comments.routes")
const tagsRouter = require('./tags.routes')
const sessionsRouter = require("./sessions.routes")

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/posts', postsRouter)
routes.use('/comments', commentsRouter)
routes.use('/tags', tagsRouter)

module.exports = routes