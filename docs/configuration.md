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
const recorder = new Recorder({ resolution: "1920x1080" });
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
const recorder = new Recorder({ frameRate: 60 });
```

---

### `fileFormat?` (optional)
> Defines the format of the recorded video file.
- **Format:** One of `"mp4", "mov", "wmv", "avi", and "mkv"`
- **Default:** `"mp4"`

Example usage:

