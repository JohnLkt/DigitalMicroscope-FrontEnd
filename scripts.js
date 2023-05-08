let userCamera = document.getElementById('userCamera');
let cameraSelect = document.getElementById('videoSource');
let captureButton = document.getElementById('captureButton');
let carousel = document.getElementById('carousel');
let modal = document.getElementById('myModal');
let modalImage = document.getElementById('modalImage');
let closeModalButton = document.getElementById('closeModalButton');
let downloadModalButton = document.getElementById('downloadModalButton');
let selectedImage = null;

'use strict';

cameraSelect.onchange = getStream;

function getDevices() {
  // AFAICT in Safari this only gets default devices until gUM is called :/
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos; // make available to console
  console.log('Available input and output devices:', deviceInfos);
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `Camera ${cameraSelect.length + 1}`;
      cameraSelect.appendChild(option);
    }
  }
}

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const videoSource = cameraSelect.value;
  const constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  return navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  cameraSelect.selectedIndex = [...cameraSelect.options].
    findIndex(option => option.text === stream.getVideoTracks()[0].label);
  userCamera.srcObject = stream;
}

function handleError(error) {
  console.error('Error: ', error);
}

getStream().then(getDevices).then(gotDevices);

// Capture image from video stream
captureButton.addEventListener('click', function() {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let width = userCamera.videoWidth;
    let height = userCamera.videoHeight;

    // Set canvas dimensions to match video stream
    canvas.width = width;
    canvas.height = height;

    // Draw current video frame on the canvas
    context.drawImage(userCamera, 0, 0, width, height);

    // Create a data URL containing the captured image
    let dataUrl = canvas.toDataURL('image/png', 1);

    // Create a new carousel item
    let carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');

    // Create an image element for the captured image
    let image = document.createElement('img');
    image.classList.add('carousel-image');
    image.src = dataUrl;

    // Append the image to the carousel item
    carouselItem.appendChild(image);

    // Append the carousel item to the carousel
    carousel.appendChild(carouselItem);

    // Scroll to the newly added carousel item
    carouselItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Add click event listener to the image
    image.addEventListener('click', () => {
    // Set the selected image and display the modal
    selectedImage = image;
    modalImage.src = selectedImage.src;
    modal.style.display = 'block';
    });
});

// Close the modal when the close button is clicked
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Download the modal image when the download button is clicked
downloadModalButton.addEventListener('click', () => {
    if (selectedImage) {
    downloadModalButton.href = selectedImage.src;
    downloadModalButton.download = 'image.jpg';
    }
});



// STARTUP ROUTINE

let xPos = document.getElementById('xPos');
let yPos = document.getElementById('yPos');
let zPos = document.getElementById('zPos');

function initControlPanel() {
  xPos.value = 0;
  yPos.value = 0;
  zPos.value = 0;
}

document.addEventListener("DOMContentLoaded", function(event){
  // your code here
  initControlPanel();
});


let moveFactor = 10; //default set to 10 steps

let xPosPlus = document.getElementById('xPosPlus');
let xPosMin = document.getElementById('xPosMin');
// limit the stepper motor movement
let xMin = 0;
let xMax = 10000;

xPosMin.addEventListener('click', () => {
  if(parseInt(xPos.value) - moveFactor >= xMin) {
    let newXPos = parseInt(xPos.value) - moveFactor;
    xPos.value = newXPos;
  } else {
    alert('Out of Bounds');
  }
});
xPosPlus.addEventListener('click', () => {
  if(parseInt(xPos.value) + moveFactor <= xMax) {
    let newXPos = parseInt(xPos.value) + moveFactor;
    xPos.value = newXPos;
  } else {
    alert('Out of Bounds');
  }
});
let yPosPlus = document.getElementById('yPosPlus');
let yPosMin = document.getElementById('yPosMin');
// limit the stepper motor movement
let yMin = 0;
let yMax = 10000;

yPosMin.addEventListener('click', () => {
  if(parseInt(yPos.value) - moveFactor >= yMin) {
    let newYPos = parseInt(yPos.value) - moveFactor;
    yPos.value = newYPos;
  } else {
    alert('Out of Bounds');
  }
});
yPosPlus.addEventListener('click', () => {
  if(parseInt(yPos.value) + moveFactor <= yMax) {
    let newYPos = parseInt(yPos.value) + moveFactor;
    yPos.value = newYPos;
  } else {
    alert('x-axis Out of Bounds');
  }
});
let zPosPlus = document.getElementById('zPosPlus');
let zPosMin = document.getElementById('zPosMin');
// limit the stepper motor movement
let zMin = 0;
let zMax = 10000;

zPosMin.addEventListener('click', () => {
  if(parseInt(zPos.value) - moveFactor >= zMin) {
    let newZPos = parseInt(zPos.value) - moveFactor;
    zPos.value = newZPos;
  } else {
    alert('y-axis Out of Bounds');
  }
});
zPosPlus.addEventListener('click', () => {
  if(parseInt(zPos.value) + moveFactor <= zMax) {
    let newZPos = parseInt(zPos.value) + moveFactor;
    zPos.value = newZPos;
  } else {
    alert('z-axis Out of Bounds');
  }
});