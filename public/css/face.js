const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('css/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('css/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('css/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('css/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('css/models')
]).then(startVideo);

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    video.srcObject = stream;
    video.onloadedmetadata = function (e) {
      video.play();
    };
  } catch (err) {
    console.log("The following error occurred: " + err.name);
  }
}

video.addEventListener('play', async () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };

  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();


    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100);
});