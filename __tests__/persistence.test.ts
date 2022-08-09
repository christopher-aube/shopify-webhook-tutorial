/* eslint-disable @typescript-eslint/no-var-requires */

import { nanoid } from "nanoid";
import {
  loadEvent,
  saveEvent,
} from "../src/persistence";

test("A saved event should be available", async () => {
  // Arrange
  const event = require("./data/test-payload.json");

  // Act
  const key = await saveEvent(event);

  // Assert
  const persistedEvent = await loadEvent(key);
  expect(persistedEvent).toStrictEqual(event);
});

test("An inexistent record should return null", async () => {
  // Arrange
  const key = nanoid(); // Use some random key

  // Act
  const persistedEvent = await loadEvent(key);

  // Assert
  expect(persistedEvent).toBeNull;
});
