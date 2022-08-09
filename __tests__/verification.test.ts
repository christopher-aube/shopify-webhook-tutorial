/* eslint-disable @typescript-eslint/no-var-requires */

import { expect } from "@jest/globals";

import { isValidWebhookCall } from "../src/verification";

const ogEnv = JSON.parse(JSON.stringify(process.env));

beforeEach(() => {
  jest.resetModules();
  process.env = ogEnv;
});

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

test("A webhook without a has should not validate", async () => {
  // Arrange
  const input = require("./data/webhook-event-valid.json");

  delete input.headers["X-Shopify-Hmac-Sha256"];

  // Act
  const result = await isValidWebhookCall(input);

  // Assert
  expect(result).toBe(false);
});

test("Enviroment without shopify secret should not validate", async () => {
  // Arrange
  const input = require("./data/webhook-event-valid.json");

  delete process.env.SHOPIFY_SHARED_SECRET;

  // Act
  const result = await isValidWebhookCall(input);

  // Assert
  expect(result).toBeFalsy();
});
