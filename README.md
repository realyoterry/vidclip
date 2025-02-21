<p align="center">
    <a href="https://github.com/realyoterry/vidclip"><img src="https://raw.githubusercontent.com/realyoterry/vidclip/main/public/vidclip.png" width="546"></img></a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/vidclip"><img src="https://img.shields.io/npm/v/vidclip"></img></a>
    <a href="https://github.com/realyoterry/vidclip/blob/main/LICENSE"><img src="https://img.shields.io/github/license/realyoterry/vidclip"></img></a>
    <a href="https://npm-stat.com/charts.html?package=vidclip&from=2024-11-01"><img src="https://img.shields.io/npm/d18m/vidclip.svg?maxAge=3600"></img></a>
    <a href="https://github.com/realyoterry/vidclip/actions/workflows/nodejs.yml"><img src="https://github.com/realyoterry/vidclip/actions/workflows/nodejs.yml/badge.svg"></img></a>
    <a href="https://codecov.io/gh/realyoterry/vidclip"><img src="https://codecov.io/gh/realyoterry/vidclip/branch/beta/graph/badge.svg"/></a>
</p>

<p align="center">A highly customizable, lightweight screen & audio recorder.</p>

## Features

- Record & capture your whole desktop
- Save recordings in various formats (MP4, MOV, MKV etc.)
- Adjustable frame rate, resolution, bitrate and much more
- Audio recording from microphone and/or system sound

#### \*Before you get started:

- **Windows users who are recording sound** - Please make sure you have Stereo Mix enabled. To enable it, go to `Settings > System > Sound > More sound settings > Recording > Stereo Mix`. The stereo mix is for recordig desktop audio.

## Installation

```bash
npm install vidclip
yarn add vidclip
pnpm add vidclip
bun add vidclip
```

## Usage

Here's a quick example on how to use the basic features of this package.

### 1. Import the application:

Make sure you have installed the package first.

```js
// If you use CommonJS...
const Recorder = require('vidclip');

// If you use ES Modules...
import Recorder from 'vidclip';
```

### 2. Start the recording

Here's a simple usage of the `start()` function:

```js
const recorder = new Recorder({
    resolution: '1920x1080', // Resolution (`width`x`height`)
    frameRate: 30, // Frame rate (one of 24, 30, 60 and 120)
    fileFormat: 'mp4', // Video encoding format
    audioSource: 'Stereo Mix (Realtek(R) Audio)', // Audio device name
    outputFile: 'myFolder/myVideo', // Where to store the video
    timeOut: 5, // Record for 5 seconds
    replaceExisting: true, // Whether to replace an existing file in the same path or not
    verbose: true, // Log everything into the console
});

recorder.start();

// use recorder.stop() if you haven't set the timeOut option
```

---

Please take a look here before opening an pull request / issue!

### Contributing

Contributions are welcome to everyone! Please make sure you have read the [CONTRIBUTING.md](https://github.com/realyoterry/vidclip/bloc/main/CONTRIBUTING.md) file, and the [COMMIT_CONVENTION.md](https://github.com/realyoterry/vidclip/blob/main/COMMIT_CONVENTION.md) file before you get started. When you are done, make a pull request at the [GitHub repository](https://github.com/realyoterry/vidclip).

### Security

If you discover any security vulnerabilities, read the [SECURITY.md](https://github.com/realyoterry/vidclip/blob/main/SECURITY.md) file, then create an issue.

### License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/realyoterry/vidclip/blob/main/LICENSE) file for details.

### Contact

For any questions or suggestions, please open an [issue](https://github.com/realyoterry/vidclip/issues) or contact me at [theterryaki@gmail.com](mailto:theterryaki@gmail.com).
