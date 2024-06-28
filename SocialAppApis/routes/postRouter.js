const express = require("express");
const { getPosts, AddPost, UpdatePost, DeletePost, getPostById, getPostUser, LikePost } = require("../controller/postController");
const { VerifyToken } = require('../controller/authController');
const upload = require("../middleware/upload");
const router = express.Router();

router.route("/getPosts").get(getPosts);
router.route("/getPost/:id").get(getPostById)
router.route("/get/:id").get(getPostUser)
router.route("/add").post(upload.single('imageUrl'), AddPost);
router.route("/update/:id").put(UpdatePost);
router.route("/delete/:id").delete(DeletePost)
router.route("/like/:id").put(LikePost)

module.exports = router;
