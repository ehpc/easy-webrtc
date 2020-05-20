
export default class {
  #peers = {}

  constructor(signalingController) {
    this.signalingController = signalingController;
    this.#peers = this.signalingController.getPeers()
      .reduce((peers, peer) => ({
        [peer]: {
          connected: false,
        },
        ...peers,
      }), {});
  }

  async makeCall(peer) {
    // Provide ICE servers
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const peerConnection = new RTCPeerConnection(configuration);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    // Send offer to peer
    this.signalingController.sendOffer(peer, offer);
    // Wait for answer from peer
    const answer = await this.signalingController.waitForAnswer(peer);
    const remoteDesc = new RTCSessionDescription(answer);
    return peerConnection.setRemoteDescription(remoteDesc);
  }

  async answerCall(peer, offer) {
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return this.signalingController.sendAnswer(peer, answer);
  }

  listenForOffers() {
    this.signalingController.on('offer', (peer, offer) => {
      this.answerCall(peer, offer);
    });
  }

  connectAll() {
    return Promise.all(
      this.#peers
        .filter((peer) => !peer.connected)
        .map((peer) => this.makeCall(peer)),
    );
  }
}
