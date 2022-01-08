module.exports = {
  serverError(res, error) {
    // console.log(error);
    return res.status(500).json({
      error: error,
      message: "Server Error Occurred",
    });
  },

  resourceError(res, message) {
    return res.json({ success: false, message: message });
    // return res.status(400).json({
    //   message,
    // });
  },
};
