const mongoose = require("mongoose");
const validator = require("validator");
const user = require("./users");

const TaskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 3) {
          throw new Error("Name length is too low");
        }
      }
    },
    completed: { type: Boolean, required: false, default: false },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Tasks", TaskSchema);

module.exports = Task;
