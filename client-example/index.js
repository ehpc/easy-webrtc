// import SingnalingController from '../client/signaling';
import Peer from '../client/peer';
import { connectToPeers } from '../client/peering';
import SignalingChannel from '../client/signaling-channel';

async function run() {
  // try {
  //   const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //   logger.log('Got MediaStream:', stream);
  //   const videoElement = document.querySelector('#localVideo');
  //   videoElement.srcObject = stream;
  // } catch (err) {
  //   logger.error('Error accessing media devices.', err);
  // }
  // const signalingController = new SingnalingController('ws://localhost:3010');
  // const peerController = new PeerController(signalingController);
  // peerController.connectAll();

  const signalingChannel = new SignalingChannel('ws://localhost:3010');

  const [localPeerId, remotePeerIds] = await Promise.all([
    signalingChannel.getLocalPeerId(),
    signalingChannel.getRemotePeerIds(),
  ]);
  const localPeer = new Peer(localPeerId);
  const peers = remotePeerIds.map((id) => new Peer(id));
  await connectToPeers(localPeer, peers, signalingChannel);
}

run();
