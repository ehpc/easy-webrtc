import ws from 'ws';
import * as signals from '../common/signals.js';

const server = new ws.Server({
  port: process.env.SIGNAL_PORT || 3010,
});

let lastPeerId = 0;
function createPeerId() {
  lastPeerId += 1;
  return String(lastPeerId);
}

const peers = {};

server.on('connection', (socket) => {
  const peerId = createPeerId();
  peers[peerId] = socket;

  console.log('connected', peerId, Object.keys(peers));

  socket.on('message', (message) => {
    console.log('received: %s', message);
    const { type } = JSON.parse(message);
    switch (type) {
      case signals.TYPE_ID:
        socket.send(signals.createIdSignalResponse(peerId));
        break;
      case signals.TYPE_LIST_PEERS:
        socket.send(signals.createListSignalResponse(
          Object.keys(peers).filter((peer) => peer !== peerId),
        ));
        break;
      default:
    }
  });

  socket.on('close', () => {
    console.log('closed', peerId);
    delete peers[peerId];
  });
});
