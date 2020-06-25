require("../src/db/mongoose");
const Tasks = require("../src/models/tasks");
const Task = require("../src/models/tasks");

Task.findByIdAndDelete("5eea2c99b2365cb9b154665b", { completed: true })
  .then(task => {
    console.log(task);
    return Task.countDocuments({ completed: true });
  })
  .then(tasks => {
    console.log(tasks);
  })
  .catch(error => {
    console.log(error);
  });

const deleteTaskAndCount = async (id, completed) => {
  const task = await Task.findByIdAndDelete(id, { completed });
  const count = await Task.countDocuments({ completed });
  return count;
};

deleteTaskAndCount("5eea1585c40c9a8c5f47c68a", false)
  .then(result => console.log(result))
  .catch(e => console.log(e));
