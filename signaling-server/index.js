import ws from 'ws';

const server = new ws.Server({
  port: process.env.SIGNAL_PORT || 3010,
});

let lastPeerId = 0;
function createPeerId() {
  lastPeerId += 1;
  return lastPeerId;
}

function createMessage(type, payload) {
  console.debug('message sent', type, payload);
  return JSON.stringify({
    type,
    ...payload,
  });
}

const peers = {};

server.on('connection', (socket) => {
  const peerId = createPeerId();
  peers[peerId] = socket;

  console.log('connected', peerId);

  socket.on('message', (message) => {
    console.log('received: %s', message);
  });

  socket.on('close', () => {
    console.log('closed', peerId);
    delete peers[peerId];
  });

  socket.send(createMessage('id', {
    id: peerId,
  }));
  socket.send(createMessage('list', {
    peers: Object.keys(peers),
  }));
});
