const jwt = require("jsonwebtoken");
const user = require("../models/users");
const User = require("../models/users");

const auth = async (req, res, next) => {
  try {
    const token = await req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.verify(token, "thisismynewcourse");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });

    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
