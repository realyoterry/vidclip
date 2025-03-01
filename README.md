<p align="center">
    <a href="https://github.com/realyoterry/vidclip"><img src="https://raw.githubusercontent.com/realyoterry/vidclip/main/public/vidclip.png" width="546"></img></a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/vidclip"><img src="https://img.shields.io/npm/v/vidclip"></img></a>
    <a href="https://github.com/realyoterry/vidclip/blob/main/LICENSE"><img src="https://img.shields.io/github/license/realyoterry/vidclip"></img></a>
    <a href="https://npm-stat.com/charts.html?package=vidclip&from=2024-11-01"><img src="https://img.shields.io/npm/d18m/vidclip.svg?maxAge=3600"></img></a>
    <a href="https://github.com/realyoterry/vidclip/actions/workflows/nodejs.yml"><img src="https://github.com/realyoterry/vidclip/actions/workflows/nodejs.yml/badge.svg"></img></a>
</p>

<p align="center">A highly customizable, Node.js screen & audio recorder.</p>

## Features

- Record & capture your whole desktop
- Save recordings in various formats (MP4, MOV, MKV etc.)
- Adjustable frame rate, resolution, bitrate and much more
- Audio recording from microphone and/or system sound

## Links

- [Vidclip Documentation](https://vidclip.js.org)
- [NPM Package](https://npmjs.com/package/vidclip)
- [GitHub Repository](https://github.com/realyoterry/vidclip)

## Installation

```bash
npm install vidclip
yarn add vidclip
pnpm add vidclip
bun add vidclip
```

## Usage

Here's a quick example on how to use the basic features of this package. Read the [Vidclip Documentation](https://vidclip.js.org/) for a full guide.

### 1. Import the application:

Make sure you have installed the package first.

```javascript
const { Recorder } = require('vidclip');

// or if you use ESM:
import { Recorder } from 'vidclip';
```

### 2. Start the recording

Here's a simple usage of the `start()` function:

```javascript
const recorder = new Recorder({
    resolution: '1920x1080', // {width}x{height}
    frameRate: 30, // one of 24, 30, 60 and 120
    fileFormat: 'mp4', // one of mp4, mov, wmv, avi and mkv
    audioSource: 'Stereo Mix (Realtek(R) Audio)', // one of your enabled audio devices
    outputFile: 'recordings/recording.mp4', // any directory you want to store the video (inside the current directory)
    replaceExisting: true, // replace an existing file?
    verbose: false, // output necessary logs into the console?
    rateControl: { mode: 'crf', value: 18 }, // one of crf, cq, bitrate, and qp
    codec: 'libx264', // one of libx264, libx265, libvpx-vp9, h264_nvenc, hevc_nvenc, h264_qsv, hevc_qsv, and hev264_amf
    preset: 'fast', // one of placebo, veryslow, slower, slow, medium, fast, faster, veryfast, superfast, and ultrafast
    pixelFormat: 'yuv420p', // one of yuv420p, yuv422p, yuv444p, rgb24, gray, and nv12 (yuv420p highly recommended)
});

recorder.start({
    stopAfter: 5, // how long for the recording to run (in seconds)
});

/* an alternative:
 *
 * setTimeout(() => {
 *    recorder.stop(); // forcefully stop by using SIGKILL
 * }, 5000);
*/
```

## Contributing

To contribute, first read the [CONTRIBUTING.md](https://github.com/realyoterry/vidclip/blob/main/CONTRIBUTING.md) file. Then, fork the repository, apply your changes, and [create a pull request](https://github.com/realyoterry/vidclip/pulls).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/realyoterry/vidclip/blob/main/LICENSE) file for details.
