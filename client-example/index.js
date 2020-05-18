import SingnalingController from '../client/signaling-controller';

const logger = console;

async function run() {
  // try {
  //   const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //   logger.log('Got MediaStream:', stream);
  //   const videoElement = document.querySelector('#localVideo');
  //   videoElement.srcObject = stream;
  // } catch (err) {
  //   logger.error('Error accessing media devices.', err);
  // }
  const signalingController = new SingnalingController('ws://localhost:3010');
}

run();
