
export default class {
  #peers = {}

  constructor(signalingController) {
    this.signalingController = signalingController;
    this.#peers = this.signalingController.getPeers()
      .reduce((peers, peer) => ({
        [peer]: {
          connection: null,
        },
        ...peers,
      }), {});
  }

  /**
   * Makes a call to a peer
   * TODO: Abort if peer already called us?
   * @param {string} peer Peer we a calling to
   */
  async makeCall(peer) {
    // Setup ICE
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const peerConnection = new RTCPeerConnection(configuration);
    this.#peers[peer].connection = peerConnection;
    // Create and send offer to peer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    // Send offer to peer
    this.signalingController.sendOffer(peer, offer);
    // Wait for answer from peer
    const answer = await this.signalingController.waitForAnswer(peer);
    const remoteDesc = new RTCSessionDescription(answer);
    return peerConnection.setRemoteDescription(remoteDesc);
  }

  /**
   * Answers a call from peer
   * @param {string} peer Calling peer
   */
  async answerCall(peer) {
    // Setup ICE
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const peerConnection = new RTCPeerConnection(configuration);
    this.#peers[peer].connection = peerConnection;
    // Wait for offer from peer
    const offer = await this.signalingController.waitForOffer(peer);
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    // Create and send answer to peer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return this.signalingController.sendAnswer(peer, answer);
  }

  // /**
  //  * Listens for peer offers
  //  */
  // listenForOffers() {
  //   this.signalingController.addEventListener('offer', ({ detail: { peer, offer } }) => {
  //     console.log('offer', peer, offer);
  //     this.answerCall(peer, offer);
  //   });
  // }

  // /**
  //  * Listens for peer answers
  //  */
  // listenForAnswers() {
  //   this.signalingController.addEventListener('answer', ({ detail: { peer, answer } }) => {
  //     console.log('answer', peer, answer);
  //     this.answerCall(peer, offer);
  //   });
  // }

  connectAll() {
    return Promise.all(
      this.#peers
        // Remove already connected peers
        .filter((peer) => !peer.connection)
        // Try to call every peer
        .map((peer) => this.makeCall(peer)),
    );
  }
}
