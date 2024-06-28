const express = require('express')
const {UpdateUser, DeleteUser, getUsers, getUserById, Follow, UnFollow } = require('../controller/userController')
const { VerifyToken } = require('../controller/authController')
const router = express.Router()

router.route("/update/:id").put(UpdateUser)
router.route("/delete/:id").delete(DeleteUser)
router.route("/getUsers").get(getUsers)
router.route("/getUser/:id").get(getUserById)
router.route("/follow/:id").put(Follow)
router.route("/unfollow/:id").put(UnFollow)

module.exports = router;