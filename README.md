<p align="center">
    <a href="https://github.com/realyoterry/vidclip"><img src="https://raw.githubusercontent.com/realyoterry/vidclip/main/public/vidclip.png" width="546"></img></a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/vidclip"><img src="https://img.shields.io/npm/v/vidclip"></img></a>
    <a href="https://github.com/realyoterry/vidclip/blob/main/LICENSE"><img src="https://img.shields.io/github/license/realyoterry/vidclip"></img></a>
    <a href="https://npm-stat.com/charts.html?package=vidclip&from=2024-11-01"><img src="https://img.shields.io/npm/d18m/vidclip.svg?maxAge=3600"></img></a>
    <a href="https://github.com/realyoterry/vidclip/actions/workflows/nodejs.yml"><img src="https://github.com/realyoterry/vidclip/actions/workflows/nodejs.yml/badge.svg"></img></a>
</p>

---

<p align="center">A highly customizable, lightweight screen & audio recorder.</p>

## Contents

- [Features](#features)
    - [Before you get started](#before-you-get-started)
- [Installation](#installation)
- [Usage](#usage)
    - [Importing the application](#1-importing-the-application)
    - [Using basic functions](#2-using-basic-functions)
- [Other](#other)
    - [Contributing](#contributing)
    - [License](#license)
    - [Contact](#contact)

## Features

- Record & capture your whole desktop / webcam with/without audio
- Save recordings in various formats (MP4, MOV, MKV etc.)
- Adjustable frame rate, resolution, bitrate and much more
- Audio recording from microphone and/or system sound
- Lightweight and minimal resource usage

#### \*Before you get started:

- Familiarize yourself with the [Node.js basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript).
- Please be respectful and kind in our community.
- **Windows users who are recording sound** - PLEASE make sure you have Stereo Mix enabled. To enable it, go to `Settings > System > Sound > More sound settings > Recording > Stereo Mix`. The stereo mix is for recordig desktop audio.

## Installation

_Make sure a package manager has been installed before starting._

```bash
npm install vidclip@latest
yarn add vidclip
pnpm add vidclip
bun add vidclip
```

## Usage

Here's a quick example on how to use the basic features of this package. Full and detailed documentation is on the [vidclip documentation.](https://vidclip.js.org)

---

### 1. Importing the application:

Make sure you have installed the package first.

```js
// If you use CommonJS...
const record = require('vidclip');

// If you use ES Modules...
import record from 'vidclip';
```

By default, CommonJS would be enabled.

---

### 2. Using basic functions:

This is the point where you can actually start recording. Here's a quick example.

```js
const recorder = new record.VideoRecorder({
    outputPath: './testRecordings',
    fileName: 'testRecording',
    format: 'mp4',
    frameRate: 30,
    resolution: '1280x720',
    verbose: true,
    includeUUID: false,
    recordAudio: true,
    audioSource: 'Stereo Mix (Realtek(R) Audio)',
});

recorder.start();

setTimeout(() => {
    recorder.stop();
}, 10000);
```

##### \*Note: This is just an example, showcasing the different customizable settings. Please see the [Vidclip documentation](https://vidclip.js.org) to explore in more detail.

---

You can also list the exact name of the **enabled** audio sources to capture audio.

```js
listAudioDevices()
    .then(console.log)
    .catch(console.error);
```

Then, set the `audioSource` option to the desired device you would like to use.

## Other

Please take a look here before opening an pull request / issue!

### Contributing

Contributions are welcome to everyone! Please make a pull request at the [GitHub repository](https://github.com/realyoterry/vidclip) after you have made your changes.

### Security

If you discover any security vulnerabilities, we kindly ask you to read the [SECURITY.md](https://github.com/realyoterry/vidclip/blob/main/SECURITY.md) file to create an issue. We take security **very seriously**, and will address the reported vulnerabilities as quickly as possible. Your cooperation and assistance in maintaining the security of this project are greatly appreciated.

### License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/realyoterry/vidclip/blob/main/LICENSE) file for details.

### Contact

For any questions or suggestions, please open an [issue](https://github.com/realyoterry/vidclip/issues) or contact me at [theterrykim@gmail.com](mailto:theterrykim@gmail.com).
