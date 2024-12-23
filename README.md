<p align="center">
    <a href="https://github.com/realyoterry/vidclip"><img src="https://raw.githubusercontent.com/realyoterry/vidclip/main/public/vidclip.png" width="546"></img></a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/vidclip"><img src="https://img.shields.io/npm/v/vidclip"></img></a>
    <a href="https://github.com/realyoterry/vidclip/blob/main/LICENSE"><img src="https://img.shields.io/github/license/realyoterry/vidclip"></img></a>
    <a href="https://npm-stat.com/charts.html?package=vidclip&from=2024-11-01"><img src="https://img.shields.io/npm/d18m/vidclip.svg?maxAge=3600"></img></a>
    <a href="https://github.com/realyoterry/vidclip/actions/workflows/nodejs.yml"><img src="https://github.com/realyoterry/vidclip/actions/workflows/nodejs.yml/badge.svg"></img></a>
</p>
<br />
<p align="center">A highly customizable, lightweight screen & audio recorder.</p>

## Features

- Record & capture your whole desktop / webcam with/without audio
- Save recordings in various formats (MP4, MOV, MKV etc.)
- Adjustable frame rate, resolution, bitrate and much more
- Audio recording from microphone and/or system sound
- Lightweight and minimal resource usage

#### \*Before you get started:

- Familiarize yourself with the [Node.js basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript).
- Please be respectful and kind in our community.

## Contents

- [Features](#features)
    - [Before you get started](#before-you-get-started)
- [Installation](#installation)
- [Usage](#usage)
    - [Import the application](#1-import-the-application)
    - [Basic Functions](#2-basic-functions)
    - [Customization](#3-customization)
- [Other](#other)
    - [Contributing](#contributing)
    - [License](#license)
    - [Contact](#contact)

## Installation

_Make sure Node.js and NPM have been installed before starting._

```bash
npm install vidclip
yarn add vidclip
pnpm add vidclip
bun add vidclip
```

- [Install Node.js & NPM](https://nodejs.org/en/download/package-manager)
- [Install Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
- [Install pnpm](https://pnpm.io/installation)
- [Install Bun](https://bun.sh/docs/installation)

## Usage

Here's a quick example on how to use the basic features of this package. Full and detailed documentation is on the [vidclip documentation.](https://vidclip.js.org)

### 1. Import the application:

Make sure you have installed the package first.

```js
// If you use CommonJS...
const record = require('vidclip');

// If you use ES Modules...
import record from 'vidclip';
```

By default, you would use CommonJS, but if you wish to use ESM, add the

```json
{
    "type": "module"
}
```

property into your `package.json` file.

### 2. Basic Functions

Now, you can start digging deep. Here's a quick example.

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

Now when you run it, the mp4 file would be saved in the `testRecordings` folder.

### 3. Customization

**Windows users** - PLEASE make sure you have Stereo Mix enabled. To enable it, go to `Settings > System > Sound > More sound settings > Recording > Stereo Mix`. The stereo mix is for recordig desktop audio.

| **Parameter** | **Description**                                                      |  **Type** |
| ------------- | -------------------------------------------------------------------- | --------: |
| `outputPath`  | Directory where the recording will be saved.                         |  _String_ |
| `fileName`    | Desired name for the recording file.                                 |  _String_ |
| `format`      | File format for the recording (e.g., mp4, avi).                      |  _String_ |
| `frameRate`   | Frame rate (FPS) for the recording.                                  |  _Number_ |
| `codec`       | The codec the encoder uses.                                          |  _String_ |
| `preset`      | The speed of the recording upload.                                   |  _String_ |
| `resolution`  | Dimensions of the recording (e.g., 1920x1080).                       |  _String_ |
| `verbose`     | Enable logs for detailed information (`true`/`false`).               | _Boolean_ |
| `includeUUID` | Append a random unique identifier to the file name (`true`/`false`). | _Boolean_ |
| `recordAudio` | Include audio in the recording (`true`/`false`).                     | _Boolean_ |
| `audioSource` | Name of the audio input device for recording.                        |  _String_ |
| `volume`      | Control how loud you want the audio to be. (`0.0`-`2.0`)             |   _Array_ |
| `extraArgs`   | Additional settings for advanced configurations.                     |   _Array_ |

If you want to use other audio sources, run:

```js
listAudioDevices().then(console.log).catch(console.error);
```

Then, set `audioSource` to the desired source you would like to use.

## Other

Please take a look here before opening an PR / issue!

### Contributing

Contributions are welcome to everyone! Please make a PR at the [GitHub repository](https://github.com/realyoterry/vidclip) after you have made your changes.

### Security

If you discover any security vulnerabilities, we kindly ask that you do not exploit them. Instead, please report the issue to us by opening an issue on GitHub with the label `security (IMPORTANT)`. We take security very seriously and will address the reported vulnerabilities as quickly as possible. Your cooperation and assistance in maintaining the security of this project are greatly appreciated.

### License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/realyoterry/vidclip/blob/main/LICENSE) file for details.

### Contact

For any questions or suggestions, please open an [issue](https://github.com/realyoterry/vidclip/issues) or contact me at [theterrykim@gmail.com](mailto:theterrykim@gmail.com).
