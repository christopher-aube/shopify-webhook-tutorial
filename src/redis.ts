import {
  createClient,
  RedisClient,
} from "redis";
import { promisify } from "util";

/**
 * This function creates a new Redis client pointing to the Redis server
 * indicated by the following environment setup:
 * - REDIS_HOST: address of the Redis server (default: "redis")
 * - REDIS_PORT: port of the Redis server (default: 6379)
 *
 * @returns a new instance of `RedisClient`
 */
export const newRedisClient: () => RedisClient = () => {
  const {
    REDIS_HOST: host = "redis",
    REDIS_PORT: portStr = "6379",
  } = process.env;
  const port = parseInt(portStr);
  
  if (isNaN(port)) {
    throw new Error(`Unable to create redis client: port (${portStr}) is not a number`);
  }

  return createClient({
    host,
    port,
  });
};

const redisClient = newRedisClient();

// For persistence
export const exists = <(key: string) => Promise<number>> promisify(redisClient.exists).bind(redisClient);
export const get = promisify(redisClient.get).bind(redisClient);
export const set = promisify(redisClient.set).bind(redisClient);

// For notifications
export const publish = promisify(redisClient.publish).bind(redisClient);
