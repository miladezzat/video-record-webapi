let constraintObj = {
    audio: true,
    video: {
        facingMode: "user",
        width: {
            min: 640,
            ideal: 1280,
            max: 1920
        },
        height: {
            min: 480,
            ideal: 720,
            max: 1080
        }
    }
};

if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
    navigator.mediaDevices.getUserMedia = function(constraintObj) {
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraintObj, resolve, reject);
        });
    }
} else {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            devices.forEach(device => {
                console.log(device.kind.toUpperCase(), device.label);
                //, device.deviceId
            })
        })
        .catch(err => {
            console.log(err.name, err.message);
        })
}

navigator.mediaDevices.getUserMedia(constraintObj)
    .then(function(mediaStreamObj) {
        let stream;
        //add listeners for saving video/audio
        let start = document.getElementById('btnStart');
        let stop = document.getElementById('btnStop');
        let vidSave = document.getElementById('vid2');
        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        let chunks = [];
        let video = document.querySelector('video');

        const vid1 = document.getElementById("vid1")
        const vid2 = document.getElementById("vid2")
        const img = document.getElementById("img")

        start.addEventListener('click', (ev) => {
            if ("srcObject" in video) {
                video.srcObject = mediaStreamObj;
                stream = video.srcObject;
            } else {
                video.src = window.URL.createObjectURL(mediaStreamObj);
                stream = video.srcObject;
            }

            vid1.style.display = "inline-block"
            vid2.style.display = "none"
            img.style.display = "none"
            video.onloadedmetadata = function(ev) {
                video.play();
            };
            mediaRecorder.start();
            console.log(mediaRecorder.state);
        })
        stop.addEventListener('click', (ev) => {
            mediaRecorder.stop();
            vid2.style.display = "inline-block"
            vid1.pause();
            vid1.style.display = "none"
            console.log(mediaRecorder.state);
        });
        mediaRecorder.ondataavailable = function(ev) {
            chunks.push(ev.data);
        }
        mediaRecorder.onstop = (ev) => {
            let blob = new Blob(chunks, {
                'type': 'video/mp4;'
            });
            chunks = [];
            let videoURL = window.URL.createObjectURL(blob);
            vidSave.src = videoURL;
        }
    })
    .catch(function(err) {
        console.log(err.name, err.message);
    });