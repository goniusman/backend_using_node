const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "goniusman",
  api_key: "176131195836588",
  api_secret: "EhDV0ClM05vDScRE9x2QYWpezg4",
});

module.exports = cloudinary;
