const express = require("express");
const { request } = require("express");
const app = express();
require("./db/mongoose");
const Task = require("./models/tasks");
const User = require("./models/users");
const userRouter = require("./routers/userRoute");
const taskRouter = require("./routers/taskRoute");
const e = require("express");

const port = process.env.PORT;

//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

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("get request are disabled");
//   } else {
//     next();
//   }
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("server running");
});
