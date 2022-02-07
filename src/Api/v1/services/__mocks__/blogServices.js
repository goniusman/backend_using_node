const User = require("../../models/User");


let blog = [
  {
    _id: "03423",
    title: "osman",
    description: "osman@gmail.com",
    category: "2424",
    tag: "goniusman",
    author: "admin",
    isPublished: "admin",
  }, 
  {
    _id: "03424",
    title: "osman",
    description: "osman@gmail.com",
    category: "2424",
    tag: "goniusman",
    author: "admin",
    isPublished: "admin",
  },
];

export const allUser = async ( res) => {

  return res.json({ success: true, users });
  
};


export const register = async (user, res) => {
  const model = new User(user);
  users.push(model);
  return res.status(201).json({ success: true, user: model });
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
