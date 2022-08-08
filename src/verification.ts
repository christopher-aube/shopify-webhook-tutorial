"use strict";

import { createHmac } from "crypto";
import { IFunctionEvent } from "./types";

/**
 * This function verifies and indicates whether an incoming HTTP call was made
 * from a valid source or not. This verification logic only applies to Shopify
 * webhook calls. For more information regarding the verification logic see the
 * official API docs:
 * https://shopify.dev/tutorials/manage-webhooks#verifying-webhooks
 *
 * @param event the incoming event sent by the associated Shopify webhook
 * @returns a boolean value indicating whether this webhook call is from a valid
 * source or not
 */
export const isValidWebhookCall = (event: IFunctionEvent<unknown>): boolean => {
  const { "X-Shopify-Hmac-SHA256": expectedHmac } = event.headers;
  const { SHOPIFY_SHARED_SECRET: sharedSecret = "" } = process.env;

  const hmac = createHmac("sha256", sharedSecret)
    .update(event.body.toString())
    .digest()
    .toString();

  return hmac === expectedHmac;
};
