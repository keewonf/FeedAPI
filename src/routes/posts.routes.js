const { Router } = require ("express")

const PostsController = require('../controllers/PostsController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const postsRoutes = Router()
const verifyUserAuthorization = require('../middlewares/verifyUserAuthorization.js')
const postsController = new PostsController()

postsRoutes.use(ensureAuthenticated)

postsRoutes.get("/index", postsController.index)
postsRoutes.get("/:id/comments", postsController.showPostComments)
postsRoutes.get("/", postsController.showAll)

postsRoutes.post("/",postsController.create)
postsRoutes.post("/likes/:post_id", postsController.addLike)

postsRoutes.delete("/:id", postsController.delete)

postsRoutes.patch('/:id', postsController.updatePost)
postsRoutes.patch('/:id/fix', postsController.fixPost)


module.exports = postsRoutes;