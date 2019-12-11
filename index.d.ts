// TypeScript Version: 3.7
declare module "effection" {

  export type Operation<T = any> = Sequence | SequenceFn | Controller<T> | PromiseLike<T> | undefined;

  export interface Sequence extends Generator<Operation, any, any> {}
  export interface SequenceFn { (): Sequence; }

  export interface Controller<T> {
    (controls: Controls<T>): void;
  }

  export interface Controls<T> {
    resume(result: T): void;
    fail(error: Error): void;
    ensure(callback: (context: Context<T>) => void): void;
    call<R>(operation: Operation<R>): Context<R>
    context: Context<T>;
  }

  export interface Context<T = any> extends PromiseLike<T> {
    id: number;
    halt(reason?: any): void;
    catch<R>(fn: (error: Error) => R): Promise<R>;
    finally(fn: () => void): Promise<any>;
  }

  export function enter<T>(operation: Operation<T>): Context<T>;
  export function fork<T>(operation: Operation<T>): Operation<Context<T>>;
  export function join<T>(context: Context<T>): Operation<T>;
  export function timeout(durationMillis: number): Operation<void>;
}
