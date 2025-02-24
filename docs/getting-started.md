# Getting Started

## Prerequisites

Make sure you have:

- Node.js installed on your device ([click to download](https://nodejs.org/en))
- Suitable code editor for editing in JavaScript ([Visual Studio Code](https://code.visualstudio.com/))

::: warning
If you are recording sound, make sure you have the selected audio devices **enabled** and **running**.
:::

## Installation

You can install `Vidclip` through npm with your preferred package manager.

::: code-group

```shell [npm]
$ npm install vidclip
```

``` shell [pnpm]
$ pnpm install vidclip
```

``` shell [yarn]
$ yarn add vidclip
```

``` shell [bun]
$ bun add vidclip
```

:::

## Importing

Now, simply import the `Recorder` class with the following code:

::: code-group

```javascript [CommonJS]
const { Recorder } = require('vidclip');
```

```javascript [ES Modules]
import { Recorder } from 'vidclip';
```

:::

Now, let's try testing if Vidclip is up and working for you.

## Basic Usage

Create a file named `index.js` then insert this snippet of code:

```javascript
const recorder = new Recorder({ verbose: true });
recorder.start({ stopAfter: 5 });
```

Start the process:
```shell
node index.js
```

::: info
If the command refuses to start, try installing the `@ffmpeg-installer/ffmpeg` dependency and try again.
:::

After about 5 seconds, you should see the process exit. Check the recorded video in the `recordings/recording.mp4` directory.

## Errors

If one of the following applies to you, you've encountered **an error**.

- If the process gets inturrupted by an error
- If the process fails / refuses to start
- If the video doesn't play / error while playback

If don't know what to do, check the [issues](https://github.com/realyoterry/vidclip/issues?q=is%3Aissue%20) in the repository. If you are **sure** there is none with the same issue as you, create a new issue. Include the **error message from your terminal** (if there is one), and **your current code**.

Please be patient while I try to respond to you as fast as possible.

---

*Aaaaaannnddd...* that's all for **getting started**! Now, you can start to [configure](/configuration) your own video recorder.
