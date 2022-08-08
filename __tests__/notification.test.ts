import { RedisClient } from "redis";
import { publishEvent } from "../src/notification";

test("A published event should be delivered to subscribers", (done) => {
  // Arrange
  const event = require("./data/test-payload.json");

  const redisClient = new RedisClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  });
  const { EVENT_TOPIC: topic } = process.env;
  redisClient.subscribe(topic);

  // Assert (asynchronous)
  redisClient.on("message", (_, message) => {
    const decodedMessage = JSON.parse(
      Buffer.from(message, "base64").toString(),
    );
    expect(decodedMessage).toEqual(event);
    done();
  });

  // Act
  publishEvent(event, topic);
});

