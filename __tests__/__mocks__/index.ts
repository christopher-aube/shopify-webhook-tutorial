import {
  ICallback,
  IFunctionEvent,
  IFunctionContext,
  FunctionEventHeaders,
  FunctionEventQuery,
} from "../../src/types";

export class FunctionEventMock<T> implements IFunctionEvent<T> {
  body: T;
  headers: FunctionEventHeaders;
  query: FunctionEventQuery;
  method: string;
  path: string;

  constructor({
    body,
    headers = {},
    query = {},
    method = "POST",
    path = "/",
  }: {
    body: T,
    headers?: FunctionEventHeaders,
    query?: FunctionEventQuery,
    method?: string,
    path?: string,
  }) {
    this.body = body;
    this.headers = headers;
    this.query = query;
    this.method = method;
    this.path = path;
  }
}

export class FunctionContextMock implements IFunctionContext {
  value = 200;
  headerValues = {};
  cbCalled = 0;
  cb: ICallback = null;

  constructor(cb: ICallback) {
    this.cb = cb;
  }

  getStatus(): number {
    return this.value;
  }

  status(value: number): IFunctionContext {
    this.value = value;
    return this;
  }

  getHeaders(): FunctionEventHeaders {
    return this.headerValues;
  }

  headers(value: FunctionEventHeaders): IFunctionContext {
    this.headerValues = value;
    return this;
  }

  succeed(result: unknown): FunctionContextMock {
    this.cbCalled++;
    this.cb(null, result);
    return this;
  }

  fail(error: Error): FunctionContextMock {
    this.cbCalled++;
    this.cb(error);
    return this;
  }
}
