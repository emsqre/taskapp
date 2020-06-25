require("../src/db/mongoose");
const User = require("../src/models/users");

//5eea25b84f1184ac5e08259b

User.findByIdAndUpdate("5eea2d8f299783bb691df42f", { age: 20 })
  .then(user => {
    console.log(user);
    return User.countDocuments({ age: 20 });
  })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });
