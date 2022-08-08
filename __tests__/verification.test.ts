import { expect } from "@jest/globals";

import { isValidWebhookCall } from "../src/verification";

test("A valid webhook call should pass the checks", async () => {
  // Arrange
  const input = require("./data/webhook-event-valid.json");

  // Act
  const result = await isValidWebhookCall(input);

  // Assert
  expect(result).toBeTruthy();
});

test("An invalid webhook call should not pass the checks", async () => {
  // Arrange
  const input = require("./data/webhook-event-invalid.json");

  // Act
  const result = await isValidWebhookCall(input);

  // Assert
  expect(result).toBeFalsy();
});
