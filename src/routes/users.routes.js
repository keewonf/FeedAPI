const { Router } = require ("express")
const multer = require('multer')
const uploadConfig = require('../configs/upload')

const UsersController = require('../controllers/UsersController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const UserUploadController = require("../controllers/UserUploadController")

const usersRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const usersController = new UsersController()
const userUploadController = new UserUploadController()

usersRoutes.get('/:id', usersController.show)
usersRoutes.post("/", usersController.create)
usersRoutes.put("/", ensureAuthenticated, usersController.update)
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userUploadController.updateAvatar)
usersRoutes.patch("/banner", ensureAuthenticated, upload.single("banner"), userUploadController.updateBanner)

module.exports = usersRoutes;