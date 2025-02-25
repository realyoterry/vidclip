# Configuration

This page covers the `Recorder` class and its available options.

### Too Long; Didn't Read?

A brief summary of this page:

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
    pixelFormat: 'yuv420p', // one of yuv420p, yuv422p, yuv444p, rgb24, gray, and nv12
});

recorder.start({
    stopAfter: 5, // how long for the recording to run (in seconds)
});

/* an alternative:
 *
 * setTimeout(() => {
 *    recorder.stop(true); // forcefully stop by using SIGKILL
 * }, 5000);
*/
```

## Recorder Options

### `resolution?` (optional)
> Defines the video resolution for the recording, specifying the width and height in pixels.
- **Format:** `"{width}x{height}"` (e.g. `"1280x720"`)
- **Default:** `"1920x1080"`

Example usage:

```javascript
Recorder({ resolution: "1920x1080" });
```

::: info
Higher resolutions produce better quality but may require more processing power and storage.
:::

---

### `frameRate?` (optional)
> Defines the recording frame rate, determining how many frames per second (FPS) are captured.
- **Format:** One of `24, 30, 60, and 120`
- **Default:** `30`

Example usage:
```js
new Recorder({ frameRate: 60 });
```

---

### `fileFormat?` (optional)
> Defines the format of the recorded video file.
- **Format:** One of `"mp4", "mov", "wmv", "avi", and "mkv"`
- **Default:** `"mp4"`

Example usage:
```javascript
new Recorder({ fileFormat: 'mov' });
```

---

### `audioSource?` (optional)
> Specifies the input audio source for recording.
- **Format:** `string` (device name or no audio recorded)
- **Default:** `undefined` (no audio recorded)

Example usage:
```js
new Recorder({ audioSource: 'Stereo Mix (Realtek(R) Audio)' }); // windows
```

::: info
Make sure the audio source is the **exact** name as the audio device name.
:::

---

### `outputFile?` (optional)
> Specifies the file path where the recorded video will be saved.
- **Format:** `string`
- **Default:** `"recordings/recording.{fileFormat}"`

Example usage:
```js
new Recorder({ outputFile: "public/session.mov" });
```

::: info
The `{fileFormat}` placeholder is replaced with the selected fileFormat. if fileFormat is nullish it will default to `".mp4"`.
:::

---

### `replaceExisting?` (optional)
> Determines whether to overwrite an existing file with the same name.
- **Format:** `boolean`
- **Default:** `true`

Example usage:
```js
const recorder = new Recorder({ replaceExisting: true });
```

::: info
If `false`, the recording will fail with an error if the file already exists.
:::

---

### `verbose?` (optional)

> Enables detailed logging output for debugging.
- **Format:** `boolean`
- **Default:** `false`

Example usage:
```js
new Recorder({ verbose: true });
```

---

### `rateControl?` (optional)
> Defines the rate control method for video encoding.
- **Format:** `{ mode: "crf" | "cq" | "bitrate" | "qp", value: number }`
- **Default:** `{ mode: "crf", value: 18 }`

Example usage:
```js
const recorder = new Recorder({ rateControl: { mode: "bitrate", value: 5000 } });
```

---

### `codec?` (optional)
> Specifies the video codec for encoding.
- **Format:** `"libx264" | "libx265" | "libvpx-vp9" | "h264_nvenc" | "hevc_nvenc" | "h264_qsv" | "hevc_qsv" | "h264_amf" | "hevc_amf"`
- **Default:** `"libx264"`

Example usage:
```js
const recorder = new Recorder({ codec: "h264_nvenc" });
```

---

### `preset?` (optional)
> Defines the FFmpeg encoding preset, balancing speed and quality.
- **Format:** `"placebo" | "veryslow" | "slower" | "slow" | "medium" | "fast" | "faster" | "veryfast" | "superfast" | "ultrafast"`
- **Default:** `"fast"`

Example usage:
```js
const recorder = new Recorder({ preset: "slower" });
```

---

### `pixelFormat?` (optional)
> Sets the pixel format for the video output.
- **Format:** `"yuv420p" | "yuv422p" | "yuv444p" | "rgb24" | "gray" | "nv12"`
- **Default:** `"yuv420p"`

Example usage:
```js
const recorder = new Recorder({ pixelFormat: "rgb24" });
```

---

That's all for configuring your recorder! Note that recording will still work without any options provided.

Now, let's see how to use functions like starting the recording, stopping etc.
