const redis = require("redis")

module.exports = () => {
  const host = process.env.REDIS_HOST || 'redis'
  const redisPort = process.env.REDIS_PORT || 6379
  const client = redis.createClient({ 
    port : redisPort,
    host : host
  });

  client.on("error", (err) => {
    console.log('You Should Run Redis Server!')
    console.log(err);
  })


  return client
}



