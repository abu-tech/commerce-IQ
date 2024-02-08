import redis from 'redis'

const REDIS_PORT = 6379;
const redisClient = redis.createClient(REDIS_PORT);

redisClient.on("connect", (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Redis Connected".blue.underline);
});

export default redisClient;