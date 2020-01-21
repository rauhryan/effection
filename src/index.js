export { timeout } from './timeout';
export { fork, join } from './control';
export { use, Effect } from './effect';

import { ExecutionContext } from './context';

export function enter(operation, options) {
  let top = new ExecutionContext(null, options);
  top.enter(operation);
  return top;
}
