const User = require("../models/User");
const { sendMail } = require("./SendMail");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyUser = require("../models/verifyUser");
dotenv.config();

async function InsertVerifyUser(name, email, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = generateToken(email);

    const newUser = new verifyUser({
      name: name,
      email: email,
      password: hashedPassword,
      token: token,
    });

    const activationLink = `https://guvi-mern-auth.onrender.com/signin/${token}`;
    const content = `<h4>hi,there </h4>
        <h5>Welcome to the app</h5>
        <p>Thank you for signing up click on the below link to activate</p>
        <a href="${activationLink}">Click here</a>
        <p>Regard</p>
        <p>Team</p>`;
    console.log(newUser);
    await newUser.save();
    sendMail(email, "VerifyUser", content);
  } catch (e) {
    console.log(e);
  }
}

function generateToken(email) {
  const token = jwt.sign(email, process.env.signup_Secret_Token);
  return token;
}

async function InsertSignUpUser(token) {
  try {
    const userVerify = await verifyUser.findOne({ token:token });
    if (userVerify) {
      const newUser = new User({
        name: userVerify.name,
        email: userVerify.email,
        password: userVerify.password,
        token:userVerify.token,
        forgetPassword: {},
      });
      await newUser.save();
      await userVerify.deleteOne({ token:token });
      const content = `<h4>hi,there </h4>
        <h5>Welcome to the app</h5>
        <p>you are successfully registered</p>
        <p>Regard</p>
        <p>Team</p>`;
      sendMail(newUser.email, "Registeration successfully", content);
      return `<h4>hi,there </h4>
        <h5>Welcome to the app</h5>
        <p>you are successfully registered</p>
        <p>Regard</p>
        <p>Team</p>`;
    }
    return `<h4>Link expired.... </h4>
        <p>Regard</p>
        <p>Team</p>`;
  } 
  catch (error) {
    console.log(error);
    return `<html>
        <body>
        <h4>Unexpected Error......</h4>
        <p>Regard</p>
        <p>Team</p>
        </body>
    </html>`;
  }
}

module.exports = { InsertVerifyUser, InsertSignUpUser };
