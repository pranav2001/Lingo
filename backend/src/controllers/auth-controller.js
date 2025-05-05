import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import _ from "lodash";

import { validationResult } from "express-validator";
import { uploadImage } from "../utils/cloudinaryConfig.js";

const authCtrl = {};

authCtrl.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Validation Error", error: errors.array() });
  }
  const { fullName, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });
    const accessToken = generateToken(newUser._id);
    const userData = _.pick(newUser, ["_id", "email", "fullName"]);
    res.status(201).json({
      userData,
      message: "Succesfully registered account",
      accessToken,
    });
  } catch (error) {
    console.log("Error in signup", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

authCtrl.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Validation Error", error: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const accessToken = generateToken(user._id);
    console.log("token", accessToken);
    const userData = _.pick(user, [
      "_id",
      "email",
      "fullName",
      "profilePic",
      "createdAt",
    ]);
    res
      .status(201)
      .json({ userData, message: "Succesfully logged in", accessToken });
  } catch (error) {
    console.log("Error in login", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

authCtrl.updateProfile = async (req, res) => {
  delete req.body.fullName;
  delete req.body.email;
  const profilePath = req.file?.path;
  try {
    const foundUser = await User.findById(req.currentUser.userId);
    console.log("Found User publicId", foundUser.profilePic.publicId);
    let profileUploadResponse;
    if (profilePath) {
      profileUploadResponse = await uploadImage(
        profilePath,
        "profilePic",
        foundUser.profilePic.publicId
      );
    }
    console.log("ProfilePic upload response", profileUploadResponse);
    const updatedUser = await User.findByIdAndUpdate(
      foundUser._id,
      {
        $set: {
          profilePic: {
            url: profileUploadResponse?.url,
            publicId: profileUploadResponse?.publicId,
          },
        },
      },
      { new: true, runValidators: true }
    ).select("-password");
    console.log("Updated User", updatedUser);
    res.status(200).json({ message: "Succesfully updated", updatedUser });
  } catch (error) {
    console.log("Error in update profile controller", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

authCtrl.profile = async (req, res) => {
  try {
    const user = await User.findById(req.currentUser.userId).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in profile controller", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default authCtrl;
