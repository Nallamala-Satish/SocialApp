const User = require("../models/UserModel");

const bcrypt = require("bcrypt");

//Get Users
const getUsers = async (req, res) => {
  try {
    User.find().then((users) => {
      res.status(200).json({
        status: true,
        message: "Users fetched Successfully.",
        data: users,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

//Get UserById
const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
      User.findById({ _id: req.params.id }).then((user) => {
        res.status(200).json({
          status: true,
          message: "User fetched Successfully.",
          data: user,
        });
      });
    } else {
      res.status(400).json({
        status: false,
        message: "User not found.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

//Update User
const UpdateUser = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }).then(
      () => {
        res.status(200).json({
          status: true,
          message: "User Updated Successfully.",
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

//Delete User
const DeleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
      User.findByIdAndDelete({ _id: req.params.id }).then(() => {
        res.status(200).json({
          status: true,
          message: "User deleted Successfully.",
        });
      });
    } else {
      res.status(400).json({
        status: false,
        message: "User not found.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

//Follow
const Follow = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const currentUser = await User.findOne({ _id: req.body.userId });

    let isFollowed = false;
    user.followers.map((item) => {
      if (item == req.body.userId) {
        isFollowed = true;
      }
    });
    if (isFollowed) {
        const res1 = await User.updateOne(
            { _id: req.params.id },
            { $pull: { followers: req.body.userId } }
          );
          const res2 = await User.updateOne(
            { _id: req.body.userId },
            { $pull: { following: req.params.id } }
          );
      res
        .status(200)
        .json({ status: false, message: "user unfollowed successfully" });
    } else {
      const res1 = await User.updateOne(
        { _id: req.params.id },
        { $push: { followers: req.body.userId } }
      );
      const res2 = await User.updateOne(
        { _id: req.body.userId },
        { $push: { following: req.params.id } }
      );
      res
        .status(200)
        .json({ status: true, message: "followed user Successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

//unFollow
const UnFollow = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        const currentUser = await User.findOne({ _id: req.body.userId });
    
        let isFollowed = false;
        user.followers.map((item) => {
          if (item == req.body.userId) {
            isFollowed = true;
          }
        });
        if (!isFollowed) {
          res
            .status(200)
            .json({ status: false, message: "You are not followed this user" });
        } else {
          const res1 = await User.updateOne(
            { _id: req.params.id },
            { $pull: { followers: req.body.userId } }
          );
          const res2 = await User.updateOne(
            { _id: req.body.userId },
            { $pull: { following: req.params.id } }
          );
          res
            .status(200)
            .json({ status: true, message: "Unfollowed user Successfully" });
        }
      } catch (err) {
        console.log(err);
        res.status(400).json(err);
      }
};

module.exports = {
  UpdateUser,
  DeleteUser,
  getUsers,
  getUserById,
  Follow,
  UnFollow,
};
