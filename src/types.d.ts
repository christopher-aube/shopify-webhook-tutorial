import { IncomingHttpHeaders } from "http2";
import { ParsedQs } from "qs";

export type FunctionEventQuery = ParsedQs;
export type FunctionEventHeaders = IncomingHttpHeaders;
export type KnownEvent = {
  entityId: string;
  serial: number;
  [key: string]: string | number | boolean;
};
export type EventProps = KnownEvent;
export interface IFunctionEvent {
  body: EventProps;
  headers: FunctionEventHeaders;
  query: FunctionEventQuery;
  method: string;
  path: string;
}

export type ICallback = null | ((err: Error|null, functionResult?: IFunctionContext) => unknown);

export interface IFunctionContext {
  getStatus: () => number;
  status: (value: number) => IFunctionContext;
  getHeaders: () => IncomingHttpHeaders;
  headers: (value: IncomingHttpHeaders) => IFunctionContext;
  succeed: (value: IFunctionContext) => IFunctionContext;
  fail: (error: Error) => IFunctionContext;
}

export type Handler<I, O> = (
  event: IFunctionEvent,
  context: IFunctionContext,
  callback?: ICallback,
) => O;

export type AsyncHandler<I, O> = (
  event: IFunctionEvent,
  context: IFunctionContext,
  callback?: ICallback,
) => Promise<O>;
