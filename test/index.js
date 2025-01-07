const { VideoRecorder, listDevices } = require('../src/index.js');

const recorder = new VideoRecorder({
    outputPath: './testRecordings',
    fileName: 'testRecording',
    format: 'mp4',
    frameRate: 15,
    resolution: '1280x720',
    preset: 'medium',
    verbose: true,
    includeUUID: false,
    recordAudio: true,
    audioSource: 'Stereo Mix (Realtek(R) Audio)',
});

listDevices().then((devices) => {
    console.log(devices);
});

recorder.start();

setTimeout(() => {
    recorder.stop();
}, 10000);
