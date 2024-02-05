const redis = require("redis")

module.exports = () => {

  // var HOST = process.env.REDIS_HOST || '127.0.0.1'
  // var PORT = process.env.REDIS_PORT || 6379
  // var PASS = process.env.REDIS_PASS || ""


  //   var client = redis.createClient({ 
  //       HOST,  
  //       PORT,
  //       no_ready_check: true,
  //       auth_pass: PASS, 
  //   });

  //   client.on("error", (err) => {
  //     console.log('You Should Run Redis Server!')
  //     console.log(err);
  //   })

  //   client.on('connect', () => {   
  //     global.console.log("Connected to Redis Server");
  //   })

  // const redisUrl = 'redis://127.0.0.1:6379';

  // Create a Redis client with a URL
  const client = redis.createClient({
    url: process.env.REDIS_URL,
  });
  
  // Example: Set a key-value pair
  client.set('exampleKey', 'exampleValue', (err, reply) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Reply:', reply);
    }
  
    // Close the Redis connection
    client.quit();
  });



  return client

}



