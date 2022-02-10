var config = {
  production: {
    mongo : {
      billing: '****'
    }
  },
  default: {
    mongo : {
      billing: '****'
    }
  }
}

exports.get = function get(env) {
  return config[env] || config.default;
}


// const config = require('./config/config.js').get(process.env.NODE_ENV);
// const dbconn = mongoose.createConnection(config.mongo.billing);
