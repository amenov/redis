const redis = require('redis');

/*
  options: Object
    - redisClient?: RedisClient
    - redisHost?: String
    - redisPort?: String
    - redisPrefix?: String
*/
module.exports = (options = {}) => {
  const redisClient =
    options.redisClient ??
    redis.createClient({
      host: options.redisHost ?? process.env.REDIS_HOST ?? '127.0.0.1',
      port: options.redisPort ?? process.env.REDIS_PORT ?? '6379',
    });

  /*
    @ADD-PREFIX
  
    key: String
  */
  const addPrefix = (key) => {
    const prefix = options.redisPrefix ?? process.env.REDIS_PREFIX;

    return (prefix ? prefix + '_' : '') + key;
  };

  /*
    @CREATE-KEY
    
    key: String | Array:String
    withPrefix: Boolean
  */
  const createKey = (key, withPrefix = true) => {
    if (withPrefix) {
      if (Array.isArray(key)) {
        return key.map((key) => addPrefix(key));
      } else {
        return addPrefix(key);
      }
    } else {
      return key;
    }
  };

  /*
    @GET
    
    key: String
    withPrefix?: Boolean
  */
  const redisGet = (key, withPrefix) => {
    return new Promise((resolve, reject) => {
      redisClient.get(createKey(key, withPrefix), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  /*
    @SET
    
    key: String
    payload: String
    withPrefix?: Boolean
  */
  const redisSet = (key, payload, withPrefix) => {
    redisClient.set(createKey(key, withPrefix), payload);
  };

  /*
    @KEYS

    key: String
    withPrefix?: Boolean
  */
  const redisKeys = (key, withPrefix) => {
    return new Promise((resolve, reject) => {
      redisClient.keys(createKey(key, withPrefix), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  /*
    @DEL

    key: String | Array:String
    withPrefix?: Boolean
  */
  const redisDel = (key, withPrefix) => {
    redisClient.del(createKey(key, withPrefix));
  };

  return {
    redisClient,
    createKey,
    redisSet,
    redisGet,
    redisKeys,
    redisDel,
  };
};
