"use strict";

import { publish as redisPublish } from "./redis";
import { IFunctionEvent } from "./types";

/**
 * This function publishes an input event to a targetted topic/channel via a
 * Pub/Sub semantics. This means that other entities currently subscribed to
 * such topic will receive the event _at least once_.
 *
 * At the wire level, the event object is JSON-stringified and encoded into
 * Base64.
 *
 * @param event the event to publish via Pub/Sub
 * @param topic the target Pub/Sub notification channel
 * @returns
 */
export const publishEvent: (
  event: IFunctionEvent<unknown>,
  topic: string,
) => Promise<void> = async (event, topic) => {
  const value = Buffer
    .from(JSON.stringify(event))
    .toString("base64");
  await redisPublish(topic, value);
};
