'use strict'
const photo = document.getElementById("photo");
const canvas = document.getElementById("canvas");
const snap = document.getElementById("snap");
const errorMsgElement = document.getElementById("span#ErrorMsg");

const constraints = {
    audio: false,
    video: {
        width: 300,
        height: 300
    }
};

async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        handleSuccess(stream);
    } catch (e) {
        // errorMsgElement.innerHTML = `navigator.getUserMedia.error: ${e.toString()}`;
    }
}

function handleSuccess(stream) {
    window.stream = stream;
    photo.srcObject = stream;
}

init()



let context = canvas.getContext('2d');
snap.addEventListener('click', () => {
    context.drawImage(photo, 0, 0)
});

function download() {
    let download = document.getElementById("download");
    let image = document.getElementById("canvas").toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
    const takenDate = Date.now();
    download.setAttribute("download", `${takenDate}.png`);
}