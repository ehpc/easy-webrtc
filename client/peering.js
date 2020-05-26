
export function getPeers(signalingChannel) {

}

/**
 * Checks if local peer should be calling remote peer
 * @param {Peer} localPeer Local peer
 * @param {Peer} remotePeer Remote peer
 */
function isLocalPeerCalling(localPeer, remotePeer) {
  return localPeer.getId() < remotePeer.getId();
}

/**
 * Makes a call to peer
 * TODO: Abort if peer already called us?
 * @param {Peer} localPeer Calling peer
 * @param {Peer} remotePeer Peer we a calling to
 */
export async function makeCall(localPeer, remotePeer, signalingChannel) {
  // Setup ICE
  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  const peerConnection = new RTCPeerConnection(configuration);
  // Create and send offer to peer
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  // Send offer to peer
  signalingChannel.sendOffer(localPeer, remotePeer, offer);
  // Wait for answer from peer
  const answer = await signalingChannel.waitForAnswer(localPeer, remotePeer);
  const remoteDesc = new RTCSessionDescription(answer);
  await peerConnection.setRemoteDescription(remoteDesc);
  remotePeer.setConnection(peerConnection);
}

/**
 * Answers a call from peer
 * @param {Peer} localPeer Answering peer
 * @param {Peer} remotePeer Calling peer
 */
export async function answerCall(localPeer, remotePeer, signalingChannel) {
  // Setup ICE
  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  const peerConnection = new RTCPeerConnection(configuration);
  // Wait for offer from peer
  const offer = await signalingChannel.waitForOffer(localPeer, remotePeer);
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  // Create and send answer to peer
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  await signalingChannel.sendAnswer(localPeer, remotePeer, answer);
  return remotePeer.setConnection(peerConnection);
}

/**
 * Connects all peers with each other
 * @param {Peer} localPeer Local peer
 * @param {Peer[]} peers Remote peers list
 */
export function connectToPeers(localPeer, peers, signalingChannel) {
  return Promise.all(
    peers.map(
      (remotePeer) => (
        isLocalPeerCalling(localPeer, remotePeer)
          ? makeCall(localPeer, remotePeer, signalingChannel)
          : answerCall(localPeer, remotePeer, signalingChannel)
      ),
    ),
  );
}

// export default class {
//   #peers = {}

//   constructor(signalingController) {
//     this.signalingController = signalingController;
//     this.#peers = this.signalingController.getPeers()
//       .reduce((peers, peer) => ({
//         [peer]: {
//           connection: null,
//         },
//         ...peers,
//       }), {});
//   }


//   // /**
//   //  * Listens for peer offers
//   //  */
//   // listenForOffers() {
//   //   this.signalingController.addEventListener('offer', ({ detail: { peer, offer } }) => {
//   //     console.log('offer', peer, offer);
//   //     this.answerCall(peer, offer);
//   //   });
//   // }

//   // /**
//   //  * Listens for peer answers
//   //  */
//   // listenForAnswers() {
//   //   this.signalingController.addEventListener('answer', ({ detail: { peer, answer } }) => {
//   //     console.log('answer', peer, answer);
//   //     this.answerCall(peer, offer);
//   //   });
//   // }


// }
