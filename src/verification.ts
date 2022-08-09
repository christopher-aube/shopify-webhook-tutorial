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
  let { "X-Shopify-Hmac-Sha256": expectedHmac } = event.headers;

  expectedHmac = expectedHmac ? expectedHmac : event.headers['x-shopify-hmac-sha256'];

  const { SHOPIFY_SHARED_SECRET: sharedSecret = "" } = process.env;
  const hmac = createHmac("sha256", sharedSecret)
    .update(JSON.stringify(event.body))
    .digest('base64')
    .toString();
  
  return hmac === expectedHmac;
};
