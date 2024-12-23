<p align="center">
    <img src="/public/vidclip.png" width="546"></img>
</p>

<p align="center">
    <img src="https://img.shields.io/npm/v/vidclip?style=for-the-badge"></img>
    <img src="https://img.shields.io/github/license/realyoterry/vidclip?style=for-the-badge"></img>
</p>
<br />
<p align="center">A highly customizable, lightweight screen & audio recorder.</p>

## Features

- Record & capture your whole desktop with/without audio
- Save recordings in various formats (MP4, MOV, etc.)
- Adjustable frame rate, resolution, bitrate and much more
- Audio recording from microphone and/or system sound
- Lightweight and minimal resource usage

**\*Before you get started:**

- Familiarize yourself with the [Node.js basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript).
- Please be respectful and kind in our community.

## Installation

*Make sure Node.js and NPM have been installed before starting.*

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

Here's a quick example on how to use the basic features of this package. Full and detailed documentation is on the [Vidclip documentation.](https://vidclip.js.org)

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
    "type": "module",
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

### Customization

**Windows users** - PLEASE make sure you have Stereo Mix enabled. To enable it, go to `Settings > System > Sound > More sound settings > Recording > Stereo Mix`. The stereo mix is for recordig desktop audio.

| **Parameter**   | **Description**                                                         | **Type**   |
|-----------------|-------------------------------------------------------------------------|-----------:|
| `outputPath`    | Directory where the recording will be saved.                            | *String*   |
| `fileName`      | Desired name for the recording file.                                    | *String*   |
| `format`        | File format for the recording (e.g., mp4, avi).                         | *String*   |
| `frameRate`     | Frame rate (FPS) for the recording.                                     | *Number*   |
| `codec`         | The codec the encoder uses.                                             | *String*   |
| `preset`        | The speed of the recording upload.                                      | *String*   |
| `resolution`    | Dimensions of the recording (e.g., 1920x1080).                          | *String*   |
| `verbose`       | Enable logs for detailed information (`true`/`false`).                  | *Boolean*  |
| `includeUUID`   | Append a random unique identifier to the file name (`true`/`false`).    | *Boolean*  |
| `recordAudio`   | Include audio in the recording (`true`/`false`).                        | *Boolean*  |
| `audioSource`   | Name of the audio input device for recording.                           | *String*   |
| `volume`        | Control how loud you want the audio to be. (`0.0`-`2.0`)                    | *Array*    |
| `extraArgs`     | Additional settings for advanced configurations.                        | *Array*    |

If you want to use other audio sources, run:

```js
listAudioDevices()
    .then(console.log)
    .catch(console.error);
```

Then, set `audioSource` to the desired source you would like to use.

## Contributing

Contributions are welcome to everyone! Please make a PR at the [GitHub repository](https://github.com/realyoterry/vidclip) after you have made your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please open an issue or contact me at [theterrykim@gmail.com](mailto:theterrykim@gmail.com).
