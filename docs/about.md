# About

Vidclip is a flexible and lightweight screen recorder for Node.js. It runs on `FFmpeg`, a powerful media framework, by launching an FFmpeg process with your chosen recording settings.

What makes Vidclip different? Unlike other screen recorders, it works directly within Node.js, making it a great fit for automation, scripting, and integrating into existing applications.

## How It Works

Vidclip executes FFmpeg commands using `child_process.spawn`, which gives you better control over the process and avoids shell command issues. Compared to `exec`, `spawn` is more efficient for handling large data streams and long-running tasks.

To make setup easier, Vidclip includes `@ffmpeg-installer/ffmpeg`, which installs `FFmpeg` automatically if it’s not already available. That means no manual installation of FFmpeg is required.

## Why Vidclip?

Vidclip offers several advantages over other recorders by:
- Made to be minimal - Lightweight and efficient.
- Zero complex setup - Works out of the box.
- Cross-platform - Runs on Windows, macOS, and Linux.
- Highly customizable - Configure resolutions, codecs and more.
- FFmpeg-powered - With FFmpeg's powerful recording capabilities.

---

Start off by **getting started** and installing the dependency.
