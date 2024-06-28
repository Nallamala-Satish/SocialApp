const User = require("../models/UserModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register
const Register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      emailId: req.body.emailId,
      mobile: req.body.mobile,
      gender: req.body.gender,
      password: hashedPassword,
    });

    const oldEmail = await User.findOne({ emailId: req.body.emailId });
    const oldMobile = await User.findOne({ mobile: req.body.mobile });
    if (oldEmail) {
      return res.status(500).send("Email Already Exist. Please Login");
    } else if (oldMobile) {
      return res.status(500).send("Mobile number Already Exist. Please Login");
    }

    await newUser.save();
    res.status(200).json({
      status: true,
      message: "Registration Successfully.",
      data: newUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

//Login
const Login = async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    !user &&
      res.status(400).json({ status: false, message: "User not found." });
    if (user) {
      const token = jwt.sign(
        { user_id: user._id, emailId: req.body.emailId },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );
      const userObject = user.toObject();
      userObject.token = token;

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validPassword) {
        res.status(200).json({
          status: true,
          message: "Login Successfully.",
          data: userObject,
        });
      } else {
        res.status(400).json({ status: false, message: "Wrong Password." });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const VerifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .send({ message: "A token is required for authentication" });
  }

  try {
    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ message: "Invalid Token" });
  }
  return next();
};



module.exports = {
  Register,
  Login,
  VerifyToken,
};
