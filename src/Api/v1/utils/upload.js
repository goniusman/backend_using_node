const multer = require("multer");

const storage = multer.diskStorage({});

// const storage = multer.diskStorage({

//   destination: function (request, file, callback) {
//     // const dir =  "./uploads";
//     const root = path.resolve('./')
//     // return;
//       callback(null, `${root}/uploads/`);
//   },
//   filename: function (request, file, callback) {
//       console.log(file);
//       callback(null, file.originalname)
//   }
// });

const fileFilter = (req, file, cb) => {
 
  if (file.mimetype.startsWith("image")) {
    // console.log(file)
   return cb(null, true);
  } else {
   return cb("invalid image file!", false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fieldSize: 10 * 1024 * 1024 },
});


module.exports = upload