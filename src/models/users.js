const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./tasks");
const { sendWelcomeEmail } = require('../emails/account')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 3) {
          throw new Error("Name length is too low");
        }
      }
    },
    email: {
      type: String,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("please provide correct email");
        }
      },
      required: true,
      unique: true
    },
    password: { type: String, required: true, minlength: 7 },
    age: { type: Number, default: 0, required: true },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  { timestamps: true }
);

UserSchema.virtual("tasks", {
  ref: "Tasks",
  localField: "_id",
  foreignField: "creator"
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  delete user.avatar;
  return user;
};

UserSchema.methods.generateAuthToken = async function () {
  try {
    const user = this;
    const token = await jwt.sign(
      { _id: user._id.toString() },
      "thisismynewcourse"
    );
    user.tokens = await user.tokens.concat({ token: token });
    await user.save();
    return token;
  } catch (error) {
    return error;
  }
};

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

UserSchema.pre("remove", async function (next) {
  const user = this
  await Task.deleteMany({ creator: user._id })
  next();
});

//Hash the user password before saving
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
