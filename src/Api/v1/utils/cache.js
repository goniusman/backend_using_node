const redis = require("redis")

module.exports = () => {

  var HOST = process.env.REDIS_HOST || '127.0.0.1'
  var PORT = process.env.REDIS_PORT || 6379
  var PASS = process.env.REDIS_PASS || ""


    var client = redis.createClient({ 
        HOST,  
        PORT,
        no_ready_check: true,
        auth_pass: PASS, 
    });

    client.on("error", (err) => {
      console.log('You Should Run Redis Server!')
      console.log(err);
    })

    client.on('connect', () => {   
      global.console.log("Connected to Redis Server");
    })

  return client

}



