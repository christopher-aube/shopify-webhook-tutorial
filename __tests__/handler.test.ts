import {
  expect,
  jest,
} from "@jest/globals";

import { createHmac } from "crypto";
import { handler } from "../src/handler";
import { loadEvent } from "../src/persistence";
import { EventProps } from "../src/types";

import {
  FunctionContextMock,
  FunctionEventMock,
} from "./__mocks__";

const contextMock = new FunctionContextMock(x => x);

beforeEach(() => {
  jest.restoreAllMocks();
});

test("Handler should return corresponding payload", async () => {
  // Arrange
  const succeed = jest.spyOn(contextMock, "succeed");
  const fail = jest.spyOn(contextMock, "fail");
  const input = require("./data/webhook-event-valid.json");

  // Act
  const result = await handler(input, contextMock);

  // Assert
  expect(result.getStatus()).toEqual(200);
  expect(fail).toHaveBeenCalledTimes(0);
  expect(succeed).toHaveBeenCalledTimes(1);
  expect(succeed).toHaveBeenCalledWith(
    expect.objectContaining({
      id: "1234567890123456111",
    }),
  );
});

test("Handler should invalidate on hash mismatch", async () => {
  // Arrange
  const succeed = jest.spyOn(contextMock, "succeed");
  const fail = jest.spyOn(contextMock, "fail");
  const input = require("./data/webhook-event-invalid.json");

  // Act
  const result = await handler(input, contextMock);

  // Assert
  expect(result.getStatus()).toEqual(400);
  expect(fail).toHaveBeenCalledTimes(0);
  expect(succeed).toHaveBeenCalledTimes(1);
  expect(succeed).toHaveBeenCalledWith(null);
});

test("Load test the handler with a storm of concurrent events", async () => {
  // Arrange
  const entityId = "some-unique-entity-id";
  const itemCount = 1024;

  // Act
  const getHmac = (data: { entityId: string, serial: number }) => {
    if (!process.env.SHOPIFY_SHARED_SECRET) {
      return '';
    }

    return createHmac("sha256", process.env.SHOPIFY_SHARED_SECRET)
      .update(JSON.stringify(data))
      .digest('base64')
      .toString();
  }

  const dosSelf = () => {
    let serial = 0;
    const calls: Array<any> = [];

    while (serial < itemCount) {
      serial++;

      const body = {
        entityId,
        serial,
      };
      const headers = {
        "X-Shopify-Hmac-Sha256": getHmac(body),
      };
      const mockEvent = new FunctionEventMock({
        headers,
        body,
      });

      calls.push(handler(mockEvent, contextMock));
    }

    return calls;
  }

  await Promise.all(dosSelf());

  // Assert
  const lastKnownEvent = await loadEvent(entityId);
    
  if (!lastKnownEvent || !lastKnownEvent.body) {
    expect(lastKnownEvent).toBeDefined();
    expect(lastKnownEvent).not.toBeNull();
    return;
  }

  if (!lastKnownEvent.body) {
    expect(lastKnownEvent.body).toBeDefined();
    expect(lastKnownEvent.body).not.toBeNull();
    return;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventBody: EventProps = lastKnownEvent.body;
  expect(eventBody.entityId).toEqual(entityId);
  expect(eventBody.serial).toEqual(itemCount);
});
