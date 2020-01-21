import { Effect } from '../src/index';
import { compile } from './pattern';

export const Mailbox = name => Effect.create({
  name: `mailbox(${name})`,
  operations: {
    initialize: ({ resume }) => resume({ messages: new Set(), receivers: new Set() }),
    send: message => ({ resume }, { messages, receivers }) => {
      for (let receiver of receivers) {
        if (receiver.match(message)) {
          receiver.resume(message);
          resume();
          return;
        }
      }
      // no match, so add it to the queue
      messages.add(message);
      resume();
    },

    receive: (pattern) => ({ resume, ensure }, { messages, receivers }) => {
      let match = compile(pattern);

      for (let message of messages) {
        if (match(message)) {
          messages.delete(message);
          resume(message);
          return;
        }
      }

      // no match, so add it to the queue
      let receiver = { match, resume };
      receivers.add(receiver);
      ensure(() => receivers.delete(receiver));
    }
  }
});


export const mailbox = Mailbox('mailbox');
