/* global describe, beforeEach, it */
/* eslint require-yield: 0 */
/* eslint no-unreachable: 0 */

import expect from 'expect';

import { enter, fork, use } from '../src/index';
import { any } from '../src/pattern';

import { Mailbox } from '../src/mailbox';

async function suspend() {}

describe('Send and Receive Messages', () => {
  let mailbox, send, receive;
  beforeEach(() => {
    mailbox = Mailbox('Send and Receive Messages Test');
    send = mailbox.send;
    receive = mailbox.receive;
  });

  describe('receive with no arguments', () => {
    let child, message;

    beforeEach(() => {
      enter(function*() {
        yield use(mailbox);

        child = yield fork();

        message = yield receive();
      });
    });

    it('blocks until a message is sent', async () => {
      expect(message).toEqual(undefined);

      await suspend();

      child.call(send("hello"));
      await suspend();

      expect(message).toEqual("hello");
    });
  });

  describe('receive with an execution as argument', () => {
    let context, message;

    beforeEach(() => {
      context = enter(function*() {
        yield use(mailbox);

        yield fork(function*() {
          message = yield receive();
        });
      });
    });

    it('blocks until a message is sent to the given execution', async () => {
      expect(message).toEqual(undefined);

      await suspend();

      context.call(send("hello"));
      await suspend();

      expect(message).toEqual("hello");
    });
  });

  describe('receive with a pattern argument', () => {
    let context, message;

    beforeEach(() => {
      context = enter(function*() {
        yield use(mailbox);
        message = yield receive({ some: any("string") });
      });
    });

    it('ignores messages which does not match', async () => {
      context.call(send({ another: "one" }));
      await suspend();
      expect(message).toEqual(undefined);
    });

    it('receives matching messages', async () => {
      context.call(send({ some: "thing" }));
      await suspend();
      expect(message.some).toEqual("thing");
    });

    it('leaves non matching message in inbox for later retrieval', async () => {
      context.call(send({ first: "message" }));
      context.call(send("another"));
      context.call(send({ some: "thing" }));

      let [one, two] = await context.call(function*() {
        let one = yield receive();
        let two = yield receive();
        return [one, two];
      });
      expect(one.first).toEqual("message");
      expect(two).toEqual("another");
    });
  });

  describe('receive with both exection and pattern argument', () => {
    let context, message;

    beforeEach(() => {
      context = enter(function*() {
        yield use(mailbox);
        yield fork(function*() {
          message = yield receive({ some: any("string") });
        });
      });
    });

    it('ignores messages which does not match', async () => {
      context.call(send({ another: "one" }));
      await suspend();
      expect(message).toEqual(undefined);
    });

    it('receives matching messages', async () => {
      context.call(send({ some: "thing" }));
      await suspend();
      expect(message.some).toEqual("thing");
    });
  });
});
