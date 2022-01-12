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

// module.exports = allUser;
