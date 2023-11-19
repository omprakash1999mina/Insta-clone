const Redis = require('ioredis');
const redisUrl = process.env.REDIS_URL

class RedisServices{
    static createClient(){
        return new Redis(redisUrl);
    }
}

module.exports = RedisServices;