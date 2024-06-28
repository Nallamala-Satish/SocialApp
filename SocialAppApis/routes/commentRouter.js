const express = require('express');
const { AddComment, DeleteComment, GetCommentsByPost, UpdateComment } = require('../controller/commentController');
const { VerifyToken } = require('../controller/authController')
const router = express.Router()

router.route("/add").post(AddComment)
router.route("/delete/:id").delete(DeleteComment)
router.route("/get/:id").get(GetCommentsByPost)
router.route("/update/:id").put(UpdateComment)

module.exports= router;