const Comment = require("../models/CommentModel");

// add comment
const AddComment = async (req, res) => {
  try {
    const newComment = new Comment({
      comment: req.body.comment,
      userId: req.body.userId,
      postId: req.body.postId,
      username: req.body.username,
    });
    await newComment.save();
    res
      .status(200)
      .json({ status: true, message: "Comment added successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
};

//Delete Comment
const DeleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    if (comment) {
      await Comment.findOneAndDelete({ _id: req.params.id })
        .then(() => {
          res
            .status(200)
            .json({ status: true, message: "Comment deleted Successfully" });
        })
        .catch((err) => {
          res.status(201).json(err);
        });
    } else {
      res.status(201).json({ status: false, message: "no Comments found" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

// Get All Comments By posy
const GetCommentsByPost = async (req, res) => {
  try {
    Comment.find({ postId: req.params.id }).then((comments) => {
      res.status(200).json({
        status: true,
        message: "comments fetched successfully",
        data: comments,
      });
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

//update Comment
const UpdateComment= async(req,res)=>{
    try{
       Comment.findByIdAndUpdate({_id:req.params.id},{$set:req.body})
       .then(()=>{
        res.status(200).json({
            status:true,
            message:"comment updated successfully"
        })
       }).catch((err)=>{
        res.status(400).json(err);
       })
    }catch (err) {
    res.status(400).json(err);
  }
}


module.exports = {
  AddComment,
  DeleteComment,
  GetCommentsByPost,
  UpdateComment
};
