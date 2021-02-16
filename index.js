const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: process.env.REDIS_PORT ?? '6379',
});

const redisPrefix = process.env.REDIS_PREFIX ?? '';

const redisGet = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(redisPrefix + key, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const redisSet = (key, payload) => {
  redisClient.set(redisPrefix + key, payload);
};

module.exports = { redisGet, redisSet, redisClient };
