import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const signup = async (req, res) => {
  try {
    const { fullname, username, password } = req.body;
    const user = await User.findOne({ username });

    if (user)
      return res.status(400).json({
        status: "fail",
        message: "User already exist!",
      });

    await User.create({ fullname, username, password });

    res.status(201).json({
      status: "success",
      message: "Thanks for signup! kindly login now",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "SOME THING WENT VERY WRONG!",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({
        status: "fail",
        message: "Please provide a valid username and password!",
      });

    const user = await User.findOne({ username });

    if (!user)
      return res.status(401).json({
        status: "fail",
        message: "Invalid username or password!",
      });

    const isPasswordValid = await user.correctPassword(password, user.password);

    console.log(isPasswordValid);

    if (!isPasswordValid)
      return res.status(401).json({
        status: "fail",
        message: "Invalid username or password!",
      });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    res.status(200).json({
      status: "success",
      message: "You have successfully logged in!",
      token,
      userId: user._id,
      fullname: user.fullname,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing your request.",
    });
  }
};

const protectRoute = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return res.status(401).json({
      status: "fail",
      message: "You are not logged! Please log in to get access!",
    });

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.userId).select("-password");

  if (!freshUser)
    return res.status(401).json({
      status: "fail",
      message: "The user belonging to this token does no longer exist",
    });

  decoded.fullname = freshUser.fullname;

  req.user = decoded;

  next();
};

export default {
  signup,
  login,
  protectRoute,
};
