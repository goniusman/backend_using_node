const redis = require("redis")

module.exports = () => {
<<<<<<< HEAD
  const redisPort = 6379
  const host = process.env.REDIS_HOST || "localhost"
  const client = redis.createClient({
    host: host,
    port: redisPort
=======
  const host = process.env.REDIS_HOST || 'redis'
  const redisPort = process.env.REDIS_PORT || 6379
  const client = redis.createClient({ 
    port : redisPort,
    host : host
>>>>>>> bb27d22e8326cc0653531fd4f1c39cbd9ffa25fa
  });

  client.on("error", (err) => {
    console.log('You Should Run Redis Server!')
    console.log(err);
  })


  return client
}



