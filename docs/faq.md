# FAQ

Frequently asked questions:

::: details Why is my recording not saving?
Ensure the `outputFile` path is valid and that the target directory exists. If the directory doesn't exist, the package should attempt to create it, but you can manually check permissions or create the folder beforehand.
:::

::: details What is the best frameRate for smooth recording?
- `30 FPS` is standard for most recordings.
- `60 FPS` is smoother but requires more processing power.
- `120 FPS` is only recommended for high-performance systems and specific use cases like gaming or slow-motion footage.
:::

::: details Why does my recording have low quality?
- Check your `resolution` setting and increase it if necessary.
- Use a higher `bitrate` if you're using `rateControl`.
- Consider using a slower `preset` (e.g. `medium` instead of `ultrafast`).
:::

::: details Can I record only audio without video?
Currently, the package is designed for screen recording, but if you need to, you can set a dummy resolution (e.g., `"1x1"`) and set `audioSource` to a working audio device.
:::

::: details Are you sure Vidclip is safe?
Yes! Vidclip is completely safe to use.

- Everything runs locally, which means no HTTP requests can be made.
- Vidclip relies on FFmpeg, a widely trusted open-source media tool.
- Vidclip uses `child_process.spawn`, which is safer than `exec` because it doesn’t execute shell commands directly.
- Open Source: The source code can be found on [GitHub](https://github.com/realyoterry/vidclip/tree/main) or [NPM](https://www.npmjs.com/package/vidclip?activeTab=code).

