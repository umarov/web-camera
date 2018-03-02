const videoElement = document.querySelector('video')
const imageElement = document.querySelector('img')
const canvas = document.querySelector('canvas')
const shutterButton = document.querySelector('.shutter-button')

async function init() {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    })
    videoElement.srcObject = mediaStream
    const mediaStreamTrack = mediaStream.getVideoTracks()[0]
    const imageCapture = new ImageCapture(mediaStreamTrack)

    shutterButton.addEventListener('click', takePhoto(imageCapture))
  } catch (error) {
    console.error('getUserMedia() error:', error)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init()
})

function takePhoto(imageCapture) {
  return async (event) => {
    try {
      const blob = await imageCapture.takePhoto()
      const imageBitmap = await createImageBitmap(blob)

      videoElement.pause()
      videoElement.style.display = 'none'

      setTimeout(() => {
        drawCanvas(canvas, imageBitmap);
        // console.log(blob)
        // imageElement.src = URL.createObjectURL(blob)
        // imageElement.onload = () => {
        //   URL.revokeObjectURL(this.src)
        // }
      }, 0)

      canvas.style.display = 'block'
    } catch (error) {
      console.error('takePhoto() error:', error)
    }
  }
}

function drawCanvas(canvas, img) {
  canvas.width = getComputedStyle(canvas).width.split('px')[0]
  canvas.height = getComputedStyle(canvas).height.split('px')[0]
  let ratio = Math.min(canvas.width / img.width, canvas.height / img.height)
  let x = (canvas.width - img.width * ratio) / 2
  let y = (canvas.height - img.height * ratio) / 2
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  canvas.getContext('2d').rotate(-80*Math.PI/180)
  canvas
    .getContext('2d')
    .drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      x/8,
      y/4,
      img.width * ratio,
      img.height * ratio
    )
}
function gotMedia(mediaStream) {
  // requestAnimationFrame(async () => {
  //   try {
  //     const imageBitmap = await imageCapture.grabFrame()
  //     console.log(imageBitmap);
  //     canvas.width = imageBitmap.width
  //     canvas.height = imageBitmap.height
  //     canvas.getContext('2d').drawImage(imageBitmap, 0, 0)
  //   } catch(error) {
  //     console.error('grabFrame() error:', error)
  //   }
  // })
  // setTimeout(() => {
  // }, 4000)
}
