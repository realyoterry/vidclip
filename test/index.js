const { VideoRecorder } = require('../src/index.js');

const recorder = new VideoRecorder({
    outputPath: './testRecordings',
    fileName: 'testRecording',
    format: 'mp4',
    frameRate: 30,
    resolution: '1280x720',
    verbose: true,
    includeUUID: false,
    recordAudio: true,
    volume: 2.0,
});

recorder.start();

setTimeout(() => {
    recorder.stop();
}, 10000);
