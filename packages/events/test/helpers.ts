import { main, Context, Controls } from 'effection';

export type World<T> = Context<T> & Controls<T> 

export let World: World<any>;

beforeEach(() => {
  World = main(undefined) as World<void>;
});

afterEach(() => {
  World.halt();
})
