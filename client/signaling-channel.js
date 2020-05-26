import * as signals from '../common/signals';

/**
 * Communacation channe between local peer and remote peers
 */
export default class SignalingChannel {
  #socket

  #socketPromise

  /**
   * Constructor
   * @param {string} socketUrl Socket URL
   */
  constructor(socketUrl) {
    this.#socket = new WebSocket(socketUrl);
    this.#socketPromise = new Promise((resolve) => {
      this.#socket.addEventListener('open', resolve);
    });
  }

  async promisifyWSSignal(signalType, payloadExtractor) {
    await this.#socketPromise;
    return new Promise((resolve) => {
      const handler = (event) => {
        const { type, payload } = JSON.parse(event.data);
        switch (type) {
          case signalType:
            this.#socket.removeEventListener('message', handler);
            resolve(payloadExtractor(payload));
            break;
          default:
        }
      };
      this.#socket.addEventListener('message', handler);
      this.#socket.send(signals.createSignal(signalType));
    });
  }

  getLocalPeerId() {
    return this.promisifyWSSignal(signals.TYPE_ID, ({ id }) => id);
  }

  getRemotePeerIds() {
    return this.promisifyWSSignal(signals.TYPE_LIST_PEERS, ({ peers }) => peers);
  }
}
