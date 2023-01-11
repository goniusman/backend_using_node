const validator = require("validator");

const validate = ({title, description, category, tag }) => {
  let error = {};

  if (!title) {
    error.title = "Please Provide Your Title";
  }
  if (!description) {
    error.description = "You didn't select any Descrioption";
  }

  // if(!post.image){
  //     error.image = "Please Provide Your image"
  // }
  
  if (!category) {
    error.category = "Please Provide Your category";
  }
  if (!tag) {
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
