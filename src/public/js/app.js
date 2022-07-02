const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

let myStream;

let muted = false;
let cameraOff = false;

// 카메라 정보 가져오기
async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach(camera => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if(currentCamera.label === camera.label) { // 맨 처음 선택 되어있는 카메라 select 되도록 하기 위하여
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

// media(비디오, 마이크) 불러오기
async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };

  const cameraConstrains = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  }
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstrains : initialConstrains
    );
    myFace.srcObject = myStream;
    if(!deviceId) {
      await getCameras(); // 맨 처음에만 getCameras() 호출
    }
  } catch (e) {
    console.log(e);
  }
}

getMedia(); // video, audio

// Mic Mute Button
function handleMuteClick() {
  myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  if(!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  }
  else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}

// Camera Mute Button
function handleCameraClick() {
  myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
  if(cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  }
  else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
}

// Camera change Button 
async function handleCameraChange() {
  await getMedia(cameraSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick); // 마이크 on/off 리스너
cameraBtn.addEventListener("click", handleCameraClick); // camera on/off 리스너
cameraSelect.addEventListener("input", handleCameraChange); // camera 변경 감지