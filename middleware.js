const redis = require('redis')

/*
  options: Object
    - redisClient?: RedisClient
    - host?: String
    - port?: String
    - prefix?: String
*/
module.exports = (options = {}) => {
  const redisClient =
    options.redisClient ??
    redis.createClient({
      host: options.host ?? process.env.REDIS_HOST ?? '127.0.0.1',
      port: options.port ?? process.env.REDIS_PORT ?? '6379'
    })

  /*
    @ADD-PREFIX
  
    key: String
  */
  const addPrefix = (key) => {
    const prefix = options.prefix ?? process.env.REDIS_PREFIX

    return (prefix ? prefix + '_' : '') + key
  }

  /*
    @CREATE-KEY
    
    key: String | Array:String
    withPrefix: Boolean
  */
  const keyMutation = (key, withPrefix = true) => {
    if (withPrefix) {
      if (Array.isArray(key)) {
        return key.map((key) => addPrefix(key))
      } else {
        return addPrefix(key)
      }
    } else {
      return key
    }
  }

  /*
    @GET
    
    key: String
    withPrefix?: Boolean
  */
  const get = (key, withPrefix) => {
    return new Promise((resolve, reject) => {
      redisClient.get(keyMutation(key, withPrefix), (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /*
    @SET
    
    key: String
    payload: String
    withPrefix?: Boolean
  */
  const set = (key, payload, withPrefix) => {
    redisClient.set(keyMutation(key, withPrefix), payload)
  }

  /*
    @KEYS

    key: String
    withPrefix?: Boolean
  */
  const keys = (key, withPrefix) => {
    return new Promise((resolve, reject) => {
      redisClient.keys(keyMutation(key, withPrefix), (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /*
    @DEL

    key: String | Array:String
    withPrefix?: Boolean
  */
  const del = (key, withPrefix) => {
    redisClient.del(keyMutation(key, withPrefix))
  }

  return { redisClient, keyMutation, set, get, keys, del }
}
