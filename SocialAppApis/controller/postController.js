const Post = require("../models/PostModel");

//get all Posts
const getPosts = async (req, res) => {
  try {
    Post.find().then((users) => {
      res.status(200).json({
        status: true,
        message: "Posts fetched Successfully.",
        data: users,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// get PostById
const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (post) {
      Post.findById({ _id: req.params.id }).then((user) => {
        res.status(200).json({
          status: true,
          message: "Post fetched Successfully.",
          data: user,
        });
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Post not found.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// get Post of any User
const getPostUser = async (req, res) => {
  try {
    Post.find({ userId: req.params.id })
      .then((posts) => {
        res.status(200).json({
          status: true,
          message: "",
          data: posts,
        });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

//add Post
const AddPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    if(req.file){
        newPost.imageUrl = req.file.filename;
    }
    newPost
      .save()
      .then(() => {
        res
          .status(200)
          .json({ status: true, message: "Post added Successfully" });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

//update Post
const UpdatePost = async (req, res) => {
  try {
    Post.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
      .then(() => {
        res
          .status(200)
          .json({ status: true, message: "Post Updated Successfully" });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete Post
const DeletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (post) {
      Post.findByIdAndDelete({ _id: req.params.id }).then(() => {
        res.status(200).json({
          status: true,
          message: "Post deleted Successfully.",
        });
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Post not found.",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//Like Post
const LikePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    let isLike = false;
    post.likes.map((item) => {
      if (item == req.body.userId) {
        isLike = true;
      }
    });
    if (isLike) {
      const res1 = await Post.updateOne(
        { _id: req.params.id },
        { $pull: { likes: req.body.userId } }
      );

      res
        .status(200)
        .json({ status: true, message: "like removed Successfully" });
    } else {
      const res1 = await Post.updateOne(
        { _id: req.params.id },
        { $push: { likes: req.body.userId } }
      );

      res
        .status(200)
        .json({ status: true, message: "Post liked  Successfully" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//Delete Post

module.exports = {
  getPosts,
  getPostById,
  getPostUser,
  AddPost,
  UpdatePost,
  DeletePost,
  LikePost,
};
