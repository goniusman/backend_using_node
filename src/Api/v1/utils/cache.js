const redis = require("redis")

module.exports = () => {

  var host=""
  var redisPort=""
  var redisPass=""
  if(process.env.NODE_ENV=="production"){
    host = process.env.REDIS_HOST || '127.0.0.1'
    redisPort = process.env.REDIS_PORT || 6379
    redisPass = process.env.REDIS_PASS || ""
      var client = redis.createClient({ 
        host : host,  
        no_ready_check: true,
        auth_pass: redisPass, 
        port : redisPort,
    });

    client.on("error", (err) => {
      console.log('You Should Run Redis Server!')
      console.log(err);
    })

    client.on('connect', () => {   
      global.console.log("connected to live server");
    })
  }else{
    host = process.env.REDIS_HOST || '127.0.0.1'
    redisPort = 6379
    redisPass = ""
    
      var client = redis.createClient({ 
        host : host,  
        no_ready_check: true,
        auth_pass: redisPass, 
        port : redisPort,
    });

    client.on("error", (err) => {
      console.log('You Should Run Redis Server!')
      console.log(err);
    })

    client.on('connect', () => {   
      // global.console.log("connected to local server");
    })
  }

  
 
  return client
}



