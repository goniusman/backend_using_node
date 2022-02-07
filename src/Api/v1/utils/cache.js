const redis = require("redis")


module.exports = () => {
  const redisPort = 6379
  const host = process.env.REDIS_HOST || "localhost"
  const client = redis.createClient({
    host: host,
    port: redisPort
  });

  client.on("error", (err) => {
    console.log('You Should Run Redis Server!')
    console.log(err);
  })


  return client
}



