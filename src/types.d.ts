import { IncomingHttpHeaders } from "http2";
import { ParsedQs } from "qs";

export type FunctionEventQuery = ParsedQs;
export type FunctionEventHeaders = IncomingHttpHeaders;
export interface IFunctionEvent<T> {
  body: T;
  headers: FunctionEventHeaders;
  query: FunctionEventQuery;
  method: string;
  path: string;
}

export type ICallback = (err: Error|null, functionResult?: unknown) => unknown;

export interface IFunctionContext {
  getStatus: () => number;
  status: (value: number) => IFunctionContext;
  getHeaders: () => IncomingHttpHeaders;
  headers: (value: IncomingHttpHeaders) => IFunctionContext;
  succeed: (value: unknown) => IFunctionContext;
  fail: (error: Error) => IFunctionContext;
}

export type Handler<I, O> = (
  event: IFunctionEvent<I>,
  context: IFunctionContext,
  callback?: ICallback,
) => O;

export type AsyncHandler<I, O> = (
  event: IFunctionEvent<I>,
  context: IFunctionContext,
  callback?: ICallback,
) => Promise<O>;
