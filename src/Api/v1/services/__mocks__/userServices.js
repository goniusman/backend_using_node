const User = require("../../models/User");
let users = [
  {
    _id: "03423",
    name: "osman",
    email: "osman@gmail.com",
    password: "2424",
    username: "goniusman",
    role: "admin",
  }, 
  {
    _id: "03424",
    name: "anik",
    email: "anik@gmail.com",
    password: "24245",
    username: "anikhasan",
    role: "user",
  },
];

export const allUser = async ( res) => {

  return res.json({ success: true, users });
  
};


export const register = async (user) => {
  const model = new models.User(user);
  users.push(model);
  return res.status(201).json({ success: true, model });
};

export const getUserById = async (id) => {
  let model = users.find(x => x.id === id);
  return model;
}

export const update = async (user) => {
  users[0].username = user.username;
  return users[0];
}

export const deleteById = async (id) => {
  users = [];
}

// module.exports = allUser;
