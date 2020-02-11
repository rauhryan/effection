// TypeScript Version: 3.7
declare module "effection" {
  export type Operation<T> = OperationFn<T> | Sequence<T> | Promise<T> | Controller<T> | undefined;

  type OperationFn<T> = () => Operation<T>;

  type Controller<T> = (controls: Controls<T>) => void | (() => void);

  interface Sequence<T> extends Generator<Operation<unknown>, T, any> {}

  export interface Context<T> extends PromiseLike<T> {
    id: number;
    parent?: Context<unknown>;
    result?: T;
    halt(reason?: any): void;
    catch<R>(fn: (error: Error) => R): Promise<R>;
    finally(fn: () => void): Promise<any>;
  }

  export interface Controls<T> {
    id: number;
    resume(result: T): void;
    fail(error: Error): void;
    ensure(hook: (context?: Context<T>) => void): () => void;
    spawn<T>(operation: Operation<T>): Context<T>;
    context: Context<T>;
  }

  export function main<T>(operation: Operation<T>): Context<T>;

  export function fork<T>(operation: Operation<T>): Context<T>;

  export function join<T>(context: Context<T>): Operation<T>;

  export function monitor<T>(operation: Operation<T>): Context<T>;

  export function timeout(durationMillis: number): Operation<void>;
}
