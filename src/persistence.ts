"use strict";

import { nanoid } from "nanoid";

import {
  exists as redisExists,
  get as redisGet,
  set as redisSet,
} from "./redis";
import { IFunctionEvent } from "./types";

/**
 * This function stores an event object into an underlying persistence engine
 * (typically an in-memory database). After the function is executed
 * successfully, the event provided as argument will be persisted in the
 * database under a unique key which is returned by the function.
 *
 * Keep in mind that by "unique key" we mean that the database will only contain
 * a value associated to such key. This function **DOES NOT** check previous
 * existence of such key, meaning that this function can be used to make updates
 * to a pre-existing record.
 *
 * @param event An event received by the handler function, which will be
 * persisted in the underlying database.
 * @param [key] The indexing key under which the event will be persisted. If
 * this is not provided, the function will generate a random unique key.
 * @returns the indexing key associated to the persisted event
 */
export const saveEvent: (
  event: IFunctionEvent,
  key?: string,
) => Promise<string> = async (event, key = nanoid()) => {
  const value = Buffer
    .from(JSON.stringify(event))
    .toString("base64");
  await redisSet(key, value);
  return key;
};

/**
 * This function looks for a persisted event associated to an input key, and
 * returns such event if it exists. If the record does not exist, it returns
 * `null`.
 *
 * @param key The indexing key to use to retrieve the persisted record
 * @returns the persisted record for the associated key, or `null` if there is
 * no record associated to such key
 */
export const loadEvent: (key: string) => Promise<IFunctionEvent> = async (key) => {
  const recordExists = await redisExists(key);
  if (recordExists === 0) {
    // The record does not exist in the database, so we return nil
    return null;
  }

  const value = await redisGet(key);
  const event = Buffer.from(value, "base64").toString();
  return JSON.parse(event);
};
