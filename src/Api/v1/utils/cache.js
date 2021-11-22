const redis = require("redis")


module.exports = () => {
  const redisPort = 6379
  const client = redis.createClient(redisPort);

  client.on("error", (err) => {
    console.log('You Should Run Redis Server!')
    console.log(err);
  })


  return client
}



