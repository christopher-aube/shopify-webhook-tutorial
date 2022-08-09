import { expect } from '@jest/globals';

import { newRedisClient } from '../src/redis';

const ogEnv = JSON.parse(JSON.stringify(process.env));

beforeEach(() => {
  jest.resetModules();
  process.env = ogEnv;
});

test('A redis client should be created', async () => {
  // Act
  const db = newRedisClient();

  // Assert
  expect(db).toBeDefined();
});

test('A redis client should be created with default config', async () => {
  // Arrange
  delete process.env.REDIS_HOST
  delete process.env.REDIS_PORT

  // Act
  const db = newRedisClient();

  // Assert
  expect(db).toBeDefined();
});

test('A redis client should not be created with bad config', async () => {
  // Arrange
  process.env.REDIS_PORT = "this-is-not-a-port";

  try {
    // Act
    const db = newRedisClient();

    expect(db).toBeUndefined();
  } catch (err) {
    // Assert
    expect(err).toBeDefined();

    if (!err || typeof err !== 'string') {
      return;
    }

    expect(err).toBe(`Unable to create redis client: port (${process.env.REDIS_PORT}) is not a number`);
  }
});