const express = require("express");
const User = require("../models/users");
const Task = require("../models/tasks");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')

const multer = require("multer");
const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(
        new Error("Please upload an image with extention jpg, png or jpeg")
      );
    }
    cb(undefined, true);
  }
});

router.post("/users", async (req, res) => {

  try {
    const user = await new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    //sendWelcomeEmail(user.email, user.name);

    res.status(200).send({ user, token });
  } catch (error) {
    res.status(500).send();
  }
});


router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(valid =>
    allowedUpdates.includes(valid)
  );
  if (!isValidOperation) {
    return res.status(400).send();
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//delete user route not deleting users currently
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    Task.deleteMany({ creator: req.user._id });
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  "/users/me/avatar",
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
