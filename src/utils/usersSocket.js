const users = [];

const addUser = (socketId, userId) => {
  const existingUser = users.find(
    (user) => user.userId === userId || user.socketId === socketId
  );

  if (existingUser) return;

  const user = { socketId, userId };

  users.push(user);

  return { user };
};

const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (socketId) => users.find((user) => user.socketId === socketId);
const showUsers = () => console.log(users);
const getAllUSers = () => users;
export { addUser, removeUser, getUser, showUsers, getAllUSers };
