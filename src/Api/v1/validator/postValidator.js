const validator = require("validator");

const validate = (post) => {
  let error = {};

  if (!post.title) {
    error.title = "Please Provide Your Title";
  }
  if (!post.description) {
    error.description = "You didn't select any Descrioption";
  }

  // if(!post.image){
  //     error.image = "Please Provide Your image"
  // }
  
  if (!post.category) {
    error.category = "Please Provide Your category";
  }
  if (!post.tag) {
    error.tag = "Please Provide Your tag";
  }
  // if (!post.author) {
  //   error.author = "Please Provide Your tag";
  // }

  return {
    error,
    isValid: Object.keys(error).length === 0,
  };
};

module.exports = validate;
