"use strict";

import {
  AsyncHandler,
  IFunctionContext,
  IFunctionEvent,
} from "./types";

import { publishEvent } from "./notification";
import { saveEvent } from "./persistence";
import { isValidWebhookCall } from "./verification";

export const handler: AsyncHandler<unknown, IFunctionContext> = async (
  event: IFunctionEvent<unknown>,
  context: IFunctionContext,
) => {
  if (!isValidWebhookCall(event)) {
    const headersJson = JSON.stringify(event.headers, null, 2);
    console.warn(`The following event could not be verified: ${headersJson}`);
    return context
      .status(404)
      .succeed(null);
  }

  await saveEvent(event);

  const { EVENT_TOPIC: topic } = process.env;
  await publishEvent(event, topic);

  const eventBody = JSON.parse(JSON.stringify(event.body));
  const result = {
    ...eventBody,
    message: "OK",
  };
  return context
    .status(200)
    .succeed(result);
};
