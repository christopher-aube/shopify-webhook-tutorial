import {
  expect,
  jest,
} from "@jest/globals";

import { handler } from "../src/handler";
import { loadEvent } from "../src/persistence";

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

test("Load test the handler with a storm of concurrent events", async () => {
  // Arrange
  const entityId = "some-unique-entity-id";
  const itemCount = 1024;

  // Act
  const calls = Array(itemCount)
    .map((i) => {
      const body = JSON.stringify({
        entityId,
        serial: i + 1,
      });
      return new FunctionEventMock({
        body,
      });
    })
    .map((input) => handler(input, contextMock));
  await Promise.all(calls);
  console.log('calls', calls.length);
  // Assert
  const lastKnownEvent = await loadEvent(entityId);
    console.log('lastKnownEvent', lastKnownEvent);
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
  const eventBody: any = JSON.parse(lastKnownEvent.body.toString());
  expect(eventBody.entityId).toEqual(entityId);
  expect(eventBody.serial).toEqual(itemCount);
});
