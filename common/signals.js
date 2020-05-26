export const TYPE_ID = 'ID';
export const TYPE_LIST_PEERS = 'LIST_PEERS';

export function createSignal(type, payload) {
  console.debug('message created', type, payload);
  return JSON.stringify({
    type,
    payload,
  });
}

export function createIdSignalResponse(peerId) {
  return createSignal(TYPE_ID, {
    id: peerId,
  });
}

export function createListSignalResponse(peers) {
  return createSignal(TYPE_LIST_PEERS, {
    peers,
  });
}
