const { Router } = require ("express")

const CommentsController = require("../controllers/CommentsController")
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const commentsRoutes = Router()
const commentsController = new CommentsController()

commentsRoutes.use(ensureAuthenticated)

commentsRoutes.post("/:post_id", commentsController.create)
commentsRoutes.post("/likes/:comment_id", commentsController.addLike)
commentsRoutes.delete("/:id", commentsController.delete)
commentsRoutes.get('/:id', commentsController.show)
commentsRoutes.patch('/:id', commentsController.updateComment)
module.exports = commentsRoutes