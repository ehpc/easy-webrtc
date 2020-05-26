export default class Peer {
  #id

  #connection

  constructor(id) {
    this.#id = id;
  }

  sendOffer(remotePeer, offer) {
    this.socket.send();
  }

  getId() {
    return this.#id;
  }

  setConnection(connection) {
    this.#connection = connection;
  }
}
