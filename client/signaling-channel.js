/**
 * SignalingChannel is a channel for 1-to-1 communication between peers
 */
export default class SignalingChannel extends EventTarget {
  /**
   * Constructor
   * @param {string} localId Local peer ID
   * @param {string} remoteId Remote peer ID
   * @param {string} signalingUrl Signaling server URL
   */
  constructor(localId, remoteId, signalingUrl) {
    super();
    this.localId = localId;
    this.remoteId = remoteId;
  }

  /**
   * Send message to remote
   * @param {object} message Message to send to remote
   */
  send(message) {
    this.socket.send(JSON.stringify(message));
  }
}
