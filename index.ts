"use strict";

import express from "express";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express-serve-static-core";

import { handler } from "./src/handler";
import {
  FunctionEventHeaders,
  FunctionEventQuery,
  IFunctionEvent,
  IFunctionContext,
  ICallback,
} from "./src/types";

const defaultMaxSize = "100kb"; // body-parser default
const {
  http_port: port = 8000,
  MAX_RAW_SIZE: rawLimit = defaultMaxSize,
  MAX_JSON_SIZE: jsonLimit = defaultMaxSize,
  RAW_BODY: useRawBody,
} = process.env;

const app = express();
app.disable("x-powered-by");

const addDefaultContentType = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  // Default `Content-Type` header to `text/plain` if it's not specified
  const { "content-type": contentType = "text/plain" } = req.headers;
  req.headers = {
    ...req.headers,
    "content-type": contentType,
  };

  next();
};
app.use(addDefaultContentType);

if (useRawBody === "true") {
  app.use(express.raw({
    type: "*/*",
    limit: rawLimit,
  }));
} else {
  app.use(express.text({
    type: "text/*",
  }));
  app.use(express.json({
    limit: jsonLimit,
  }));
  app.use(express.urlencoded({
    extended: true,
  }));
}

class FunctionEvent<T> implements IFunctionEvent<T> {
  body: T;
  headers = {};
  query: FunctionEventQuery;
  method: string;
  path: string;

  constructor(req: Request) {
    this.body = req.body;
    this.headers = req.headers;
    this.query = req.query;
    this.method = req.method;
    this.path = req.path;
  }
}

class FunctionContext implements IFunctionContext {
  value = 200;
  headerValues = {};
  cbCalled = 0;
  cb: ICallback = null;

  constructor(cb: ICallback) {
    this.cb = cb;
  }

  getStatus() {
    return this.value;
  }

  status(value: number) {
    this.value = value;
    return this;
  }

  getHeaders() {
    return this.headerValues;
  }

  headers(value: FunctionEventHeaders) {
    this.headerValues = value;
    return this;
  }

  succeed(result: unknown) {
    this.cbCalled++;
    this.cb(null, result);
    return this;
  }

  fail(error: Error) {
    this.cbCalled++;
    this.cb(error);
    return this;
  }
}

const isArray = Array.isArray;
const isObject = (a: unknown) => {
  return !!a && a.constructor === Object;
};
const shouldBeStringified = (obj: unknown) => isArray(obj) || isObject(obj);

const middleware: RequestHandler = async (req: Request, res: Response) => {
  const cb: ICallback = (err: Error|null, functionResult: unknown) => {
    if (err) {
      const errPayload = err.toString
        ? err.toString()
        : err;
      console.error(errPayload);
      return res
        .status(500)
        .send(errPayload);
    }

    const resultBody = shouldBeStringified(functionResult)
      ? JSON.stringify(functionResult)
      : functionResult;
    res
      .set(fnContext.getHeaders())
      .status(fnContext.getStatus())
      .send(resultBody);
  };

  const fnEvent = new FunctionEvent(req);
  const fnContext = new FunctionContext(cb);

  try {
    const handlerResponse = await handler(fnEvent, fnContext, cb);
    if (!fnContext.cbCalled) {
      fnContext.succeed(handlerResponse);
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    cb(e);
  }
};

app.post("/*", middleware);
app.get("/*", middleware);
app.patch("/*", middleware);
app.put("/*", middleware);
app.delete("/*", middleware);
app.options("/*", middleware);

app.listen(port, () => {
  console.log(`node12-ts listening on port: ${port}`);
});
