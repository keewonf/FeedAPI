const { Router } = require ("express")

const PostsController = require('../controllers/PostsController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const postsRoutes = Router()

const postsController = new PostsController()

postsRoutes.use(ensureAuthenticated)

postsRoutes.get("/index", postsController.index)
postsRoutes.post("/", postsController.create)
postsRoutes.get("/", postsController.showAll)
postsRoutes.post("/likes/:post_id", postsController.addLike)
postsRoutes.delete("/:id", postsController.delete)

module.exports = postsRoutes;