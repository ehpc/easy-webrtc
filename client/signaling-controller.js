
import SignalingChannel from './signaling-channel';
import PeerConnection from './peer-connection';

export default class extends EventTarget {
  // Local ID
  #localId

  // Remote peers
  #peers = []

  // WebSocket connection
  #socket

  constructor(signalingUrl) {
    super();
    // Initialize web socket
    this.#socket = new WebSocket(signalingUrl);
    // Listen for messages from remote
    this.#socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        // Receive local ID
        case 'id':
          this.setLocalId(data.id);
          break;
        // List all peers
        case 'list':
          this.updatePeers(data.peers);
        // Peer sent an answer
        case 'answer':

        // Peer sent an offer
        case 'offer':
        default:
      }
    });
  }

  /**
   * Update peer connections
   * @param {array} peers Peer ids
   */
  updatePeers(peers) {
    this.#peers = peers
      .filter((remoteId) => this.#localId !== remoteId)
      .map(
        (remoteId) => this.#peers[remoteId] || new PeerConnection(this.#localId, remoteId),
      );
  }

  /**
   * Set local ID
   * @param {string} id Local ID
   */
  setLocalId(id) {
    this.#localId = id;
  }
}
